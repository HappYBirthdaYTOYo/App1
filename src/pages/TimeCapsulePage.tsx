
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function TimeCapsulePage() {
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Time Capsule</h1>
          <p className="text-muted-foreground">Send messages to your future self</p>
        </div>
      </div>
      
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center p-6">
          <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-muted-foreground mb-4">
            The Time Capsule module is currently under development and will be available soon.
          </p>
          <Button>Get Notified</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default TimeCapsulePage;
