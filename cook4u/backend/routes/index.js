import express from "express";
import testRouter from "./testRoute/index.js";
import authRouter from "./auth.routes.js";
import customerRouter from "./customer.routes.js";
import chefRouter from "./chef.routes.js";
import dishRouter from "./dish.routes.js";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";
import reviewRouter from "./review.routes.js";

// Main router
const router = express.Router();

// Mount testRouter at /test
router.use("/test", testRouter);

// Mount authRouter at /auth
router.use("/auth", authRouter);

// Mount customerRouter at /customers
router.use("/customers", customerRouter);

// Mount chefRouter at /chefs
router.use("/chefs", chefRouter);

// Mount dishRouter at /dishes
router.use("/dishes", dishRouter);

// Mount cartRouter at /cart
router.use("/cart", cartRouter);

// Mount orderRouter at /orders
router.use("/orders", orderRouter);

// Mount reviewRouter at /reviews
router.use("/reviews", reviewRouter);

export default router;