
import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send, Mic, Loader, Save, Trash2, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const [showConversationsList, setShowConversationsList] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem("ai-conversations");
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
        
        // If there's an active conversation, load it
        const activeId = localStorage.getItem("active-conversation-id");
        if (activeId) {
          const activeConversation = parsedConversations.find((c: Conversation) => c.id === activeId);
          if (activeConversation) {
            setMessages(activeConversation.messages);
            setCurrentConversationId(activeId);
            setConversationTitle(activeConversation.title);
            return;
          }
        }
      } catch (e) {
        console.error("Error loading saved conversations:", e);
      }
    }
    
    // If no conversations or no active one, initialize with welcome message
    createNewConversation();
  }, []);

  // Scroll to bottom of messages whenever they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Save conversations to localStorage
  const saveConversations = useCallback((updatedConversations: Conversation[]) => {
    try {
      localStorage.setItem("ai-conversations", JSON.stringify(updatedConversations));
      setConversations(updatedConversations);
    } catch (e) {
      console.error("Error saving conversations:", e);
    }
  }, []);

  // Save current messages to the active conversation
  const saveCurrentConversation = useCallback((updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    
    const updatedConversations = conversations.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: updatedMessages } 
        : conv
    );
    
    saveConversations(updatedConversations);
    localStorage.setItem("active-conversation-id", currentConversationId);
  }, [conversations, currentConversationId, saveConversations]);

  const createNewConversation = useCallback(() => {
    const newId = Date.now().toString();
    const welcomeMessage = {
      role: "assistant" as const,
      content: "Hi there! I'm your personal AI assistant. How can I help you today?"
    };
    
    const newConversation = {
      id: newId,
      title: "New conversation",
      messages: [welcomeMessage],
      date: new Date().toISOString()
    };
    
    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    
    setMessages([welcomeMessage]);
    setCurrentConversationId(newId);
    setConversationTitle("New conversation");
    localStorage.setItem("active-conversation-id", newId);
    setShowConversationsList(false);
  }, [conversations, saveConversations]);

  const loadConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(id);
      setConversationTitle(conversation.title);
      localStorage.setItem("active-conversation-id", id);
      setShowConversationsList(false);
    }
  };

  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    saveConversations(updatedConversations);
    
    if (id === currentConversationId) {
      if (updatedConversations.length > 0) {
        loadConversation(updatedConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const updateConversationTitle = () => {
    if (!conversationTitle.trim()) {
      setConversationTitle("New conversation");
      return;
    }
    
    const updatedConversations = conversations.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, title: conversationTitle } 
        : conv
    );
    
    saveConversations(updatedConversations);
    setIsEditingTitle(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };
    const updatedMessages = [...messages, userMessage];
    
    saveCurrentConversation(updatedMessages);
    setMessage("");
    setIsTyping(true);

    try {
      // Check for app navigation commands
      if (message.toLowerCase().includes("go to") || message.toLowerCase().includes("open")) {
        handleNavigationCommand(message);
      }

      // Check for task creation commands
      if (message.toLowerCase().includes("create task") || message.toLowerCase().includes("add task")) {
        handleTaskCreation(message);
      }
      
      // Generate response
      setTimeout(() => {
        const response = generateAdvancedResponse(message, updatedMessages);
        
        const newMessages = [...updatedMessages, { 
          role: "assistant" as const, 
          content: response
        }];
        
        saveCurrentConversation(newMessages);
        setIsTyping(false);

        // Update conversation title if it's still the default and this is the first user message
        if (
          conversationTitle === "New conversation" && 
          updatedMessages.filter(m => m.role === "user").length === 1
        ) {
          const newTitle = message.length > 30 ? `${message.substring(0, 30)}...` : message;
          setConversationTitle(newTitle);
          const titleUpdatedConversations = conversations.map(conv => 
            conv.id === currentConversationId 
              ? { ...conv, title: newTitle } 
              : conv
          );
          saveConversations(titleUpdatedConversations);
        }
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

  const handleNavigationCommand = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    // Handle navigation commands
    if (msg.includes("dashboard") || msg.includes("home")) {
      navigate("/dashboard");
      toast({ title: "Navigating to Dashboard" });
    } else if (msg.includes("task")) {
      navigate("/");
      toast({ title: "Navigating to Tasks" });
    } else if (msg.includes("note")) {
      navigate("/notes");
      toast({ title: "Navigating to Notes" });
    } else if (msg.includes("journal")) {
      navigate("/journal");
      toast({ title: "Navigating to Journal" });
    } else if (msg.includes("writing")) {
      navigate("/writing");
      toast({ title: "Navigating to Creative Writing" });
    } else if (msg.includes("bucket") || msg.includes("list")) {
      navigate("/bucket-list");
      toast({ title: "Navigating to Bucket List" });
    } else if (msg.includes("quote")) {
      navigate("/quotes");
      toast({ title: "Navigating to Quotes" });
    } else if (msg.includes("timeline")) {
      navigate("/timeline");
      toast({ title: "Navigating to Timeline" });
    } else if (msg.includes("vault")) {
      navigate("/vault");
      toast({ title: "Navigating to Safe Vault" });
    } else if (msg.includes("time capsule") || msg.includes("capsule")) {
      navigate("/time-capsule");
      toast({ title: "Navigating to Time Capsule" });
    }
  };

  const handleTaskCreation = (userMessage: string) => {
    // Extract task information
    const title = extractTaskTitle(userMessage);
    if (!title) return;
    
    // Get existing tasks
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Create new task
    const newTask = {
      id: Date.now().toString(),
      title: title,
      description: "",
      priority: userMessage.toLowerCase().includes("high") ? "high" : 
                userMessage.toLowerCase().includes("low") ? "low" : "medium",
      dueDate: new Date().toISOString().split("T")[0],
      tags: [],
      completed: false,
    };
    
    // Save task
    tasks.unshift(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    toast({
      title: "Task Created",
      description: `"${title}" has been added to your tasks`,
    });
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
    
    // Navigation assistance
    if (lowerCaseMessage.includes("go to") || lowerCaseMessage.includes("open") || lowerCaseMessage.includes("navigate")) {
      if (lowerCaseMessage.includes("tasks") || lowerCaseMessage.includes("task list")) {
        return "I'll help you navigate to the Tasks page. You can manage all your tasks there.";
      } else if (lowerCaseMessage.includes("notes")) {
        return "I'll open the Notes page for you. You can view and manage your notes there.";
      } else if (lowerCaseMessage.includes("bucket list")) {
        return "I'll take you to your Bucket List where you can manage your life goals.";
      } else if (lowerCaseMessage.includes("quotes")) {
        return "I'm opening the Quotes Collection for you. You can save and organize inspiring quotes there.";
      } else if (lowerCaseMessage.includes("journal")) {
        return "I'll navigate you to your Journal. You'll need to enter your password to access it.";
      } else if (lowerCaseMessage.includes("vault")) {
        return "I'll take you to the Safe Vault. You'll need to enter your password for access.";
      }
    }

    // Out-of-box questions
    if (lowerCaseMessage.includes("what is") || lowerCaseMessage.includes("who is") || lowerCaseMessage.includes("how to")) {
      if (lowerCaseMessage.includes("meaning of life")) {
        return "The meaning of life is a philosophical question that has been debated throughout human history. Different perspectives include finding purpose, seeking happiness, contributing to society, or simply experiencing the journey. What gives your life meaning?";
      } else if (lowerCaseMessage.includes("weather")) {
        return "I don't have access to real-time weather data, but I can help you organize your tasks, notes, and other information in this application. Is there something specific you'd like my assistance with here?";
      } else if (lowerCaseMessage.includes("recipe") || lowerCaseMessage.includes("cook")) {
        return "While I don't have a dedicated recipes feature, you could use the Notes section to store your favorite recipes. Would you like me to help you create a note for a specific recipe?";
      } else if (lowerCaseMessage.includes("joke") || lowerCaseMessage.includes("funny")) {
        return "Why don't scientists trust atoms? Because they make up everything! Is there something specific about the application I can help you with?";
      }
    }

    // General assistant responses for other queries
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! I'm your personal AI assistant. I can help you manage tasks, provide information, and assist with various features of this application. How can I help you today?";
    } else if (lowerCaseMessage.includes("help")) {
      return "I can help you with the following:\n\n" +
        "- Task management: View, create, and track your tasks\n" +
        "- Navigation: Guide you through different sections of the app\n" +
        "- Information: Answer questions about the app's features\n" +
        "- Suggestions: Provide ideas for organizing your work\n" +
        "- Creating content: Help with writing, brainstorming, and more\n\n" +
        "What would you like help with?";
    } else if (lowerCaseMessage.includes("thank")) {
      return "You're welcome! I'm here to help whenever you need assistance. Is there anything else I can help you with?";
    } else if (lowerCaseMessage.includes("feature") || lowerCaseMessage.includes("can you do")) {
      return "This application has several features including task management, note-taking, journal entries, creative writing, bucket list tracking, quotes collection, and more. I can help you navigate and use these features effectively. What specific feature are you interested in learning more about?";
    } else if (lowerCaseMessage.includes("journal") || lowerCaseMessage.includes("write")) {
      return "The Journal and Creative Writing sections are great for documenting your thoughts and ideas. You can access them from the sidebar navigation. The Journal section is password-protected for your privacy. Would you like me to navigate you to one of these sections?";
    } else if (lowerCaseMessage.includes("password") || lowerCaseMessage.includes("protected")) {
      return "Some sections of this application like the Journal, Vault, and Timeline are password-protected for privacy. You've set up your own password during initial setup. If you need to change it, you can do so through the profile settings. Would you like me to help you with that?";
    }
    
    // Default response if we don't have a specific answer
    return "I'm here to help with managing your tasks, notes, and other app features. Can you tell me more specifically what you need assistance with? You can ask me to create tasks, navigate to different sections, or provide information about the app's features.";
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
            <div className="flex items-center gap-2 flex-1">
              <Bot className="h-5 w-5 text-primary-foreground" />
              {isEditingTitle ? (
                <Input 
                  value={conversationTitle}
                  onChange={(e) => setConversationTitle(e.target.value)}
                  onBlur={updateConversationTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateConversationTitle();
                    }
                  }}
                  className="h-7 text-primary-foreground bg-transparent border-primary-foreground/20"
                  autoFocus
                />
              ) : (
                <h3 
                  className="font-semibold text-primary-foreground truncate cursor-pointer" 
                  onClick={() => setIsEditingTitle(true)}
                  title="Click to edit conversation title"
                >
                  {conversationTitle}
                </h3>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowConversationsList(!showConversationsList)}>
                    {showConversationsList ? "Hide conversations" : "Show conversations"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={createNewConversation}>
                    <Plus className="h-4 w-4 mr-2" /> New conversation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteConversation(currentConversationId)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex h-[350px] overflow-hidden">
            {showConversationsList && (
              <div className="w-[130px] border-r overflow-y-auto bg-muted/30">
                <div className="p-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={createNewConversation}
                  >
                    <Plus className="h-3 w-3 mr-1" /> New
                  </Button>
                </div>
                <div className="space-y-1 p-1">
                  {conversations.map(conv => (
                    <div 
                      key={conv.id} 
                      onClick={() => loadConversation(conv.id)}
                      className={cn(
                        "cursor-pointer text-xs p-2 rounded truncate",
                        conv.id === currentConversationId 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                    >
                      {conv.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className={cn(
              "overflow-y-auto p-4 bg-background/60",
              showConversationsList ? "flex-1" : "w-full"
            )}>
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
