import pool from "../config/db.js";

// POST   /api/orders                       Tạo đơn (từ cart)
export const createOrderFromCart = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    // Sửa: Lấy customerId từ token (req.userId) thay vì body
    const { 
      cartId, 
      chefId,
      cookingDate, 
      cookingTime, 
      address,
      specReq = null 
    } = req.body;
    console.log(cartId, 
      chefId,
      cookingDate, 
      cookingTime, 
      address,
      specReq);
    // Sửa: Lấy customerId từ token
    const customerId = req.userId;
    console.log(customerId);
    // Validate required fields
    if (!cartId || !chefId || !cookingDate || !cookingTime) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin: cartId, chefId, cookingDate, cookingTime là bắt buộc'
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

    // ... phần còn lại giữ nguyên ...
    // (các dòng code giữ nguyên từ đây)
        // Kiểm tra cart có liên kết với chef này không
    const [cartChef] = await connection.query(
      'SELECT CHEFID, PRICE FROM CART_CHEF WHERE CARTID = ? AND CHEFID = ?',
      [cartId, chefId]
    );

    if (cartChef.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng không có đầu bếp này'
      });
    }

    // Lấy các món trong giỏ cho cart này (vì mỗi cart chỉ có 1 chef)
    const [cartItems] = await connection.query(
      `SELECT cd.CARTDISHID, cd.DISHID, cd.QUANTITY, cd.PRICE,
              d.DISHNAME, d.DISHSTATUS
       FROM CART_DISH cd
       JOIN DISH d ON cd.DISHID = d.DISHID
       WHERE cd.CARTID = ?`,
      [cartId]
    );
    console.log('cartItems: ',cartItems);
    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không có món ăn nào trong giỏ hàng'
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

    // Tính tổng giá (từ CART_DISH và CART_CHEF)
    const dishesTotal = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.PRICE) * item.QUANTITY);
    }, 0);

    const chefPrice = parseFloat(cartChef[0].PRICE) || 0;
    const totalPrice = dishesTotal + chefPrice;

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

    const [rows] = await connection.query(
      `SELECT ORDERID FROM ORDERS WHERE CUSTOMERID = ? AND CARTID = ?`,
      [customerId, cartId]
    );
    const orderId = rows[0].ORDERID;
    // Thêm các order items từ CART_DISH
    for (const item of cartItems) {
      console.log('item.DISHID: ', item.DISHID);
      await connection.query(
        `INSERT INTO ORDER_ITEM (ORDERID, DISHID, QUANTITY, PRICE)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.DISHID, item.QUANTITY, item.PRICE]
      );
    }

    // Xóa dữ liệu cart sau khi tạo order
    await connection.query(
      'DELETE FROM CART_DISH WHERE CARTID = ?',
      [cartId]
    );

    await connection.query(
      'DELETE FROM CART_CHEF WHERE CARTID = ?',
      [cartId]
    );

    // await connection.query(
    //   'DELETE FROM CART WHERE CARTID = ?',
    //   [cartId]
    // );

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
            chefId: chefId,
            name: orderDetails[0].CHEFNAME,
            pricePerHour: parseFloat(orderDetails[0].PRICEPERHOUR)
          },
          customer: {
            customerId: customerId,
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
  const customerId = req.userId; // Lấy từ token
  const connection = await pool.getConnection();
  
  try {
    // Sửa: Kiểm tra quyền truy cập - chỉ customer hoặc chef liên quan mới xem được
    const [orderDetails] = await connection.query(
      `SELECT o.ORDERID, o.ORDERDATE, o.COOKINGDATE, o.COOKINGTIME,
              o.ADDRESS, o.SPECREQ, o.TOTALPRICE, o.ORDERSTATUS, o.PAYMENTSTATUS,
              o.CHEFID, o.CUSTOMERID,
              c.CHEFNAME, c.PRICEPERHOUR, c.AVTURL as CHEFAVATAR,
              u.FULLNAME as CUSTOMERNAME, u.EMAIL as CUSTOMEREMAIL
       FROM ORDERS o
       JOIN CHEF c ON o.CHEFID = c.CHEFID
       JOIN CUSTOMER cu ON o.CUSTOMERID = cu.CUSTOMERID
       JOIN USER u ON cu.CUSTOMERID = u.USERID
       WHERE o.ORDERID = ? AND o.CUSTOMERID = ?`,
      [id, customerId]
    );

    if (orderDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại hoặc bạn không có quyền xem'
      });
    }

    // ... phần còn lại giữ nguyên ...
        // Lấy danh sách món trong order
    const [orderItems] = await connection.query(
      `SELECT oi.ORDERITEMID, oi.DISHID, oi.QUANTITY, oi.PRICE,
              d.DISHNAME, d.PICTUREURL, d.SHORTDESCR
       FROM ORDER_ITEM oi
       JOIN DISH d ON oi.DISHID = d.DISHID
       WHERE oi.ORDERID = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
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
            chefId: orderDetails[0].CHEFID,
            name: orderDetails[0].CHEFNAME,
            pricePerHour: parseFloat(orderDetails[0].PRICEPERHOUR),
            avatar: orderDetails[0].CHEFAVATAR
          },
          customer: {
            customerId: orderDetails[0].CUSTOMERID,
            name: orderDetails[0].CUSTOMERNAME,
            email: orderDetails[0].CUSTOMEREMAIL
          }
        },
        items: orderItems.map(item => ({
          orderItemId: item.ORDERITEMID,
          dishId: item.DISHID,
          dishName: item.DISHNAME,
          description: item.SHORTDESCR,
          pictureUrl: item.PICTUREURL,
          quantity: item.QUANTITY,
          price: parseFloat(item.PRICE),
          subtotal: parseFloat(item.PRICE) * item.QUANTITY
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết đơn hàng',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// GET    /api/orders/customer  Lịch sử đơn của customer
export const getOrderHistoryByCustomerId = async (req, res) => {
  // Sửa: Lấy customerId từ token thay vì params
  const customerId = req.userId;
  const connection = await pool.getConnection();
  
  try {
    // Lấy danh sách đơn hàng của customer
    const [orders] = await connection.query(
      `SELECT o.ORDERID, o.ORDERDATE, o.COOKINGDATE, o.COOKINGTIME, 
              o.TOTALPRICE, o.ORDERSTATUS, o.PAYMENTSTATUS,
              c.CHEFNAME, c.AVTURL as CHEFAVATAR
       FROM ORDERS o
       JOIN CHEF c ON o.CHEFID = c.CHEFID
       WHERE o.CUSTOMERID = ?
       ORDER BY o.ORDERDATE DESC`,
      [customerId]
    );

    return res.status(200).json({
      success: true,
      data: orders.map(order => ({
        orderId: order.ORDERID,
        orderDate: order.ORDERDATE,
        cookingDate: order.COOKINGDATE,
        cookingTime: order.COOKINGTIME,
        totalPrice: parseFloat(order.TOTALPRICE),
        orderStatus: order.ORDERSTATUS,
        paymentStatus: order.PAYMENTSTATUS,
        chefName: order.CHEFNAME,
        chefAvatar: order.CHEFAVATAR
      }))
    });
  } catch (error) {
    console.error('Error fetching order history:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy lịch sử đơn hàng',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// GET    /api/orders/chef/:chefId          Lịch sử đơn của chef
export const getOrderHistoryByChefId = async (req, res) => {
  const { chefId } = req.params;
  const userId = req.userId; // Lấy từ token
  
  // Sửa: Kiểm tra quyền truy cập - chỉ chef đó mới xem được lịch sử của mình
  if (parseInt(chefId) !== parseInt(userId)) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền xem lịch sử đơn hàng của đầu bếp này'
    });
  }
  
  const connection = await pool.getConnection();
  
  try {
    // Lấy danh sách đơn hàng của chef
    const [orders] = await connection.query(
      `SELECT o.ORDERID, o.ORDERDATE, o.COOKINGDATE, o.COOKINGTIME, 
              o.TOTALPRICE, o.ORDERSTATUS, o.PAYMENTSTATUS,
              u.FULLNAME as CUSTOMERNAME
       FROM ORDERS o
       JOIN CUSTOMER c ON o.CUSTOMERID = c.CUSTOMERID
       JOIN USER u ON c.CUSTOMERID = u.USERID
       WHERE o.CHEFID = ?
       ORDER BY o.ORDERDATE DESC`,
      [chefId]
    );

    return res.status(200).json({
      success: true,
      data: orders.map(order => ({
        orderId: order.ORDERID,
        orderDate: order.ORDERDATE,
        cookingDate: order.COOKINGDATE,
        cookingTime: order.COOKINGTIME,
        totalPrice: parseFloat(order.TOTALPRICE),
        orderStatus: order.ORDERSTATUS,
        paymentStatus: order.PAYMENTSTATUS,
        customerName: order.CUSTOMERNAME
      }))
    });
  } catch (error) {
    console.error('Error fetching chef order history:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy lịch sử đơn hàng của đầu bếp',
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
  const userId = req.userId; // Lấy từ token
  const connection = await pool.getConnection();
  
  try {
    // Validate order status
    const validStatuses = ['PENDING', 'CONFIRMED', 'COOKING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    // Sửa: Kiểm tra quyền - chỉ chef của order mới được cập nhật trạng thái
    const [orderCheck] = await connection.query(
      'SELECT CHEFID FROM ORDERS WHERE ORDERID = ?',
      [id]
    );

    if (orderCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    // Chỉ cho phép chef của order cập nhật trạng thái
    if (parseInt(orderCheck[0].CHEFID) !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật trạng thái đơn hàng này'
      });
    }

    const [result] = await connection.query(
      'UPDATE ORDERS SET ORDERSTATUS = ?, UPDATEDAT = CURRENT_TIMESTAMP WHERE ORDERID = ?',
      [orderStatus, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    // Lấy thông tin order sau khi update
    const [updatedOrder] = await connection.query(
      'SELECT ORDERID, ORDERSTATUS, UPDATEDAT FROM ORDERS WHERE ORDERID = ?',
      [id]
    );

    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: {
        orderId: updatedOrder[0].ORDERID,
        orderStatus: updatedOrder[0].ORDERSTATUS,
        updatedAt: updatedOrder[0].UPDATEDAT
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái đơn hàng',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// PATCH  /api/orders/:id/payment
export const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;
  const userId = req.userId; // Lấy từ token
  const connection = await pool.getConnection();
  
  try {
    // Validate payment status
    const validStatuses = ['UNPAID', 'PAID', 'REFUNDED'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái thanh toán không hợp lệ'
      });
    }

    // Sửa: Kiểm tra quyền - chỉ customer của order mới được cập nhật payment
    const [orderCheck] = await connection.query(
      'SELECT CUSTOMERID FROM ORDERS WHERE ORDERID = ?',
      [id]
    );

    if (orderCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    // Chỉ cho phép customer của order cập nhật payment status
    if (parseInt(orderCheck[0].CUSTOMERID) !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật trạng thái thanh toán của đơn hàng này'
      });
    }

    const [result] = await connection.query(
      'UPDATE ORDERS SET PAYMENTSTATUS = ?, UPDATEDAT = CURRENT_TIMESTAMP WHERE ORDERID = ?',
      [paymentStatus, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công'
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái thanh toán',
      error: error.message
    });
  } finally {
    connection.release();
  }
};