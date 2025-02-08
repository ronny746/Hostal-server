// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const connectDB = require('./config/database');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use('/api/users', require('./routes/user.routes')); // User routes
// app.use('/api/hostels', require('./routes/hostel.routes')); // Hostel routes
// app.use('/api/bookings', require('./routes/booking.routes')); // Booking routes
// app.use('/api/contact', require('./routes/contact.routes')); // Contact Us routes
// app.use('/api/app', require('./routes/app.routes')); // App Details routes
// app.use('/api/review', require('./routes/review.routes')); // App Details routes
// app.use('/api/rooms', require('./routes/room.routes')); // App Details routes
// app.use('/api/images', require('./routes/image.routes'));
// app.use('/api', require('./routes/pdfRoutes'));
// app.use('/api',  require('./routes/qrRoutes'));
// app.use('/api/payments', require('./routes/paymentRoutes'));
// app.use('/api/transactions', require('./routes/transactionRoutes'));

// const PORT = process.env.PORT || 2000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Listening for voice call initiation
  socket.on('voice_call', (data) => {
    console.log('Voice call request received from', socket.id);
    socket.broadcast.emit('voice_call', data); // Send to other users in the LAN
  });

  // Listening for ICE candidates
  socket.on('ice_candidate', (data) => {
    socket.broadcast.emit('ice_candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://192.168.31.134:3000');
});
