const express = require('express');
const contactController = require('../controllers/contact.controller');
const router = express.Router();

router.post('/', contactController.submitContact); // Submit a contact inquiry
router.get('/', contactController.getContacts); // Get all contact inquiries

module.exports = router;
