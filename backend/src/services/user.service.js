const User = require("../models/User");
const Wishlist = require("../models/Wishlist");

async function getUserContext(userId) {
  const user = await User.findById(userId);
  const wishlist = await Wishlist.find({ userId });

  return {
    preferences: user.preferences || {},
    wishlist,
  };
}

module.exports = {
  getUserContext,
};
