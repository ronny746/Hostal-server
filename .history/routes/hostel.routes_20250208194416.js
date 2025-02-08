const express = require('express');
const {
    createHostel,
    getHostels,
    updateHostel,
    deleteHostel,
    searchHostels,
    getHostListings,
    getBookingsForHost
} = require('../controllers/hostel.controller');
const authenticateToken = require('../'); // Import the auth middleware

const router = express.Router();

// Protect routes that require authentication
router.post('/', authenticateToken, createHostel);
router.get('/', authenticateToken, getHostels);
router.get('/user/:userId', authenticateToken, getHostListings);
router.get('/bookings/:hostId', authenticateToken, getBookingsForHost);
router.put('/:hostelId', authenticateToken, updateHostel);
router.delete('/:id', authenticateToken, deleteHostel);
router.get('/search', searchHostels); // Can be public

module.exports = router;
