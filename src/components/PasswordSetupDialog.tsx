
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PasswordSetupDialogProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function PasswordSetupDialog({ isOpen, onComplete }: PasswordSetupDialogProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Store the password securely (for demo purposes, using localStorage)
    localStorage.setItem("appPassword", password);
    localStorage.setItem("passwordConfigured", "true");
    
    toast({
      title: "Password Set Successfully",
      description: "Your password has been set for protected sections",
    });
    
    onComplete();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto p-2 rounded-full bg-primary/10 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Create Password</DialogTitle>
          <DialogDescription className="text-center">
            Please create a password to protect sensitive sections of your application.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={error && error.includes("at least") ? "border-destructive" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className={error && error.includes("match") ? "border-destructive" : ""}
            />
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button type="submit" className="w-full">
            Set Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordSetupDialog;
