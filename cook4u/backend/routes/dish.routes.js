import express from "express";
import * as dishController from "../controllers/dish.controller.js";

const dishRouter = express.Router();

// Test route
dishRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Dish route is working!' });
});

// GET    /api/dishes           Lấy tất cả món
dishRouter.get('/', dishController.getAllDishes);
// GET    /api/dishes/:id       Lấy món theo id
dishRouter.get('/:id', dishController.getDishById);
// POST   /api/dishes           Tạo món
dishRouter.post('/', dishController.createDish);
// PATCH   /api/dishes/:id      Sửa món
dishRouter.patch('/:id', dishController.updateDish);
// DELETE /api/dishes/:id      Xoá món
dishRouter.delete('/:id', dishController.deleteDish);
// GET /api/dishes/:id/nutrition  Lấy thông tin dinh dưỡng của món
dishRouter.get('/:id/nutrition', dishController.getDishNutrition);
// POST /api/dishes/:id/nutrition  Thêm thông tin dinh dưỡng cho món
dishRouter.post('/:id/nutrition', dishController.addDishNutrition);
// DELETE /api/dishes/:id/nutrition/:nutritionId  Xoá thông tin dinh dưỡng của món
dishRouter.delete('/:id/nutrition/:nutritionId', dishController.deleteDishNutrition);
// GET /api/dishes/:id/ingredients  Lấy nguyên liệu của món
dishRouter.get('/:id/ingredients', dishController.getDishIngredients);
// POST /api/dishes/:id/ingredients  Thêm nguyên liệu cho món
dishRouter.post('/:id/ingredients', dishController.addDishIngredient);
// DELETE /api/dishes/:id/ingredients/:ingredientId  Xoá nguyên liệu của món
dishRouter.delete('/:id/ingredients/:ingredientId', dishController.deleteDishIngredient);



export default dishRouter;