import React, { useState, useEffect, useRef } from 'react';
// Fix: Import `Part` type to construct multimodal messages.
import { type Chat, type Part } from '@google/genai';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { createChatSession, sendMessageToAI } from './services/geminiService';
import { type Message } from './types';

// Fix: Add a helper function to convert a blob URL to a Base64 string for the Gemini API.
const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the Base64 prefix, which we need to remove.
        // e.g., "data:audio/webm;base64,GkXfo59ChoEBQveBA..."
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read blob as Base64 string."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
        id: '1',
        sender: 'ai',
        text: "Hello! I'm Gemini. How can I help you today? You can send me text or hold the mic button to send a voice message.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!chatRef.current) {
        chatRef.current = createChatSession();
    }
  }, []);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };
  
  const handleSendText = async (text: string) => {
    addMessage({ sender: 'user', text });
    setIsLoading(true);
    
    if (chatRef.current) {
        const aiResponse = await sendMessageToAI(chatRef.current, text);
        addMessage({ sender: 'ai', text: aiResponse });
    }
    
    setIsLoading(false);
  };

  const handleSendVoice = async (audioUrl: string, mimeType: string) => {
    addMessage({ sender: 'user', audioUrl });
    setIsLoading(true);

    if (chatRef.current) {
      try {
        const audioBase64 = await blobUrlToBase64(audioUrl);
        const audioPart: Part = {
          inlineData: {
            mimeType: mimeType,
            data: audioBase64,
          },
        };
        const textPart: Part = { text: "Transcribe this voice message and provide a helpful response." };
        const aiResponse = await sendMessageToAI(chatRef.current, [audioPart, textPart]);
        addMessage({ sender: 'ai', text: aiResponse });
      } catch (error) {
        console.error("Error processing voice message:", error);
        addMessage({ sender: 'ai', text: "Sorry, I couldn't process the voice message. Please try again." });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 font-sans">
        <div 
          className="w-full h-full sm:w-[420px] sm:h-[840px] md:w-[480px] md:h-[900px] flex flex-col bg-gray-800 shadow-2xl rounded-lg overflow-hidden border-4 border-gray-700"
          style={{
            backgroundImage: `url('https://picsum.photos/seed/telegrambg/480/900')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <ChatHeader />
          <ChatWindow messages={messages} isLoading={isLoading} />
          <ChatInput
            onSendText={handleSendText}
            onSendVoice={handleSendVoice}
            isLoading={isLoading}
          />
        </div>
    </div>
  );
};

export default App;