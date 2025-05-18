
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export function Header({ toggleMobileSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gradient">PersonalHub</h1>
      </div>
      
      <div className="hidden md:block" />
      
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative hidden md:block max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="pl-9 w-[300px] bg-background"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border-2 h-9 w-9"
        >
          <span className="font-medium">JD</span>
        </Button>
      </div>
    </header>
  );
}

export default Header;
