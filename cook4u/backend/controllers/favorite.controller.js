import pool from "../config/db.js";

// POST   /api/favorites        Khách thêm đầu bếp vào yêu thích
export const addFavoriteChef = async (req, res) => {
    const { customerId, chefId } = req.body;
    const conn = await pool.getConnection();
    try {
        // Validate input
        if (!customerId || !chefId) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        // Kiểm tra xem đã yêu thích chưa
        const [existingFavorite] = await conn.query(
            'SELECT * FROM FAVORCHEF WHERE USERID = ? AND CHEFID = ?',
            [customerId, chefId]
        );
        if (existingFavorite.length > 0) {
            return res.status(400).json({ message: 'Đã yêu thích đầu bếp này' });
        }
        // Thêm vào yêu thích
        const [result] = await conn.query(
            'INSERT INTO FAVORCHEF (USERID, CHEFID) VALUES (?, ?)',
            [customerId, chefId]
        );
        res.status(201).json({ message: 'Đã thêm đầu bếp vào yêu thích'});
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    } finally {
        conn.release();
    }
};

// DELETE /api/favorites        Khách xóa đầu bếp khỏi yêu thích
export const removeFavoriteChef = async (req, res) => {
    const { customerId, chefId } = req.body;
    const conn = await pool.getConnection();
    try {
        // Validate input
        if (!customerId || !chefId) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        // Xóa khỏi yêu thích
        const [result] = await conn.query(
            'DELETE FROM FAVORCHEF WHERE USERID = ? AND CHEFID = ?',
            [customerId, chefId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đầu bếp trong danh sách yêu thích' });
        }
        res.status(200).json({ message: 'Đã xóa đầu bếp khỏi yêu thích' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    } finally {
        conn.release();
    }
};

// GET    /api/favorites/:customerId     Lấy số lượng đầu bếp yêu thích của khách
export const getFavoriteChefsCount = async (req, res) => {
    const { customerId } = req.params;
    const conn = await pool.getConnection();
    try {
        // Lấy số lượng đầu bếp yêu thích
        const [rows] = await conn.query(
            'SELECT COUNT(*) AS favoriteCount FROM FAVORCHEF WHERE USERID = ?',
            [customerId]
        );
        res.status(200).json({ favoriteCount: rows[0].favoriteCount });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    } finally {
        conn.release();
    }
};
