import mongoose from "mongoose";

const plannerSessionSchema = new mongoose.Schema({
  userId: String,
  type: String,
  productId: String,
  endedAt: Date
}, { timestamps: true });

export default mongoose.model("PlannerSession", plannerSessionSchema);
