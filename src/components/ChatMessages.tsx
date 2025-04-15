
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { BotIcon, UserIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const ChatMessages: React.FC = () => {
  const { messages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text: string) => {
    // Use marked to convert markdown to HTML
    const rawHtml = marked.parse(text, { breaks: true });
    // Sanitize the HTML to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    return { __html: sanitizedHtml };
  };

  return (
    <div className="h-full overflow-y-auto pb-10 pt-4 scroll-smooth flex flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 mt-12">
          <div className="w-16 h-16 mb-6 animate-bounce-in">
            <Sparkles className="w-full h-full text-primary opacity-85" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
            Welcome to Oye AI
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md animate-fade-in delay-100 leading-relaxed">
            I'm here to help with answers, ideas, and conversation. What's on your mind today?
          </p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "py-6 animate-fade-in transition-all duration-500 w-full",
                message.isUser ? "bg-transparent" : "bg-muted/10 backdrop-blur-sm"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex max-w-3xl mx-auto px-6">
                <div className="flex-shrink-0 mr-4">
                  <div className={cn(
                    "flex items-center justify-center h-9 w-9 rounded-full shadow-md transition-all duration-300 hover:scale-105",
                    message.isUser 
                      ? "bg-gradient-to-br from-primary to-secondary text-white" 
                      : "bg-gradient-to-br from-secondary to-accent text-white"
                  )}>
                    {message.isUser ? (
                      <UserIcon className="h-5 w-5" />
                    ) : (
                      <BotIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="prose dark:prose-invert max-w-none">
                    {message.isUser ? (
                      <p className="text-foreground leading-relaxed">{message.text}</p>
                    ) : (
                      <div 
                        className="text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={formatMessage(message.text)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="py-6 bg-muted/10 backdrop-blur-sm animate-fade-in transition-all duration-300">
          <div className="flex max-w-3xl mx-auto px-6">
            <div className="flex-shrink-0 mr-4">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-secondary to-accent text-white shadow-md">
                <BotIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-grow">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
