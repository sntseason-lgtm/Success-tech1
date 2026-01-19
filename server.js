const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ROOT TEST
app.get("/", (req, res) => {
  res.send("Backend is live");
});

// TEMP in-memory storage
global.investments = [];

// Save investment
app.post("/api/invest", (req, res) => {
  const { name, email, amount, plan } = req.body;

  if (!name || !email || !amount || !plan) {
    return res.status(400).json({ message: "All fields required" });
  }

  const investment = {
    id: Date.now(),
    name,
    email,
    amount,
    plan,
    date: new Date()
  };

  global.investments.push(investment);

  res.json({
    message: "Investment saved",
    investment
  });
});

// Admin: get all investments
app.get("/admin/investments", (req, res) => {
  res.json(global.investments);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
