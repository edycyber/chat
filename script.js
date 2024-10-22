document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    const fileUpload = document.getElementById('file-upload').files[0];

    if (fileUpload) {
        handleFileUpload(fileUpload, userInput);
    } else {
        sendMessage(userInput, null); // If no file, send only text
    }

    document.getElementById('user-input').value = ''; // Clear the input field
});

function handleFileUpload(file, userInput) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        sendMessage(userInput, fileContent); // Send both user input and file content
    };
    reader.readAsText(file);
}

async function sendMessage(content, fileContent) {
    const messages = document.getElementById('messages');

    // Add user message to the chat
    let userMessage = document.createElement('div');
    userMessage.textContent = 'User: ' + content;
    messages.appendChild(userMessage);

    try {
        const response = await fetch('/.netlify/functions/openrouter', {
            method: 'POST',
            body: JSON.stringify({ content, fileContent }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        // Add AI response to the chat
        let aiMessage = document.createElement('div');
        aiMessage.textContent = 'AI: ' + data.choices[0].message.content;
        messages.appendChild(aiMessage);

    } catch (error) {
        console.error('Error:', error);
        let errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error: Could not connect to the API.';
        messages.appendChild(errorMessage);
    }
}
