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
                u.AVTURL,
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

// PUT    /api/users/me       Cập nhật thông tin user hiện tại
export const updateCurrentUser = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        console.log("Request body:", req.body);
        
        const {
            fullname,
            phonenumber,
            email,
            address,
            introduction,
            avturl
        } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!fullname || !email || !phonenumber) {
            return res.status(400).json({ 
                message: "Thiếu thông tin bắt buộc",
                required: ["fullname", "email", "phonenumber"]
            });
        }

        // Bắt đầu transaction
        await conn.beginTransaction();

        // 1. Cập nhật bảng USER - KHÔNG dùng UPDATEDAT
        const userUpdateQuery = `
            UPDATE USER 
            SET FULLNAME = ?, 
                EMAIL = ?,
                AVTURL = ?
            WHERE USERID = ?
        `;
        
        console.log("Executing USER update:", userUpdateQuery);
        const [userResult] = await conn.query(
            userUpdateQuery,
            [fullname, email, avturl || null, req.userId]
        );

        console.log("USER rows affected:", userResult.affectedRows);

        // 2. Cập nhật bảng CUSTOMER - KHÔNG dùng UPDATEDAT
        const customerUpdateQuery = `
            UPDATE CUSTOMER 
            SET PHONENUMBER = ?, 
                ADDRESS = ?, 
                INTRODUCTION = ?
            WHERE CUSTOMERID = ?
        `;
        
        console.log("Executing CUSTOMER update:", customerUpdateQuery);
        const [customerResult] = await conn.query(
            customerUpdateQuery,
            [phonenumber, address || null, introduction || null, req.userId]
        );

        console.log("CUSTOMER rows affected:", customerResult.affectedRows);

        // Commit transaction
        await conn.commit();

        // Lấy thông tin mới sau khi cập nhật
        const [updatedRows] = await conn.query(
            `SELECT 
                u.FULLNAME,
                u.EMAIL,
                u.AVTURL,
                c.PHONENUMBER,
                c.ADDRESS,
                c.INTRODUCTION,
                c.REWARDPOINT
            FROM USER u
            JOIN CUSTOMER c ON u.USERID = c.CUSTOMERID
            WHERE u.USERID = ?`,
            [req.userId]
        );

        if (updatedRows.length === 0) {
            return res.status(404).json({ 
                message: "User not found after update" 
            });
        }

        res.status(200).json({ 
            message: "Cập nhật thông tin thành công", 
            data: updatedRows[0] 
        });
    } catch (error) {
        // Rollback nếu có lỗi
        await conn.rollback();
        console.error("Database error:", error);
        
        // Kiểm tra lỗi MySQL cụ thể
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            return res.status(500).json({ 
                message: "Lỗi cấu trúc database", 
                error: `Cột không tồn tại: ${error.sqlMessage}` 
            });
        }
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                message: "Thông tin trùng lặp", 
                error: "Email hoặc số điện thoại đã tồn tại" 
            });
        }
        
        res.status(500).json({ 
            message: "Lỗi server", 
            error: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
    } finally {
        conn.release();
    }
};