const express = require('express');
const { generateHostelQRCode } = require('../controllers/');

const router = express.Router();

/**
 * Route to generate QR code
 * POST /api/generate-hostel-qr
 */
router.post('/generate-hostel-qr', generateHostelQRCode);

module.exports = router;
