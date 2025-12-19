import express from 'express';
import * as cartController from '../controllers/cart.controller.js';
import authMiddleware from '../middleware/jwt.middleware.js';

const cartRouter = express.Router();

// Test route
cartRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Cart route is working!' });
});

// GET    /api/cart/me                      Khách xem giỏ
cartRouter.get('/me', authMiddleware, cartController.getCartByCustomerId);
// // POST   /api/cart                         Khách chọn món + chef
// cartRouter.post('/', authMiddleware, cartController.addItemToCart);

// POST     /api/cart/dish
cartRouter.post('/dish', authMiddleware, cartController.addDishToCart);
// POST     /api/cart/chef
cartRouter.post('/chef', authMiddleware, cartController.addChefToCart);
// // DELETE /api/cart/item                    Khách xóa món
// cartRouter.delete('/item', authMiddleware, cartController.deleteItemFromCart);

// DELETE   /api/cart/dish
cartRouter.delete('/dish', authMiddleware, cartController.deleteDishFromCart);

//DELETE    /api/cart/chef
cartRouter.delete('/chef', authMiddleware, cartController.deleteChefFromCart);

// DELETE /api/cart/clear                   Khách xóa tất cả món trong giỏ
cartRouter.delete('/clear', authMiddleware, cartController.clearCartByCustomerId);

export default cartRouter;