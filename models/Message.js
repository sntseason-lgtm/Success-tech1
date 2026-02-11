import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Message", MessageSchema);
