import express from "express";
import * as userController from "../controllers/user.controller.js";

const userRouter = express.Router();
// Test route
userRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'User route is working!' });
});

// GET    /api/users/:userId       Lấy thông tin user hiện tại
userRouter.get('/:userId', userController.getCurrentUser);

export default userRouter;