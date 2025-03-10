const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(message, className) {
    const p = document.createElement("p");
    p.textContent = message;
    p.className = className;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getHealthBotResponse(userMessage) {
    addMessage("Du: " + userMessage, "user-message");

    const response = await fetch('/ask-healthbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    if (response.ok) {
        addMessage("HealthBot: " + data.reply, "bot-message");
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
