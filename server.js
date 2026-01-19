const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==============================
// TEMP IN-MEMORY DATA
// ==============================
let investments = [];
let notifications = [
  { message: "Welcome to SUCCESS-TECH" },
  { message: "Your account is active" }
];

// ==============================
// ROOT TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("SUCCESS-TECH backend is running");
});

// ==============================
// CREATE INVESTMENT
// ==============================
app.post("/api/invest", (req, res) => {
  const { name, email, amount, plan } = req.body;

  if (!name || !email || !amount || !plan) {
    return res.status(400).json({
      error: "All fields are required"
    });
  }

  const investment = {
    id: Date.now(),
    name,
    email,
    amount: Number(amount),
    plan,
    date: new Date().toISOString()
  };

  investments.push(investment);

  // Add notification
  notifications.unshift({
    message: `Investment of ₦${amount} submitted successfully`
  });

  res.json({
    message: "Investment saved",
    investment
  });
});

// ==============================
// ADMIN: VIEW ALL INVESTMENTS
// ==============================
app.get("/admin/investments", (req, res) => {
  res.json(investments);
});

// ==============================
// USER NOTIFICATIONS
// ==============================
app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

// ==============================
// SERVER START
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("SUCCESS-TECH server running on port " + PORT);
});
