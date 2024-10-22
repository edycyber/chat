document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    sendMessage(userInput);
    document.getElementById('user-input').value = ''; // Clear the input field
});

async function sendMessage(content) {
    const messages = document.getElementById('messages');
    
    // Add user message to the chat
    let userMessage = document.createElement('div');
    userMessage.textContent = 'User: ' + content;
    messages.appendChild(userMessage);

    // API Request
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`, // API Key stored securely
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.2-11b-vision-instruct:free",
                messages: [{ "role": "user", "content": content }]
            })
        });
        const data = await response.json();
        let aiMessage = document.createElement('div');
        aiMessage.textContent = 'AI: ' + data.choices[0].message.content;
        messages.appendChild(aiMessage);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Drag and Drop file handling
const fileUpload = document.getElementById('file-upload');
fileUpload.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const files = event.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            console.log("File content:", content); // Display the file content in the console
            sendMessage(content); // Send file content to the AI API
        };
        reader.readAsText(file); // You can adjust this depending on file type (e.g., for images use readAsDataURL)
    }
}
