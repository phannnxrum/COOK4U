import pool from "../config/db.js";

// POST   /api/reviews        Customer đánh giá chef/món
export const createReview = async (req, res) => {
    const { orderId, chefId, customerId, star, reviewcontent } = req.body;
    const conn = await pool.getConnection();
    try {
        // Validate input
        if (!customerId || !orderId || !chefId || star == null) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }
        if (star < 1 || star > 5) {
            return res.status(400).json({ message: 'Star phải từ 1 đến 5' });
        }
        const [result] = await conn.query(
            `INSERT INTO REVIEW
                (ORDERID, CHEFID, CUSTOMERID, STAR, REVIEWCONTENT)
                VALUES (?, ?, ?, ?, ?)`,
            [
                orderId,
                chefId,
                customerId,
                star,
                reviewcontent || null,
            ]
        );
        const [rows] = await conn.query(
            'SELECT REVIEWID FROM REVIEW ORDER BY CREATEDAT DESC LIMIT 1'
        );
        res.status(201).json({ message: 'Review created successfully', reviewId: rows[0].REVIEWID });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// GET    /api/reviews/chef/:chefId     Xem review của chef
export const getReviewsByChef = async (req, res) => {
    const { chefId } = req.params;
    const conn = await pool.getConnection();
    try {
        // Lấy review của chef và tên chef
        const [reviews] = await conn.query(
            `SELECT 
                r.REVIEWID,
                r.ORDERID,
                r.CUSTOMERID,
                r.CHEFID,
                r.STAR,
                r.REVIEWCONTENT,
                r.REVIEWTIME,
                c.CHEFNAME
            FROM REVIEW r
            JOIN CHEF c ON r.CHEFID = c.CHEFID
            WHERE r.CHEFID = ?`,
            [chefId]
        );
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};

// GET    /api/reviews/dish/:dishId     Xem review của món
export const getReviewsByDish = async (req, res) => {
    const { dishId } = req.params;
    const conn = await pool.getConnection();
    try {
        const [reviews] = await conn.query(
            `SELECT 
                r.REVIEWID,
                r.ORDERID,
                r.CUSTOMERID,
                r.CHEFID,
                r.STAR,
                r.REVIEWCONTENT,
                r.REVIEWTIME,
                d.DISHNAME
            FROM REVIEW r
            JOIN ORDERS o ON r.ORDERID = o.ORDERID
            JOIN ORDER_ITEM oi ON o.ORDERID = oi.ORDERID
            JOIN DISH d ON oi.DISHID = d.DISHID
            WHERE d.DISHID = ?`,
            [dishId]
        );
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        conn.release();
    }
};