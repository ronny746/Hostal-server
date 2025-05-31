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
// app.use('/api/favorites', require('./routes/favoriteRoutes'));

// const PORT = process.env.PORT || 2000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const RUNWAY_API_KEY = "YOUR_RUNWAY_API_KEY"; // 🔁 Replace with your real API key

// POST /text-to-video
app.post("/text-to-video", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: "Text is required" });
  }

  try {
    // Call Runway Gen-2 API
    const response = await axios.post(
      "https://api.runwayml.com/v1/generate", // Replace with actual endpoint if different
      {
        prompt: text,
        length: 5, // in seconds
      },
      {
        headers: {
          Authorization: `Bearer ${RUNWAY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const videoUrl = response.data.video_url;
    res.json({ success: true, videoUrl });

  } catch (err) {
    console.error("Error generating video:", err.message);
    res.status(500).json({ success: false, message: "Failed to generate video" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
