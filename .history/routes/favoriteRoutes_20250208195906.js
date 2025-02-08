const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ✅ Add Favorite (hostelId in URL)
router.post('/add/:hostelId', verifyToken, addFavorite);

// ✅ Remove Favorite (hostelId in URL)
router.delete('/remove/:hostelId', verifyToken, removeFavorite);

// ✅ Get All Favorites
router.get('/list', verifyToken, getFavorites);

module.exports = router;
