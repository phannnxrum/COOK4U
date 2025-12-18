import pool from "../config/db.js";

// POST   /api/customers/cart       Tạo giỏ hàng cho khách
export const createCartForCustomer = async (req, res) => {
    const { customerId } = req.body;
    const conn = await pool.getConnection();
    try {
        const [existingCart] = await conn.query(
            'SELECT * FROM CART WHERE CUSTOMERID = ?',
            [customerId]
        );
        if (existingCart.length > 0) {
            return res.status(400).json({ message: 'Cart already exists for this customer' });
        }
        const [result] = await conn.query(
            'INSERT INTO CART (CUSTOMERID) VALUES (?)',
            [customerId]
        );
        const [rows] = await conn.query(
            'SELECT CARTID FROM CART WHERE CUSTOMERID = ? ORDER BY CARTID DESC LIMIT 1',
            [customerId]
        );
        res.status(201).json({ message: 'Cart created successfully', cartId: rows[0].CARTID });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

