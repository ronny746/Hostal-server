require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://hostal:CazvKvGIwXd2o8G9@cluster0.lorer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
            socketTimeoutMS: 45000, // Increase socket timeout
        });

        console.log(`[${new Date().toISOString()}] ✅ MongoDB connected successfully`);

        // MongoDB Connection Events
        mongoose.connection.on('connected', () => {
            console.log(`[${new Date().toISOString()}] ✅ Mongoose connected`);
        });

        mongoose.connection.on('error', (err) => {
            console.error(`[${new Date().toISOString()}] ❌ Mongoose Error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn(`[${new Date().toISOString()}] ⚠️ Mongoose Disconnected`);
        });

        mongoose.connection.on('reconnected', () => {
            console.log(`[${new Date().toISOString()}] 🔄 Mongoose Reconnected`);
        });

        mongoose.connection.on('reconnectFailed', () => {
            console.error(`[${new Date().toISOString()}] ❌ Mongoose Reconnection Failed`);
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] ❌ Database Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
