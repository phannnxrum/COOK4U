import pool from '../config/db.js';

// GET /api/dishes - Get all dishes with filters
export const getAllDishes = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [dishes] = await conn.query(
            'SELECT DISHID, DISHNAME, DESCR, SHORTDESCR, COOKTIME, PRICE, DISHSTATUS, PICTUREURL, CREATEDAT FROM DISH WHERE DISHSTATUS = TRUE'
        );
        res.status(200).json({ message: 'Dishes retrieved successfully', data: dishes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            'SELECT DISHID, DISHNAME, DESCR, SHORTDESCR, COOKTIME, PRICE, DISHSTATUS, PICTUREURL, CREATEDAT FROM DISH WHERE DISHID = ?',
            [id]
        );
        if (dishes.length === 0) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.status(200).json({ message: 'Dish retrieved successfully', data: dishes[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
                toNull(pictureurl)
            ]
        );
        const [dishRows] = await conn.query(
            'SELECT DISHID FROM DISH ORDER BY CREATEDAT DESC LIMIT 1'
        );
        await conn.commit();
        res.status(201).json({ message: 'Dish created successfully', dishId: dishRows[0].DISHID });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// PATCH /api/dishes/:id - Update dish
export const updateDish = async (req, res) => {
    const { id } = req.params;
    const { dishname, descr, shortdescr, cooktime, price, dishstatus, pictureurl } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        // Lấy dữ liệu hiện tại
        const [rows] = await conn.query('SELECT * FROM DISH WHERE DISHID = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Dish not found' });
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
            pictureurl: pictureurl ?? currentDish.PICTUREURL
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
                id
            ])
        res.status(200).json({ message: 'Dish updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// DELETE /api/dishes/:id - Delete dish
export const deleteDish = async (req, res) => {
    const { id } = req.params;
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query('DELETE FROM DISH WHERE DISHID = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            'SELECT * FROM NUTRITION WHERE DISHID = ?',
            [id]
        );
        res.status(200).json({ message: 'Nutrition info retrieved successfully', data: nutrition });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            'SELECT NUTRITIONID FROM NUTRITION WHERE DISHID = ? ORDER BY NUTRITIONID DESC LIMIT 1',
            [id]
        );
        res.status(201).json({ message: 'Nutrition info added successfully', nutritionId: rows[0].NUTRITIONID });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            'DELETE FROM NUTRITION WHERE DISHID = ? AND NUTRITIONID = ?',
            [id, nutritionId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nutrition info not found' });
        }
        res.status(200).json({ message: 'Nutrition info deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            'SELECT * FROM INGREDIENT WHERE DISHID = ?',
            [id]
        );
        console.log(ingredients);
        res.status(200).json({ message: 'Ingredients retrieved successfully', data: ingredients });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            'SELECT INGREDIENTID FROM INGREDIENT WHERE DISHID = ? ORDER BY INGREDIENTID DESC LIMIT 1',
            [id]
        );
        res.status(201).json({ message: 'Ingredient added successfully', ingredientId: rows[0].INGREDIENTID });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
            'DELETE FROM INGREDIENT WHERE DISHID = ? AND INGREDIENTID = ?',
            [id, ingredientId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }
        res.status(200).json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

