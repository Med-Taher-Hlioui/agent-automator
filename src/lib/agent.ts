import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Accessing the API key using a type assertion to bypass 
 * the 'ImportMeta' build error on the Vercel server.
 */
const getApiKey = () => {
  const env = (import.meta as any).env;
  return env.VITE_OPENAI_API_KEY;
};

const genAI = new GoogleGenerativeAI(getApiKey());

export const planTask = async (userInput: string) => {
  /**
   * IN 2026: 'gemini-flash-latest' is the recommended alias for 
   * the most stable Gemini 3 Flash model.
   */
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest" 
  });

  const prompt = `You are an AI Task Architect.
  Break down the following goal into exactly 3 clear, actionable steps.
  Return ONLY a raw JSON array in this exact format:
  [{"step": 1, "task": "description", "status": "pending"}]
  
  Goal: ${userInput}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove markdown code blocks if the AI includes them
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
    
  } catch (error: any) {
    console.error("Agent Error:", error);

    // Handle Rate Limiting (Quota)
    if (error.message?.includes("429")) {
      throw new Error("AI Quota reached. Please wait 60 seconds and try again.");
    }
    
    // Generic fallback for network or model errors
    throw new Error("Failed to plan task. Please check your connection.");
  }
};