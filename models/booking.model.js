const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    hostel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hostel', 
        required: true 
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },

    bookingDate: { 
        type: Date, 
        default: Date.now 
    },
    checkIn: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: 'Check-in date must be in the future.'
        }
    },
    checkOut: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return this.checkIn < value;
            },
            message: 'Check-out date must be after the check-in date.'
        }
    },
    guests: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed'], 
        default: 'Pending' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['Credit Card', 'PayPal', 'Cash'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled'], 
        default: 'Pending' 
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
