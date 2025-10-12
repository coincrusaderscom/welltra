// FIX: Implement Gemini service to fetch dynamic motivational quotes.
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMotivationalQuote(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Give me a short, inspiring motivational quote for someone on a weight loss journey. The quote should be concise and uplifting. Only return the quote itself, without any surrounding text like "Here is a quote:" or quotation marks.',
        config: {
            temperature: 1,
            maxOutputTokens: 60,
            // Disable thinking for low-latency UI updates
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    const text = response.text.trim();
    
    if (text) {
      // Remove surrounding quotes if the model still adds them
      return text.replace(/^"|"$/g, '');
    }
    // Fallback if Gemini returns an empty response
    return "You are stronger than you think.";
  } catch (error) {
    console.error("Error fetching motivational quote from Gemini API:", error);
    // Return a fallback quote on error
    return "Believe in the process and trust yourself.";
  }
}
