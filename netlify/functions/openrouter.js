const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { content, fileContent } = JSON.parse(event.body);

  const apiKey = process.env.OPENROUTER_API_KEY; // Hidden in Netlify env variables

  // Combine text input with file content if available
  const combinedMessage = fileContent ? `${content}\n\nFile Content: ${fileContent}` : content;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-11b-vision-instruct:free",
        messages: [{ "role": "user", "content": combinedMessage }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error calling OpenRouter API", details: error })
    };
  }
};
