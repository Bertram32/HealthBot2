const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const thinkingIndicator = document.getElementById("thinking-indicator");

function addMessage(message, className) {
    const p = document.createElement("p");
    p.textContent = message;
    p.className = className;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getHealthBotResponse(userMessage) {
    addMessage(userMessage, "user-message");

    // Vis tænke-animation
    thinkingIndicator.style.display = "block";

    const response = await fetch('/api/healthbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });

    // Skjul tænke-animation
    thinkingIndicator.style.display = "none";

    const data = await response.json();
    if (response.ok) {
        addMessage(data.reply, "bot-message");
    } else {
        addMessage("HealthBot: Noget gik galt! Fejl: " + data.error, "bot-message");
    }
}

sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
        getHealthBotResponse(message);
        userInput.value = "";
    }
});

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendBtn.click();
    }
});
