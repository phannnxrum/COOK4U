import express from "express";
import * as favoriteController from '../controllers/favorite.controller.js';

const favoriteRouter = express.Router();
// Test route
favoriteRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Favorite route is working!' });
});

// POST   /api/favorites        Khách thêm đầu bếp vào yêu thích
favoriteRouter.post('/', favoriteController.addFavoriteChef);

// DELETE /api/favorites        Khách xóa đầu bếp khỏi yêu thích
favoriteRouter.delete('/', favoriteController.removeFavoriteChef);

// GET    /api/favorites/:customerId     Lấy số lượng đầu bếp yêu thích của khách
favoriteRouter.get('/:customerId', favoriteController.getFavoriteChefsCount);

export default favoriteRouter;