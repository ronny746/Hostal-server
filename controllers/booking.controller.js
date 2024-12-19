

const Booking = require('../models/booking.model');
const User = require('../models/user.model');
const Hostel = require('../models/hostel.model');
const jwt = require('jsonwebtoken');
const Room = require('../models/room.model'); // Adjust the path as needed



exports.bookHostel = async (req, res) => {
    try {
        const { userId, hostelId, roomId, checkIn, checkOut, guests, totalPrice, paymentMethod } = req.body;

        // Validate user existence
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Validate hostel existence
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
 
        // Validate room existence
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });


        // Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            room: roomId,
            $or: [
                { checkIn: { $lte: checkOut, $gte: checkIn } },
                { checkOut: { $lte: checkOut, $gte: checkIn } }
            ],
            status: 'Confirmed'
        });
        if (overlappingBooking) {
            return res.status(400).json({ message: 'Room is not available for the selected dates' });
        }

        // Create the booking
        const booking = new Booking({
            user: userId,
            hostel: hostelId,
            room: roomId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            paymentMethod
        });

        await booking.save();

        res.status(201).json({ message: 'Booking created successfully', booking });
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
            .populate('hostel', 'name address'); // Populate hostel name and address

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify the token and extract user ID
        const decoded = jwt.verify(token, 'hostal');
        const userId = decoded.id;

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
