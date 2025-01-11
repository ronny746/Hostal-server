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
        houseRules: [String], // Custom house rules (e.g., "No loud music after 10 PM")
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
