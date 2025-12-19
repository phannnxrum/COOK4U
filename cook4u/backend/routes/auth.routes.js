import express from 'express';
import * as authController from '../controllers/auth.controller.js';
// import { authenticate } from '../middleware/auth.middleware.js';
// const { validateRegister, validateLogin } = require('../middleware/validation.middleware.js');

const authRouter = express.Router();

// Register
authRouter.post('/register', authController.register);

// Login
authRouter.post('/login', authController.login);

// Register admin
authRouter.post('/hidden-register', authController.adminRegister);

// Login with admin privileges
authRouter.post('/login-admin', authController.adminLogin);

// Forgot password - Send OTP to email
authRouter.post('/send-otp', authController.sendOTP);

// Forgot password - Verify OTP
authRouter.post('/verify-otp', authController.verifyOTPCode);

// Forgot password - Reset password
authRouter.post('/reset-password', authController.resetPassword);

// Test route
authRouter.get('/test', (req, res) => {
    res.status(200).json({ message: 'Auth route is working!' });
});


export default authRouter;