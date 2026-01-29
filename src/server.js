import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Message from "./models/Message.js";
import connectDB from "./db.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});

// ✅ CONTACT ROUTE (ADD IT HERE)
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await Message.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
