import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  preferences: Object,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
