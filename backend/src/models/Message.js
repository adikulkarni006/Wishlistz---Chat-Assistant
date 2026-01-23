import mongoose from "mongoose";


const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      enum: ["user", "bot"],
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
