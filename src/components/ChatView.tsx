import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { llmService, ChatMessage, type Message } from "@/services/llmService";
import { MessageCircle, ArrowLeft } from "lucide-react";
import logoSmallPng from "@/assets/logo_small.png";

interface ChatViewProps {
  onReturn?: () => void;
}

const ChatView = ({ onReturn }: ChatViewProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check for existing userId on component mount
  useEffect(() => {
    // Get userId and userName from localStorage
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        setUserId(userData.id);
        setUserName(userData.name);

        // Add initial greeting message
        const greetingMessage: ChatMessage = {
          id: Math.random().toString(36).substring(2, 10),
          content: `Hey ${userData.name}, How are you today?`,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages([greetingMessage]);
      } catch (error) {
        console.error("Error parsing currentUser from localStorage:", error);
      }
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
      const response = await llmService.sendMessage(userMessages, userId);

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

  return (
    <div className="flex flex-col h-full">
      {onReturn && (
        <div className="sticky top-0 z-10 p-4 border-b border-theme-purple/20 bg-white/50">
          <div className="max-w-md mx-auto">
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
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="max-w-md mx-auto bg-theme-purple/5 p-6 rounded-lg shadow-sm border border-theme-purple/20 mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Share your feelings or just say hello!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-md mx-auto">
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
                    <img
                      src={logoSmallPng}
                      alt="Bot"
                      className="h-4 w-4 mr-2 rounded"
                    />
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
