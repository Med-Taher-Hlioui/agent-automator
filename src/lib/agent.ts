import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your VITE_ prefix key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_OPENAI_API_KEY);

export const planTask = async (userInput: string) => {
  /**
   * IN 2026: 'gemini-3.1-flash' is the high-performance model.
   * We use the 'latest' alias to ensure it always finds the active model.
   */
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `You are an Agentic Automator. 
  Break down the following goal into exactly 3 executable steps. 
  Return ONLY a JSON array in this exact format: 
  [{"step": 1, "task": "description", "status": "pending"}]
  
  Goal: ${userInput}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean up markdown code blocks if the AI includes them
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // If the error is a 429 (Rate Limit), tell the user to wait
    if (error.message?.includes("429")) {
      throw new Error("The AI is taking a breather. Please wait 30 seconds.");
    }
    
    // If it's a 404, we try the newest preview name as a last resort
    const fallbackModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-preview" });
    const fallbackResult = await fallbackModel.generateContent(prompt);
    return JSON.parse(fallbackResult.response.text().replace(/```json|```/g, "").trim());
  }
};