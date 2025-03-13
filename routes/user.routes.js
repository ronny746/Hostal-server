const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.get('/:id', userController.getUserById);
router.get('/', userController.getUsers); // Get all users
router.put('/:id', userController.updateUser); // Update user
router.put('/verifyUser:id', userController.verifyUserDocuments); // Update user
router.delete('/:id', userController.deleteUser); // Delete user

router.post('/generate-otp', userController.generateOTP); // Generate OTP
router.post('/verify-otp', userController.verifyOTP); // Verify OTP

module.exports = router;
