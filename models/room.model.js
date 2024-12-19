const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    roomNo: { type: Number, required: true },
    capacity: { type: Number, required: true },
    amenities: [String],
    isAvailable: { type: Boolean, default: true },
    images: [String],
    description: { type: String },
    hostal: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
