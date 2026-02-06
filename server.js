import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


// ================= ROUTES ==================

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});


// GET ALL MESSAGES  (for admin page)
app.get("/contact", async (req, res) => {
  try {
    const allMessages = await Message.find().sort({ createdAt: -1 });
    res.json(allMessages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// POST NEW MESSAGE (from index.html form)
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await Message.create({
      name,
      email,
      message
    });

    res.status(201).json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});


// DELETE MESSAGE (admin)
app.delete("/contact/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// START SERVER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
