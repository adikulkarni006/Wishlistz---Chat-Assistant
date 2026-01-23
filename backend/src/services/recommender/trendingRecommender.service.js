/**
 * Trending Recommender Service
 * ----------------------------------
 * Purpose:
 * - Provide trending products for chatbot planners
 * - Works without Wishlistz DB
 * - Safe fallback if anything fails
 *
 * Later:
 * - Replace static data with DB queries
 */

export async function getTrendingProducts() {
  try {
    // 🔹 Temporary static trending data
    // (replace with DB logic later)
    const trendingProducts = [
      {
        id: "trend_1",
        name: "Smart Watch"
      },
      {
        id: "trend_2",
        name: "Wireless Earbuds"
      },
      {
        id: "trend_3",
        name: "Stylish Backpack"
      }
    ];

    // Simulate async behavior (realistic service pattern)
    return Promise.resolve(trendingProducts);
  } catch (error) {
    console.error("Trending recommender error:", error);

    // 🔴 IMPORTANT: Never throw error
    // Chatbot must NOT break if recommender fails
    return [];
  }
}
