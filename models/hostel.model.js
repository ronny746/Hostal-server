
const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  // General Information
  title: { type: String, required: true },
  hostelType: {
    type: String,
    required: true,
    enum: [
      'Hostel', 'PG', 'Guest House', 'House', '1 RK', '1 BHK', '2 BHK', '3 BHK', 'Resort'
    ],
  },
  guestType: {
    type: String,
    required: true,
    enum: [
      'Single Bedded',
      'Double Bedded',
      'Triple Bedded',
      'Four Bedded',
      'Classic',
      'Deluxe',
      'Super Deluxe',
    ],
  },
  // Facilities
  onlyFor: { type: String, enum: ['Male', 'Female', 'Both'], default: 'Both' },
  ac: { type: String, enum: ['AC', 'Non AC', 'Both'], default: "Both" },
  mess: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },

  roomIn: {
    type: String,
    required: true,
    enum: [
      'Multi Building', 'Building', 'Individual House', 'Villa', 'Double Story', 'Duplex', 'Resort', 'Society'
    ],
  },
  sharedSpace: { type: Boolean, default: false },
  dedicatedBathroom: { type: Boolean, default: false },

  // Additional Information
  aboutThisPlace: { type: String },
  inTime: { type: String, default: '06:00 AM' },
  outTime: { type: String, default: '10:00 PM' },

  // Rules
  rules: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],
  cancellationPolicy: { type: String, enum: ['No', 'Before 24 hours', 'Any Time'], default: 'No' },
  smokingZone: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },

  // Amenities
  amenities: [{ type: String }],

  // Location Details
  // mapLocation: { type: String },
  flatType: { type: String },
  streetAddress: { type: String },
  nearbyLandmark: { type: String },
  district: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },

  sfetyDescription: { type: String },
  images: [{ type: String }],
  video: { type: String },
  // Room Details
  totalRooms: { type: Number },
  acCharges: { type: Number, default: 0 },
  messCharges: { type: Number, default: 0 },
  laundryCharges: { type: Number, default: 0 },
  gymCharges: { type: Number, default: 0 },

  payFull: { type: Boolean, default: true },
  payPercentage: { type: Number, default: 0 },
  weeklyDiscount: { type: Number },
  monthlyDiscount: { type: Number },
  bookingAmount: { type: Number },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  discount: { type: Number, default: 0 },
  couponCode: { type: String, },
  contactNumber: { type: Number },

  ratings: { type: Number, default: 0 }, // Average rating
  reviewsCount: { type: Number, default: 0 }, // Number of reviews
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);
