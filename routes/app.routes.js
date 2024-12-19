const express = require('express');
const appController = require('../controllers/app.controller');
const router = express.Router();

router.get('/details', appController.getAppDetails); // Get app details

module.exports = router;
