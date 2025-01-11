const express = require('express');
const router = express.Router();
const { uploadImage, uploadMiddleware } = require('../controllers/image.controller');

// Route for uploading images
router.post('/upload', uploadMiddleware, uploadImage);

module.exports = router;
