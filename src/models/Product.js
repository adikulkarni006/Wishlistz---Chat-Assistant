import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  categoryId: String,
  price: Number,
  tags: [String],
  images: [String],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
