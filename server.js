const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is live");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// Save investment
app.post("/api/invest", (req, res) => {
  const { name, email, amount, plan } = req.body;

  if (!name || !email || !amount || !plan) {
    return res.status(400).json({ message: "All fields required" });
  }

  // TEMP: store in memory (we'll add database later)
  const investment = {
    id: Date.now(),
    name,
    email,
    amount,
    plan,
    date: new Date()
  };

  global.investments = global.investments || [];
  global.investments.push(investment);

  res.json({ message: "Investment saved", investment });
});

