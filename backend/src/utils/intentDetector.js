export function detectIntent(message) {
  const text = message.toLowerCase();

  // =============================
  // 1️⃣ WISHLIST ITEM ACTIONS (TOP PRIORITY)
  // =============================
  if (text.includes("add") && text.includes("first")) {
    return "ADD_FIRST_ITEM";
  }

  if (text.includes("add") && text.includes("second")) {
    return "ADD_SECOND_ITEM";
  }

  if (
    text.includes("add to wishlist") ||
    text.includes("save to wishlist") ||
    text.includes("add it to wishlist")
  ) {
    return "ADD_TO_WISHLIST";
  }

  // =============================
  // 2️⃣ PLANNER INTENTS
  // =============================
  if (text.includes("gift")) {
    return "GIFT_PLANNER";
  }

  if (
    text.includes("trip") ||
    text.includes("travel") ||
    text.includes("going")
  ) {
    return "TRIP_PLANNER";
  }

  if (
    text.includes("theme") ||
    text.includes("party") ||
    text.includes("birthday")
  ) {
    return "THEME_PLANNER";
  }

  // =============================
  // 3️⃣ OTHER INTENTS
  // =============================
  if (text.includes("trending")) {
    return "TRENDING";
  }

  // =============================
  // 4️⃣ FALLBACK
  // =============================
  return "GENERAL";
}
