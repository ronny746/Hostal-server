const express = require('express');
const { downloadHostelQRCode } = require('../controllers/qrController');

const router = express.Router();

/**
 * Route to generate QR code
 * POST /api/generate-hostel-qr
 */
router.post('/generate-hostel-qr', downloadHostelQRCode);

module.exports = router;
