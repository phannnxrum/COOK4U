import pool from "../config/db.js";

// GET /api/dishes - Get all dishes with filters
export const getAllDishes = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [dishes] = await conn.query(
      `
            SELECT 
                d.DISHID AS id,
                d.DISHNAME AS name,
                d.DESCR AS description,
                d.SHORTDESCR AS shortDescription,
                d.COOKTIME AS cookTime,
                d.PRICE AS price,
                d.PICTUREURL AS image,
                d.NUMPEOPLE AS numberOfPeople,
                d.DISHSTATUS AS status,
                -- 1. Tính điểm đánh giá trung bình
                COALESCE((
                    SELECT ROUND(AVG(r.STAR), 1)
                    FROM ORDER_ITEM oi
                    JOIN REVIEW r ON oi.ORDERID = r.ORDERID
                    WHERE oi.DISHID = d.DISHID
                ), 0) AS rating,
                -- 2. CHỈNH SỬA TẠI ĐÂY: Đếm tổng số đơn hàng có chứa món ăn này
                (
                    SELECT COUNT(DISTINCT oi.ORDERID)
                    FROM ORDER_ITEM oi
                    WHERE oi.DISHID = d.DISHID
                ) AS totalOrders,
                -- 3. Đếm tổng số đánh giá (nếu bạn vẫn muốn giữ)
                (
                    SELECT COUNT(DISTINCT r.REVIEWID)
                    FROM ORDER_ITEM oi
                    JOIN REVIEW r ON oi.ORDERID = r.ORDERID
                    WHERE oi.DISHID = d.DISHID
                ) AS totalReviews,
                -- 4. Lấy danh sách loại ẩm thực
                COALESCE(
                    (SELECT JSON_ARRAYAGG(DISHTYPE) 
                     FROM DISHTYPE 
                     WHERE DISHID = d.DISHID), 
                    JSON_ARRAY()
                ) AS cuisine
            FROM DISH d
            WHERE d.DISHSTATUS = TRUE
            GROUP BY d.DISHID
            ORDER BY d.CREATEDAT DESC
            `
    );

    res.status(200).json({
      message: "Dishes retrieved successfully",
      data: dishes,
    });
  } catch (error) {
    console.error("Lỗi tại getAllDishes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// GET /api/admin/dishes - Get ALL dishes (including hidden ones) for Admin
export const getAllDishesAdmin = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [dishes] = await conn.query(
      `
            SELECT 
                d.DISHID AS id,
                d.DISHNAME AS name,
                d.DESCR AS description,
                d.SHORTDESCR AS shortDescription,
                d.COOKTIME AS cookTime,
                d.PRICE AS price,
                d.PICTUREURL AS image,
                d.NUMPEOPLE AS numberOfPeople,
                d.DISHSTATUS AS status, -- Admin cần trường này để biết món nào đang ẩn
                -- 1. Tính điểm đánh giá trung bình
                COALESCE((
                    SELECT ROUND(AVG(r.STAR), 1)
                    FROM ORDER_ITEM oi
                    JOIN REVIEW r ON oi.ORDERID = r.ORDERID
                    WHERE oi.DISHID = d.DISHID
                ), 0) AS rating,
                -- 2. Đếm tổng số đơn hàng
                (
                    SELECT COUNT(DISTINCT oi.ORDERID)
                    FROM ORDER_ITEM oi
                    WHERE oi.DISHID = d.DISHID
                ) AS totalOrders,
                -- 3. Đếm tổng số đánh giá
                (
                    SELECT COUNT(DISTINCT r.REVIEWID)
                    FROM ORDER_ITEM oi
                    JOIN REVIEW r ON oi.ORDERID = r.ORDERID
                    WHERE oi.DISHID = d.DISHID
                ) AS totalReviews,
                -- 4. Lấy danh sách loại ẩm thực
                COALESCE(
                    (SELECT JSON_ARRAYAGG(DISHTYPE) 
                     FROM DISHTYPE 
                     WHERE DISHID = d.DISHID), 
                    JSON_ARRAY()
                ) AS cuisine
            FROM DISH d
            -- LƯU Ý: Đã bỏ dòng WHERE d.DISHSTATUS = TRUE để lấy tất cả
            GROUP BY d.DISHID
            ORDER BY d.CREATEDAT DESC
            `
    );

    res.status(200).json({
      message: "Dishes retrieved successfully",
      data: dishes,
    });
  } catch (error) {
    console.error("Lỗi tại getAllDishes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// GET /api/dishes/:id - Get dish by id
export const getDishById = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;

    const [dishes] = await conn.query(
      `
      SELECT 
        d.DISHID AS id,
        d.DISHNAME AS name,
        d.DESCR AS description,
        d.SHORTDESCR AS shortDescription,
        d.COOKTIME AS cookTime,
        d.PRICE AS price,
        d.NUMPEOPLE AS servings,
        d.PICTUREURL AS image,
        d.DISHSTATUS AS status, -- 1. ĐÃ THÊM: Lấy cột status
        
        -- Tính điểm trung bình
        COALESCE((
            SELECT ROUND(AVG(r.STAR), 1)
            FROM ORDER_ITEM oi
            JOIN REVIEW r ON oi.ORDERID = r.ORDERID
            WHERE oi.DISHID = d.DISHID
        ), 0) AS rating,
        
        -- Đếm số review
        (
            SELECT COUNT(DISTINCT r.REVIEWID)
            FROM ORDER_ITEM oi
            JOIN REVIEW r ON oi.ORDERID = r.ORDERID
            WHERE oi.DISHID = d.DISHID
        ) AS reviewsCount,
        
        -- Lấy danh sách Cuisine
        COALESCE(
            (SELECT JSON_ARRAYAGG(DISHTYPE) 
             FROM DISHTYPE 
             WHERE DISHID = d.DISHID), 
            JSON_ARRAY()
        ) AS category

      FROM DISH d
      WHERE d.DISHID = ?
      `,
      [id]
    );

    if (dishes.length === 0) {
      return res.status(404).json({ message: "Món ăn không tồn tại" });
    }

    const dish = dishes[0];

    // Lấy Reviews (Giữ nguyên)
    const [reviews] = await conn.query(
      `
      SELECT 
        u.FULLNAME AS name,
        LEFT(u.FULLNAME, 1) AS initial,
        u.AVTURL AS avatar,
        r.STAR AS rating,
        CASE 
            WHEN DATEDIFF(NOW(), r.REVIEWTIME) = 0 THEN 'Hôm nay'
            WHEN DATEDIFF(NOW(), r.REVIEWTIME) < 7 THEN CONCAT(DATEDIFF(NOW(), r.REVIEWTIME), ' ngày trước')
            ELSE DATE_FORMAT(r.REVIEWTIME, '%d/%m/%Y')
        END AS time,
        r.REVIEWCONTENT AS comment
      FROM ORDER_ITEM oi
      JOIN REVIEW r ON oi.ORDERID = r.ORDERID
      JOIN USER u ON r.CUSTOMERID = u.USERID
      WHERE oi.DISHID = ?
      ORDER BY r.REVIEWTIME DESC
      `,
      [id]
    );

    // 2. SỬA NUTRITION: Alias rõ ràng thành chữ thường để khớp Frontend
    const [nutritionList] = await conn.query(
      "SELECT NAMETYPE AS name, QUANTITY AS amount, UNIT AS unit FROM NUTRITION WHERE DISHID = ?",
      [id]
    );

    // 3. SỬA INGREDIENTS:
    // - Tách riêng QUANTITY và UNIT (Không dùng CONCAT nữa)
    // - Thêm cột NOTE
    const [ingredientsList] = await conn.query(
      "SELECT INGREDIENT AS name, QUANTITY AS amount, UNIT AS unit, NOTE AS note FROM INGREDIENT WHERE DISHID = ?",
      [id]
    );

    const finalData = {
      ...dish,
      // Chuyển status 1/0 sang true/false
      status: dish.status === 1 || dish.status === true,
      category: dish.category,
      images: [dish.image],
      about: dish.description,
      description: dish.shortDescription || dish.description,
      nutrition: nutritionList,
      reviews: reviews,
      ingredients: ingredientsList,
    };

    res.status(200).json({
      message: "Dish retrieved successfully",
      data: finalData,
    });
  } catch (error) {
    console.error("Lỗi getDishById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// // POST /api/dishes - Create new dish
// export const createDish = async (req, res) => {
//   // 1. Thêm numpeople vào destructuring từ req.body
//   const {
//     dishname,
//     descr,
//     shortdescr,
//     cooktime,
//     price,
//     pictureurl,
//     numpeople,
//   } = req.body;

//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     // 2. Cập nhật câu lệnh SQL INSERT để bao gồm cột NUMPEOPLE
//     const [result] = await conn.query(
//       `INSERT INTO DISH
//         (DISHNAME, DESCR, SHORTDESCR, COOKTIME, PRICE, PICTUREURL, NUMPEOPLE, DISHSTATUS)
//         VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
//       [
//         toNull(dishname),
//         toNull(descr),
//         toNull(shortdescr),
//         toNull(cooktime),
//         toNull(price),
//         toNull(pictureurl),
//         toNull(numpeople),
//       ]
//     );

//     // Lấy ID của món ăn vừa tạo
//     const [dishRows] = await conn.query(
//       "SELECT DISHID FROM DISH ORDER BY CREATEDAT DESC LIMIT 1"
//     );

//     await conn.commit();
//     res.status(201).json({
//       message: "Dish created successfully",
//       dishId: dishRows[0].DISHID,
//     });
//   } catch (error) {
//     await conn.rollback();
//     console.error("Lỗi khi tạo món ăn:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // PATCH /api/dishes/:id - Update dish
// export const updateDish = async (req, res) => {
//   const { id } = req.params;
//   const {
//     dishname,
//     descr,
//     shortdescr,
//     cooktime,
//     price,
//     dishstatus,
//     pictureurl,
//   } = req.body;
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();
//     // Lấy dữ liệu hiện tại
//     const [rows] = await conn.query("SELECT * FROM DISH WHERE DISHID = ?", [
//       id,
//     ]);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Dish not found" });
//     }
//     const currentDish = rows[0];
//     // Merge dữ liệu mới với dữ liệu cũ
//     const updatedDish = {
//       dishname: dishname ?? currentDish.DISHNAME,
//       descr: descr ?? currentDish.DESCR,
//       shortdescr: shortdescr ?? currentDish.SHORTDESCR,
//       cooktime: cooktime ?? currentDish.COOKTIME,
//       price: price ?? currentDish.PRICE,
//       dishstatus: dishstatus ?? currentDish.DISHSTATUS,
//       pictureurl: pictureurl ?? currentDish.PICTUREURL,
//     };
//     // Ghi log
//     // console.log('Updated dish data:', updatedDish);
//     // console.log('Dish ID to update:', id);
//     // Cập nhật dữ liệu
//     const [result] = await conn.query(
//       `UPDATE DISH SET
//                 DISHNAME = ?, DESCR = ?, SHORTDESCR = ?, COOKTIME = ?, PRICE = ?, DISHSTATUS = ?, PICTUREURL = ?
//              WHERE DISHID = ?`,
//       [
//         updatedDish.dishname,
//         updatedDish.descr,
//         updatedDish.shortdescr,
//         updatedDish.cooktime,
//         updatedDish.price,
//         updatedDish.dishstatus,
//         updatedDish.pictureurl,
//         id,
//       ]
//     );
//     res.status(200).json({ message: "Dish updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // DELETE /api/dishes/:id - Delete dish
// export const deleteDish = async (req, res) => {
//   const { id } = req.params;
//   const conn = await pool.getConnection();
//   try {
//     const [result] = await conn.query("DELETE FROM DISH WHERE DISHID = ?", [
//       id,
//     ]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Dish not found" });
//     }
//     res.status(200).json({ message: "Dish deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // GET /api/dishes/:id/nutrition - Get nutrition info for a dish
// export const getDishNutrition = async (req, res) => {
//   const { id } = req.params;
//   const conn = await pool.getConnection();
//   try {
//     const [nutrition] = await conn.query(
//       "SELECT * FROM NUTRITION WHERE DISHID = ?",
//       [id]
//     );
//     res.status(200).json({
//       message: "Nutrition info retrieved successfully",
//       data: nutrition,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // POST /api/dishes/:id/nutrition - Add nutrition info for a dish
// export const addDishNutrition = async (req, res) => {
//   const { id } = req.params;
//   const { nametype, quantity, unit } = req.body;
//   const conn = await pool.getConnection();
//   try {
//     const [result] = await conn.query(
//       `INSERT INTO NUTRITION (DISHID, NAMETYPE, QUANTITY, UNIT)
//                 VALUES (?, ?, ?, ?)`,
//       [id, nametype, quantity, unit]
//     );
//     // Lấy id của bản ghi mới tạo
//     const [rows] = await conn.query(
//       "SELECT NUTRITIONID FROM NUTRITION WHERE DISHID = ? ORDER BY NUTRITIONID DESC LIMIT 1",
//       [id]
//     );
//     res.status(201).json({
//       message: "Nutrition info added successfully",
//       nutritionId: rows[0].NUTRITIONID,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // DELETE /api/dishes/:id/nutrition/:nutritionId - Delete nutrition info for a dish
// export const deleteDishNutrition = async (req, res) => {
//   const { id, nutritionId } = req.params;
//   const conn = await pool.getConnection();
//   try {
//     const [result] = await conn.query(
//       "DELETE FROM NUTRITION WHERE DISHID = ? AND NUTRITIONID = ?",
//       [id, nutritionId]
//     );
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Nutrition info not found" });
//     }
//     res.status(200).json({ message: "Nutrition info deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // GET /api/dishes/:id/ingredients - Get ingredients for a dish
// export const getDishIngredients = async (req, res) => {
//   const { id } = req.params;
//   const conn = await pool.getConnection();
//   try {
//     const [ingredients] = await conn.query(
//       "SELECT * FROM INGREDIENT WHERE DISHID = ?",
//       [id]
//     );
//     console.log(ingredients);
//     res.status(200).json({
//       message: "Ingredients retrieved successfully",
//       data: ingredients,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // POST /api/dishes/:id/ingredients - Add ingredient for a dish
// export const addDishIngredient = async (req, res) => {
//   const { id } = req.params;
//   const { ingredient, quantity, unit, note } = req.body;
//   const conn = await pool.getConnection();
//   try {
//     const [result] = await conn.query(
//       `INSERT INTO INGREDIENT (DISHID, INGREDIENT, QUANTITY, UNIT, NOTE)
//                 VALUES (?, ?, ?, ?, ?)`,
//       [id, ingredient, quantity, unit, note]
//     );
//     // Lấy id của bản ghi mới tạo
//     const [rows] = await conn.query(
//       "SELECT INGREDIENTID FROM INGREDIENT WHERE DISHID = ? ORDER BY INGREDIENTID DESC LIMIT 1",
//       [id]
//     );
//     res.status(201).json({
//       message: "Ingredient added successfully",
//       ingredientId: rows[0].INGREDIENTID,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // DELETE /api/dishes/:id/ingredients/:ingredientId - Delete ingredient for a dish
// export const deleteDishIngredient = async (req, res) => {
//   const { id, ingredientId } = req.params;
//   const conn = await pool.getConnection();
//   try {
//     const [result] = await conn.query(
//       "DELETE FROM INGREDIENT WHERE DISHID = ? AND INGREDIENTID = ?",
//       [id, ingredientId]
//     );
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Ingredient not found" });
//     }
//     res.status(200).json({ message: "Ingredient deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// POST /api/dishes - Create new dish WITH ALL DETAILS (Transaction)
export const createDish = async (req, res) => {
  // Bóc tách dữ liệu từ Frontend gửi lên (theo format values bạn cung cấp)
  const {
    name,
    description,
    shortDescription,
    cookTime,
    price,
    image,
    numPeople,
    cuisine, // Array ["Món Ý", ...]
    ingredients, // Array of Objects
    nutritions, // Array of Objects
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction(); // Bắt đầu giao dịch

    // 1. INSERT DISH
    const [result] = await conn.query(
      `INSERT INTO DISH 
       (DISHNAME, DESCR, SHORTDESCR, COOKTIME, PRICE, PICTUREURL, NUMPEOPLE, DISHSTATUS) 
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        toNull(name),
        toNull(description),
        toNull(shortDescription),
        toNull(cookTime),
        toNull(price),
        toNull(image),
        toNull(numPeople),
      ]
    );

    // Lấy ID món ăn vừa tạo (Do UUID nên phải select lại)
    const [dishRows] = await conn.query(
      "SELECT DISHID FROM DISH ORDER BY CREATEDAT DESC LIMIT 1"
    );
    const dishId = dishRows[0].DISHID;

    // 2. INSERT DISHTYPE (Cuisine)
    if (cuisine && cuisine.length > 0) {
      for (const type of cuisine) {
        await conn.query(
          "INSERT INTO DISHTYPE (DISHID, DISHTYPE) VALUES (?, ?)",
          [dishId, type]
        );
      }
    }

    // 3. INSERT INGREDIENTS
    if (ingredients && ingredients.length > 0) {
      for (const item of ingredients) {
        await conn.query(
          "INSERT INTO INGREDIENT (DISHID, INGREDIENT, QUANTITY, UNIT, NOTE) VALUES (?, ?, ?, ?, ?)",
          [dishId, item.name, item.amount, item.unit, item.note]
        );
      }
    }

    // 4. INSERT NUTRITION
    if (nutritions && nutritions.length > 0) {
      for (const nut of nutritions) {
        await conn.query(
          "INSERT INTO NUTRITION (DISHID, NAMETYPE, QUANTITY, UNIT) VALUES (?, ?, ?, ?)",
          [dishId, nut.name, nut.amount, nut.unit]
        );
      }
    }

    await conn.commit(); // Lưu tất cả
    res.status(201).json({ message: "Dish created successfully", dishId });
  } catch (error) {
    await conn.rollback(); // Nếu lỗi thì hủy hết
    console.error("Create Dish Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// PATCH /api/dishes/:id - Update dish (Hỗ trợ cả Sửa món ăn và Xóa mềm)
export const updateDish = async (req, res) => {
  const { id } = req.params;

  // 1. Hứng đúng tên biến mà Frontend gửi lên
  const {
    name,
    description,
    shortDescription,
    cookTime,
    price,
    image,
    numPeople,
    status, // Frontend gửi { status: false } khi xóa
    cuisine,
    ingredients,
    nutritions,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 2. Lấy dữ liệu hiện tại trong Database để đối chiếu
    const [rows] = await conn.query("SELECT * FROM DISH WHERE DISHID = ?", [
      id,
    ]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Dish not found" });
    }
    const currentDish = rows[0];

    // 3. Merge dữ liệu:
    // Logic: Nếu Frontend KHÔNG gửi (undefined) -> Giữ nguyên dữ liệu cũ trong DB
    const updatedData = {
      DISHNAME: name !== undefined ? name : currentDish.DISHNAME,
      DESCR: description !== undefined ? description : currentDish.DESCR,
      SHORTDESCR:
        shortDescription !== undefined
          ? shortDescription
          : currentDish.SHORTDESCR,
      COOKTIME: cookTime !== undefined ? cookTime : currentDish.COOKTIME,
      PRICE: price !== undefined ? price : currentDish.PRICE,
      PICTUREURL: image !== undefined ? image : currentDish.PICTUREURL,
      NUMPEOPLE: numPeople !== undefined ? numPeople : currentDish.NUMPEOPLE,
      // Lưu ý: status là boolean, phải check undefined kỹ
      DISHSTATUS:
        status !== undefined ? (status ? 1 : 0) : currentDish.DISHSTATUS,
    };

    // 4. Thực hiện UPDATE bảng DISH
    await conn.query(
      `UPDATE DISH SET 
       DISHNAME = ?, DESCR = ?, SHORTDESCR = ?, COOKTIME = ?, PRICE = ?, PICTUREURL = ?, NUMPEOPLE = ?, DISHSTATUS = ?
       WHERE DISHID = ?`,
      [
        toNull(updatedData.DISHNAME),
        toNull(updatedData.DESCR),
        toNull(updatedData.SHORTDESCR),
        toNull(updatedData.COOKTIME),
        toNull(updatedData.PRICE),
        toNull(updatedData.PICTUREURL),
        toNull(updatedData.NUMPEOPLE),
        updatedData.DISHSTATUS, // Đã convert sang 1/0 ở bước 3
        id,
      ]
    );

    // 5. Cập nhật các bảng phụ (Chỉ chạy khi người dùng Sửa form, không chạy khi Xóa mềm)
    // Dấu hiệu: Khi xóa mềm, frontend KHÔNG gửi mảng cuisine/ingredients lên (nó là undefined)

    // Chỉ update Cuisine nếu frontend CÓ gửi lên
    if (cuisine !== undefined) {
      await conn.query("DELETE FROM DISHTYPE WHERE DISHID = ?", [id]);
      if (cuisine.length > 0) {
        for (const type of cuisine) {
          await conn.query(
            "INSERT INTO DISHTYPE (DISHID, DISHTYPE) VALUES (?, ?)",
            [id, type]
          );
        }
      }
    }

    // Chỉ update Ingredients nếu frontend CÓ gửi lên
    if (ingredients !== undefined) {
      await conn.query("DELETE FROM INGREDIENT WHERE DISHID = ?", [id]);
      if (ingredients.length > 0) {
        for (const item of ingredients) {
          await conn.query(
            "INSERT INTO INGREDIENT (DISHID, INGREDIENT, QUANTITY, UNIT, NOTE) VALUES (?, ?, ?, ?, ?)",
            [id, item.name, item.amount, item.unit, item.note]
          );
        }
      }
    }

    // Chỉ update Nutrition nếu frontend CÓ gửi lên
    if (nutritions !== undefined) {
      await conn.query("DELETE FROM NUTRITION WHERE DISHID = ?", [id]);
      if (nutritions.length > 0) {
        for (const nut of nutritions) {
          await conn.query(
            "INSERT INTO NUTRITION (DISHID, NAMETYPE, QUANTITY, UNIT) VALUES (?, ?, ?, ?)",
            [id, nut.name, nut.amount, nut.unit]
          );
        }
      }
    }

    await conn.commit();
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    await conn.rollback();
    console.error("Lỗi Update Dish:", error); // Xem lỗi chi tiết ở Terminal
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};
