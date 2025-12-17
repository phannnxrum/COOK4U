import express from 'express';
import * as authController from '../controllers/auth.controller.js';
// import { authenticate } from '../middleware/auth.middleware.js';
// const { validateRegister, validateLogin } = require('../middleware/validation.middleware.js');

const authRouter = express.Router();

// Register
authRouter.post('/register', authController.register);

// Login
authRouter.post('/login', authController.login);

// Test route
authRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Auth route is working!' });
});

// Get current user
// authRouter.get('/me', authenticate, authController.getCurrentUser);

export default authRouter;