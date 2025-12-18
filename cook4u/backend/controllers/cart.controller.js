import pool from "../config/db.js";

// GET    /api/cart/:customerId              Khách xem giỏ
export const getCartByCustomerId = async (req, res) => {
    const { customerId } = req.params;
    const conn = await pool.getConnection();
    try {
        // Lấy id giỏ hàng của khách
        const [cartRows] = await conn.query(
            'SELECT CARTID FROM CART WHERE CUSTOMERID = ?',
            [customerId]
        );
        if (cartRows.length === 0) {
            return res.status(404).json({ message: 'Cart not found for this customer' });
        }
        const cartId = cartRows[0].CARTID;
        // Lấy các món trong giỏ hàng
        const [cartItems] = await conn.query(
            `SELECT DISHID, CHEFID FROM CART_ITEM
            WHERE CARTID = ?`,
            [cartId]
        );
        res.status(200).json({ message: 'Cart retrieved successfully', data: cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// POST   /api/cart                         Khách chọn món + chef
export const addItemToCart = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { customerId, dishId, chefId, quantity = 1 } = req.body;

    // Validate input
    if (!customerId || !dishId || !chefId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: customerId, dishId, chefId là bắt buộc'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    await connection.beginTransaction();

    // Kiểm tra customer có tồn tại
    const [customers] = await connection.query(
      'SELECT CUSTOMERID FROM CUSTOMER WHERE CUSTOMERID = ?',
      [customerId]
    );

    if (customers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Khách hàng không tồn tại'
      });
    }

    // Kiểm tra dish có tồn tại và còn hoạt động
    const [dishes] = await connection.query(
      'SELECT DISHID, DISHNAME, PRICE, DISHSTATUS FROM DISH WHERE DISHID = ?',
      [dishId]
    );

    if (dishes.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Món ăn không tồn tại'
      });
    }

    if (!dishes[0].DISHSTATUS) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Món ăn hiện không khả dụng'
      });
    }

    const dishPrice = dishes[0].PRICE;

    // Kiểm tra chef có tồn tại và còn hoạt động
    const [chefs] = await connection.query(
      'SELECT CHEFID, CHEFNAME, CHEFSTATUS FROM CHEF WHERE CHEFID = ?',
      [chefId]
    );

    if (chefs.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Đầu bếp không tồn tại'
      });
    }

    if (!chefs[0].CHEFSTATUS) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Đầu bếp hiện không khả dụng'
      });
    }

    // Tìm hoặc tạo giỏ hàng cho customer
    let [carts] = await connection.query(
      'SELECT CARTID FROM CART WHERE CUSTOMERID = ?',
      [customerId]
    );

    let cartId;
    if (carts.length === 0) {
      // Tạo giỏ hàng mới
      const [cartResult] = await connection.query(
        'INSERT INTO CART (CUSTOMERID) VALUES (?)',
        [customerId]
      );
      cartId = cartResult.insertId || (await connection.query(
        'SELECT CARTID FROM CART WHERE CUSTOMERID = ? ORDER BY CREATEDAT DESC LIMIT 1',
        [customerId]
      ))[0][0].CARTID;
    } else {
      cartId = carts[0].CARTID;
    }

    // Kiểm tra xem món ăn + chef đã có trong giỏ chưa
    const [existingItems] = await connection.query(
      `SELECT CARTITEMID, QUANTITY, PRICE 
       FROM CART_ITEM 
       WHERE CARTID = ? AND DISHID = ? AND CHEFID = ?`,
      [cartId, dishId, chefId]
    );

    if (existingItems.length > 0) {
      // Cập nhật số lượng nếu đã tồn tại
      const newQuantity = existingItems[0].QUANTITY + quantity;
      await connection.query(
        'UPDATE CART_ITEM SET QUANTITY = ?, PRICE = ? WHERE CARTITEMID = ?',
        [newQuantity, dishPrice, existingItems[0].CARTITEMID]
      );

      await connection.commit();
      return res.status(200).json({
        success: true,
        message: 'Cập nhật số lượng món ăn trong giỏ hàng thành công',
        data: {
          cartItemId: existingItems[0].CARTITEMID,
          cartId,
          dishId,
          chefId,
          quantity: newQuantity,
          price: dishPrice,
          totalPrice: (newQuantity * dishPrice).toFixed(2)
        }
      });
    } else {
      // Thêm món mới vào giỏ
      const [itemResult] = await connection.query(
        `INSERT INTO CART_ITEM (CARTID, DISHID, CHEFID, QUANTITY, PRICE) 
         VALUES (?, ?, ?, ?, ?)`,
        [cartId, dishId, chefId, quantity, dishPrice]
      );

      const cartItemId = itemResult.insertId || (await connection.query(
        'SELECT CARTITEMID FROM CART_ITEM WHERE CARTID = ? AND DISHID = ? AND CHEFID = ? ORDER BY CARTITEMID DESC LIMIT 1',
        [cartId, dishId, chefId]
      ))[0][0].CARTITEMID;

      await connection.commit();
      return res.status(201).json({
        success: true,
        message: 'Thêm món ăn vào giỏ hàng thành công',
        data: {
          cartItemId,
          cartId,
          dishId,
          dishName: dishes[0].DISHNAME,
          chefId,
          chefName: chefs[0].CHEFNAME,
          quantity,
          price: dishPrice,
          totalPrice: (quantity * dishPrice).toFixed(2)
        }
      });
    }

  } catch (error) {
    await connection.rollback();
    console.error('Error adding item to cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm món vào giỏ hàng',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// DELETE /api/cart/:cartId                 Khách xóa món
export const deleteItemFromCart = async (req, res) => {
    const { cartId } = req.params;
    const { dishId, chefId } = req.body;
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            'DELETE FROM CART_ITEM WHERE CARTID = ? AND DISHID = ? AND CHEFID = ?',
            [cartId, dishId, chefId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
        res.status(200).json({ message: 'Item deleted from cart successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// DELETE /api/cart/clear/:customerId      Khách xóa tất cả món trong giỏ
export const clearCartByCustomerId = async (req, res) => {
    const { customerId } = req.params;
    const conn = await pool.getConnection();
    try {
        // Lấy id giỏ hàng của khách
        const [cartRows] = await conn.query(
            'SELECT CARTID FROM CART WHERE CUSTOMERID = ?',
            [customerId]
        );
        if (cartRows.length === 0) {
            return res.status(404).json({ message: 'Cart not found for this customer' });
        }
        const cartId = cartRows[0].CARTID;
        // Xóa tất cả món trong giỏ hàng
        const [result] = await conn.query(
            'DELETE FROM CART_ITEM WHERE CARTID = ?',
            [cartId]
        );
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};
