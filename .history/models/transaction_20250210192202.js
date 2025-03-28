const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Booking' },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Partially Paid', 'Paid'], default: 'Pending' },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
