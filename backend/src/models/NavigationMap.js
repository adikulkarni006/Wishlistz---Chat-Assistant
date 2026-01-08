import mongoose from "mongoose";

const navigationSchema = new mongoose.Schema({
  key: String,
  url: String
}, { timestamps: true });

export default mongoose.model("NavigationMap", navigationSchema);
