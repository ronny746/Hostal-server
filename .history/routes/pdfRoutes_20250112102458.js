const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

// Define the route for generating PDF
router.get('/generate-pdf', pdfController.generateBillPDF);

module.exports = router;
