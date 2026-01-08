const { detectIntent } = require("./intent.service");
const userService = require("./user.service");
const recommender = require("./recommender.service");
const planner = require("./planner.service");
const ChatSession = require("../models/ChatSession");

async function processMessage(userId, message) {

  // 1️⃣ Detect intent
  let intent = detectIntent(message);

  // 2️⃣ Load user context
  const context = await userService.getUserContext(userId);

  // 3️⃣ Save chat memory
  await ChatSession.findOneAndUpdate(
    { userId },
    { lastIntent: intent },
    { upsert: true }
  );

  // 4️⃣ Route to correct service
  switch (intent) {
    case "TRENDING":
      return recommender.getTrending(context);

    case "GIFT_PLANNER":
      return planner.startGiftFlow();

    case "TRIP_PLANNER":
      return planner.planTrip(message, context);

    case "THEME_PLANNER":
      return planner.planTheme(message);

    default:
      return { message: "Can you tell me more?" };
  }
}

module.exports = { processMessage };
