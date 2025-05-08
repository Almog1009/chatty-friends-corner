
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const ChatView = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to responses
    setResponses([...responses, message]);
    
    // Display a toast notification
    toast({
      title: "Message sent",
      description: "Your response has been received!",
    });
    
    // Clear input field
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto bg-theme-purple/5 p-6 rounded-lg shadow-sm border border-theme-purple/20 mb-6">
          <h2 className="text-xl font-semibold text-theme-purple-dark mb-2">How are you today?</h2>
          <p className="text-sm text-muted-foreground">Share your feelings or just say hello!</p>
        </div>

        {responses.length > 0 && (
          <div className="space-y-4 max-w-md mx-auto">
            {responses.map((response, index) => (
              <div 
                key={index} 
                className="bg-theme-purple/10 p-4 rounded-lg ml-auto max-w-[80%]"
              >
                <p className="text-sm">{response}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-theme-purple/20">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 focus-visible:ring-theme-purple"
          />
          <Button 
            type="submit"
            className="bg-theme-purple hover:bg-theme-purple-dark"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
