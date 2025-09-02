import React, { useState } from 'react';
import { Message } from '../types';
import { speak, cancel } from '../services/ttsService';
import { SpeakerWaveIcon, StopCircleIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
  userBubbleClass: string;
  aiBubbleClass: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, userBubbleClass, aiBubbleClass }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const isUser = message.sender === 'user';
  const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';

  const bubbleStyles = isUser
    ? `${userBubbleClass} rounded-br-none`
    : `${aiBubbleClass} rounded-bl-none`;

  const isSpokenMessage = message.sender === 'ai' && message.isSpoken && message.text;

  const handlePlayToggle = () => {
    if (!message.text) return;
    
    if (isPlaying) {
      cancel();
    } else {
      setIsPlaying(true);
      speak(message.text, () => setIsPlaying(false));
    }
  };

  // The TTS service's onEnd callback handles setting isPlaying to false,
  // including when speech is cancelled.
  // We need to add a listener to ensure the state is updated if cancel() is called.
  React.useEffect(() => {
    const onEnded = () => setIsPlaying(false);
    
    // A simplified way to listen for speech ending/cancellation.
    const checkSpeechStatus = () => {
        if (!window.speechSynthesis.speaking && isPlaying) {
            onEnded();
        }
    };
    const interval = setInterval(checkSpeechStatus, 200);

    return () => {
        clearInterval(interval);
    }
  }, [isPlaying]);


  return (
    <div className={`flex ${bubbleAlignment} mb-4`}>
      <div className={`max-w-md md:max-w-lg lg:max-w-xl px-4 py-3 rounded-2xl text-white ${bubbleStyles}`}>
        {message.text && <p className="text-base break-words">{message.text}</p>}
        {message.audioUrl && (
          <audio controls src={message.audioUrl} className="w-64 md:w-72 h-12" />
        )}
        <div className="flex justify-end items-center mt-2">
            {isSpokenMessage && (
                <button 
                  onClick={handlePlayToggle} 
                  className="text-gray-300 hover:text-white transition-colors mr-2 focus:outline-none"
                  aria-label={isPlaying ? 'Stop reading message' : 'Read message aloud'}
                >
                    {isPlaying ? <StopCircleIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                </button>
            )}
            <p className="text-xs text-gray-300">{message.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;