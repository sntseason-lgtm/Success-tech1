import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect database
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Server running successfully");
});

// contact route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      message
    });

    await newMessage.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
