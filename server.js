import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import connectDB from "./db.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== CONNECT DATABASE =====
connectDB();

// ===== EMAIL CONFIG =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ===== ROUTES =====

// Home route
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

// GET all messages (admin page)
app.get("/contact", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST new message
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const saved = await Message.create({ name, email, message });

    res.status(201).json({ success: true, saved });

  } catch (err) {
    console.log("CONTACT ERROR:", err);

    res.status(500).json({ 
      error: "Server error",
      details: err.message
    });
  }
});

    // ===== SEND EMAIL TO YOU =====
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "📩 New Contact Form Message",
      html: `
        <h3>New Message from Website</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/> ${message}</p>
      `
    });

    res.status(201).json({ success: true });

  } catch (err) {
    console.log("Email error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE message
app.delete("/contact/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
