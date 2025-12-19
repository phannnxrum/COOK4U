import express from "express";
import * as reviewController from '../controllers/review.controller.js';

const reviewRouter = express.Router();

// Test route
reviewRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Review route is working!' });
});

// POST   /api/reviews        Customer đánh giá chef/món
reviewRouter.post('/', reviewController.createReview);
// GET    /api/reviews/chef/:chefId     Xem review của chef
reviewRouter.get('/chef/:chefId', reviewController.getReviewsByChef);
// GET    /api/reviews/dish/:dishId     Xem review của món
reviewRouter.get('/dish/:dishId', reviewController.getReviewsByDish);

export default reviewRouter;