import pool from "../config/db.js";

// Controller functions
// export const getAllChefs = async (req, res) => {
//     const conn = await pool.getConnection();
//     try {
//         const [chefs] = await conn.query(
//             'SELECT CHEFID, CHEFNAME, AVTURL, DESCR, EXPYEAR, PRICEPERHOUR, CHEFSTATUS, CREATEDAT FROM CHEF WHERE CHEFSTATUS = TRUE'
//         );
//         res.status(200).json({ message: 'Chefs retrieved successfully', data: chefs });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     } finally {
//         conn.release();
//     }
// };
export const getAllChefs = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    // Truy vấn lấy toàn bộ danh sách đầu bếp đang hoạt động
    const [chefs] = await conn.query(`
            SELECT 
                c.CHEFID AS id,
                c.CHEFNAME AS name,
                c.AVTURL AS avatar,
                -- Tính điểm trung bình (Rating) từ bảng REVIEW
                COALESCE(ROUND(AVG(r.STAR), 1), 0) AS rating,
                -- Đếm tổng số lượng đánh giá
                COUNT(DISTINCT r.REVIEWID) AS reviews,
                -- Lấy chuỗi loại món ăn (Cuisine)
                (SELECT GROUP_CONCAT(DISTINCT CUISINETYPE SEPARATOR ', ') 
                 FROM CHEF_CUISINE_TYPE 
                 WHERE CHEFID = c.CHEFID) AS cuisine,
                c.CHEFAREA AS district,
                c.CHEFTIME AS cookTime,
                -- Định dạng giá tiền có dấu phẩy (ví dụ: 100,000)
                FORMAT(c.PRICEPERHOUR, 0) AS price,
                -- Lấy danh sách các thẻ món ăn sở trường (Tags)
                GROUP_CONCAT(DISTINCT d.DISHNAME SEPARATOR ', ') AS tags
            FROM CHEF c
            LEFT JOIN REVIEW r ON c.CHEFID = r.CHEFID
            LEFT JOIN CHEF_SIGNATURE_DISH csd ON c.CHEFID = csd.CHEFID
            LEFT JOIN DISH d ON csd.DISHID = d.DISHID
            WHERE c.CHEFSTATUS = TRUE
            GROUP BY c.CHEFID
            ORDER BY rating DESC, reviews DESC -- Ưu tiên các đầu bếp điểm cao
        `);

    // Xử lý dữ liệu trả về để khớp hoàn toàn với cấu trúc JSON của chefsData
    const formattedData = chefs.map((chef) => ({
      ...chef,
      // Chuyển chuỗi Tags từ database thành Array cho Frontend
      tags: chef.tags ? chef.tags.split(", ") : [],
    }));

    res.status(200).json({
      message: "Chefs retrieved successfully",
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

export const getChefbyId = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    // 1. Lấy thông tin cơ bản của Chef
    const [chefs] = await conn.query(
      `
      SELECT 
        c.CHEFID AS id,
        c.CHEFNAME AS name,
        c.AVTURL AS avatar,
        COALESCE(ROUND(AVG(r.STAR), 1), 0) AS rating,
        COUNT(DISTINCT r.REVIEWID) AS reviews,
        -- Sử dụng COALESCE và mảng rỗng để tránh lỗi null
        COALESCE((SELECT JSON_ARRAYAGG(CUISINETYPE) FROM CHEF_CUISINE_TYPE WHERE CHEFID = c.CHEFID), JSON_ARRAY()) AS cuisine,
        c.CHEFAREA AS district,
        c.CHEFTIME AS cookTime,
        c.EXPYEAR AS yearNum,
        FORMAT(c.PRICEPERHOUR, 0) AS price,
        c.VALID AS valid,
        c.DESCR AS description,
        c.DESCR AS bio,
        COALESCE((SELECT JSON_ARRAYAGG(d.DISHNAME) 
          FROM CHEF_SIGNATURE_DISH csd 
          JOIN DISH d ON csd.DISHID = d.DISHID 
          WHERE csd.CHEFID = c.CHEFID), JSON_ARRAY()) AS tags,
        COALESCE((SELECT JSON_ARRAYAGG(LANGUAGE) FROM CHEF_LANGUAGE WHERE CHEFID = c.CHEFID), JSON_ARRAY()) AS languages,
        COALESCE((SELECT JSON_ARRAYAGG(CERTIFICATE) FROM CHEFCERTIFICATE WHERE CHEFID = c.CHEFID), JSON_ARRAY()) AS certifications,
        JSON_OBJECT(
            'minDuration', c.MINHOUR,
            'includes', COALESCE((SELECT JSON_ARRAYAGG(SERVICE) FROM CHEFSERVICE WHERE CHEFID = c.CHEFID), JSON_ARRAY())
        ) AS serviceDetails
      FROM CHEF c
      LEFT JOIN REVIEW r ON c.CHEFID = r.CHEFID
      WHERE c.CHEFID = ?
      GROUP BY c.CHEFID
    `,
      [id]
    );

    if (chefs.length === 0) {
      return res.status(404).json({ message: "Chef not found" });
    }

    // 2. Lấy danh sách review chi tiết (Lấy tên món ăn từ mối quan hệ gián tiếp)
    const [reviewsList] = await conn.query(
      `
  SELECT 
    u.FULLNAME AS name,
    u.AVTURL AS avatar,
    r.STAR AS rating,
    DATE_FORMAT(r.REVIEWTIME, '%d/%m/%Y') AS date,
    r.REVIEWCONTENT AS comment,
    -- Subquery lấy tên các món ăn khách đã đặt trong đơn hàng này
    (SELECT GROUP_CONCAT(d.DISHNAME SEPARATOR ', ') 
     FROM ORDER_ITEM oi 
     JOIN DISH d ON oi.DISHID = d.DISHID 
     WHERE oi.ORDERID = r.ORDERID) AS dish
  FROM REVIEW r
  JOIN USER u ON r.CUSTOMERID = u.USERID
  WHERE r.CHEFID = ?
  ORDER BY r.REVIEWTIME DESC
`,
      [id]
    );

    // 3. Lấy thông tin chi tiết các món ăn (Giữ nguyên)
    const [dishesDetail] = await conn.query(
      `
      SELECT 
        d.DISHNAME AS name,
        d.PICTUREURL AS image,
        d.DESCR AS description,
        d.COOKTIME AS cookTime,
        d.NUMPEOPLE AS numberOfPeople,
        FORMAT(d.PRICE, 0) AS dishPrice
      FROM DISH d
      JOIN CHEF_SIGNATURE_DISH csd ON d.DISHID = csd.DISHID
      WHERE csd.CHEFID = ?
    `,
      [id]
    );

    const finalData = {
      ...chefs[0],
      dishes: dishesDetail,
      reviewsList: reviewsList,
    };

    res.status(200).json({
      message: "Chef retrieved successfully",
      data: finalData,
    });
  } catch (error) {
    // Log lỗi chi tiết ra console server để bạn dễ debug
    console.error("Lỗi tại getChefbyId:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// Hàm convert "" hoặc undefined thành null
const toNull = (value) => {
  return value === "" || value === undefined ? null : value;
};

export const createChef = async (req, res) => {
  const {
    chefname,
    avturl,
    descr,
    chefarea,
    cheftime,
    minhour,
    expyear,
    priceperhour,
  } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO CHEF 
             (CHEFNAME, AVTURL, DESCR, CHEFAREA, CHEFTIME, MINHOUR, EXPYEAR, PRICEPERHOUR, CHEFSTATUS) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        toNull(chefname),
        toNull(avturl),
        toNull(descr),
        toNull(chefarea),
        toNull(cheftime),
        toNull(minhour),
        toNull(expyear),
        toNull(priceperhour),
      ]
    );
    await conn.commit();
    // Trả về ID của chef mới tạo trong mysql
    const [rows] = await conn.query(
      "SELECT CHEFID FROM CHEF ORDER BY CREATEDAT DESC LIMIT 1"
    );
    res
      .status(201)
      .json({ message: "Chef created successfully", chefId: rows[0].CHEFID });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

export const updateChef = async (req, res) => {
  const { id } = req.params;
  const {
    chefname,
    avturl,
    descr,
    chefarea,
    cheftime,
    minhour,
    expyear,
    priceperhour,
  } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lấy dữ liệu hiện tại
    const [rows] = await conn.query("SELECT * FROM CHEF WHERE CHEFID = ?", [
      id,
    ]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Chef not found" });
    }
    const currentChef = rows[0];

    // Merge dữ liệu mới với dữ liệu cũ
    const updatedChef = {
      chefname: chefname ?? currentChef.CHEFNAME,
      avturl: avturl ?? currentChef.AVTURL,
      descr: descr ?? currentChef.DESCR,
      chefarea: chefarea ?? currentChef.CHEFAREA,
      cheftime: cheftime ?? currentChef.CHEFTIME,
      minhour: minhour ?? currentChef.MINHOUR,
      expyear: expyear ?? currentChef.EXPYEAR,
      priceperhour: priceperhour ?? currentChef.PRICEPERHOUR,
    };

    // Update
    const [result] = await conn.query(
      "UPDATE CHEF SET CHEFNAME = ?, AVTURL = ?, DESCR = ?, CHEFAREA = ?, CHEFTIME = ?, MINHOUR = ?, EXPYEAR = ?, PRICEPERHOUR = ? WHERE CHEFID = ?",
      [
        updatedChef.chefname,
        updatedChef.avturl,
        updatedChef.descr,
        updatedChef.chefarea,
        updatedChef.cheftime,
        updatedChef.minhour,
        updatedChef.expyear,
        updatedChef.priceperhour,
        id,
      ]
    );

    await conn.commit();
    res.status(200).json({ message: "Chef updated successfully" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};
