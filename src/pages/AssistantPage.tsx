
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function AssistantPage() {
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
        <CardContent className="text-center pb-6">
          <p className="text-muted-foreground mb-4">
            You can access your AI Assistant from any screen by clicking the floating button in the bottom right corner.
          </p>
          <Button>Try It Now</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssistantPage;
