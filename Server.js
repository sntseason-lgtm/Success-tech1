const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("SUCCESS-TECH backend is running");
});

// TEMP storage (we will upgrade later)
let users = [];
let transactions = [];
let messages = [];

// Register
app.post("/register", (req, res) => {
  users.push(req.body);
  res.json({ success: true, message: "User registered" });
});

// Login
app.post("/login", (req, res) => {
  const user = users.find(
    u => u.email === req.body.email && u.password === req.body.password
  );
  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Save transaction
app.post("/transaction", (req, res) => {
  transactions.push(req.body);
  res.json({ success: true });
});

// Admin get transactions
app.get("/admin/transactions", (req, res) => {
  res.json(transactions);
});

// Messages (chatbot)
app.post("/message", (req, res) => {
  messages.push(req.body);
  res.json({ success: true });
});

app.get("/admin/messages", (req, res) => {
  res.json(messages);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
