const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    rooms: [
        {
            room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
            guests: { type: Number, required: true }
        }
    ],
    totalGuests: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentPercentage: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Partially Paid', 'Paid'], default: 'Pending' },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    bookingDate: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Booking', BookingSchema);
