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
                c.PHONENUMBER AS phone,
                c.EMAIL AS email,
                c.EXPYEAR AS experience,
                c.CHEFSTATUS AS status,
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
        c.PHONENUMBER AS phone,
        c.EMAIL AS email,
        c.CHEFSTATUS AS status,
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

// tên đầu bếp, email, số điện thoại, avturl, expyear, chefarea, cheftime, priceperhour,
// chefstatus, valid, cuisine, descr, languages, certifications, serviceDetails, minhour

export const createChefV2 = async (req, res) => {
  const {
    chefname,
    email,
    phonenumber,
    avturl,
    expyear,
    chefarea,
    cheftime,
    priceperhour,
    chefstatus,
    valid,
    cuisine,
    descr,
    languages,
    certifications,
    serviceDetails,
    minhour,
  } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `
      INSERT INTO CHEF
        (CHEFNAME, EMAIL, PHONENUMBER, AVTURL, EXPYEAR, CHEFAREA, CHEFTIME, PRICEPERHOUR,
         CHEFSTATUS, VALID, DESCR, MINHOUR)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        toNull(chefname),
        toNull(email),
        toNull(phonenumber),
        toNull(avturl),
        toNull(expyear),
        toNull(chefarea),
        toNull(cheftime),
        toNull(priceperhour),
        toNull(chefstatus),
        toNull(valid),
        toNull(descr),
        toNull(minhour),
      ]
    );

    const [rows] = await conn.query(
      "SELECT CHEFID FROM CHEF ORDER BY CREATEDAT DESC LIMIT 1"
    );
    const chefId = rows[0].CHEFID;

    // Insert cuisine types
    console.log("Cuisine data:", cuisine);
    if (Array.isArray(cuisine)) {
      for (const type of cuisine) {
        console.log("Inserting cuisine type:", type);
        await conn.query(
          "INSERT INTO CHEF_CUISINE_TYPE (CHEFID, CUISINETYPE) VALUES (?, ?)",
          [chefId, type]
        );
      }
    }

    // Insert languages
    if (Array.isArray(languages)) {
      for (const lang of languages) {
        await conn.query(
          "INSERT INTO CHEF_LANGUAGE (CHEFID, LANGUAGE) VALUES (?, ?)",
          [chefId, lang]
        );
      }
    }

    // Insert certifications
    if (Array.isArray(certifications)) {
      for (const cert of certifications) {
        await conn.query(
          "INSERT INTO CHEFCERTIFICATE (CHEFID, CERTIFICATE) VALUES (?, ?)",
          [chefId, cert]
        );
      }
    }

    // Insert service details
    if (serviceDetails && Array.isArray(serviceDetails.includes)) {
      for (const service of serviceDetails.includes) {
        await conn.query(
          "INSERT INTO CHEFSERVICE (CHEFID, SERVICE) VALUES (?, ?)",
          [chefId, service]
        );
      }
    }

    await conn.commit();
    res
      .status(201)
      .json({ message: "Chef created successfully", chefId: chefId });
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

export const updateChefV2 = async (req, res) => {
  const { id } = req.params;
  // Lấy tất cả các trường có thể cập nhật từ req.body
  const {
    chefname,
    email,
    phonenumber,
    avturl,
    expyear,
    chefarea,
    cheftime,
    priceperhour,
    chefstatus,
    valid,
    descr,
    minhour,
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
      email: email ?? currentChef.EMAIL,
      phonenumber: phonenumber ?? currentChef.PHONENUMBER,
      avturl: avturl ?? currentChef.AVTURL,
      expyear: expyear ?? currentChef.EXPYEAR,
      chefarea: chefarea ?? currentChef.CHEFAREA,
      cheftime: cheftime ?? currentChef.CHEFTIME,
      priceperhour: priceperhour ?? currentChef.PRICEPERHOUR,
      chefstatus: chefstatus ?? currentChef.CHEFSTATUS,
      valid: valid ?? currentChef.VALID,
      descr: descr ?? currentChef.DESCR,
      minhour: minhour ?? currentChef.MINHOUR,
    };
    // Update
    const [result] = await conn.query(
      `UPDATE CHEF
        SET CHEFNAME = ?, EMAIL = ?, PHONENUMBER = ?, AVTURL = ?, EXPYEAR = ?, CHEFAREA = ?, CHEFTIME = ?,
            PRICEPERHOUR = ?, CHEFSTATUS = ?, VALID = ?, DESCR = ?, MINHOUR = ?
        WHERE CHEFID = ?`,
      [
        updatedChef.chefname,
        updatedChef.email,
        updatedChef.phonenumber,
        updatedChef.avturl,
        updatedChef.expyear,
        updatedChef.chefarea,
        updatedChef.cheftime,
        updatedChef.priceperhour,
        updatedChef.chefstatus,
        updatedChef.valid,
        updatedChef.descr,
        updatedChef.minhour,
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

// Update chef_cuisine_type
export const updateChefCuisineTypes = async (req, res) => {
  const { id } = req.params; // id của chef
  const { cuisine } = req.body; // cuisine mới

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Kiểm tra chef có tồn tại không
    const [rows] = await conn.query("SELECT * FROM CHEF WHERE CHEFID = ?", [
      id,
    ]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Chef not found" });
    }

    // Xóa cuisine cũ
    await conn.query("DELETE FROM CHEF_CUISINE_TYPE WHERE CHEFID = ?", [id]);

    // Thêm cuisine mới (có thể là array hoặc string)
    if (Array.isArray(cuisine)) {
      for (const item of cuisine) {
        await conn.query(
          "INSERT INTO CHEF_CUISINE_TYPE (CHEFID, CUISINE) VALUES (?, ?)",
          [id, item]
        );
      }
    } else if (cuisine) {
      await conn.query(
        "INSERT INTO CHEF_CUISINE_TYPE (CHEFID, CUISINE) VALUES (?, ?)",
        [id, cuisine]
      );
    }

    await conn.commit();
    res.status(200).json({ message: "Chef cuisine updated successfully" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// Update chef languages
export const updateChefLanguages = async (req, res) => {
  const { id } = req.params;
  const { languages } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query("SELECT * FROM CHEF WHERE CHEFID = ?", [
      id,
    ]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Chef not found" });
    }
    await conn.query("DELETE FROM CHEF_LANGUAGE WHERE CHEFID = ?", [id]);
    if (Array.isArray(languages)) {
      for (const lang of languages) {
        await conn.query(
          "INSERT INTO CHEF_LANGUAGE (CHEFID, LANGUAGE) VALUES (?, ?)",
          [id, lang]
        );
      }
    } else if (languages) {
      await conn.query(
        "INSERT INTO CHEF_LANGUAGE (CHEFID, LANGUAGE) VALUES (?, ?)",
        [id, languages]
      );
    }
    await conn.commit();
    res.status(200).json({ message: "Chef languages updated successfully" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// Update chef certifications
export const updateChefCertifications = async (req, res) => {
  const { id } = req.params;
  const { certifications } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query("SELECT * FROM CHEF WHERE CHEFID = ?", [
      id,
    ]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Chef not found" });
    }
    await conn.query("DELETE FROM CHEFCERTIFICATE WHERE CHEFID = ?", [id]);
    if (Array.isArray(certifications)) {
      for (const cert of certifications) {
        await conn.query(
          "INSERT INTO CHEFCERTIFICATE (CHEFID, CERTIFICATE) VALUES (?, ?)",
          [id, cert]
        );
      }
    } else if (certifications) {
      await conn.query(
        "INSERT INTO CHEFCERTIFICATE (CHEFID, CERTIFICATE) VALUES (?, ?)",
        [id, certifications]
      );
    }
    await conn.commit();
    res
      .status(200)
      .json({ message: "Chef certifications updated successfully" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// Update chef service details
export const updateChefServiceDetails = async (req, res) => {
  const { id } = req.params;
  const { serviceDetails } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query("SELECT * FROM CHEF WHERE CHEFID = ?", [
      id,
    ]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Chef not found" });
    }
    await conn.query("DELETE FROM CHEFSERVICE WHERE CHEFID = ?", [id]);
    if (serviceDetails && Array.isArray(serviceDetails)) {
      for (const service of serviceDetails) {
        await conn.query(
          "INSERT INTO CHEFSERVICE (CHEFID, SERVICE) VALUES (?, ?)",
          [id, service]
        );
      }
    }
    await conn.commit();
    res
      .status(200)
      .json({ message: "Chef service details updated successfully" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};
