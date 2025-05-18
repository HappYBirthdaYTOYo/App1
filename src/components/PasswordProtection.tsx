
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PasswordProtectionProps {
  pageName: string;
  returnPath: string;
  onAuthenticated?: () => void;
}

export function PasswordProtection({ pageName, returnPath, onAuthenticated }: PasswordProtectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored password
    const storedPassword = localStorage.getItem("appPassword") || "1234";
    
    if (password === storedPassword) {
      setIsOpen(false);
      toast({
        title: "Access Granted",
        description: "You now have access to this protected section",
      });
      
      if (onAuthenticated) {
        onAuthenticated();
      }
    } else {
      setError("Incorrect password");
      toast({
        title: "Access Denied",
        description: "The password you entered is incorrect",
        variant: "destructive",
      });
    }
  };
  
  // When dialog is closed without successful auth, redirect back
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      navigate(returnPath);
    }
    setIsOpen(open);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto p-2 rounded-full bg-primary/10 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Password Required</DialogTitle>
          <DialogDescription className="text-center">
            This section is password protected. Please enter the password to continue.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className={error ? "border-destructive" : ""}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button type="submit" className="w-full">
            Unlock
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordProtection;
