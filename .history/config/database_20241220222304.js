const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        \
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
