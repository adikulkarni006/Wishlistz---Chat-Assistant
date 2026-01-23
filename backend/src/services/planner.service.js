function startGiftFlow() {
  return {
    message: "Tell me about the person — age, relationship & budget?"
  };
}

function planTrip(message, context) {
  return {
    message: "Here’s your trip plan",
    checklist: [
      "Casual clothes",
      "Warm jacket",
      "Power bank",
      "Sunscreen"
    ],
    missingItems: ["Travel pouch"]
  };
}

function planTheme(message) {
  return {
    message: "Blue aesthetic theme works best for night parties"
  };
}

module.exports = {
  startGiftFlow,
  planTrip,
  planTheme,
};
