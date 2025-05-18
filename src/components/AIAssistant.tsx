
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Mic, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your personal AI assistant. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages whenever they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai-messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Error loading saved messages:", e);
      }
    }
  }, []);

  // Save messages to localStorage
  const saveMessages = (updatedMessages: Message[]) => {
    try {
      localStorage.setItem("ai-messages", JSON.stringify(updatedMessages));
    } catch (e) {
      console.error("Error saving messages:", e);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setMessage("");
    setIsTyping(true);

    try {
      // Simulate AI response with delayed response
      setTimeout(() => {
        // Generate a simple contextual response based on the message
        const response = generateSimpleResponse(message);
        
        const newMessages = [...updatedMessages, { 
          role: "assistant" as const, 
          content: response
        }];
        
        setMessages(newMessages);
        saveMessages(newMessages);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Could not get a response from the assistant",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  };

  // Generate a simple contextual response based on the message
  const generateSimpleResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    } else if (lowerCaseMessage.includes("task") || lowerCaseMessage.includes("todo")) {
      return "I can help you organize your tasks! You can create new tasks from the Tasks page using the 'Add Task' button.";
    } else if (lowerCaseMessage.includes("note") || lowerCaseMessage.includes("write")) {
      return "The Notes section is great for jotting down quick thoughts. Would you like to know more about it?";
    } else if (lowerCaseMessage.includes("calendar") || lowerCaseMessage.includes("schedule")) {
      return "You can use the Calendar in the Tasks page to view and manage your task schedule. Just click on the Calendar button!";
    } else if (lowerCaseMessage.includes("help")) {
      return "I'm here to help! I can assist with tasks, notes, journaling, and other features of the app. What would you like to know about?";
    } else if (lowerCaseMessage.includes("journal")) {
      return "The Journal feature allows you to record your daily experiences and thoughts. Would you like me to tell you more about it?";
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! Let me know if there's anything else I can help you with.";
    } else {
      return "I'm still learning, but I'm here to help with your personal organization needs. Can you tell me more about what you're looking for?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="animate-in slide-in-from-bottom-10 mb-4 w-[350px] rounded-xl glass-card overflow-hidden shadow-lg">
          <div className="flex items-center justify-between bg-primary p-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-[300px] overflow-y-auto p-4 bg-background/60">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "mb-3 max-w-[80%] rounded-xl p-3 text-sm",
                  msg.role === "assistant"
                    ? "ml-0 mr-auto bg-secondary"
                    : "ml-auto mr-0 bg-primary text-primary-foreground"
                )}
              >
                {msg.content}
              </div>
            ))}
            
            {isTyping && (
              <div className="ml-0 mr-auto max-w-[80%] rounded-xl p-3 text-sm bg-secondary">
                <div className="flex items-center gap-2">
                  <Loader className="h-3 w-3 animate-spin" />
                  <span>Typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t p-3 flex gap-2 bg-card/80">
            <Textarea
              className="min-h-10 resize-none bg-background"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isTyping}
            />
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8"
                disabled={isTyping}
                onClick={() => toast({
                  title: "Voice input",
                  description: "Voice input is coming soon!",
                })}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg",
          isOpen ? "bg-primary/90" : "bg-primary animate-pulse-soft"
        )}
      >
        <Bot className="h-6 w-6" />
      </Button>
    </div>
  );
}

export default AIAssistant;
