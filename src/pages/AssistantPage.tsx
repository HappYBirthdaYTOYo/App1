
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useState } from "react";

export function AssistantPage() {
  const [showAIDemo, setShowAIDemo] = useState(false);

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Get AI-powered help for your content</p>
        </div>
      </div>
      
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center p-6">
          <Bot className="h-12 w-12 mx-auto text-primary mb-4" />
          <CardTitle>AI Assistant is Ready</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6 space-y-4">
          <p className="text-muted-foreground">
            You can access your AI Assistant from any screen by clicking the floating button in the bottom right corner.
          </p>
          <p>
            The AI can help you with:
          </p>
          <ul className="text-left list-disc pl-8 space-y-1">
            <li>Managing your tasks and schedules</li>
            <li>Organizing your notes and journal entries</li>
            <li>Finding information across your personal hub</li>
            <li>Getting answers to your questions</li>
          </ul>
          <Button onClick={() => {
            const aiButton = document.querySelector('.fixed.bottom-4.right-4 button') as HTMLButtonElement;
            if (aiButton) {
              aiButton.click();
            }
          }}>
            Try It Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssistantPage;
