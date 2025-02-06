const Room = require('../models/room.model'); // Assuming Room model path
const Hostel = require('../models/hostel.model'); // Assuming Hostel model path
const Booking = require('../models/booking.model');

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

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find(); // Fetch all rooms
        res.status(200).json({
            message: 'Rooms fetched successfully.',
            rooms,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch rooms.',
            error: error.message,
        });
    }
};

exports.getRoomsByHostelId = async (req, res) => {
    try {
        const { hostelId, fromDate, toDate } = req.body;

        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            return res.status(404).json({
                message: 'Hostel not found.',
            });
        }

        // Fetch all rooms linked to the given hostelId
        const rooms = await Room.find({ hostal: hostelId });

        if (rooms.length === 0) {
            return res.status(404).json({
                message: 'No rooms found for the specified hostel ID.',
                hostel:hostel.toObject()
            });
        }

        let from, to;
        let filterByDate = false;  // Flag to check if date filtering is needed

        if (fromDate && toDate) {
            from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);

            to = new Date(toDate);
            to.setHours(23, 59, 59, 999);

            if (from >= to) {
                return res.status(400).json({
                    message: 'Invalid date range: fromDate should be earlier than toDate.',
                });
            }
            filterByDate = true;
        }

        const roomDetails = await Promise.all(
            rooms.map(async (room) => {
                let availableRooms = room.totalRooms;
                let availableGuestCapacity = room.totalRooms * room.guestAllowedPerRoom;
                let bookedRooms = 0;

                let bookings = [];  // Initialize as empty array

                if (filterByDate) {
                    bookings = await Booking.find({
                        room: room._id,
                        status: 'Confirmed',
                        $or: [
                            { checkIn: { $lte: to }, checkOut: { $gte: from } },
                            { checkIn: { $gte: from, $lte: to } },
                        ],
                    });

                    let totalOccupiedGuests = bookings.reduce((sum, booking) => sum + booking.guests, 0);

                    // Calculate available rooms and guests
                    availableRooms = Math.max(0, room.totalRooms - bookings.length);
                    availableGuestCapacity = Math.max(0, (room.totalRooms * room.guestAllowedPerRoom) - totalOccupiedGuests);
                    bookedRooms = bookings.length;
                }

                return {
                    roomId: room._id,
                    roomType: room.roomType,
                    totalRooms: room.totalRooms,
                    availableRooms: availableRooms,
                    guestAllowedPerRoom: room.guestAllowedPerRoom,
                    totalGuestCapacity: room.totalRooms * room.guestAllowedPerRoom,
                    availableGuestCapacity: availableGuestCapacity,
                    ratePerDay: room.ratePerDay,
                    description: room.description,
                    images: room.images,
                    bookedRooms: bookedRooms,
                    hostal: room.hostal,
                };
            })
        );

        res.status(200).json({
            message: 'Rooms fetched successfully.',
            rooms: roomDetails,
            hostel:hostel.toObject()
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch rooms by hostel ID.',
            error: error.message,
        });
    }
};


exports.updateRoom = async (req, res) => {
    try {
        // Extract room ID from the request params
        const { roomId } = req.params;

        // Extract the updated data from the request body
        const updatedData = req.body;

        // Find the room by ID and update it with the provided data
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,            // Room ID
            updatedData,       // Data to update
            { new: true }      // Return the updated document
        );

        // Check if the room was found and updated
        if (!updatedRoom) {
            return res.status(404).json({
                message: 'Room not found. Please check the room ID.',
            });
        }

        // Respond with the updated room data
        res.status(200).json({
            message: 'Room updated successfully.',
            room: updatedRoom,
        });
    } catch (error) {
        // Catch and return any errors
        res.status(400).json({
            message: 'Failed to update room. Please check the input data.',
            error: error.message,
        });
    }
};