const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: false },
    phone: { type: String, required: true, unique: true }, // Unique phone number
    aboutMe: { type: String, required: false }, // Optional about me
    email: { type: String, required: false, unique: true }, // Unique email
    dateOfBirth: { type: Date, required: false }, // Optional date of birth
    address: { type: String, required: false }, // Optional address
    isHost: { type: Boolean, default: false }, // Indicate if the user is a host
    adharFront:{type:String,required:false},
    adharBack:{type:String,required:false},
    panCard:{type:String,required:false},
    safetydescription:{type:String,required:false},
    language:{type:String,required:false},
    position:{type:String,required:false},
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
