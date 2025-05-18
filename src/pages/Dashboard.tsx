
import { CheckSquare, StickyNote, BookText, PenTool, MapPin, 
  Bot, Lock, Clock, Timeline, User, Quote, ListTodo, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  to: string;
  color?: string;
  preview?: React.ReactNode;
}

const ModuleCard = ({ title, icon, description, to, color = "bg-primary/10", preview }: ModuleCardProps) => {
  return (
    <Link to={to} className="block">
      <div className="module-card h-full flex flex-col justify-between">
        <div>
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
            {icon}
          </div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {preview && <div className="mt-4">{preview}</div>}
      </div>
    </Link>
  );
};

function TasksPreview() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs truncate">Design system updates</p>
        <span className="text-xs text-amber-500">Today</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs truncate">Review project proposal</p>
        <span className="text-xs text-green-500">Tomorrow</span>
      </div>
      <Progress value={40} className="h-1.5" />
    </div>
  );
}

function NotesPreview() {
  return (
    <div className="flex gap-2 overflow-x-hidden">
      <div className="w-6 h-6 rounded-sm bg-yellow-100 dark:bg-yellow-900/30 shadow-sm"></div>
      <div className="w-6 h-6 rounded-sm bg-blue-100 dark:bg-blue-900/30 shadow-sm"></div>
      <div className="w-6 h-6 rounded-sm bg-green-100 dark:bg-green-900/30 shadow-sm"></div>
      <div className="w-6 h-6 rounded-sm bg-purple-100 dark:bg-purple-900/30 shadow-sm"></div>
    </div>
  );
}

function JournalPreview() {
  return (
    <div className="text-xs text-muted-foreground">
      Last entry: Yesterday at 10:45 PM
    </div>
  );
}

function QuotesPreview() {
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Star className="h-3 w-3 text-amber-400 mr-1" />
      <span>15 favorites collected</span>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's your personal dashboard</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ModuleCard
          title="Tasks"
          icon={<CheckSquare className="h-6 w-6 text-primary" />}
          description="Organize and track your daily tasks"
          to="/"
          color="bg-primary/10"
          preview={<TasksPreview />}
        />
        
        <ModuleCard
          title="Quick Notes"
          icon={<StickyNote className="h-6 w-6 text-amber-500" />}
          description="Jot down your thoughts instantly"
          to="/notes"
          color="bg-amber-500/10"
          preview={<NotesPreview />}
        />
        
        <ModuleCard
          title="Journal"
          icon={<BookText className="h-6 w-6 text-blue-500" />}
          description="Record your daily experiences"
          to="/journal"
          color="bg-blue-500/10"
          preview={<JournalPreview />}
        />
        
        <ModuleCard
          title="Creative Writing"
          icon={<PenTool className="h-6 w-6 text-violet-500" />}
          description="Unleash your creativity with writing"
          to="/writing"
          color="bg-violet-500/10"
        />
        
        <ModuleCard
          title="Travel Dump"
          icon={<MapPin className="h-6 w-6 text-green-500" />}
          description="Document your travels and adventures"
          to="/travel"
          color="bg-green-500/10"
        />
        
        <ModuleCard
          title="AI Assistant"
          icon={<Bot className="h-6 w-6 text-cyan-500" />}
          description="Get AI-powered help for your content"
          to="/assistant"
          color="bg-cyan-500/10"
        />
        
        <ModuleCard
          title="Safe Vault"
          icon={<Lock className="h-6 w-6 text-red-500" />}
          description="Securely store sensitive information"
          to="/vault"
          color="bg-red-500/10"
        />
        
        <ModuleCard
          title="Time Capsule"
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          description="Send messages to your future self"
          to="/time-capsule"
          color="bg-orange-500/10"
        />
        
        <ModuleCard
          title="Timeline"
          icon={<Timeline className="h-6 w-6 text-emerald-500" />}
          description="Visualize your life's important events"
          to="/timeline"
          color="bg-emerald-500/10"
        />
        
        <ModuleCard
          title="Profile"
          icon={<User className="h-6 w-6 text-indigo-500" />}
          description="Manage your personal information"
          to="/profile"
          color="bg-indigo-500/10"
        />
        
        <ModuleCard
          title="Quotes Collection"
          icon={<Quote className="h-6 w-6 text-rose-500" />}
          description="Save and organize inspiring quotes"
          to="/quotes"
          color="bg-rose-500/10"
          preview={<QuotesPreview />}
        />
        
        <ModuleCard
          title="Bucket List"
          icon={<ListTodo className="h-6 w-6 text-teal-500" />}
          description="Track your life goals and ambitions"
          to="/bucket-list"
          color="bg-teal-500/10"
        />
      </div>
    </div>
  );
}

export default Dashboard;
