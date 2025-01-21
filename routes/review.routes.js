const express = require('express');
const router = express.Router();
const { addReview, getReviews, deleteReview } = require('../controllers/review.controller');

// Add a review
router.post('/', addReview);

// Get all reviews for a hostel
router.get('/', getReviews);

//get hostel reviews
router.get('/hostel/:hostelId', getReviews);

// Delete a specific review
router.delete('/hostels/:hostelId/reviews/:reviewId', deleteReview);

module.exports = router;
