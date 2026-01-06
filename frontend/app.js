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
const quickActions = document.querySelectorAll('.quick-action');

// ================= BACKEND CONFIG =================
const BACKEND_CHAT_API = "http://localhost:5000/api/chat";

// Bot Responses (Removed duplicate welcome message - FIX 1)
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

const fileResponses = [
  "📎Looks like a shirt 👕 Added to your wishlist",
  "✅Beautiful! dress saved successfully.",
  "✨ Men's product added 👔.",
  "🎨 Product image saved to wishlist ❤️!"
];

const imageResponses = [
  "✅Looks like a shirt 👕 Added to your wishlist",
  "📸 Beautiful! dress saved successfully.",
  "✨ Men's product added 👔.",
  "🎨 Product image saved to wishlist ❤️!"
];

const quickActionsContainer = document.querySelector(".quick-actions");

function updateQuickActions(options = []) {
  if (!quickActionsContainer) return;

  quickActionsContainer.innerHTML = "";

  if (options.length === 0) return;

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "quick-action";
    btn.textContent = option;

    btn.onclick = () => {
      messageInput.value = option;
      handleSendMessage();
    };

    quickActionsContainer.appendChild(btn);
  });
}

// Helpers
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
}

function getFileIcon(extension) {
  const iconMap = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'txt': '📃',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'webp': '🖼️'
  };
  return iconMap[extension] || '📎';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function isImageFile(filename) {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// FIX 3: Removed unused getRandomBotResponse() function

function getRandomFileResponse() {
  return fileResponses[Math.floor(Math.random() * fileResponses.length)];
}

function getRandomImageResponse() {
  return imageResponses[Math.floor(Math.random() * imageResponses.length)];
}

// ================= BACKEND CHAT CALL =================
async function getBotResponseFromBackend(userMessage) {
  try {
    const response = await fetch(BACKEND_CHAT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        userId: "guest_user"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "🤖 No response from server";

  } catch (error) {
    console.error("Backend error:", error);
    return "⚠️ Server is not responding. Please try again later.";
  }
}

// Add text message - FIX 4: Added newline handling
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const messageText = document.createElement('p');
  // FIX 4: Replace newlines with <br> tags
  messageText.innerHTML = text.replace(/\n/g, "<br>");

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(messageText);
  messageContent.appendChild(messageTime);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}

// Add image message
function addImageMessage(imageSrc, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content has-image';

  const img = document.createElement('img');
  img.src = imageSrc;
  img.className = 'message-image';
  img.alt = 'Uploaded image';
  img.loading = 'lazy';

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(img);
  messageContent.appendChild(messageTime);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}

// Add file message
function addFileMessage(fileName, fileSize, isUser = false) {
  const extension = getFileExtension(fileName);
  const icon = getFileIcon(extension);

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const fileCard = document.createElement('div');
  fileCard.className = 'file-card';

  const fileIcon = document.createElement('div');
  fileIcon.className = 'file-icon';
  fileIcon.textContent = icon;

  const fileInfo = document.createElement('div');
  fileInfo.className = 'file-info';

  const fileNameDiv = document.createElement('div');
  fileNameDiv.className = 'file-name';
  fileNameDiv.textContent = fileName;

  const fileSizeDiv = document.createElement('div');
  fileSizeDiv.className = 'file-size';
  fileSizeDiv.textContent = formatFileSize(fileSize);

  fileInfo.appendChild(fileNameDiv);
  fileInfo.appendChild(fileSizeDiv);
  fileCard.appendChild(fileIcon);
  fileCard.appendChild(fileInfo);

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(fileCard);
  messageContent.appendChild(messageTime);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}

// Typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message';
  typingDiv.id = 'typingIndicator';

  const typingContent = document.createElement('div');
  typingContent.className = 'message-content';

  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    typingIndicator.appendChild(dot);
  }

  typingContent.appendChild(typingIndicator);
  typingDiv.appendChild(typingContent);
  chatMessages.appendChild(typingDiv);

  scrollToBottom();
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function handleBotReply(reply) {
  // Clear previous buttons by default
  updateQuickActions([]);

  // TEXT RESPONSE
  if (typeof reply === "string") {
    addMessage(reply, false);
    applyQuickActions(reply);
    return;
  }

  // PLANNER RESPONSE (cards)
  if (reply.type === "PLANNER") {
    renderPlannerResponse(reply);
    updateQuickActions(["Add first one", "Show wishlist", "Reset"]);
    return;
  }

  // Fallback
  addMessage("🤖 I’m here to help!", false);
}


// Bot response logic
async function sendBotResponse(userMessage) {
  showTypingIndicator();

  try {
    const botReply = await getBotResponseFromBackend(userMessage);
    removeTypingIndicator();
    handleBotReply(botReply);
  } catch (error) {
    removeTypingIndicator();
    addMessage("⚠️ Sorry, I encountered an error. Please try again.", false);
  }
}

function renderPlannerResponse(planner) {
  addMessage(planner.title, false);

  if (planner.message) {
    addMessage(planner.message, false);
  }

  const container = document.createElement("div");
  container.className =
    planner.title.includes("Wishlist")
      ? "wishlist-cards"
      : "planner-cards";

  planner.items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className =
      planner.title.includes("Wishlist")
        ? "wishlist-card"
        : "planner-card";

    card.innerHTML = `
      <div class="card-index">${index + 1}</div>
      <img src="${item.imageUrl || item.images?.[0] || ''}">
      <p class="price">${item.reason || ""}</p>
    `;

    container.appendChild(card);
  });

  chatMessages.appendChild(container);

  if (planner.followUp) {
    addMessage(planner.followUp, false);
  }

  scrollToBottom();
}


// File upload handler - FIX 2: Added comment about UI-only behavior
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // FIX 2: NOTE - File/image uploads are UI-only for demo purposes
  // Backend processing can be added later by sending the file to an API
  if (isImageFile(file.name)) {
    const reader = new FileReader();
    reader.onload = function(e) {
      addImageMessage(e.target.result, true);
      
      // UI-only demo response (not connected to backend)
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage(getRandomImageResponse(), false);
      }, 1000);
    };
    reader.onerror = function() {
      addMessage("❌ Failed to read image file", true);
    };
    reader.readAsDataURL(file);
  } else {
    addFileMessage(file.name, file.size, true);
    
    // UI-only demo response (not connected to backend)
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(getRandomFileResponse(), false);
    }, 1000);
  }

  fileInput.value = '';
}

// Send message
async function handleSendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText === '') return;

  addMessage(messageText, true);
  messageInput.value = '';
  messageInput.focus();
  
  // Reset send button state
  sendButton.style.opacity = '0.5';
  sendButton.style.cursor = 'not-allowed';

  await sendBotResponse(messageText);
}

// Check if mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Initialize chat - FIX 1: Only one welcome message from here
function initializeChat() {
  // Show single welcome message (removed duplicate from botResponses)
  setTimeout(() => {
    addMessage("Welcome to Wishlistz! How can I help you today? 🛍️", false);
  }, 500);

  // Set initial send button state
  sendButton.style.opacity = '0.5';
  sendButton.style.cursor = 'not-allowed';

  // Focus input
  messageInput.focus();
}

function applyQuickActions(botText) {
  const text = botText.toLowerCase();

  // 🎁 GIFT PLANNER
  if (text.includes("who is the gift")) {
    updateQuickActions(["Friend", "Mother", "Partner", "Sibling"]);
    return;
  }

  if (text.includes("age")) {
    updateQuickActions(["10", "18", "25", "30", "Skip"]);
    return;
  }

  if (text.includes("budget")) {
    updateQuickActions(["1000", "2000", "3000", "5000"]);
    return;
  }

  // 🧳 TRIP PLANNER
  if (text.includes("traveling to")) {
    updateQuickActions(["Delhi", "Goa", "Manali", "Bangalore"]);
    return;
  }

  if (text.includes("how many days")) {
    updateQuickActions(["2", "3", "5", "7"]);
    return;
  }

  if (text.includes("season") || text.includes("month")) {
    updateQuickActions(["Summer", "Winter", "Monsoon", "Any"]);
    return;
  }

  if (text.includes("work trip") || text.includes("casual")) {
    updateQuickActions(["Work", "Casual"]);
    return;
  }

  // 🎨 THEME PLANNER
  if (text.includes("event")) {
    updateQuickActions(["Birthday", "Wedding", "Anniversary"]);
    return;
  }

  if (text.includes("event for")) {
    updateQuickActions(["Kids", "Adults", "Mixed"]);
    return;
  }

  if (text.includes("vibe")) {
    updateQuickActions(["Fun", "Classy", "Traditional"]);
    return;
  }

  // 🔄 RESET / DEFAULT
  if (text.includes("help you") || text.includes("what would you like")) {
    updateQuickActions([
      "Plan a gift 🎁",
      "Plan a trip 🧳",
      "Plan a theme 🎨"
    ]);
    return;
  }

  // Default → no buttons
  updateQuickActions([]);
}


// Event Listeners
attachButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', handleFileUpload);

sendButton.addEventListener('click', handleSendMessage);

messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
});

messageInput.addEventListener('input', () => {
  const isEmpty = messageInput.value.trim() === '';
  sendButton.style.opacity = isEmpty ? '0.5' : '1';
  sendButton.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌓';
  
  // Save theme preference
  localStorage.setItem('chatTheme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// ================= FULLSCREEN OPEN / CLOSE LOGIC =================
minimizedChat.addEventListener('click', () => {
  chatContainer.style.display = 'flex';
  minimizedChat.classList.add('hidden');
  
  if (isMobile()) {
    chatContainer.classList.add('fullscreen');
  }
  
  // Focus input when opening
  setTimeout(() => {
    messageInput.focus();
  }, 100);
});

minimizeButton.addEventListener('click', () => {
  if (isMobile()) {
    chatContainer.classList.remove('fullscreen');
  }
  chatContainer.style.display = 'none';
  minimizedChat.classList.remove('hidden');
});

// Quick actions
quickActions.forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.textContent || button.innerText;
    addMessage(text, true);
    await sendBotResponse(text);
  });
});

// Window resize handler
window.addEventListener('resize', () => {
  if (!isMobile() && chatContainer.classList.contains('fullscreen')) {
    chatContainer.classList.remove('fullscreen');
  }
});

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('chatTheme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '🌞';
  }
  
  // Initialize chat
  initializeChat();
  
  // Set initial state for mobile
  if (isMobile()) {
    chatContainer.style.display = 'none';
    minimizedChat.classList.remove('hidden');
  } else {
    chatContainer.style.display = 'flex';
    minimizedChat.classList.add('hidden');
  }
});