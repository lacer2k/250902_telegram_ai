import React, { useState } from 'react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { MicIcon, SendIcon } from './icons';

interface ChatInputProps {
  onSendText: (text: string) => void;
  onSendVoice: (audioUrl: string, mimeType: string) => void;
  isLoading: boolean;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendText, onSendVoice, isLoading }) => {
  const [text, setText] = useState('');
  const { isRecording, startRecording, stopRecording, recordingSeconds } = useVoiceRecorder({
    onRecordingComplete: onSendVoice,
  });

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendText(text.trim());
      setText('');
    }
  };

  const handleMicPress = () => {
    if (!isLoading) {
        startRecording();
    }
  };

  const handleMicRelease = () => {
    stopRecording();
  };

  return (
    <div className="bg-gray-800 p-4 shadow-inner">
      <div className="flex items-center bg-gray-700 rounded-full px-4 py-2">
        {isRecording ? (
          <div className="flex-1 flex items-center text-white">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></span>
            Recording...
            <span className="ml-auto text-sm font-mono">{formatTime(recordingSeconds)}</span>
          </div>
        ) : (
          <form onSubmit={handleSendText} className="flex-1">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message..."
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
              disabled={isLoading}
            />
          </form>
        )}

        <button
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 ${
            text ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={text ? handleSendText : undefined}
          onMouseDown={!text ? handleMicPress : undefined}
          onMouseUp={!text ? handleMicRelease : undefined}
          onTouchStart={!text ? handleMicPress : undefined}
          onTouchEnd={!text ? handleMicRelease : undefined}
          disabled={isLoading}
        >
          {text ? <SendIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;