const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: false },
        phone: { type: String, required: true, unique: true }, // Unique phone number
        aboutMe: { type: String, required: false }, // Optional about me
        email: { type: String, required: false, unique: true }, // Unique email
        dateOfBirth: { type: Date, required: false }, // Optional date of birth
        address: { type: String, required: false }, // Optional address
        isHost: { type: Boolean, default: false }, // Indicate if the user is a host
        languages: { type: [String], default: [] },
        position: { type: String, required: false },
        verified: { type: String, required: false },
        // Documents with Status
        adharFront: {
            file: { type: String, required: false }, // File URL
            status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" } // Status
        },
        adharBack: {
            file: { type: String, required: false },
            status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" }
        },
        panCard: {
            file: { type: String, required: false },
            status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
