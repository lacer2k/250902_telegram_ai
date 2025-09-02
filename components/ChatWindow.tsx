import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-4">
    <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-700 text-white">
      <div className="flex items-center space-x-2">
        <span className="text-base font-medium">Gemini is typing</span>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
      <div className="space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatWindow;