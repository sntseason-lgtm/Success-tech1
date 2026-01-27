import connectDB from "./db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});

// Port
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
