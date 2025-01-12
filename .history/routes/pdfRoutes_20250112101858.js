const express = require('express');
const router = express.Router();
const pdfController = require('./pdfController');

// Define the route for generating PDF
router.get('/generate-pdf', pdfController.generateHostelPDF);

module.exports = router;
