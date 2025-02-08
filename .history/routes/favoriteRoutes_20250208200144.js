const express = require('express');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const contactController = require('../controllers/contact.controller');
const { verifyToken } = require('../config/middlewares');

const router = express.Router();

// ✅ Add Favorite (hostelId in URL)
router.post('/add/:hostelId', verifyToken, addFavorite);

// ✅ Remove Favorite (hostelId in URL)
router.delete('/remove/:hostelId', verifyToken, removeFavorite);

// ✅ Get All Favorites
router.get('/list', verifyToken, getFavorites);

module.exports = router;
