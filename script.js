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
    
    // Check the file type
    if (file.type.startsWith('text')) {
        reader.readAsText(file);
    } else if (file.type.startsWith('image')) {
        reader.readAsDataURL(file);  // If it's an image, read it as a data URL
    } else {
        console.error('Unsupported file type:', file.type);
        return;
    }
    
    reader.onload = function(e) {
        const fileContent = e.target.result;
        sendMessage(userInput, fileContent); // Send both user input and file content
    };
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

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Add AI response to the chat
        let aiMessage = document.createElement('div');
        aiMessage.textContent = 'AI: ' + data.choices[0].message.content;
        messages.appendChild(aiMessage);

    } catch (error) {
        console.error('Error:', error);
        let errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error: Could not connect to the API or the API response failed.';
        messages.appendChild(errorMessage);
    }
    const combinedMessage = fileContent ? `${content}\n\nFile Content: ${fileContent}` : content;

}
