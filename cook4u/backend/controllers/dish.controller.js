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
                -- 1. Tính điểm đánh giá trung bình từ bảng REVIEW thông qua ORDER_ITEM
                COALESCE((
                    SELECT ROUND(AVG(r.STAR), 1)
                    FROM ORDER_ITEM oi
                    JOIN REVIEW r ON oi.ORDERID = r.ORDERID
                    WHERE oi.DISHID = d.DISHID
                ), 0) AS rating,
                -- 2. Đếm tổng số đánh giá của món ăn này
                (
                    SELECT COUNT(DISTINCT r.REVIEWID)
                    FROM ORDER_ITEM oi
                    JOIN REVIEW r ON oi.ORDERID = r.ORDERID
                    WHERE oi.DISHID = d.DISHID
                ) AS totalReviews,
                -- 3. Lấy danh sách loại ẩm thực
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
        -- 1. Tính điểm trung bình và số lượng đánh giá từ bảng REVIEW
        COALESCE((
            SELECT ROUND(AVG(r.STAR), 1)
            FROM ORDER_ITEM oi
            JOIN REVIEW r ON oi.ORDERID = r.ORDERID
            WHERE oi.DISHID = d.DISHID
        ), 0) AS rating,
        (
            SELECT COUNT(DISTINCT r.REVIEWID)
            FROM ORDER_ITEM oi
            JOIN REVIEW r ON oi.ORDERID = r.ORDERID
            WHERE oi.DISHID = d.DISHID
        ) AS reviewsCount,
        -- 2. Lấy danh sách loại ẩm thực (Cuisine/Category)
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

    // 3. Lấy danh sách Review chi tiết cho món ăn này
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

    // Thay thế đoạn logic cũ bằng Subquery thật
    const [nutritionList] = await conn.query(
      "SELECT NAMETYPE AS name, QUANTITY AS amount, UNIT FROM NUTRITION WHERE DISHID = ?",
      [id]
    );

    const [ingredientsList] = await conn.query(
      "SELECT INGREDIENT AS name, CONCAT(QUANTITY, ' ', UNIT) AS amount FROM INGREDIENT WHERE DISHID = ?",
      [id]
    );

    // Định dạng dữ liệu trả về khớp 100% với Frontend format
    const finalData = {
      ...dish,
      category: dish.category,
      images: [dish.image], // Đưa vào mảng như yêu cầu
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

// Hàm convert "" hoặc undefined thành null
const toNull = (value) => {
  return value === "" || value === undefined ? null : value;
};

// POST /api/dishes - Create new dish
export const createDish = async (req, res) => {
  const { dishname, descr, shortdescr, cooktime, price, pictureurl } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO DISH
                (DISHNAME, DESCR, SHORTDESCR, COOKTIME, PRICE, PICTUREURL, DISHSTATUS)
                VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
      [
        toNull(dishname),
        toNull(descr),
        toNull(shortdescr),
        toNull(cooktime),
        toNull(price),
        toNull(pictureurl),
      ]
    );
    const [dishRows] = await conn.query(
      "SELECT DISHID FROM DISH ORDER BY CREATEDAT DESC LIMIT 1"
    );
    await conn.commit();
    res.status(201).json({
      message: "Dish created successfully",
      dishId: dishRows[0].DISHID,
    });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// PATCH /api/dishes/:id - Update dish
export const updateDish = async (req, res) => {
  const { id } = req.params;
  const {
    dishname,
    descr,
    shortdescr,
    cooktime,
    price,
    dishstatus,
    pictureurl,
  } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Lấy dữ liệu hiện tại
    const [rows] = await conn.query("SELECT * FROM DISH WHERE DISHID = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Dish not found" });
    }
    const currentDish = rows[0];
    // Merge dữ liệu mới với dữ liệu cũ
    const updatedDish = {
      dishname: dishname ?? currentDish.DISHNAME,
      descr: descr ?? currentDish.DESCR,
      shortdescr: shortdescr ?? currentDish.SHORTDESCR,
      cooktime: cooktime ?? currentDish.COOKTIME,
      price: price ?? currentDish.PRICE,
      dishstatus: dishstatus ?? currentDish.DISHSTATUS,
      pictureurl: pictureurl ?? currentDish.PICTUREURL,
    };
    // Ghi log
    // console.log('Updated dish data:', updatedDish);
    // console.log('Dish ID to update:', id);
    // Cập nhật dữ liệu
    const [result] = await conn.query(
      `UPDATE DISH SET
                DISHNAME = ?, DESCR = ?, SHORTDESCR = ?, COOKTIME = ?, PRICE = ?, DISHSTATUS = ?, PICTUREURL = ?
             WHERE DISHID = ?`,
      [
        updatedDish.dishname,
        updatedDish.descr,
        updatedDish.shortdescr,
        updatedDish.cooktime,
        updatedDish.price,
        updatedDish.dishstatus,
        updatedDish.pictureurl,
        id,
      ]
    );
    res.status(200).json({ message: "Dish updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// DELETE /api/dishes/:id - Delete dish
export const deleteDish = async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query("DELETE FROM DISH WHERE DISHID = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.status(200).json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// GET /api/dishes/:id/nutrition - Get nutrition info for a dish
export const getDishNutrition = async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    const [nutrition] = await conn.query(
      "SELECT * FROM NUTRITION WHERE DISHID = ?",
      [id]
    );
    res.status(200).json({
      message: "Nutrition info retrieved successfully",
      data: nutrition,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// POST /api/dishes/:id/nutrition - Add nutrition info for a dish
export const addDishNutrition = async (req, res) => {
  const { id } = req.params;
  const { nametype, quantity, unit } = req.body;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO NUTRITION (DISHID, NAMETYPE, QUANTITY, UNIT)
                VALUES (?, ?, ?, ?)`,
      [id, nametype, quantity, unit]
    );
    // Lấy id của bản ghi mới tạo
    const [rows] = await conn.query(
      "SELECT NUTRITIONID FROM NUTRITION WHERE DISHID = ? ORDER BY NUTRITIONID DESC LIMIT 1",
      [id]
    );
    res.status(201).json({
      message: "Nutrition info added successfully",
      nutritionId: rows[0].NUTRITIONID,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// DELETE /api/dishes/:id/nutrition/:nutritionId - Delete nutrition info for a dish
export const deleteDishNutrition = async (req, res) => {
  const { id, nutritionId } = req.params;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      "DELETE FROM NUTRITION WHERE DISHID = ? AND NUTRITIONID = ?",
      [id, nutritionId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Nutrition info not found" });
    }
    res.status(200).json({ message: "Nutrition info deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// GET /api/dishes/:id/ingredients - Get ingredients for a dish
export const getDishIngredients = async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    const [ingredients] = await conn.query(
      "SELECT * FROM INGREDIENT WHERE DISHID = ?",
      [id]
    );
    console.log(ingredients);
    res.status(200).json({
      message: "Ingredients retrieved successfully",
      data: ingredients,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// POST /api/dishes/:id/ingredients - Add ingredient for a dish
export const addDishIngredient = async (req, res) => {
  const { id } = req.params;
  const { ingredient, quantity, unit, note } = req.body;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO INGREDIENT (DISHID, INGREDIENT, QUANTITY, UNIT, NOTE)
                VALUES (?, ?, ?, ?, ?)`,
      [id, ingredient, quantity, unit, note]
    );
    // Lấy id của bản ghi mới tạo
    const [rows] = await conn.query(
      "SELECT INGREDIENTID FROM INGREDIENT WHERE DISHID = ? ORDER BY INGREDIENTID DESC LIMIT 1",
      [id]
    );
    res.status(201).json({
      message: "Ingredient added successfully",
      ingredientId: rows[0].INGREDIENTID,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};

// DELETE /api/dishes/:id/ingredients/:ingredientId - Delete ingredient for a dish
export const deleteDishIngredient = async (req, res) => {
  const { id, ingredientId } = req.params;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      "DELETE FROM INGREDIENT WHERE DISHID = ? AND INGREDIENTID = ?",
      [id, ingredientId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  } finally {
    conn.release();
  }
};
