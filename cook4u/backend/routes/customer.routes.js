import express from 'express';
import * as customerController from '../controllers/customer.controller.js';

const customerRouter = express.Router();

// Test route
customerRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Customer route is working!' });
});

// POST   /api/customers/cart       Tạo giỏ hàng cho khách
customerRouter.post('/cart', customerController.createCartForCustomer);

export default customerRouter;