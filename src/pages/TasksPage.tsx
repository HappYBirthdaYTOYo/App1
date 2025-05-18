
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Plus, Filter, Calendar as CalendarIcon, CheckSquare, Clock, Tag, 
  AlertCircle, CheckCircle2, CircleCheck 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string[];
  completed: boolean;
}

// Load tasks from localStorage if available
const getInitialTasks = (): Task[] => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    try {
      return JSON.parse(savedTasks);
    } catch (e) {
      console.error("Error parsing saved tasks:", e);
    }
  }

  // Default tasks if none are saved
  return [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the draft and send it for review",
      priority: "high",
      dueDate: "2025-05-20",
      tags: ["work", "important"],
      completed: false,
    },
    {
      id: "2",
      title: "Schedule dentist appointment",
      priority: "medium",
      dueDate: "2025-05-25",
      tags: ["health"],
      completed: false,
    },
    {
      id: "3",
      title: "Buy groceries",
      description: "Milk, eggs, bread, vegetables",
      priority: "low",
      dueDate: "2025-05-19",
      tags: ["personal"],
      completed: false,
    },
    {
      id: "4",
      title: "Renew gym membership",
      priority: "medium",
      dueDate: "2025-05-30",
      tags: ["health", "fitness"],
      completed: true,
    },
  ];
};

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks());
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
    tags: [],
  });
  const [newTaskTag, setNewTaskTag] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Save tasks to localStorage whenever they change
  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const todayTasks = tasks.filter(task => !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString());
  const upcomingTasks = tasks.filter(task => !task.completed && new Date(task.dueDate).toDateString() !== new Date().toDateString());
  const completedTasks = tasks.filter(task => task.completed);

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const addTask = () => {
    if (newTask.title?.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority as "low" | "medium" | "high",
        dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
        tags: newTask.tags || [],
        completed: false,
      };
      
      const updatedTasks = [task, ...tasks];
      saveTasks(updatedTasks);
      
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        tags: [],
      });
      setIsDialogOpen(false);
    }
  };

  const addTagToNewTask = () => {
    if (newTaskTag.trim() && !newTask.tags?.includes(newTaskTag)) {
      setNewTask({
        ...newTask,
        tags: [...(newTask.tags || []), newTaskTag],
      });
      setNewTaskTag("");
    }
  };

  const removeTagFromNewTask = (tag: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags?.filter(t => t !== tag),
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/80";
      case "medium": return "bg-amber-500/80";
      case "low": return "bg-green-500/80";
      default: return "bg-slate-500/80";
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setNewTask({
        ...newTask,
        dueDate: date.toISOString().split("T")[0]
      });
    }
    setIsCalendarOpen(false);
  };

  const filterTasksByDate = (date: Date | undefined) => {
    if (!date) return tasks;
    
    const filteredDate = date.toISOString().split("T")[0];
    return tasks.filter(task => task.dueDate === filteredDate);
  };
  
  // Filter tasks based on the selected date in the calendar
  const filteredTasks = selectedDate ? filterTasksByDate(selectedDate) : tasks;

  const TaskItem = ({ task }: { task: Task }) => {
    const isPastDue = new Date(task.dueDate) < new Date() && !task.completed;
    
    return (
      <Card className={`mb-3 ${task.completed ? "opacity-70" : ""} ${isPastDue ? "border-red-300 dark:border-red-800" : ""}`}>
        <CardContent className={`p-4 ${viewMode === "compact" ? "py-2" : ""}`}>
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full mt-0.5 ${task.completed ? "text-green-500" : ""}`}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <CircleCheck className="h-5 w-5" />}
            </Button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-medium truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
                <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                  {task.priority}
                </Badge>
                {isPastDue && (
                  <Badge variant="outline" className="bg-red-500 text-white text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              
              {viewMode === "detailed" && task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                
                {task.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Organize and manage your daily tasks</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" onClick={() => setViewMode(viewMode === "detailed" ? "compact" : "detailed")}>
            {viewMode === "detailed" ? "Compact View" : "Detailed View"}
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description (Optional)</Label>
                  <Input
                    id="task-description"
                    placeholder="Enter task description"
                    value={newTask.description || ""}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value as "low" | "medium" | "high" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="task-date">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newTask.dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.dueDate ? format(new Date(newTask.dueDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                          onSelect={(date) => 
                            setNewTask({ 
                              ...newTask, 
                              dueDate: date ? date.toISOString().split("T")[0] : undefined 
                            })
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTaskTag}
                      onChange={(e) => setNewTaskTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTagToNewTask();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addTagToNewTask}>
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newTask.tags?.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTagFromNewTask(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addTask} disabled={!newTask.title?.trim()}>
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {selectedDate && (
        <div className="mb-4">
          <h2 className="text-xl font-medium mb-2">
            Tasks for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
          ) : (
            <Card>
              <CardHeader className="text-center py-6">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <CardTitle>No tasks for this date</CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>
      )}
      
      {!selectedDate && (
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="today" className="flex items-center">
              <CheckSquare className="h-4 w-4 mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-0">
            {todayTasks.length > 0 ? (
              todayTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <Card>
                <CardHeader className="text-center py-6">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <CardTitle>No tasks for today</CardTitle>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <Card>
                <CardHeader className="text-center py-6">
                  <CardTitle>No upcoming tasks</CardTitle>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <Card>
                <CardHeader className="text-center py-6">
                  <CardTitle>No completed tasks</CardTitle>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            {tasks.map(task => <TaskItem key={task.id} task={task} />)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default TasksPage;
