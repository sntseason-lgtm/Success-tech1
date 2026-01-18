app.get("/", (req, res) => {
  res.send("Backend is live");
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// TEMP STORAGE (later we’ll use database)
let messages = [];
let investments = [];

// ✅ HOME TEST
app.get("/", (req, res) => {
  res.send("SUCCESS-TECH Backend is running");
});

// ✅ SAVE CHAT MESSAGE
app.post("/message", (req, res) => {
  const { message, time } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  messages.push({ message, time });
  res.json({ success: true });
});

// ✅ ADMIN – VIEW MESSAGES
app.get("/admin/messages", (req, res) => {
  res.json(messages);
});

// ✅ SAVE INVESTMENT
app.post("/invest", (req, res) => {
  const data = req.body;
  investments.push(data);
  res.json({ success: true });
});

// ✅ ADMIN – VIEW INVESTMENTS
app.get("/admin/investments", (req, res) => {
  res.json(investments);
});

// START SERVER
app.get("/", (req, res) => {
  res.send("Backend is live");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
