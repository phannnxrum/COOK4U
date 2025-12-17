import express from 'express';
import * as chefsController from '../controllers/chef.controller.js';

const chefRouter = express.Router();
// GET all chefs
chefRouter.get('/', chefsController.getAllChefs);
// GET chef by id
chefRouter.get('/:id', chefsController.getChefbyId);

// POST create chef
chefRouter.post('/', chefsController.createChef);

// PATCH update chef status
chefRouter.patch('/:id/status', chefsController.updateChefStatus);

// Test route
chefRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Chef route is working!' });
});

export default chefRouter;