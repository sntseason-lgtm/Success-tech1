const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ===== ADMIN ROUTES =====

// Admin messages
app.get("/admin/messages", (req, res) => {
  res.json([]);
});

// Admin investments
app.get("/admin/investments", (req, res) => {
  res.json([]);
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
