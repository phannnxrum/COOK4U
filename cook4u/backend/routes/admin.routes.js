import express from "express";

const adminRouter = express.Router();
// Test route
adminRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Admin route is working!' });
});

// POST   /api/admin/violations     Admin ghi nhận vi phạm


// GET    /api/admin/violations     Admin xem danh sách vi phạm

export default adminRouter;