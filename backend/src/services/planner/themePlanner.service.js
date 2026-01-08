import { extractNumber } from "../../utils/validators.js";
import Product from "../../models/Product.js";

/* ==========================
   Allowed Values
========================== */
const allowedAudiences = ["kids", "adults", "mixed"];
const allowedVibes = ["fun", "classy", "traditional"];

/* ==========================
   EVENT → CATEGORY MAPPING
========================== */
function mapEventToCategory(eventType) {
  if (!eventType) return "decor";
  const e = eventType.toLowerCase();

  if (e.includes("birthday")) return "decor";
  if (e.includes("wedding")) return "decor";
  if (e.includes("party")) return "decor";

  return "decor";
}

/* ==========================
   MAIN HANDLER
========================== */
export async function handleThemePlanner(message, session) {
  const context = session.context || {};
  const userMessage = message.trim().toLowerCase();

  /* ==========================
     STEP 1: Event Type
  ========================== */
  if (!context.eventType) {
    session.context = {
      ...context,
      eventType: message.trim()
    };
    await session.save();
    return {
      type: "TEXT",
      message: "Nice! Who is the event for? (kids / adults / mixed)"
    };
  }

  /* ==========================
     STEP 2: Audience
  ========================== */
  if (!context.audience) {
    if (userMessage === "skip" || userMessage.includes("don't know")) {
      session.context = {
        ...context,
        audience: "mixed"
      };
      await session.save();
      return {
        type: "TEXT",
        message: "Got it! What’s your approximate budget (in ₹)?"
      };
    }

    if (!allowedAudiences.includes(userMessage)) {
      return {
        type: "TEXT",
        message: "👥 Please choose one: kids, adults, or mixed."
      };
    }

    session.context = {
      ...context,
      audience: userMessage
    };
    await session.save();
    return {
      type: "TEXT",
      message: "Got it! What’s your approximate budget (in ₹)?"
    };
  }

  /* ==========================
     STEP 3: Budget
  ========================== */
  if (!context.budget) {
    if (userMessage === "skip" || userMessage.includes("don't know")) {
      return {
        type: "TEXT",
        message: "💰 Please provide an approximate budget so I can suggest themed items."
      };
    }

    const budget = extractNumber(message);

    if (!budget || budget <= 0) {
      return {
        type: "TEXT",
        message: "💰 Please enter a valid budget amount (e.g. 5000)."
      };
    }

    session.context = {
      ...context,
      budget
    };
    await session.save();

    return {
      type: "TEXT",
      message: "What vibe are you going for? (fun / classy / traditional)"
    };
  }

  /* ==========================
     STEP 4: Vibe (FINAL)
  ========================== */
  if (!context.vibe) {
    if (userMessage === "skip" || userMessage.includes("don't know")) {
      session.context = {
        ...context,
        vibe: "fun"
      };
    } else if (!allowedVibes.includes(userMessage)) {
      return {
        type: "TEXT",
        message: "✨ Please choose a vibe: fun, classy, or traditional."
      };
    } else {
      session.context = {
        ...context,
        vibe: userMessage
      };
    }

    const category = mapEventToCategory(context.eventType);

    /* ==========================
       FETCH REAL PRODUCTS (DB)
    ========================== */
    const products = await Product.find({
      category,
      price: { $lte: session.context.budget }
    }).limit(5);

    if (!products.length) {
      session.lastIntent = null;
      await session.save();
      return {
        type: "TEXT",
        message: "😕 I couldn’t find themed items within this budget."
      };
    }

    const items = products.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      reason: "Perfect for your event 🎉"
    }));

    /* ==========================
       SAVE FOR WISHLIST FLOW
    ========================== */
    session.context.lastItems = items;
    session.lastIntent = null;
    await session.save();

    return {
      type: "PLANNER",
      title: "🎨 Theme & Decoration Ideas",
      message: `${session.context.eventType} ideas for a ${session.context.vibe} vibe`,
      items,
      followUp: "You can say: add first one to wishlist ❤️"
    };
  }

  /* ==========================
     FALLBACK
  ========================== */
  return {
    type: "TEXT",
    message: "Let me know if you want to plan something else 😊"
  };
}
