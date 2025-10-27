import express from "express";
import testRouter from "./testRoute/index.js";

// Main router
const router = express.Router();

// Mount testRouter at /test
router.use("/test", testRouter);

export default router;