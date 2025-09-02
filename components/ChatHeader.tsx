
import React from 'react';
import { UserIcon } from './icons';

const ChatHeader: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 flex items-center shadow-md z-10">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-white" />
        </div>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-gray-800"></span>
      </div>
      <div className="ml-4">
        <h2 className="text-xl font-semibold text-white">Gemini</h2>
        <p className="text-sm text-green-400">online</p>
      </div>
    </div>
  );
};

export default ChatHeader;
