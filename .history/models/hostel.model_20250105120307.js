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
  ima: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Hostel', HostelSchema);
