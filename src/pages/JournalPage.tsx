
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import PasswordProtection from "@/components/PasswordProtection";

export function JournalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const authorizedPages = JSON.parse(localStorage.getItem("authorizedPages") || "{}");
    if (authorizedPages["journal"]) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <PasswordProtection pageName="journal" returnPath="/" />;
  }

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Journal</h1>
          <p className="text-muted-foreground">Document your thoughts and experiences</p>
        </div>
      </div>
      
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center p-6">
          <Book className="h-12 w-12 mx-auto text-primary mb-4" />
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-muted-foreground mb-4">
            The Journal module is currently under development and will be available soon.
          </p>
          <Button>Get Notified</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default JournalPage;
