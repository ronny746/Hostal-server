const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    enum: [
      'Single Bedded',
      'Double Bedded',
      'Triple Bedded',
      'Four Bedded',
      'AC Single Bedded',
      'AC Double Bedded',
      'AC Triple Bedded',
      'AC Four Bedded',
      'Classic',
      'Deluxe',
      'Super Deluxe',
    ],
  },
  totalRooms: { type: Number, required: true },
  guestAllowedPerRoom: { type: Number, required: true },
  
  description: { type: String  },
  images: [{ type: String }],
  ratePerDay: { type: Number, required: true },
  hostal: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  bookedRooms: { type: Number, default: 0 },
  availableRooms: { type: Number, default: 0 },
  availableGuestCapacity: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
