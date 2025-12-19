
import { GoogleGenAI, Chat } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateHealerResponse(healerName: string, specialty: string, userMessage: string, history: { role: string, content: string }[]) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(h => ({ 
            role: h.role === 'user' ? 'user' : 'model', 
            parts: [{ text: h.content }] 
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `You are ${healerName}, a world-class ${specialty}. Provide compassionate, insightful, and healing advice to the user. Keep responses concise and calming. Use a gentle tone. Address the user directly and empathetically.`,
          temperature: 0.8,
        }
      });
      return response.text || "I am reflecting on your words. Please continue...";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I'm sending you peace and light. My connection is momentarily interrupted, but my presence is with you.";
    }
  }

  async getInitialGreeting(healerName: string, specialty: string, location: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a warm, professional, and very brief initial greeting (max 15 words) for a healing session. The healer is ${healerName}, a ${specialty} from ${location}.`,
        config: {
          temperature: 0.9,
        }
      });
      return response.text || "Welcome. I am here to support your journey today.";
    } catch (error) {
      return "Welcome. I am honored to connect with you today.";
    }
  }
}
