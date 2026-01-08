import { extractNumber } from "../../utils/validators.js";
import Product from "../../models/Product.js";

export async function handleTripPlanner(message, session) {
  const context = session.context || {};
  const userMessage = message.trim().toLowerCase();

  /* ==========================
     STEP 1: Destination
  ========================== */
  if (!context.destination) {
    session.context = {
      ...context,
      destination: message.trim()
    };
    await session.save();
    return "Nice choice! How many days is your trip?";
  }

  /* ==========================
     STEP 2: Duration
  ========================== */
  if (!context.days) {
    if (userMessage === "skip" || userMessage.includes("don't know")) {
      session.context = {
        ...context,
        days: "Not specified"
      };
      await session.save();
      return "Which month or season are you traveling?";
    }

    const days = extractNumber(message);

    if (!days || days <= 0) {
      return "📅 Please enter a valid number of days (e.g. 5) or type skip.";
    }

    session.context = {
      ...context,
      days
    };
    await session.save();
    return "Which month or season are you traveling?";
  }

  /* ==========================
     STEP 3: Season
  ========================== */
  if (!context.season) {
    if (userMessage === "skip" || userMessage.includes("don't know")) {
      session.context = {
        ...context,
        season: "Any"
      };
      await session.save();
      return "Is this a work trip or a casual vacation?";
    }

    session.context = {
      ...context,
      season: message.trim()
    };
    await session.save();
    return "Is this a work trip or a casual vacation?";
  }

  /* ==========================
     STEP 4: Travel Type (FINAL)
  ========================== */
  if (!context.travelType) {
    session.context = {
      ...context,
      travelType:
        userMessage === "skip" || userMessage.includes("don't know")
          ? "casual"
          : message.trim()
    };

    /* ==========================
       FETCH REAL PRODUCTS (DB)
    ========================== */
    const products = await Product.find({
      category: "travel"
    }).limit(5);

    if (!products.length) {
      session.lastIntent = null;
      await session.save();
      return "😕 I couldn’t find travel products right now.";
    }

    const items = products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      reason: "Perfect for your upcoming trip 🧳"
    }));

    /* ==========================
       SAVE FOR WISHLIST FLOW
    ========================== */
    session.context.lastItems = items;
    session.lastIntent = null;
    await session.save();

    return {
      type: "PLANNER",
      title: "🧳 Travel Essentials",
      message: `Based on your ${session.context.days}-day trip to ${session.context.destination}, here are some useful travel items:`,
      items,
      followUp: "You can say: add first one to wishlist ❤️"
    };
  }

  /* ==========================
     FALLBACK
  ========================== */
  return "Let me know if you want to plan something else 😊";
}
