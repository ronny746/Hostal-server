const express = require('express');
const router = express.Router();
const { addRoom,getRoom,getAllRooms,getRoomsByHostelId,updateRoom} = require('../controllers/room.controller');

// Add a room to a hostel
router.get('/hostels/:id', getRoom);
// router.get('/hostels/:hostelId/rooms', getRoomsByHostelId);
router.post('/hostels/:hostelId/rooms', addRoom);

router.get('/', getAllRooms);
router.get('/hostel/', getRoomsByHostelId);
router.put('/:roomId', updateRoom);

module.exports = router;
 