import pool from "../config/db.js";

// POST   /api/admin/violations     Admin ghi nhận vi phạm
export const createViolation = async (req, res) => {
    const { USERID, USERNAME, USERTYPE, REASON, DESCR, SEVERITY } = req.body;
    const conn = await pool.getConnection();
    try {
        // Validate input
        if (!USERNAME || !USERTYPE || !REASON || !SEVERITY) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        const [result] = await conn.query(
            `INSERT INTO VIOLATION
                (USERID, USERNAME, USERTYPE, REASON, DESCR, SEVERITY)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [USERID ?? null, USERNAME, USERTYPE, REASON, DESCR, SEVERITY]);
        const [rows] = await conn.query(
            'SELECT VIOLATIONID FROM VIOLATION ORDER BY CREATEDAT DESC LIMIT 1'
        );
        res.status(201).json({ message: 'Violation recorded successfully', violationId: rows[0].VIOLATIONID });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// GET    /api/admin/violations     Admin xem danh sách vi phạm
export const getAllViolations = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [violations] = await conn.query(
            `SELECT 
                VIOLATIONID,
                USERID,
                USERNAME,
                USERTYPE,
                REASON,
                DESCR,
                SEVERITY,
                CREATEDAT
            FROM VIOLATION
            ORDER BY CREATEDAT DESC`
        );
        res.status(200).json({ violations });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};
