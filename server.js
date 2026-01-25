const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ===============================
// Message Schema
// ===============================
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

// ===============================
// Routes
// ===============================

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Create message (from frontend)
app.post("/messages", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: get all messages
app.get("/admin/messages", async (req, res) => {
  const key = req.query.key;

  if (key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

app.get("/admin", async (req, res) => {
  const key = req.query.key;

  if (key !== process.env.ADMIN_KEY) {
    return res.send("<h2>❌ Unauthorized</h2>");
  }

  const messages = await Message.find().sort({ createdAt: -1 });

  let html = `
    <html>
    <head>
      <title>Admin Dashboard</title>
      <style>
        body {
          font-family: Arial;
          background: #f4f4f4;
          padding: 20px;
        }
        .card {
          background: #fff;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .email {
          color: #555;
          font-size: 14px;
        }
        .date {
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <h1>📩 Contact Messages</h1>
  `;

  messages.forEach(msg => {
    html += `
      <div class="card">
        <strong>${msg.name}</strong>
        <div class="email">${msg.email}</div>
        <p>${msg.message}</p>
        <div class="date">${msg.createdAt.toLocaleString()}</div>
      </div>
    `;
  });

  html += `</body></html>`;

  res.send(html);
});

// ===============================
// Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.get("/test-db", async (req, res) => {
  try {
    const test = await Message.create({
      name: "Test User",
      email: "test@test.com",
      message: "Hello MongoDB"
    });

    res.json({
      success: true,
      saved: test
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
