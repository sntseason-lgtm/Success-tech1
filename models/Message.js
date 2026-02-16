import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  status: {
    type: String,
    default: "unread"
  }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
