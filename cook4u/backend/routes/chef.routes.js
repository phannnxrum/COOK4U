import express from 'express';
import * as chefsController from '../controllers/chef.controller.js';

const chefRouter = express.Router();
// Test route
chefRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Chef route is working!' });
});
// GET all chefs
chefRouter.get('/', chefsController.getAllChefs);
// GET chef by id
chefRouter.get('/:id', chefsController.getChefbyId);

// POST create chef
chefRouter.post('/', chefsController.createChef);

// PATCH update chef
chefRouter.patch('/:id', chefsController.updateChef);


export default chefRouter;