import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// ================= MODELS =================
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

const adminSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Admin = mongoose.model("Admin", adminSchema);

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ================= ROUTES =================

// Home
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Contact form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  await Message.create({ name, email, message });
  res.json({ success: true });
});

// Register admin (USE ONCE THEN REMOVE)
app.post("/register-admin", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });

  res.json({ success: true });
});

// Login
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: "Invalid" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ error: "Invalid" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  res.json({ token });
});

// Get messages
app.get("/get-messages", auth, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

// Delete message
app.delete("/delete-message/:id", auth, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on", PORT));
