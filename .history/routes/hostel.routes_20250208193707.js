const express = require('express');
const { createHostel, getHostels, updateHostel, deleteHostel, searchHostels, getHostListings, getBookingsForHost } = require('../controllers/hostel.controller');
const router = express.Router();

router.post('/', createHostel);
router.get('/', getHostels);
router.get('/user/:userId', getHostListings);
router.get('/bookings/:hostId', getBookingsForHost);


// router.put('/:id', updateHostel);
router.put('/:hostelId', updateHostel);
router.delete('/:id', deleteHostel);

router.get('/search', searchHostels);



module.exports = router;
