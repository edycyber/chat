exports.handler = async function(event, context) {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;
  
    const { content, fileContent } = JSON.parse(event.body);
    const apiKey = process.env.OPENROUTER_API_KEY;
  
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
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [{ "role": "user", "content": combinedMessage }]
        })
      });
  
      const data = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
  
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Error calling OpenRouter API", details: error.message })
      };
    }
  };
  
