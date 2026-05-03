const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkMisinformation(text) {
  try {
    const prompt = `Analyze the following news or claim for misinformation. Provide a structured response with Bias, Authenticity, and a Confidence Score (0-100%).\nClaim: "${text}"\nFormat as JSON: {"bias": "...", "authenticity": "...", "confidence": 0, "details": "..."}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error checking misinformation:", error);
    return { bias: "Unknown", authenticity: "Unknown", confidence: 0, details: "Error evaluating claim." };
  }
}

async function chatWithAssistant(message, context = "") {
  try {
    const prompt = `You are VoteWise AI, a helpful, unbiased assistant for voter education. Keep answers concise, clear, and easy to understand. User knowledge context: ${context}\n\nUser: ${message}\nVoteWise AI:`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error in chat:", error);
    return "I'm sorry, I'm having trouble connecting right now.";
  }
}

module.exports = {
  checkMisinformation,
  chatWithAssistant
};
