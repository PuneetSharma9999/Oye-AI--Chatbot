
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Trash2, Info, Settings } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ChatHeader: React.FC = () => {
  const { isDarkMode, toggleDarkMode, clearChat, apiKey, setApiKey } = useChat();
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  const handleClearChat = () => {
    clearChat();
    toast({
      title: "Chat Cleared",
      description: "All messages have been removed",
    });
  };

  const saveApiKey = () => {
    setApiKey(apiKeyInput);
    setSettingsOpen(false);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been updated",
    });
  };

  return (
    <header className="border-b dark:border-gray-800 bg-background backdrop-blur-lg bg-opacity-80 dark:bg-opacity-70 sticky top-0 z-10 transition-all duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
              Oye AI
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted transition-all duration-300 rounded-full">
                  <Info className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-xl border-primary/20 shadow-xl animate-fade-in backdrop-blur-sm bg-background/95">
                <DialogHeader>
                  <DialogTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">About Oye AI</DialogTitle>
                  <DialogDescription>
                    Your intelligent conversational assistant
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <p className="text-muted-foreground">
                    Oye AI is a powerful conversational assistant designed to help with a wide range of tasks.
                  </p>
                  <p className="text-muted-foreground">
                     Powered by <a href="https://www.linkedin.com/in/puneetsharma999" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">Puneet Sharma</a>, Oye AI can answer questions, provide information, and engage in natural conversations.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            
           {/*
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted transition-all duration-300 rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-xl border-primary/20 shadow-xl animate-fade-in backdrop-blur-sm bg-background/95">
                <DialogHeader>
                  <DialogTitle className="text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Settings</DialogTitle>
                  <DialogDescription>
                    Configure your Oye AI experience
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="api-key" className="text-sm font-medium text-foreground">
                      OpenAI API Key
                    </label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Enter your OpenAI API key"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={saveApiKey} className="bg-primary hover:bg-primary/90 transition-all duration-300">
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            */}
            
            <Button 
              onClick={handleClearChat} 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:bg-muted transition-all duration-300 rounded-full"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={toggleDarkMode} 
              variant="ghost" 
              size="icon" 
              className="text-foreground hover:bg-muted transition-all duration-300 rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
