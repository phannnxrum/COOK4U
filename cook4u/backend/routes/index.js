import express from "express";
import testRouter from "./testRoute/index.js";
import authRouter from "./auth.routes.js";
import chefRouter from "./chef.routes.js";
import dishRouter from "./dish.routes.js";

// Main router
const router = express.Router();

// Mount testRouter at /test
router.use("/test", testRouter);

// Mount authRouter at /auth
router.use("/auth", authRouter);

// Mount chefRouter at /chefs
router.use("/chefs", chefRouter);

// Mount dishRouter at /dishes
router.use("/dishes", dishRouter);

export default router;