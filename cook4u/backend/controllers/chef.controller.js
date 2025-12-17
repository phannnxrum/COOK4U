import pool from '../config/db.js';

// Controller functions
export const getAllChefs = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [chefs] = await conn.query(
            'SELECT CHEFID, CHEFNAME, AVTURL, DESCR, EXPYEAR, PRICEPERHOUR, CHEFSTATUS, CREATEDAT FROM CHEF WHERE CHEFSTATUS = TRUE'
        );
        res.status(200).json({ message: 'Chefs retrieved successfully', data: chefs });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

export const getChefbyId = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const [chefs] = await conn.query(
            'SELECT CHEFID, CHEFNAME, AVTURL, DESCR, CHEFAREA, CHEFTIME, EXPYEAR, PRICEPERHOUR, CHEFSTATUS, CREATEDAT FROM CHEF WHERE CHEFID = ?',
            [id]
        );
        if (chefs.length === 0) {
            return res.status(404).json({ message: 'Chef not found' });
        }
        res.status(200).json({ message: 'Chef retrieved successfully', data: chefs[0] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

export const createChef = async (req, res) => {
    const { chefname, avturl, descr, expyear, priceperhour } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.query(
            'INSERT INTO CHEF (CHEFNAME, AVTURL, DESCR, EXPYEAR, PRICEPERHOUR, CHEFSTATUS) VALUES (?, ?, ?, ?, ?, TRUE)',
            [chefname, avturl, descr, expyear, priceperhour]
        );
        await conn.commit();
        res.status(201).json({ message: 'Chef created successfully', chefId: result.insertId });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

export const updateChefStatus = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { id } = req.params;
        const { chefstatus } = req.body;

        if (chefstatus === undefined) {
            return res.status(400).json({ message: 'Chef status is required' });
        }

        const [result] = await conn.query(
            'UPDATE CHEF SET CHEFSTATUS = ? WHERE CHEFID = ?',
            [chefstatus, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        res.status(200).json({ message: 'Chef status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};