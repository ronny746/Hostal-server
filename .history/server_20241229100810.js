const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', require('./routes/user.routes')); // User routes
app.use('/api/hostels', require('./routes/hostel.routes')); // Hostel routes
app.use('/api/bookings', require('./routes/booking.routes')); // Booking routes
app.use('/api/contact', require('./routes/contact.routes')); // Contact Us routes
app.use('/api/app', require('./routes/app.routes')); // App Details routes
app.use('/api/review', require('./routes/review.routes')); // App Details routes
app.use('/api/room', require('./routes/room.routes')); // App Details routes
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
