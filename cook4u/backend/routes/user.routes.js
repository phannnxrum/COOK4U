import express from "express";
import * as userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/jwt.middleware.js";

const userRouter = express.Router();
// Test route
userRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'User route is working!' });
});

// GET    /api/users/me      Lấy thông tin user hiện tại
userRouter.get('/me', authMiddleware, userController.getCurrentUser);

// PUT    /api/users/me      Cập nhật thông tin user hiện tại
userRouter.put('/me', authMiddleware, userController.updateCurrentUser);

export default userRouter;