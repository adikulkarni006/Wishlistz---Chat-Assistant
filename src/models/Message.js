import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatSessionId: String,
  sender: String,
  text: String,
  intent: String
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
