const mongoose = require('mongoose');

// Hostel Schema
const HostelSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String }, 
        hostalType: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String},
        zipcode: { type: String },
        description: { type: String },
        images: { type: [String] }, 
        basePrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        facilities: [String], // Hostel-wide facilities (e.g., "Parking", "Breakfast")
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
        checkIn: { type: String }, // Check-in time (e.g., "2:00 PM")
        checkOut: { type: String }, // Check-out time (e.g., "11:00 AM")
        cancellationPolicy: { type: String }, // Cancellation details
        smokingAllowed: { type: Boolean, default: false },
        petsAllowed: { type: Boolean, default: false },
        partiesAllowed: { type: Boolean, default: false },
        nearByname: { type: String },
        nearBydistance: { type: Number }, // Distance in kilometers or miles
        nearBydescription: { type: String },
        openTime: { type: String }, // Opening time (e.g., "08:00 AM")
        closeTime: { type: String }, // Closing time (e.g., "10:00 PM")
        host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Host reference
        isAvailable: { type: Boolean, default: true }, // Availability status
        paymentOptions: [String], // Accepted payment methods (e.g., "Credit Card", "PayPal")
        tags: [String],
        highlights: [
            {
                title: { type: String, required: true }, // e.g., "This property in Under Top 10"
                subtitle: { type: String, required: true }, // e.g., "This property is under top 10 on rating basis in this area, so you can trust and book"
            },
        ], // Array of highlights
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hostel', HostelSchema);


const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  // General Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  guestType: { type: String, required: true },
  onlyFor: { type: String, required: true },

  // Facilities
  ac: { type: Boolean, default: false },
  nonac: { type: Boolean, default: true },
  mess: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  roomIn: { type: Boolean, default: false },
  sharedSpace: { type: Boolean, default: false },
  dedicatedBathroom: { type: Boolean, default: false },

  // Additional Information
  aboutThisPlace: { type: String },
  inTime: { type: String },
  outTime: { type: String },

  // Rules
  rules: [
    {
      title: { type: String },
      description: { type: String },
    },
  ],

  // Policies
  cancellationPolicy: { type: String },
  smokingZone: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },

  // Amenities
  amenities: [{ type: String }],

  // Location Details
  mapUrl: { type: String },
  flatType: { type: String },
  streetAddress: { type: String },
  nearbyLandmark: { type: String },
  district: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },

  // Room Details
  totalRooms: { type: Number },
  singleBedded: { type: Number },
  doubleBedded: { type: Number },
  tripleBedded: { type: Number },
  fourBedded: { type: Number },

  // Rates
  rateSingleBedded: { type: Number },
  rateDoubleBedded: { type: Number },
  rateTripleBedded: { type: Number },
  rateFourBedded: { type: Number },
  weeklyDiscount: { type: Number },
  monthlyDiscount: { type: Number },
  bookingAmount: { type: Number },

  // Images
  singleBeddedImage: { type: String },
  doubleBeddedImage: { type: String },
  tripleBeddedImage: { type: String },
  fourBeddedImage: { type: String },
  images: { type: [String] }, 
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);
