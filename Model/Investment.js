const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  plan: { type: String, required: true },
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Investment", investmentSchema);
