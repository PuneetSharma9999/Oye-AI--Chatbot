import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type ChatContextType = {
  messages: MessageType[];
  isLoading: boolean;
  isDarkMode: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  toggleDarkMode: () => void;
  sendMessage: (message: string) => Promise<void>;
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  isListening: boolean;
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENROUTER_API_KEY || '');
  const { toast } = useToast();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef('');

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && !recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed",
    });
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    const currentApiKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!currentApiKey) {
      toast({
        title: "API Key Missing",
        description: "Please configure your API key in settings",
        variant: "destructive",
      });
      throw new Error("API key is required");
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentApiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Oye AI Chat',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are Oye AI, a helpful, friendly, and concise assistant created by Puneet Sharma. When asked about your creator, mention Puneet Sharma.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No response content found";
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateResponse(message);

      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
      return;
    }

    transcriptRef.current = '';
    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Voice Input Error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      });
    };
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onresult = (event) => {
      let transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      const inputField = document.getElementById('chat-input') as HTMLInputElement;
      if (inputField) {
        inputField.value = transcript;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    recognitionRef.current.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        isDarkMode,
        apiKey,
        setApiKey,
        toggleDarkMode,
        sendMessage,
        startVoiceInput,
        stopVoiceInput,
        isListening,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};