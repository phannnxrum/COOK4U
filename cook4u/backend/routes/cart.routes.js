import express from 'express';
import * as cartController from '../controllers/cart.controller.js';

const cartRouter = express.Router();

// Test route
cartRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Cart route is working!' });
});

// GET    /api/cart/:customerId             Khách xem giỏ
cartRouter.get('/:customerId', cartController.getCartByCustomerId);
// POST   /api/cart                         Khách chọn món + chef
cartRouter.post('/', cartController.addItemToCart);
// DELETE /api/cart/:cartId                 Khách xóa món
cartRouter.delete('/:cartId', cartController.deleteItemFromCart);
// DELETE /api/cart/clear/:customerId      Khách xóa tất cả món trong giỏ
cartRouter.delete('/clear/:customerId', cartController.clearCartByCustomerId);

export default cartRouter;