
import { useState } from "react";
import { Bot, X, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const demoMessages = [
    {
      role: "assistant",
      content: "Hi there! I'm your personal AI assistant. How can I help you today?",
    },
  ];

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
            {demoMessages.map((msg, i) => (
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
          </div>
          
          <div className="border-t p-3 flex gap-2 bg-card/80">
            <Textarea
              className="min-h-10 resize-none bg-background"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={1}
            />
            <div className="flex flex-col gap-2">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Mic className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" className="rounded-full h-8 w-8">
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
