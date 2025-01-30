

const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Hostel = require('../models/hostel.model');
const jwt = require('jsonwebtoken');
const Room = require('../models/room.model'); // Adjust the path as needed



exports.bookHostel = async (req, res) => {
    try {
        const { userId, hostelId, rooms, checkIn, checkOut, totalPrice, paymentMethod } = req.body;

        // Validate user existence
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validate hostel existence
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) return res.status(404).json({ message: 'Hostel not found' });

        let allBookings = [];

        for (const roomRequest of rooms) {
            const { roomId, numRooms, guestsPerRoom } = roomRequest;

            // Validate room existence
            const room = await Room.findById(roomId);
            if (!room) {
                return res.status(404).json({
                    message: `Room with ID ${roomId} not found`,
                });
            }

            // Check for overlapping bookings
            const existingBookings = await Booking.find({
                room: roomId,
                status: 'Confirmed',
                $or: [
                    { checkIn: { $lt: checkOut, $gte: checkIn } },
                    { checkOut: { $gt: checkIn, $lte: checkOut } },
                    { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } },
                ],
            });

            // Calculate total rooms and guests already booked
            let totalBookedRooms = 0;
            let totalGuests = 0;

            existingBookings.forEach((booking) => {
                totalBookedRooms += booking.numRooms || 0;
                totalGuests += booking.guests || 0;
            });

            // Check room and guest capacity
            const availableRooms = room.totalRooms - totalBookedRooms;
            const availableGuests = availableRooms * room.guestAllowedPerRoom - totalGuests;

            if (numRooms > availableRooms) {
                return res.status(400).json({
                    message: `Not enough rooms available for room type ${room.roomType}. Available: ${availableRooms}`,
                });
            }

            if (numRooms * guestsPerRoom > availableGuests) {
                return res.status(400).json({
                    message: `Not enough guest capacity for room type ${room.roomType}. Available spots: ${availableGuests}`,
                });
            }

            // Create individual bookings for each room type
            const booking = new Booking({
                user: userId,
                hostel: hostelId,
                room: roomId,
                numRooms,
                guests: numRooms * guestsPerRoom,
                checkIn,
                checkOut,
                totalPrice, // Optionally, you can calculate the price per room here
                paymentMethod,
            });

            await booking.save();
            allBookings.push(booking);
        }

        res.status(201).json({ message: 'Booking created successfully', allBookings });
    } catch (error) {
        res.status(400).json({ message: 'Error creating booking', error: error.message });
    }
};


exports.getHostelDetails = async (req, res) => {
    try {
        const { hostelId } = req.params;

        const hostel = await Hostel.findById(hostelId)
            .populate('host', 'name email')
            .populate('reviews.user', 'name');

        if (!hostel) return res.status(404).json({ message: 'Hostel not found' });

        res.status(200).json({ message: 'Hostel details retrieved successfully', hostel });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving hostel details', error: error.message });
    }
};


exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email') // Populate user name and email
            .populate('hostel', 'name address') // Populate hostel name and address
            .populate('room', 'roomNumber capacity'); // Populate room number and capacity

            if (!bookings.length) {
                return res.status(404).json({ message: 'No bookings found' });
            }
        res.status(200).json({message: 'Bookings retrieved successfully', bookings});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        // Extract token from headers
        // const token = req.headers.authorization?.split(' ')[1];
        // if (!token) {
        //     return res.status(401).json({ message: 'Unauthorized: No token provided' });
        // }

        // Verify the token and extract user ID
        // const decoded = jwt.verify(token, 'hostal');
        const userId = req.id;
        co

        // Fetch bookings for the user
        const bookings = await Booking.find({ user: userId })
            .populate('hostel', 'name address')
            .populate('room', 'name price capacity amenities');

        res.status(200).json({ message: 'User bookings retrieved successfully', bookings });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'Cancelled' },
            { new: true }
        );

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        res.status(200).json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Find booking by ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if booking is already confirmed
        if (booking.status === 'Confirmed') {
            return res.status(400).json({ message: 'Booking is already confirmed' });
        }

        // Update booking status to "Confirmed"
        booking.status = 'Confirmed';
        await booking.save();

        res.status(200).json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error confirming booking', error: error.message });
    }
};

