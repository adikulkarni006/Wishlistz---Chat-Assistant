function detectIntent(message) {
  const text = message.toLowerCase();

  if (text.includes("trend")) return "TRENDING";
  if (text.includes("gift")) return "GIFT_PLANNER";
  if (text.includes("trip") || text.includes("travel")) return "TRIP_PLANNER";
  if (text.includes("theme") || text.includes("party")) return "THEME_PLANNER";
  if (text.includes("where") || text.includes("section")) return "NAVIGATION";

  return "GENERAL_CHAT";
}

module.exports = { detectIntent };
