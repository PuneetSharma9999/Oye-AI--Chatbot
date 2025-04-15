
import React, { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useChat } from '@/context/ChatContext';

const ChatContainer: React.FC = () => {
  const { isDarkMode } = useChat();
  
  // Apply dark mode class to document when component mounts
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-none">
        <ChatHeader />
      </div>
      <div className="flex-grow overflow-hidden">
        <ChatMessages />
      </div>
      <div className="flex-none w-full max-w-3xl mx-auto px-4 mb-6">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatContainer;
