// backend/hfClient.js
const fetch = require("node-fetch");

async function queryHuggingFace({ model, messages, parameters }) {
  try {
    console.log(`🤗 Calling Hugging Face with model: ${model}`);
    
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: parameters?.max_new_tokens || 500,
        temperature: parameters?.temperature || 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Hugging Face API Error:", errText);
      throw new Error(`Hugging Face API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    console.log("✅ Hugging Face response received");
    return data;
    
  } catch (error) {
    console.error("❌ Hugging Face error:", error);
    throw error;
  }
}

module.exports = { queryHuggingFace };