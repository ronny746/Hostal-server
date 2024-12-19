const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: false },
    phone: { type: String, required: true, unique: true }, // Unique phone number
    email: { type: String, required: false, unique: true }, // Unique email
    dateOfBirth: { type: Date, required: false }, // Optional date of birth
    address: { type: String, required: false }, // Optional address
    isHost: { type: Boolean, default: false }, // Indicate if the user is a host
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
