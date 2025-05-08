import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { llmService, ChatMessage, type Message } from "@/services/llmService";
import { MessageCircle, Bot, ArrowLeft } from "lucide-react";

interface ChatViewProps {
  onReturn?: () => void;
}

const ChatView = ({ onReturn }: ChatViewProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check for existing API key on component mount
  useEffect(() => {
    const savedApiKey = llmService.getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 10),
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    // Add user message to messages state
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Clear input field
    setMessage("");

    // If API key is not set, show a toast
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API Key in the settings",
      });
      setShowApiKeyInput(true);
      return;
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Prepare context for API call
      const userMessages: string[] = [
        ...messages
          .filter((msg) => msg.role == "user")
          .map((msg) => msg.content),
        userMessage.content,
      ];

      // Call LLM service
      const response = await llmService.sendMessage(userMessages);

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 10),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      // Add assistant message to messages state
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      llmService.setApiKey(apiKey.trim());
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="max-w-md mx-auto bg-theme-purple/5 p-6 rounded-lg shadow-sm border border-theme-purple/20 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-theme-purple-dark">
                How are you today?
              </h2>
              {onReturn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReturn}
                  className="border-theme-purple/20 text-theme-purple hover:bg-theme-purple/10"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Chat
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Share your feelings or just say hello!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-md mx-auto">
            {onReturn && (
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReturn}
                  className="border-theme-purple/20 text-theme-purple hover:bg-theme-purple/10"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Chat
                </Button>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-theme-purple/10 ml-auto"
                    : "bg-white border border-theme-purple/20 mr-auto"
                }`}
              >
                <div className="flex items-center mb-1">
                  {msg.role === "user" ? (
                    <MessageCircle className="h-4 w-4 mr-2 text-theme-purple" />
                  ) : (
                    <Bot className="h-4 w-4 mr-2 text-theme-purple" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {msg.role === "user" ? "You" : "AI"} •{" "}
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {showApiKeyInput && (
        <div className="p-4 border-t border-theme-purple/20 bg-white/50 mb-2">
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-medium mb-2">
              Enter your OpenAI API Key:
            </h3>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 focus-visible:ring-theme-purple"
              />
              <Button
                onClick={handleSaveApiKey}
                className="bg-theme-purple hover:bg-theme-purple-dark"
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally in your browser.
            </p>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-theme-purple/20">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 focus-visible:ring-theme-purple"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-theme-purple hover:bg-theme-purple-dark"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
