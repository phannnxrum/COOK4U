import pool from "../config/db.js";

export const getCartByCustomerId = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const customerId = req.userId;

    // 1. Kiểm tra giỏ hàng hiện có
    const [cartRows] = await conn.query(
      "SELECT CARTID FROM CART WHERE CUSTOMERID = ?",
      [customerId]
    );

    let cartId;
    if (cartRows.length === 0) {
      // Tạo giỏ hàng mới nếu chưa có
      const [result] = await conn.query(
        "INSERT INTO CART (CUSTOMERID) VALUES (?)",
        [customerId]
      );
      cartId = result.insertId;
    } else {
      cartId = cartRows[0].CARTID;
    }

    // 2. Lấy thông tin chef
    const [chefRows] = await conn.query(
      `SELECT 
        ch.CHEFID, 
        ch.CHEFNAME, 
        ch.AVTURL, 
        ch.PRICEPERHOUR as price
      FROM CART_CHEF cc
      JOIN CHEF ch ON cc.CHEFID = ch.CHEFID
      WHERE cc.CARTID = ?`,
      [cartId]
    );

    const chef = chefRows.length > 0 ? chefRows[0] : null;
    
    // 3. Lấy dishes
    const [dishRows] = await conn.query(
      `SELECT 
        d.DISHID, 
        d.DISHNAME, 
        d.PICTUREURL, 
        d.COOKTIME, 
        d.PRICE, 
        d.NUMPEOPLE, 
        cd.QUANTITY
      FROM CART_DISH cd
      JOIN DISH d ON cd.DISHID = d.DISHID
      WHERE cd.CARTID = ?`,
      [cartId]
    );

    const dishes = dishRows || [];

    res.status(200).json({
      message: "Cart retrieved successfully",
      data: {
        cartId,
        chef,
        dishes
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// POST /api/cart/dish
export const addDishToCart = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { dishId, quantity = 1 } = req.body;
    const customerId = req.userId;

    if (!customerId || !dishId) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin: dishId là bắt buộc" });
    }
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Số lượng phải lớn hơn 0" });
    }

    await connection.beginTransaction();

    // Kiểm tra customer
    const [customers] = await connection.query(
      "SELECT CUSTOMERID FROM CUSTOMER WHERE CUSTOMERID = ?",
      [customerId]
    );
    if (customers.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Khách hàng không tồn tại" });
    }

    // Kiểm tra dish
    const [dishes] = await connection.query(
      "SELECT DISHID, DISHNAME, PRICE, DISHSTATUS FROM DISH WHERE DISHID = ?",
      [dishId]
    );
    if (dishes.length === 0 || !dishes[0].DISHSTATUS) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Món ăn không khả dụng" });
    }

    const dishPrice = dishes[0].PRICE;

    // Tìm hoặc tạo giỏ hàng
    let [carts] = await connection.query("SELECT CARTID FROM CART WHERE CUSTOMERID = ?", [customerId]);
    let cartId;
    if (carts.length === 0) {
      const [cartResult] = await connection.query("INSERT INTO CART (CUSTOMERID) VALUES (?)", [customerId]);
      cartId = cartResult.insertId;
    } else {
      cartId = carts[0].CARTID;
    }

    // Kiểm tra món đã có chưa
    const [existing] = await connection.query(
      "SELECT CARTDISHID, QUANTITY FROM CART_DISH WHERE CARTID = ? AND DISHID = ?",
      [cartId, dishId]
    );

    if (existing.length > 0) {
      const newQuantity = existing[0].QUANTITY + quantity;
      await connection.query("UPDATE CART_DISH SET QUANTITY = ? WHERE CARTDISHID = ?", [newQuantity, existing[0].CARTDISHID]);
      await connection.commit();
      return res.status(200).json({
        success: true,
        message: "Cập nhật số lượng món ăn thành công",
        data: { cartDishId: existing[0].CARTDISHID, cartId, dishId, dishName: dishes[0].DISHNAME, quantity: newQuantity, price: dishPrice }
      });
    } else {
      const [insertResult] = await connection.query(
        "INSERT INTO CART_DISH (CARTID, DISHID, QUANTITY, PRICE) VALUES (?, ?, ?, ?)",
        [cartId, dishId, quantity, dishPrice]
      );
      await connection.commit();
      return res.status(201).json({
        success: true,
        message: "Thêm món ăn vào giỏ hàng thành công",
        data: { cartDishId: insertResult.insertId, cartId, dishId, dishName: dishes[0].DISHNAME, quantity, price: dishPrice }
      });
    }
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ success: false, message: "Lỗi server khi thêm món ăn", error: error.message });
  } finally {
    connection.release();
  }
};


// POST /api/cart/chef
export const addChefToCart = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { chefId } = req.body;
    // console.log(ChefFavoriteDishes);
    const customerId = req.userId;

    if (!customerId || !chefId) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin: chefId là bắt buộc" });
    }

    await connection.beginTransaction();

    // Kiểm tra customer
    const [customers] = await connection.query(
      "SELECT CUSTOMERID FROM CUSTOMER WHERE CUSTOMERID = ?",
      [customerId]
    );
    if (customers.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Khách hàng không tồn tại" });
    }

    // Kiểm tra chef
    const [chefs] = await connection.query(
      "SELECT CHEFID, CHEFNAME, CHEFSTATUS FROM CHEF WHERE CHEFID = ?",
      [chefId]
    );
    if (chefs.length === 0 || !chefs[0].CHEFSTATUS) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Đầu bếp không khả dụng" });
    }

    // Tìm hoặc tạo giỏ hàng
    let [carts] = await connection.query("SELECT CARTID FROM CART WHERE CUSTOMERID = ?", [customerId]);
    let cartId;
    if (carts.length === 0) {
      const [cartResult] = await connection.query("INSERT INTO CART (CUSTOMERID) VALUES (?)", [customerId]);
      cartId = cartResult.insertId;
    } else {
      cartId = carts[0].CARTID;
    }

    // Lấy giá thuê theo giờ của chef
    const [rows] = await connection.query(
      "SELECT PRICEPERHOUR FROM CHEF WHERE CHEFID = ?",
      [chefId]
    );
    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Không tìm thấy giá của đầu bếp" });
    }
    const price = rows[0].PRICEPERHOUR;

    // Thêm chef vào giỏ
    await connection.query(
      "INSERT INTO CART_CHEF (CARTID, CHEFID, PRICE) VALUES (?, ?, ?)",
      [cartId, chefId, price]
    );

    await connection.commit();
    return res.status(201).json({
      success: true,
      message: "Thêm đầu bếp vào giỏ hàng thành công",
      data: { cartId, chefId, chefName: chefs[0].CHEFNAME, price }
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ success: false, message: "Lỗi server khi thêm đầu bếp", error: error.message });
  } finally {
    connection.release();
  }
};

// DELETE   api/cart/dish
export const deleteDishFromCart = async (req, res) => {
  const customerId = req.userId;
  const { dishId } = req.body;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT CARTID FROM CART WHERE CUSTOMERID = ?',
      [customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartId = rows[0].CARTID;

    const [result] = await conn.query(
      'DELETE FROM CART_DISH WHERE CARTID = ? AND DISHID = ?',
      [cartId, dishId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dish not found in cart' });
    }

    res.status(200).json({ message: 'Dish deleted from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    conn.release();
  }
};

// DELETE /api/cart/chef
export const deleteChefFromCart = async (req, res) => {
  const customerId = req.userId;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT CARTID FROM CART WHERE CUSTOMERID = ?',
      [customerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartId = rows[0].CARTID;

    const [result] = await conn.query(
      'DELETE FROM CART_CHEF WHERE CARTID = ?',
      [cartId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Chef not found in cart' });
    }

    res.status(200).json({ message: 'Chef deleted from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    conn.release();
  }
};

// DELETE /api/cart/clear      Khách xóa tất cả món + chef trong giỏ
export const clearCartByCustomerId = async (req, res) => {
  const customerId = req.userId;
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

    // Xóa tất cả dishes trong giỏ hàng
    await conn.query(
      'DELETE FROM CART_DISH WHERE CARTID = ?',
      [cartId]
    );

    // Xóa chef trong giỏ hàng (mỗi giỏ chỉ có 1 chef)
    await conn.query(
      'DELETE FROM CART_CHEF WHERE CARTID = ?',
      [cartId]
    );

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    conn.release();
  }
};
