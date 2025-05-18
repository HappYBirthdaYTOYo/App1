
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  CheckSquare, StickyNote, BookText, PenTool, MapPin, 
  Bot, Lock, Clock, GitBranch, User, Quote, ListTodo, Menu, X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

interface NavItemProps {
  path: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const NavItem = ({ path, icon: Icon, label, isCollapsed }: NavItemProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-primary/10",
          isActive ? "bg-primary/15 text-primary font-medium" : "text-foreground/80",
          isCollapsed ? "justify-center" : ""
        )
      }
    >
      <Icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "")} />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    { path: "/", icon: CheckSquare, label: "Tasks" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/journal", icon: BookText, label: "Journal" },
    { path: "/writing", icon: PenTool, label: "Writing" },
    { path: "/travel", icon: MapPin, label: "Travel" },
    { path: "/assistant", icon: Bot, label: "Assistant" },
    { path: "/vault", icon: Lock, label: "Vault" },
    { path: "/time-capsule", icon: Clock, label: "Time Capsule" },
    { path: "/timeline", icon: GitBranch, label: "Timeline" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/quotes", icon: Quote, label: "Quotes" },
    { path: "/bucket-list", icon: ListTodo, label: "Bucket List" },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!isCollapsed && <h2 className="text-lg font-semibold text-gradient">PersonalHub</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2">
        <nav className="flex flex-col gap-1">
          {navigationItems.map((item, i) => (
            <NavItem
              key={i}
              path={item.path}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
      
      <div className="border-t border-border p-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn("w-full", isCollapsed ? "px-0" : "")}
        >
          {isCollapsed ? (
            theme === "dark" ? "☀️" : "🌙"
          ) : (
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          )}
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
