import ChatSession from "../models/ChatSession.js";
import { handleTripPlanner } from "../services/planner/tripPlanner.service.js";
import { handleGiftPlanner } from "../services/planner/giftPlanner.service.js";
// import { handleThemePlanner } from "../services/planner/themePlanner.service.js"; // optional later

// ================= TRIP PLANNER =================

export const tripPlannerController = async (req, res) => {
  try {
    const { message, userId = "guest_user" } = req.body;

    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = await ChatSession.create({ userId, lastIntent: "TRIP_PLANNER", context: {} });
    }

    const reply = await handleTripPlanner(message, session);
    await session.save();

    res.json({ success: true, reply });
  } catch (err) {
    console.error("Trip Planner Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// ================= GIFT PLANNER =================

export const giftPlannerController = async (req, res) => {
  try {
    const { message, userId = "guest_user" } = req.body;

    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = await ChatSession.create({ userId, lastIntent: "GIFT_PLANNER", context: {} });
    }

    const reply = await handleGiftPlanner(message, session);
    await session.save();

    res.json({ success: true, reply });
  } catch (err) {
    console.error("Gift Planner Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// ================= THEME PLANNER (OPTIONAL TEMPLATE) =================
// export const themePlannerController = async (req, res) => {
//   try {
//     const { message, userId = "guest_user" } = req.body;
//
//     let session = await ChatSession.findOne({ userId });
//     if (!session) {
//       session = await ChatSession.create({ userId, lastIntent: "THEME_PLANNER", context: {} });
//     }
//
//     const reply = await handleThemePlanner(message, session);
//     await session.save();
//
//     res.json({ success: true, reply });
//   } catch (err) {
//     res.status(400).json({ success: false, error: err.message });
//   }
// };
