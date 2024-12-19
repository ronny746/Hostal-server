const express = require('express');
const router = express.Router();
const { addReview, getReviews, deleteReview } = require('../controllers/review.controller');

// Add a review
router.post('/hostels/:hostelId/reviews', addReview);

// Get all reviews for a hostel
router.get('/hostels/:hostelId/reviews', getReviews);

// Delete a specific review
router.delete('/hostels/:hostelId/reviews/:reviewId', deleteReview);

module.exports = router;
