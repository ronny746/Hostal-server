const express = require('express');
const router = express.Router();
const { addRoom,getRoomsByHostelId,getRoom} = require('../controllers/room.controller');

// Add a room to a hostel
router.get('/hostels/:id', getRoom);
router.get('/hostels/:hostelId/rooms', getRoomsByHostelId);
router.post('/hostels/:hostelId/rooms', addRoom);

module.exports = router;
