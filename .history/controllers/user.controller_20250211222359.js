

const jwt = require('jsonwebtoken');
const { use } = require('../routes/user.routes');

const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/user.model');
const OTP = require('../models/otp.model');

exports.generateOTP = async (req, res) => {
    const { phone } = req.body;

    try {
        // Check if the user exists; if not, create one
        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ phone, name: 'Anonymous' });
            await user.save();
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP expiration (5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP
        const otpRecord = new OTP({ phone, otp, expiresAt });
        await otpRecord.save();

        // Send OTP via SMS API
        const response = await axios.get('http://103.182.103.247/app/smsapi/index.php', {
            params: {
                username: 'VijayM',
                password: '2024',
                campaign: '12417',
                routeid: '3',
                type: 'text',
                contacts: phone,
                senderid: 'CSOCIT',
                msg: `Dear User Your OTP is ${otp} for mobile number verification. It is valid for 5 minutes. Please do not share with anyone - CSOCIT`,
                time: '',
                template_id: '1707173399550602618',
                pe_id: '1701171048184684059',
            },
        });

        console.log('SMS API Response:', response.data);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error generating OTP:', error.message);
        res.status(500).json({ message: 'An error occurred while generating OTP' });
    }
};



exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        // Find the OTP record
        const otpRecord = await OTP.findOne({ phone, otp });
        if (!otpRecord) return res.status(400).json({ message: 'Invalid OTP' });

        // Check if OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ phone, otp });
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Log in user
        const user = await User.findOne({ phone });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, phone: user.phone },
            'hostal', // Use a secure secret
            { expiresIn: '1d' }
        );

        // Clean up OTP
        await OTP.deleteOne({ phone, otp });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                isHost: user.isHost,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get All Users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        name, phone, email, dateOfBirth, address, isHost,
        adharFront, adharBack, panCard,
        languages, position, aboutMe
    } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // General updates
        Object.assign(user, {
            name: name ?? user.name,
            phone: phone ?? user.phone,
            email: email ?? user.email,
            dateOfBirth: dateOfBirth ?? user.dateOfBirth,
            address: address ?? user.address,
            isHost: isHost ?? user.isHost,
            aboutMe: aboutMe ?? user.aboutMe,
            position: position ?? user.position,
            languages: Array.isArray(languages) ? languages : user.languages, // Ensure it's an array
        });

        // Update document fields properly
        if (adharFront) user.adharFront = { ...user.adharFront, ...adharFront };
        if (adharBack) user.adharBack = { ...user.adharBack, ...adharBack };
        if (panCard) user.panCard = { ...user.panCard, ...panCard };
        if (user.panCard.status == 'verified' && user.adharBack.status == 'verified' && user.adharFront.status == 'verified') {
            user.profileStatus
        }
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get User Profile by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from request parameters
        const user = await User.findById(userId); // Find user by ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // Send the user data in response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User

