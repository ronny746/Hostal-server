const mongoose = require('mongoose');

const connectDB = async () => {
    try {mongodb+srv://hostal:CazvKvGIwXd2o8G9@espyrotestingdb.lorer.mongodb.net/?retryWrites=true&w=majority&appName=Espyrotestingdb
        await mongoose.connect('mongodb+srv://hostal:CazvKvGIwXd2o8G9@cluster0.lorer.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`[${new Date().toISOString()}] MongoDB connected successfully`);
        
        // Adding detailed logging for connection events
        mongoose.connection.on('connected', () => {
            console.log(`[${new Date().toISOString()}] Mongoose connected to the database`);
        });

        mongoose.connection.on('error', (err) => {
            console.error(`[${new Date().toISOString()}] Mongoose connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn(`[${new Date().toISOString()}] Mongoose connection disconnected`);
        });

        mongoose.connection.on('reconnected', () => {
            console.log(`[${new Date().toISOString()}] Mongoose reconnected to the database`);
        });

        mongoose.connection.on('reconnectFailed', () => {
            console.error(`[${new Date().toISOString()}] Mongoose failed to reconnect to the database`);
        });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Database connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
