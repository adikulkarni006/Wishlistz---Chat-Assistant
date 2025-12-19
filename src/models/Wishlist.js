import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: String,
  items: Array
}, { timestamps: true });

export default mongoose.model("Wishlist", wishlistSchema);
