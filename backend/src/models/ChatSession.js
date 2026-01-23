import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  lastIntent: {
    type: String,
    default: null
  },
  context: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

export default mongoose.model("ChatSession", chatSessionSchema);
