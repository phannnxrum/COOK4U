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
chefRouter.post('/', chefsController.createChefV2);

// PATCH update chef
chefRouter.patch('/:id', chefsController.updateChefV2);

// PATCH update chef_cuisine_type
chefRouter.patch('/:id/cuisine-types', chefsController.updateChefCuisineTypes);

// PATCH update chef_language
chefRouter.patch('/:id/languages', chefsController.updateChefLanguages);

// PATCH update chef_certifications
chefRouter.patch('/:id/certifications', chefsController.updateChefCertifications);

// PATCH update chef_services_details
chefRouter.patch('/:id/services-details', chefsController.updateChefServiceDetails);


export default chefRouter;