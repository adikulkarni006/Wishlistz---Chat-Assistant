import { faqs } from "../data/faqs.js";

export function handleFAQ(message) {
  const text = message.toLowerCase();

  for (const faq of faqs) {
    if (faq.keywords.some(k => text.includes(k))) {
      return {
        type: "TEXT",
        title: "ℹ️ Help",
        message: faq.answer
      };
    }
  }
  return null;
}
