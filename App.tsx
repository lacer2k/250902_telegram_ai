
import React, { useState, useEffect, useRef } from 'react';
import { type Chat, type Part } from '@google/genai';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import SettingsPanel from './components/SettingsPanel';
import { createChatSession, sendMessageToAI } from './services/geminiService';
import { type Message } from './types';
import { useSettings } from './hooks/useSettings';
import { SpinnerIcon } from './components/icons';

const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
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
        text: "Hello! I'm the Livio Acerbo AI Assistant. How can I help you today? You can send me text or hold the mic button to send a voice message.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings, saveSettings, isSaving, activeTheme, isLoading: isLoadingSettings } = useSettings();
  const chatRef = useRef<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!chatRef.current) {
          chatRef.current = await createChatSession();
        }
      } catch (e: any) {
        console.error("Failed to initialize chat session:", e);
        setError(e.message || "Failed to initialize the AI assistant. Please check the server configuration and refresh the page.");
      } finally {
        setIsInitializing(false);
      }
    };
    initializeChat();
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
    if (!chatRef.current) {
        addMessage({ sender: 'ai', text: "Sorry, the chat session is not properly initialized. Please refresh the page." });
        return;
    }
    setIsLoading(true);
    
    const aiResponse = await sendMessageToAI(chatRef.current, text);
    addMessage({ sender: 'ai', text: aiResponse });
    
    setIsLoading(false);
  };

  const handleSendVoice = async (audioUrl: string, mimeType: string) => {
    addMessage({ sender: 'user', audioUrl });
    if (!chatRef.current) {
        addMessage({ sender: 'ai', text: "Sorry, the chat session is not properly initialized. Please refresh the page." });
        return;
    }
    setIsLoading(true);

    try {
      const audioBase64 = await blobUrlToBase64(audioUrl);
      const audioPart: Part = {
        inlineData: {
          mimeType: mimeType,
          data: audioBase64,
        },
      };
      const textPart: Part = { text: "Transcribe this voice message and provide a helpful, conversational response." };
      const aiResponse = await sendMessageToAI(chatRef.current, [audioPart, textPart]);
      addMessage({ sender: 'ai', text: aiResponse, isSpoken: true });
    } catch (error) {
      console.error("Error processing voice message:", error);
      addMessage({ sender: 'ai', text: "Sorry, I couldn't process the voice message. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSettings || isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 font-sans text-white text-lg">
        <SpinnerIcon className="w-8 h-8 mr-4" />
        {isLoadingSettings ? 'Loading settings...' : 'Initializing AI...'}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 font-sans text-white">
          <div className="w-full h-full sm:w-[420px] sm:h-[840px] md:w-[480px] md:h-[900px] flex flex-col justify-center items-center bg-red-900 bg-opacity-50 p-8 rounded-lg text-center border-4 border-red-700">
              <h1 className="text-2xl font-bold text-red-300 mb-4">Initialization Error</h1>
              <p className="text-red-200">{error}</p>
          </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 font-sans">
        <div 
          className="w-full h-full sm:w-[420px] sm:h-[840px] md:w-[480px] md:h-[900px] flex flex-col bg-gray-800 shadow-2xl rounded-lg overflow-hidden border-4 border-gray-700"
          style={{
            backgroundImage: `url('${settings.backgroundUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <ChatHeader onMenuClick={() => setIsSettingsOpen(true)} />
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            userBubbleClass={activeTheme.userBubbleClass}
            aiBubbleClass={activeTheme.aiBubbleClass}
          />
          <ChatInput
            onSendText={handleSendText}
            onSendVoice={handleSendVoice}
            isLoading={isLoading}
          />
        </div>
        <SettingsPanel 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            updateSettings={updateSettings}
            onSave={saveSettings}
            isSaving={isSaving}
        />
    </div>
  );
};

export default App;
