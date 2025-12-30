// Get DOM elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const attachButton = document.getElementById('attachButton');
const fileInput = document.getElementById('fileInput');
const toggleSwitch = document.getElementById('themeCheckbox');
const minimizeButton = document.getElementById('minimizeButton'); // Matches your HTML ID
const chatContainer = document.querySelector('.chat-container');

// --- DATA ARRAYS ---
const botResponses = ["Welcome to Wishlistz 🛍️", "Men, Women or Kids?", "Browse latest fashion 🔥", "Great choice!", "Added to wishlist ❤️", "Item available in all sizes", "Check today’s offers 💸", "Popular item right now ⭐", "View your wishlist anytime", "New arrivals are live ✨", "Need size help?", "More styles available 👗👔", "Item saved successfully ✔️", "Shop smart with Wishlistz 🛒", "What would you like to add?"];
const fileResponses = ["📎Looks like a shirt 👕 Added to your wishlist", "✅Beautiful! dress saved successfully.", "✨ Men’s product added 👔.", "🎨 Product image saved to wishlist ❤️!"];
const imageResponses = ["✅Looks like a shirt 👕 Added to your wishlist", "📸 Beautiful! dress saved successfully.", "✨ Men’s product added 👔.", "🎨 Product image saved to wishlist ❤️!"];

// --- MINIMIZE & EXPAND LOGIC ---
minimizeButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents immediate re-opening
    chatContainer.classList.add('minimized');
});

chatContainer.addEventListener('click', () => {
    if (chatContainer.classList.contains('minimized')) {
        chatContainer.classList.remove('minimized');
    }
});

// --- THEME TOGGLE LOGIC ---
toggleSwitch.addEventListener('change', function(e) {
    if (this.checked) {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
});

// Load saved theme on refresh
if (localStorage.getItem('theme') === 'light') {
    toggleSwitch.checked = true;
    document.body.classList.add('light-mode');
}


function getFileExtension(fn) { return fn.slice((fn.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase(); }
function isImageFile(fn) { return ['jpg', 'jpeg', 'png'].includes(getFileExtension(fn)); }
function scrollToBottom() { chatMessages.scrollTop = chatMessages.scrollHeight; }

// --- MESSAGE DISPLAY LOGIC ---
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addImageMessage(imageSrc, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <img src="${imageSrc}" class="message-image" style="max-width: 100%; border-radius: 8px;" alt="upload">
            <span class="message-time">${getCurrentTime()}</span>
        </div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `<div class="message-content"><div class="typing-indicator">...</div></div>`;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function sendBotResponse(isFile = false, isImg = false) {
    showTypingIndicator();
    setTimeout(() => {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        
        let response;
        if (isImg) response = imageResponses[Math.floor(Math.random() * imageResponses.length)];
        else if (isFile) response = fileResponses[Math.floor(Math.random() * fileResponses.length)];
        else response = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        addMessage(response, false);
    }, 1200);
}

function handleSendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return;
    addMessage(text, true);
    messageInput.value = '';
    sendBotResponse();
}

sendButton.addEventListener('click', handleSendMessage);
messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });

attachButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isImageFile(file.name)) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            addImageMessage(ev.target.result, true);
            sendBotResponse(false, true);
        };
        reader.readAsDataURL(file);
    } else {
        addMessage(`📎 Sent: ${file.name}`, true);
        sendBotResponse(true, false);
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qa-btn')) {
        const text = e.target.innerText;
        addMessage(text, true); // Use your existing addMessage function
        sendBotResponse();      // Trigger your existing bot response
        e.target.parentElement.style.display = 'none'; // Optional: hide after use
    }
});