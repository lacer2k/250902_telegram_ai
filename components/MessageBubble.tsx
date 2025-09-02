
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isUser ? 'bg-blue-600' : 'bg-gray-700';
  const bubbleRadius = isUser ? 'rounded-br-none' : 'rounded-bl-none';

  return (
    <div className={`flex ${bubbleAlignment} mb-4`}>
      <div className={`max-w-md md:max-w-lg lg:max-w-xl px-4 py-3 rounded-2xl ${bubbleColor} ${bubbleRadius} text-white`}>
        {message.text && <p className="text-base break-words">{message.text}</p>}
        {message.audioUrl && (
          <audio controls src={message.audioUrl} className="w-64 md:w-72 h-12" />
        )}
        <p className="text-xs text-gray-300 mt-2 text-right">{message.timestamp}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
