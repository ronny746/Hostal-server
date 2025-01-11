const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/image.controller');

// Route for uploading images
router.post('/upload', uploadImage);

module.exports = router;
