
import React from 'react';
import ChatContainer from '@/components/ChatContainer';
import { ChatProvider } from '@/context/ChatContext';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-500">
      <div className="w-full mx-auto flex">
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </div>
    </div>
  );
};

export default Index;
