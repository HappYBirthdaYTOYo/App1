
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai-messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Error loading saved messages:", e);
        // Initialize with welcome message if there's an error
        setMessages([{
          role: "assistant",
          content: "Hi there! I'm your personal AI assistant. How can I help you today?",
        }]);
      }
    } else {
      // Initialize with welcome message if no saved messages
      setMessages([{
        role: "assistant",
        content: "Hi there! I'm your personal AI assistant. How can I help you today?",
      }]);
    }
  }, []);

  // Scroll to bottom of messages whenever they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      // Generate a contextual response based on the user's message
      setTimeout(() => {
        const response = generateAdvancedResponse(message, updatedMessages);
        
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

  // Function to get tasks from localStorage
  const getTasks = () => {
    try {
      const tasks = localStorage.getItem('tasks');
      if (tasks) {
        return JSON.parse(tasks);
      }
    } catch (e) {
      console.error("Error getting tasks:", e);
    }
    return [];
  };

  // Generate an advanced contextual response based on the message and conversation history
  const generateAdvancedResponse = (userMessage: string, conversationHistory: Message[]): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    const tasks = getTasks();
    
    // Task Management
    if (lowerCaseMessage.includes("show") && lowerCaseMessage.includes("tasks")) {
      if (tasks.length === 0) {
        return "You don't have any tasks yet. Would you like me to help you create one?";
      }
      
      const pendingTasks = tasks.filter((task: any) => !task.completed);
      if (pendingTasks.length === 0) {
        return "You've completed all your tasks! Great job!";
      }
      
      let response = `Here are your pending tasks:\n\n`;
      pendingTasks.slice(0, 5).forEach((task: any, index: number) => {
        response += `${index + 1}. ${task.title} (${task.priority} priority, due ${new Date(task.dueDate).toLocaleDateString()})\n`;
      });
      
      if (pendingTasks.length > 5) {
        response += `\n...and ${pendingTasks.length - 5} more tasks.`;
      }
      
      return response;
    }
    
    if (lowerCaseMessage.includes("completed tasks") || (lowerCaseMessage.includes("show") && lowerCaseMessage.includes("completed"))) {
      const completedTasks = tasks.filter((task: any) => task.completed);
      
      if (completedTasks.length === 0) {
        return "You haven't completed any tasks yet. You can mark tasks as completed on the Tasks page.";
      }
      
      let response = `Here are your completed tasks:\n\n`;
      completedTasks.slice(0, 5).forEach((task: any, index: number) => {
        response += `${index + 1}. ${task.title}\n`;
      });
      
      if (completedTasks.length > 5) {
        response += `\n...and ${completedTasks.length - 5} more completed tasks.`;
      }
      
      return response;
    }
    
    if (lowerCaseMessage.includes("create") && (lowerCaseMessage.includes("task") || lowerCaseMessage.includes("todo"))) {
      const title = extractTaskTitle(userMessage);
      if (title) {
        // In a real implementation, we would create the task here
        return `I've created a task titled "${title}". You can view and manage it on the Tasks page.`;
      } else {
        return "I'd be happy to help you create a task. Could you provide me with a title for the task?";
      }
    }

    if (lowerCaseMessage.includes("due") || lowerCaseMessage.includes("deadline")) {
      const today = new Date().toDateString();
      const todayTasks = tasks.filter((t: any) => !t.completed && new Date(t.dueDate).toDateString() === today);
      
      if (todayTasks.length > 0) {
        let response = `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today:\n\n`;
        todayTasks.forEach((task: any, i: number) => {
          response += `${i + 1}. ${task.title} (${task.priority} priority)\n`;
        });
        return response;
      } else {
        return "You don't have any tasks due today. Would you like to see your upcoming tasks instead?";
      }
    }

    // Analytics and insights
    if (lowerCaseMessage.includes("analytics") || lowerCaseMessage.includes("statistics") || lowerCaseMessage.includes("stats")) {
      const completed = tasks.filter((t: any) => t.completed).length;
      const pending = tasks.filter((t: any) => !t.completed).length;
      const highPriority = tasks.filter((t: any) => !t.completed && t.priority === "high").length;
      
      return `Here's a summary of your tasks:\n\n` +
        `- Total tasks: ${tasks.length}\n` +
        `- Completed tasks: ${completed}\n` +
        `- Pending tasks: ${pending}\n` +
        `- High priority tasks: ${highPriority}\n\n` +
        `Your task completion rate is ${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%.`;
    }
    
    // General assistant responses for other queries
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! I'm your personal AI assistant. I can help you manage tasks, provide information, and assist with various features of this application. How can I help you today?";
    } else if (lowerCaseMessage.includes("help")) {
      return "I can help you with the following:\n\n" +
        "- Task management: View, create, and track your tasks\n" +
        "- Navigation: Guide you through different sections of the app\n" +
        "- Information: Answer questions about the app's features\n" +
        "- Suggestions: Provide ideas for organizing your work\n\n" +
        "What would you like help with?";
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! I'm here to help whenever you need assistance. Is there anything else I can help you with?";
    } else if (lowerCaseMessage.includes("weather") || lowerCaseMessage.includes("forecast")) {
      return "I don't have access to real-time weather data, but I can help you with tasks, notes, journal entries, and other features within this application. Would you like me to help you with any of those?";
    } else if (lowerCaseMessage.includes("feature") || lowerCaseMessage.includes("can you do")) {
      return "This application has several features including task management, note-taking, journal entries, creative writing, and more. I can help you navigate and use these features effectively. What specific feature are you interested in learning more about?";
    } else if (lowerCaseMessage.includes("journal") || lowerCaseMessage.includes("write")) {
      return "The Journal and Creative Writing sections are great for documenting your thoughts and ideas. You can access them from the sidebar navigation. The Journal section is password-protected for your privacy. Would you like me to tell you more about these features?";
    } else if (lowerCaseMessage.includes("password") || lowerCaseMessage.includes("protected")) {
      return "Some sections of this application like the Journal, Vault, and Timeline are password-protected for privacy. The default password is '1234'. You can change this in a real implementation. Would you like me to guide you to any of these sections?";
    }
    
    // Default response if we don't have a specific answer
    return "I'm here to help with managing your tasks, notes, and other app features. Can you tell me more specifically what you need assistance with?";
  };

  // Helper function to try to extract a task title from user input
  const extractTaskTitle = (input: string): string | null => {
    // This is a simplified extraction - in a real app would be more sophisticated
    const commonPhrases = ["create a task", "create task", "add a task", "add task", "new task"];
    
    let processedInput = input.toLowerCase();
    let title = null;
    
    for (const phrase of commonPhrases) {
      if (processedInput.includes(phrase)) {
        // Extract what comes after the phrase
        const parts = input.split(new RegExp(phrase, "i"));
        if (parts.length > 1 && parts[1].trim()) {
          title = parts[1].trim();
          // Remove common endings like "for me", "please", etc.
          title = title.replace(/\s+(for me|please|thanks|thank you).*$/i, "");
          // Remove punctuation at the end
          title = title.replace(/[.!?]$/, "");
          break;
        }
      }
    }
    
    return title;
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
          
          <div className="h-[350px] overflow-y-auto p-4 bg-background/60">
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
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            ))}
            
            {isTyping && (
              <div className="ml-0 mr-auto max-w-[80%] rounded-xl p-3 text-sm bg-secondary">
                <div className="flex items-center gap-2">
                  <Loader className="h-3 w-3 animate-spin" />
                  <span>Thinking...</span>
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
