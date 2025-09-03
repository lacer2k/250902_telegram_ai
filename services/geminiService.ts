
import { GoogleGenAI, Chat, Part } from "@google/genai";

let ai: GoogleGenAI | null = null;

async function getAiClient(): Promise<GoogleGenAI> {
  if (ai) {
    return ai;
  }
  try {
    const response = await fetch('/api/google-api-key');
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch API key. Server returned an invalid response.' }));
        throw new Error(errorData.error || `Failed to fetch API key. Status: ${response.status}`);
    }
    const { apiKey } = await response.json();
    if (!apiKey) {
        throw new Error("API key is missing in the server's response.");
    }
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error("Could not initialize GoogleGenAI client:", error);
    // Propagate error to be handled by the UI
    throw error;
  }
}


export async function createChatSession(): Promise<Chat> {
  const aiClient = await getAiClient();
  const chat = aiClient.chats.create({
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