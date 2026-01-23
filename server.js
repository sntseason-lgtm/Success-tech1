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
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
