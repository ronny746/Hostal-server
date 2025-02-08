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


const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Register user
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log("User registered:", userId);
  });

  // Handle call request
  socket.on("callUser", ({ callerId, targetId, offer }) => {
    if (users[targetId]) {
      io.to(users[targetId]).emit("incomingCall", { callerId, offer });
    }
  });

  // Handle answer
  socket.on("answerCall", ({ targetId, answer }) => {
    if (users[targetId]) {
      io.to(users[targetId]).emit("callAnswered", { answer });
    }
  });

  // Handle ICE Candidate
  socket.on("iceCandidate", ({ targetId, candidate }) => {
    if (users[targetId]) {
      io.to(users[targetId]).emit("iceCandidate", { candidate });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));
