import express from "express";
import * as orderController from "../controllers/order.controller.js";
import authMiddleware from "../middleware/jwt.middleware.js";

const orderRouter = express.Router();

// Test route
orderRouter.get("/test", (req, res) => {
  res.status(200).json({ message: "Order route is working!" });
});

// POST   /api/orders                       Tạo đơn (từ cart)
orderRouter.post("/", authMiddleware, orderController.createOrderFromCart);

// GET    /api/orders/customer  Lịch sử đơn của customer
orderRouter.get("/customer", authMiddleware, orderController.getOrderHistoryByCustomerId);

// GET    /api/orders/chef/:chefId          Lịch sử đơn của chef
orderRouter.get("/chef/:chefId", authMiddleware, orderController.getOrderHistoryByChefId);

// PATCH  /api/orders/:id/status
orderRouter.patch("/:id/status", authMiddleware, orderController.updateOrderStatus);

// PATCH  /api/orders/:id/payment
orderRouter.patch("/:id/payment", authMiddleware, orderController.updatePaymentStatus);

// GET    /api/orders/:id                   Chi tiết đơn
orderRouter.get("/:id", authMiddleware, orderController.getOrderDetails);

export default orderRouter;