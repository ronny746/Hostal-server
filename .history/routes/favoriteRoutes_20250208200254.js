const express = require('express');

const favController = require('../controllers/favoriteController');
const { verifyToken } = require('../config/middlewares');

const router = express.Router();

// ✅ Add Favorite (hostelId in URL)
router.post('/add/:hostelId', verifyToken, favController.addFavorite);

// ✅ Remove Favorite (hostelId in URL)
router.delete('/remove/:hostelId', verifyToken, favController.removeFavorite);

// ✅ Get All Favorites
router.get('/list', verifyToken, favController.getFavorites);

module.exports = router;
