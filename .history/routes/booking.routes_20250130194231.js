const express = require('express');
const bookingController = require('../controllers/booking.controller');
const router = express.Router();

router.post('/', bookingController.bookHostel); // Create a booking
router.get('/hosteldetails/:hostelId',bookingController.getHostelDetails);
router.get('/', bookingController.getBookings); // Get all bookings
router.get('/user/:id', bookingController.getUserBookings); // Get bookings by user
router.patch('/:bookingId/cancel', bookingController.cancelBooking); // Cancel a booking
router.patch('/:bookingId/confirm', bookingController.confirmBooking); // confirm a booking

module.exports = router;
