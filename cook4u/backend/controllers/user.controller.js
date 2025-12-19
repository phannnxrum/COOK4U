import pool from "../config/db.js";

// GET    /api/users/me       Lấy thông tin user hiện tại
export const getCurrentUser = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        // console.log("Fetching user with ID:", req.userId);
        const [rows] = await conn.query(
            `SELECT 
                u.FULLNAME,
                u.EMAIL,
                c.PHONENUMBER,
                c.ADDRESS,
                c.INTRODUCTION,
                c.REWARDPOINT
            FROM USER u
            JOIN CUSTOMER c ON u.USERID = c.CUSTOMERID
            WHERE u.USERID = ?
            `,
            [req.userId]
        );
        res.status(200).json({ message: "User retrieved successfully", data: rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    } finally {
        conn.release();
    }
};