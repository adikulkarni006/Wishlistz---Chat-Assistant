const Product = require("../models/Product");

async function getTrending(context) {
  const preferredCategory =
    context.preferences?.categories?.[0];

  const products = await Product.find({
    category: preferredCategory,
    trending: true,
  }).limit(5);

  return {
    message: "Here are your personal trending picks",
    products,
  };
}

module.exports = { getTrending };
