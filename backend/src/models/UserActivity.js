import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: String,
  type: String,
  productId: String
}, { timestamps: true });

export default mongoose.model("UserActivity", userActivitySchema);
