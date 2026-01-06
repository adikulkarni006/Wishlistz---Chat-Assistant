import { extractNumber } from "../../utils/validators.js";
import { getTrendingProducts } from "../recommender/trendingRecommender.service.js";
import Product from "../../models/Product.js";

export async function handleGiftPlanner(message, session) {
  const context = session.context || {};
  const userMessage = message.trim().toLowerCase();

  /* ==========================
     STEP 1: Relation
  ========================== */
  if (!context.relation) {
    session.context = {
      ...context,
      relation: message.trim()
    };
    await session.save();
    return "Nice 🙂 What is their age?";
  }

  /* ==========================
     STEP 2: Age
  ========================== */
  if (!context.age) {
    if (userMessage.includes("don't know") || userMessage === "skip") {
      session.context = {
        ...context,
        age: "Not specified"
      };
      await session.save();
      return "Got it! What’s your budget (in ₹)?";
    }

    const age = extractNumber(message);

    if (!age || age <= 0) {
      return "🎂 Please enter a valid age (e.g. 25) or type skip.";
    }

    session.context = {
      ...context,
      age
    };
    await session.save();
    return "Got it! What’s your budget (in ₹)?";
  }

  /* ==========================
     STEP 3: Budget (FINAL STEP)
  ========================== */
  if (!context.budget) {
    if (userMessage.includes("don't know") || userMessage === "skip") {
      return "💰 Please provide an approximate budget so I can suggest gifts.";
    }

    const budget = extractNumber(message);

    if (!budget || budget <= 0) {
      return "💰 Please enter a valid budget amount (e.g. 2000).";
    }

    // Save budget
    session.context = {
      ...context,
      budget
    };

    /* ==========================
       BASE PLANNER ITEMS (DB)
    ========================== */
    const products = await Product.find({
      price: { $lte: budget }
    }).limit(5);

    if (!products.length) {
  // DO NOT end planner
  return "😕 I couldn’t find gifts in this budget. Please try a higher amount.";
}


    const baseItems = products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      reason: `₹${p.price} • ${p.category}`
    }));

    /* ==========================
       TRENDING RECOMMENDER
    ========================== */
    let trendingItems = [];
    try {
      const trending = await getTrendingProducts();

      trendingItems = trending.map(item => ({
        id: item._id || null,
        name: item.name,
        reason: "Trending right now 🔥"
      }));
    } catch (err) {
      console.error("Trending recommender failed:", err.message);
    }

    /* ==========================
       FINAL ITEMS
    ========================== */
    const finalItems = [...baseItems, ...trendingItems];

    /* ==========================
       STRUCTURED RESPONSE
    ========================== */
    const finalResponse = {
      type: "PLANNER",
      title: "🎁 Gift Suggestions",
      message: `Based on your inputs:
• Relation: ${session.context.relation}
• Age: ${session.context.age}
• Budget: ₹${session.context.budget}`,
      items: finalItems,
      followUp: "You can say: add first one to wishlist ❤️"
    };

    /* ==========================
       SAVE FOR WISHLIST FLOW
    ========================== */
    session.context.lastItems = finalItems;
    session.lastIntent = null;
    await session.save();

    return finalResponse;
  }

  /* ==========================
     FALLBACK
  ========================== */
  return "Let me know if you want to plan something else 😊";
}
