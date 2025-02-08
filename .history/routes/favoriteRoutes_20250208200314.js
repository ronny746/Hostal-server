const express = require('express');

const favController = require('../controllers/favoriteController');
const authenticateToken = require('../config/middlewares');

const router = express.Router();

// ✅ Add Favorite (hostelId in URL)
router.post('/add/:hostelId', authenticateToken, favController.addFavorite);

// ✅ Remove Favorite (hostelId in URL)
router.delete('/remove/:hostelId', authenticateToken, favController.removeFavorite);

// ✅ Get All Favorites
router.get('/list', authenticateToken, favController.getFavorites);

module.exports = router;
