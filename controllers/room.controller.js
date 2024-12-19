const Room = require('../models/room.model'); // Assuming Room model path
const Hostel = require('../models/hostel.model'); // Assuming Hostel model path

exports.addRoom = async (req, res) => {
    try {
        const { hostelId } = req.params; // Hostel ID from URL params
        const {
            name,
            price,
            roomNo,
            capacity,
            amenities,
            images,
            description,
            isAvailable,
        } = req.body;

        // Validate hostel ID
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            return res.status(404).json({ message: 'Hostel not found.' });
        }

        // Create new room
        const newRoom = new Room({
            name,
            price,
            roomNo,
            capacity,
            amenities,
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            images,
            description,
            hostal: hostelId,
        });

        // Save the room
        const savedRoom = await newRoom.save();

        res.status(201).json({
            message: 'Room added successfully.',
            room: savedRoom,
        });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({
            message: 'An error occurred while adding the room.',
            error: error.message,
        });
    }
};


exports.getRoom = async (req, res) => {
    try {
        const { id } = req.params;
    
        const rooms = await Room.findById(id);
        if (rooms.length === 0) {
            return res.status(404).json({ message: 'No Rooms found.' });
        }
        res.status(200).json({ 
            message: 'Rooms retrieved successfully.', 
            rooms 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'An error occurred while fetching rooms.', 
            error: error.message 
        });
    }
};


exports.getRoomsByHostelId = async (req, res) => {
    try {
        const { hostelId } = req.params;

        // Fetch rooms for the given hostel ID
        const rooms = await Room.find({ hostal: hostelId });

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: 'No rooms found for this hostel.' });
        }

        res.status(200).json({ 
            message: 'Rooms retrieved successfully.',
            rooms,
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({
            message: 'An error occurred while fetching rooms.',
            error: error.message,
        });
    }
};
