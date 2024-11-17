document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");

    const apiKey = 'eKOZgFwj88JBrRb6uLExtKPtOF2YALle'; 
    const externalUserId = '66e2e59149f4dc096babeb4d'; 

    // Function to append a message to the chat
    function appendMessage(content, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("chat-message", sender);
        messageDiv.textContent = content;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to create a chat session
    async function createChatSession() {
        try {
            const response = await fetch('https://api.on-demand.io/chat/v1/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify({
                    pluginIds: [],
                    externalUserId: externalUserId
                })
            });

            if (!response.ok) throw new Error('Failed to create chat session');
            
            const data = await response.json();
            return data.data.id;
        } catch (error) {
            appendMessage('Error creating chat session. Please try again later.', 'bot');
            throw error;
        }
    }

    // Function to submit a query to the API
    async function submitQuery(sessionId, query) {
        try {
            const response = await fetch(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apiKey
                },
                body: JSON.stringify({
                    endpointId: 'predefined-openai-gpt4o',
                    query: query,
                    pluginIds: ['plugin-1712327325', 'plugin-1713962163'],
                    responseMode: 'sync'
                })
            });

            if (!response.ok) throw new Error('Failed to submit query');
            
            const data = await response.json();
            return data.data.answer || 'No response received.';
        } catch (error) {
            appendMessage('Error submitting query. Please try again later.', 'bot');
            throw error;
        }
    } 

    // Function to open lyrics in editor page
    function openInEditor(lyrics) {
        localStorage.setItem("lyricsToEdit", lyrics); 
        window.location.href = "ed.html";
    }

    // Handle user input and API call
    async function handleUserInput() {
        const userText = chatInput.value.trim();
        if (!userText) return;
    
        appendMessage(userText, 'user'); // Show user message in chat
        chatInput.value = ""; // Clear input field
    
        try {
            // Create session and get response from the API
            const sessionId = await createChatSession();
            const response = await submitQuery(sessionId, userText);
    
            if (response) { // Check if response is valid
                const botResponse = typeof response === 'string' ? response : JSON.stringify(response);
                appendMessage(botResponse, 'bot'); // Show bot response in chat
                saveToHistory(botResponse); // Save response to history
            } else {
                throw new Error("No response from bot"); // Trigger error message if response is empty
            }
        } catch (error) {
            console.error('Error:', error); // Log error for debugging
            if (error.message !== "No response from bot") {
                appendMessage('...', 'bot'); // Only show for actual issues
            }
        }
    }
    
    // Event listeners for chat input and send button
    sendBtn.addEventListener("click", handleUserInput);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });
});


// Function to open lyrics in the editor page
function openInEditor(lyrics) {
    localStorage.setItem("lyricsToEdit", lyrics); // Store lyrics in local storage
    window.location.href = "ed.html"; // Redirect to editor page
}

// Event listener for the "Edit" button
document.getElementById("edit-btn").addEventListener("click", () => {
    const generatedLyrics = document.querySelector(".chat-message.bot").textContent;
    if (generatedLyrics) {
        openInEditor(generatedLyrics); // Pass the lyrics to the editor page
    } else {
        alert("No lyrics generated to edit."); // Alert if no lyrics available
    }
});
