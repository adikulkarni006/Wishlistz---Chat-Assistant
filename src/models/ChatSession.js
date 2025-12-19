import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  userId: String,
  context: Object
}, { timestamps: true });

export default mongoose.model("ChatSession", chatSessionSchema);
