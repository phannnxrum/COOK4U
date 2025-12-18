import pool from "../config/db.js";

// POST   /api/orders                       Tạo đơn (từ cart)
export const createOrderFromCart = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { 
      customerId, 
      cartId, 
      chefId,
      cookingDate, 
      cookingTime, 
      address,
      specReq = null 
    } = req.body;

    // Validate required fields
    if (!customerId || !cartId || !chefId || !cookingDate || !cookingTime) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: customerId, cartId, chefId, cookingDate, cookingTime là bắt buộc'
      });
    }

    await connection.beginTransaction();

    // Kiểm tra customer có tồn tại
    const [customers] = await connection.query(
      'SELECT CUSTOMERID, ADDRESS FROM CUSTOMER WHERE CUSTOMERID = ?',
      [customerId]
    );

    if (customers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Khách hàng không tồn tại'
      });
    }

    // Sử dụng địa chỉ từ request hoặc địa chỉ mặc định của customer
    const deliveryAddress = address || customers[0].ADDRESS;
    
    if (!deliveryAddress) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp địa chỉ giao hàng'
      });
    }

    // Kiểm tra cart có tồn tại và thuộc về customer
    const [carts] = await connection.query(
      'SELECT CARTID FROM CART WHERE CARTID = ? AND CUSTOMERID = ?',
      [cartId, customerId]
    );

    if (carts.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Giỏ hàng không tồn tại hoặc không thuộc về khách hàng này'
      });
    }

    // Lấy các món trong giỏ cho chef được chọn
    const [cartItems] = await connection.query(
      `SELECT ci.CARTITEMID, ci.DISHID, ci.QUANTITY, ci.PRICE,
              d.DISHNAME, d.DISHSTATUS
       FROM CART_ITEM ci
       JOIN DISH d ON ci.DISHID = d.DISHID
       WHERE ci.CARTID = ? AND ci.CHEFID = ?`,
      [cartId, chefId]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không có món ăn nào từ đầu bếp này trong giỏ hàng'
      });
    }

    // Kiểm tra tất cả món còn active
    const inactiveDishes = cartItems.filter(item => !item.DISHSTATUS);
    if (inactiveDishes.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Một số món ăn trong giỏ hiện không khả dụng',
        inactiveDishes: inactiveDishes.map(d => d.DISHNAME)
      });
    }

    // Kiểm tra chef có tồn tại và còn active
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

    // Tính tổng giá
    const totalPrice = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.PRICE) * item.QUANTITY);
    }, 0);

    // Validate ngày nấu phải từ ngày mai trở đi
    const cookingDateObj = new Date(cookingDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (cookingDateObj < tomorrow) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Ngày nấu phải từ ngày mai trở đi'
      });
    }

    // Tạo order
    const [orderResult] = await connection.query(
      `INSERT INTO ORDERS 
       (CUSTOMERID, CHEFID, CARTID, COOKINGDATE, COOKINGTIME, SPECREQ, ADDRESS, TOTALPRICE, ORDERSTATUS, PAYMENTSTATUS)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'UNPAID')`,
      [customerId, chefId, cartId, cookingDate, cookingTime, specReq, deliveryAddress, totalPrice]
    );

    // Lấy orderId vừa tạo
    const [newOrder] = await connection.query(
      'SELECT ORDERID FROM ORDERS WHERE CUSTOMERID = ? AND CARTID = ? ORDER BY CREATEDAT DESC LIMIT 1',
      [customerId, cartId]
    );
    
    const orderId = newOrder[0].ORDERID;

    // Thêm các order items
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO ORDER_ITEM (ORDERID, DISHID, QUANTITY, PRICE)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.DISHID, item.QUANTITY, item.PRICE]
      );
    }

    // Xóa các items của chef này khỏi cart
    await connection.query(
      'DELETE FROM CART_ITEM WHERE CARTID = ? AND CHEFID = ?',
      [cartId, chefId]
    );

    // Lấy thông tin đầy đủ của order vừa tạo
    const [orderDetails] = await connection.query(
      `SELECT o.ORDERID, o.ORDERDATE, o.COOKINGDATE, o.COOKINGTIME,
              o.ADDRESS, o.SPECREQ, o.TOTALPRICE, o.ORDERSTATUS, o.PAYMENTSTATUS,
              c.CHEFNAME, c.PRICEPERHOUR,
              u.FULLNAME as CUSTOMERNAME, u.EMAIL as CUSTOMEREMAIL
       FROM ORDERS o
       JOIN CHEF c ON o.CHEFID = c.CHEFID
       JOIN CUSTOMER cu ON o.CUSTOMERID = cu.CUSTOMERID
       JOIN USER u ON cu.CUSTOMERID = u.USERID
       WHERE o.ORDERID = ?`,
      [orderId]
    );

    // Lấy danh sách món trong order
    const [orderItems] = await connection.query(
      `SELECT oi.ORDERITEMID, oi.DISHID, oi.QUANTITY, oi.PRICE,
              d.DISHNAME, d.PICTUREURL
       FROM ORDER_ITEM oi
       JOIN DISH d ON oi.DISHID = d.DISHID
       WHERE oi.ORDERID = ?`,
      [orderId]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: {
        order: {
          orderId: orderDetails[0].ORDERID,
          orderDate: orderDetails[0].ORDERDATE,
          cookingDate: orderDetails[0].COOKINGDATE,
          cookingTime: orderDetails[0].COOKINGTIME,
          address: orderDetails[0].ADDRESS,
          specialRequest: orderDetails[0].SPECREQ,
          totalPrice: parseFloat(orderDetails[0].TOTALPRICE),
          orderStatus: orderDetails[0].ORDERSTATUS,
          paymentStatus: orderDetails[0].PAYMENTSTATUS,
          chef: {
            name: orderDetails[0].CHEFNAME,
            pricePerHour: parseFloat(orderDetails[0].PRICEPERHOUR)
          },
          customer: {
            name: orderDetails[0].CUSTOMERNAME,
            email: orderDetails[0].CUSTOMEREMAIL
          }
        },
        items: orderItems.map(item => ({
          orderItemId: item.ORDERITEMID,
          dishId: item.DISHID,
          dishName: item.DISHNAME,
          pictureUrl: item.PICTUREURL,
          quantity: item.QUANTITY,
          price: parseFloat(item.PRICE),
          subtotal: parseFloat(item.PRICE) * item.QUANTITY
        }))
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating order from cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đơn hàng',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// GET    /api/orders/:id                   Chi tiết đơn
export const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();
    try {
    // Lấy thông tin order
    const [orderDetails] = await connection.query(
        `SELECT o.ORDERID, o.ORDERDATE, o.COOKINGDATE, o.COOKINGTIME,
                o.ADDRESS, o.SPECREQ, o.TOTALPRICE, o.ORDERSTATUS, o.PAYMENTSTATUS,
                c.CHEFNAME, c.PRICEPERHOUR,
                u.FULLNAME as CUSTOMERNAME, u.EMAIL as CUSTOMEREMAIL
            FROM ORDERS o
            JOIN CHEF c ON o.CHEFID = c.CHEFID
            JOIN CUSTOMER cu ON o.CUSTOMERID = cu.CUSTOMERID
            JOIN USER u ON cu.CUSTOMERID = u.USERID
            WHERE o.ORDERID = ?`,
        [id]
    );
    if (orderDetails.length === 0) {
        return res.status(404).json({
        message: 'Đơn hàng không tồn tại'
        });
    }
    // Lấy danh sách món trong order
    const [orderItems] = await connection.query(
        `SELECT oi.ORDERITEMID, oi.DISHID, oi.QUANTITY, oi.PRICE,
                d.DISHNAME, d.PICTUREURL
            FROM ORDER_ITEM oi
            JOIN DISH d ON oi.DISHID = d.DISHID
            WHERE oi.ORDERID = ?`,
        [id]
    );
    return res.status(200).json({
        order: {
            orderId: orderDetails[0].ORDERID,
            orderDate: orderDetails[0].ORDERDATE,
            cookingDate: orderDetails[0].COOKINGDATE,
            cookingTime: orderDetails[0].COOKINGTIME,
            address: orderDetails[0].ADDRESS,
            specialRequest: orderDetails[0].SPECREQ,
            totalPrice: parseFloat(orderDetails[0].TOTALPRICE),
            orderStatus: orderDetails[0].ORDERSTATUS,
            paymentStatus: orderDetails[0].PAYMENTSTATUS,
            chef: {
                name: orderDetails[0].CHEFNAME,
                pricePerHour: parseFloat(orderDetails[0].PRICEPERHOUR)
            },
            customer: {
                name: orderDetails[0].CUSTOMERNAME,
                email: orderDetails[0].CUSTOMEREMAIL
            }
        },
        items: orderItems.map(item => ({
            orderItemId: item.ORDERITEMID,
            dishId: item.DISHID,
            dishName: item.DISHNAME,
            pictureUrl: item.PICTUREURL,
            quantity: item.QUANTITY,
            price: parseFloat(item.PRICE),
            subtotal: parseFloat(item.PRICE) * item.QUANTITY
        }))
    });
    } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({
        message: 'Lỗi server khi lấy chi tiết đơn hàng',
        error: error.message
    });
    } finally {
    connection.release();
    }
};

// GET    /api/orders/customer/:customerId  Lịch sử đơn của customer
export const getOrderHistoryByCustomerId = async (req, res) => {
    const { customerId } = req.params;
    const connection = await pool.getConnection();
    try {
        // Lấy danh sách đơn hàng của customer
        const [orders] = await connection.query(
            `SELECT ORDERID, ORDERDATE, COOKINGDATE, COOKINGTIME, TOTALPRICE, ORDERSTATUS, PAYMENTSTATUS
                FROM ORDERS
                WHERE CUSTOMERID = ?
                ORDER BY ORDERDATE DESC`,
            [customerId]
        );
        return res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching order history:', error);
        return res.status(500).json({
            message: 'Lỗi server khi lấy lịch sử đơn hàng',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

// PATCH  /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(
            'UPDATE ORDERS SET ORDERSTATUS = ? WHERE ORDERID = ?',
            [orderStatus, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }
        return res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            message: 'Lỗi server khi cập nhật trạng thái đơn hàng',
            error: error.message
        });
    } finally {
        connection.release();
    }
};