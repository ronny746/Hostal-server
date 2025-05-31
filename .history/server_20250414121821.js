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
// key_e3565f1c98720fb0907d3dcf9247c89b1202c219e653828d2d890f9b709a62dd79208a72abf12ac64e5d20967fa94e07e1b7461a5df28b9dc9f20fda28a45c0e



const express = require("express");
const bodyParser = require("body-parser");
const RunwayML = require("@runwayml/sdk").default;

const app = express();
app.use(bodyParser.json());

// Initialize RunwayML SDK with your API key
const client = new RunwayML({ apiKey: "key_e3565f1c98720fb0907d3dcf9247c89b1202c219e653828d2d890f9b709a62dd79208a72abf12ac64e5d20967fa94e07e1b7461a5df28b9dc9f20fda28a45c0e" }); // 🟡 Replace this

// API Route - Text to Video
app.post("/text-to-video", async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ success: false, message: "Text is required" });

  try {
    // Start image-to-video generation (gen4_turbo)
    const imageToVideo = await client. ({
      model: "gen4_turbo",
      promptImage: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d", // 👈 Change if needed
      promptText: text,
      ratio: "1280:720" // 👈 REQUIRED FIX
    });

    const taskId = imageToVideo.id;

    // Polling for task completion
    let task;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      task = await client.tasks.retrieve(taskId);
    } while (!["SUCCEEDED", "FAILED"].includes(task.status));

    if (task.status === "SUCCEEDED") {
      return res.json({ success: true, videoUrl: task.output?.video });
    } else {
      return res.status(500).json({ success: false, message: "Video generation failed." });
    }

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
