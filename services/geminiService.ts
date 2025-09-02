
import { GoogleGenAI, Chat, Part } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and friendly chat assistant named Livio Acerbo AI Assistant. Keep your responses concise and conversational, like in a messaging app.',
    },
  });
  return chat;
}

// Fix: Update function signature to accept multimodal content (text and audio parts).
export async function sendMessageToAI(chat: Chat, message: string | (string | Part)[]): Promise<string> {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}