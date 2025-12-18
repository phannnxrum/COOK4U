import express from "express";
import * as orderController from "../controllers/order.controller.js";

const orderRouter = express.Router();

// Test route
orderRouter.get("/test", (req, res) => {
  res.status(200).json({ message: "Order route is working!" });
});

// POST   /api/orders                       Tạo đơn (từ cart)
orderRouter.post("/", orderController.createOrderFromCart);

// GET    /api/orders/:id                   Chi tiết đơn
orderRouter.get("/:id", orderController.getOrderDetails);

// GET    /api/orders/customer/:customerId  Lịch sử đơn của customer
orderRouter.get("/customer/:customerId", orderController.getOrderHistoryByCustomerId);

// PATCH  /api/orders/:id/status
orderRouter.patch("/:id/status", orderController.updateOrderStatus);


export default orderRouter;