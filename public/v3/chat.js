// chat.js

// Replace this with your actual Cloudflare Worker URL after deployment
const WORKER_URL = "https://abhijit-portfolio-ai.guitarguitarabhijit.workers.dev/";

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messagesContainer = document.getElementById('chat-messages');

  let chatHistory = [];

  // Toggle chat panel
  toggleBtn.addEventListener('click', () => {
    chatPanel.hidden = !chatPanel.hidden;
    if (!chatPanel.hidden) {
      inputEl.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatPanel.hidden = true;
  });

  // Handle sending messages
  const sendMessage = async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    // Add user message to UI
    appendMessage(text, 'user');
    inputEl.value = '';
    
    // Add to history
    chatHistory.push({ role: 'user', content: text });

    // Show loading indicator
    const loadingId = 'loading-' + Date.now();
    appendMessage('...', 'ai', loadingId);

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!response.ok) {
        throw new Error('AI Engine unavailable');
      }

      const data = await response.json();
      
      // Remove loading indicator
      document.getElementById(loadingId)?.remove();

      // Extract AI response
      // Hugging Face returns an array of choices or a generated_text depending on the model.
      // We assume standard chat completions format or Hugging Face conversational format.
      let aiText = "I'm sorry, I couldn't process that.";
      if (data.choices && data.choices[0] && data.choices[0].message) {
        aiText = data.choices[0].message.content; // OpenAI format
      } else if (Array.isArray(data) && data[0].generated_text) {
        // HF Text Generation format - extract the last assistant message
        const genText = data[0].generated_text;
        // In case the model returns the whole prompt + response
        if(typeof genText === 'string') {
           const parts = genText.split('<|start_header_id|>assistant<|end_header_id|>\n\n');
           aiText = parts[parts.length - 1].trim() || genText;
        } else if (Array.isArray(genText)) {
           aiText = genText[genText.length - 1].content || "Error";
        }
      } else if (data.generated_text) {
         aiText = data.generated_text;
      }

      appendMessage(aiText, 'ai');
      chatHistory.push({ role: 'assistant', content: aiText });

    } catch (err) {
      console.error(err);
      document.getElementById(loadingId)?.remove();
      appendMessage('Error: Cannot connect to AI Engine. Please check if the Worker is deployed.', 'error');
      chatHistory.pop(); // Remove user message from history on failure
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function appendMessage(text, sender, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg chat-msg--${sender}`;
    if (id) msgDiv.id = id;
    msgDiv.textContent = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
