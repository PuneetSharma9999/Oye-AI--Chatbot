
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useToast } from '@/hooks/use-toast';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, startVoiceInput, stopVoiceInput, isListening, messages } = useChat();
  const { toast } = useToast();
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput('');
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    // Focus the input after sending
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter without shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceInput();
      // If there's voice input, update the input field
      if (inputRef.current && inputRef.current.value) {
        setInput(inputRef.current.value);
      }
    } else {
      startVoiceInput();
    }
  };

  // Suggestions for quick prompts
  const suggestions = [
    "Tell me a fun fact",
    "How does AI work?",
    "Write a short poem",
    "Explain quantum computing"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
      // Resize the textarea
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  };

  // Show suggestions only if there are no messages yet
  const showSuggestions = messages.length === 0;

  return (
    <div className="transition-all duration-500 animate-fade-in">
      {/* Suggestions - only shown when no messages exist */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-3 justify-center animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full border border-primary/20 bg-background hover:bg-primary/10 text-foreground/70 hover:text-foreground transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:shadow-md hover:scale-105"
            >
              <Sparkles className="h-3 w-3 text-primary/70" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative mt-2">
        <div className="relative flex items-center">
          <Textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Oye AI anything..."
            className="pr-24 min-h-[60px] max-h-[200px] resize-none rounded-xl border-muted bg-background/80 backdrop-blur-sm shadow-lg focus-visible:ring-1 focus-visible:ring-primary transition-all duration-300"
            autoFocus
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex space-x-2">
            <Button
              type="button"
              onClick={toggleVoiceInput}
              size="icon"
              variant={isListening ? "destructive" : "ghost"}
              className={`rounded-full h-9 w-9 transition-all duration-300 ${isListening ? 'animate-pulse shadow-md shadow-primary/20' : 'hover:bg-primary/10'}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              type="submit"
              size="icon"
              className="rounded-full h-9 w-9 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:scale-105"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3 animate-fade-in">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">Oye AI</span> • Powered by <a href="https://www.linkedin.com/in/puneetsharma999" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">Puneet Sharma</a>.
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
