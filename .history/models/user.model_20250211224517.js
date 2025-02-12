const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        dateOfBirth: { type: Date },
        address: { type: String },
        isHost: { type: Boolean, default: false },
        profileStatus: { type: Boolean, default: false },

        // Default values for documents
        adharFront: {
            file: { type: String, default: '' },
            status: { type: String, default: 'pending' }
        },
        adharBack: {
            file: { type: String, default: '' },
            status: { type: String, default: 'pending' }
        },
        panCard: {
            file: { type: String, default: '' },
            status: { type: String, default: 'pending' }
        },

        languages: { type: [String], default: [] },
        position: { type: String, default: '' },
        aboutMe: { type: String, default: '' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
