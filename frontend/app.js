// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const attachButton = document.getElementById('attachButton');
const fileInput = document.getElementById('fileInput');
const chatContainer = document.getElementById('chatContainer');
const minimizeButton = document.getElementById('minimizeButton');
const minimizedChat = document.getElementById('minimizedChat');
const themeToggle = document.getElementById('themeToggle');

const homeScreen = document.getElementById("homeScreen");
const chatWithUsCard = document.getElementById("chatWithUsCard");
const faqCard = document.getElementById("faqCard");
const chatInputArea = document.getElementById("chatInputArea");
const faqScreen = document.getElementById("faqScreen");
const faqList = document.getElementById("faqList");
const faqSearchInput = document.getElementById("faqSearchInput");
const faqOpenBtn = document.getElementById("faqOpenBtn");
const faqBackBtn = document.getElementById("faqBackBtn");
const chatFooterBrand = document.getElementById("chatFooterBrand");

const quickActionsContainer = document.querySelector(".quick-actions");

// ================= BACKEND CONFIG =================
const BACKEND_CHAT_API = "http://localhost:5000/api/chat";

// FAQ DATA
const FAQ_QUESTIONS = [
  "How do I create an account on Wishlistz?",
  "How can I add products to my wishlist?",
  "Can I add products from Amazon/Flipkart links?",
  "How do I share my wishlist with friends or family?",
  "How can I remove an item from my wishlist?",
  "Can I create multiple wishlists (Birthday, Wedding, Shopping)?",
  "How do I track price drops for wishlist items?",
  "How do I get product recommendations on Wishlistz?",
  "How do I upload a product image to save it?",
  "What if a product link is not working?",
  "How can I update my profile details?",
  "How do I change my password?",
  "How can I contact Wishlistz support?",
  "Is Wishlistz free to use?",
  "How do I report a wrong product or duplicate listing?",
  "How do I reset or clear my chat?",
  "Is my wishlist private or public?",
  "How do I delete my Wishlistz account?"
];


// Bot Responses
const botResponses = [
  "Men, Women or Kids?",
  "Browse latest fashion 🔥",
  "Great choice!",
  "Added to wishlist ❤️",
  "Item available in all sizes",
  "Check today's offers 💸",
  "Popular item right now ⭐",
  "View your wishlist anytime",
  "New arrivals are live ✨",
  "Need size help?",
  "More styles available 👗👔",
  "Item saved successfully ✔️",
  "Shop smart with Wishlistz 🛒",
  "What would you like to add?"
];

// ================= HELPERS =================
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ================= CHAT UI =================
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement("div");

  // IMPORTANT: Correct classes
  messageDiv.classList.add("message");
  messageDiv.classList.add(isUser ? "user-message" : "bot-message");

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  const messageText = document.createElement("p");
  messageText.innerHTML = text.replace(/\n/g, "<br>");

  const messageTime = document.createElement("span");
  messageTime.classList.add("message-time");
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(messageText);
  messageContent.appendChild(messageTime);

  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}


// ================= QUICK ACTIONS =================
function getEmojiForOption(option) {
  const key = option.toLowerCase().trim();
  return QUICK_ACTION_EMOJIS[key] || "";
}

function updateQuickActions(options = []) {
  if (!quickActionsContainer) return;

  quickActionsContainer.innerHTML = "";

  if (options.length === 0) {
    quickActionsContainer.classList.add("hidden-actions");
    return;
  }

  quickActionsContainer.classList.remove("hidden-actions");

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "quick-action";
    const emoji = getEmojiForOption(option);
    btn.textContent = emoji ? `${emoji} ${option}` : option;

    btn.onclick = () => {
      messageInput.value = option;
      handleSendMessage();
    };

    quickActionsContainer.appendChild(btn);
  });
}

function showDefaultQuickActions() {
  updateQuickActions(["Suggest a gift", "Plan a trip", "Plan a theme"]);
}

// ================= FAQ =================
function renderFAQList(filter = "") {
  if (!faqList) return;

  faqList.innerHTML = "";

  const filtered = FAQ_QUESTIONS.filter(q =>
    q.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(question => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.textContent = question;

    item.addEventListener("click", () => {
      startChatFlow();
      messageInput.value = question;
      handleSendMessage();
    });

    faqList.appendChild(item);
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "faq-item";
    empty.textContent = "No results found ❌";
    faqList.appendChild(empty);
  }
}

// ================= SCREENS =================
function showHomeScreen() {
  // show home
  homeScreen.style.display = "flex";
  faqScreen.classList.add("hidden");

  // footer show
  if (chatFooterBrand) chatFooterBrand.style.display = "block";

  // input hide
  if (chatInputArea) chatInputArea.classList.add("hidden-input");
  updateQuickActions([]); // hide actions
}

function openFAQScreen() {
  // hide home, show FAQ
  homeScreen.style.display = "none";
  faqScreen.classList.remove("hidden");

  // footer hide in FAQ (like freshchat)
  if (chatFooterBrand) chatFooterBrand.style.display = "none";

  // input hide
  if (chatInputArea) chatInputArea.classList.add("hidden-input");
  updateQuickActions([]); // hide actions

  // render list
  renderFAQList("");
  if (faqSearchInput) faqSearchInput.value = "";
}

function startChatFlow() {
  // Clear chat area
  chatMessages.innerHTML = "";

  // Hide screens
  if (homeScreen) homeScreen.style.display = "none";
  if (faqScreen) faqScreen.classList.add("hidden");

  // Show input + quick actions
  if (chatInputArea) chatInputArea.classList.remove("hidden-input");
  if (quickActionsContainer) quickActionsContainer.classList.remove("hidden-actions");

  // Footer hide while chatting
  if (chatFooterBrand) chatFooterBrand.style.display = "none";

  // Old welcome messages
  addMessage("Welcome to Wishlistz 👋", false);
  addMessage("How can I help you today?", false);

  showDefaultQuickActions();
}

// ================= BACKEND CHAT =================
async function getBotResponseFromBackend(userMessage) {
  try {
    const response = await fetch(BACKEND_CHAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, userId: "guest_user" })
    });

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    return data.reply || botResponses[Math.floor(Math.random() * botResponses.length)];
  } catch (error) {
    console.error("Backend error:", error);
    return botResponses[Math.floor(Math.random() * botResponses.length)];
  }
}

// Send message
async function handleSendMessage() {
  const messageText = messageInput.value.trim();
  if (!messageText) return;

  addMessage(messageText, true);
  messageInput.value = "";

  // Typing simulation
  const reply = await getBotResponseFromBackend(messageText);
  addMessage(reply, false);

  showDefaultQuickActions();
}

// ================= EVENT LISTENERS =================
if (chatWithUsCard) chatWithUsCard.addEventListener("click", startChatFlow);
if (faqCard) faqCard.addEventListener("click", openFAQScreen);
if (faqOpenBtn) faqOpenBtn.addEventListener("click", openFAQScreen);

if (faqBackBtn) {
  faqBackBtn.addEventListener("click", () => {
    showHomeScreen();
  });
}

if (faqSearchInput) {
  faqSearchInput.addEventListener("input", (e) => {
    renderFAQList(e.target.value);
  });
}

sendButton.addEventListener('click', handleSendMessage);

messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSendMessage();
  }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌓';
  localStorage.setItem('chatTheme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Open/Close logic
function isMobile() {
  return window.innerWidth <= 768;
}

minimizedChat.addEventListener('click', () => {
  chatContainer.style.display = 'flex';
  minimizedChat.classList.add('hidden');
});

minimizeButton.addEventListener('click', () => {
  chatContainer.style.display = 'none';
  minimizedChat.classList.remove('hidden');
});

// Load saved theme + init
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('chatTheme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '🌞';
  }

  // Default show chat desktop, minimized on mobile
  if (isMobile()) {
    chatContainer.style.display = 'none';
    minimizedChat.classList.remove('hidden');
  } else {
    chatContainer.style.display = 'flex';
    minimizedChat.classList.add('hidden');
  }

  // Always open Home Screen first
  showHomeScreen();
});