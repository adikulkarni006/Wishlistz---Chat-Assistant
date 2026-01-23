import mongoose from "mongoose";

const recLogSchema = new mongoose.Schema({
  userId: String,
  source: String,
  productIds: [String],
  metadata: Object
}, { timestamps: true });

export default mongoose.model("RecommendationLog", recLogSchema);
