
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, Plus, Check, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface BucketListItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  completed: boolean;
  dateAdded: string;
  dateCompleted?: string;
  priority: "low" | "medium" | "high";
}

export function BucketListPage() {
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<BucketListItem>>({
    title: "",
    description: "",
    category: "travel",
    priority: "medium",
    completed: false
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Load items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem("bucketList");
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Error loading bucket list items:", e);
      }
    }
  }, []);
  
  // Save items to localStorage whenever they change
  const saveItems = (updatedItems: BucketListItem[]) => {
    localStorage.setItem("bucketList", JSON.stringify(updatedItems));
    setItems(updatedItems);
  };
  
  const handleAddItem = () => {
    if (!newItem.title?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your bucket list item",
        variant: "destructive",
      });
      return;
    }
    
    const item: BucketListItem = {
      id: isEditMode ? (newItem.id as string) : Date.now().toString(),
      title: newItem.title || "",
      description: newItem.description,
      category: newItem.category || "travel",
      completed: newItem.completed || false,
      dateAdded: isEditMode ? (newItem.dateAdded as string) : new Date().toISOString(),
      dateCompleted: newItem.dateCompleted,
      priority: newItem.priority || "medium",
    };
    
    let updatedItems: BucketListItem[];
    
    if (isEditMode) {
      updatedItems = items.map(i => 
        i.id === item.id ? item : i
      );
      toast({
        title: "Item Updated",
        description: "Your bucket list item has been updated",
      });
    } else {
      updatedItems = [item, ...items];
      toast({
        title: "Item Added",
        description: "New item added to your bucket list",
      });
    }
    
    saveItems(updatedItems);
    resetForm();
  };
  
  const handleToggleComplete = (id: string) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const completed = !item.completed;
        return {
          ...item,
          completed,
          dateCompleted: completed ? new Date().toISOString() : undefined,
        };
      }
      return item;
    });
    
    saveItems(updatedItems);
  };
  
  const handleEditItem = (item: BucketListItem) => {
    setNewItem({ ...item });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
    toast({
      title: "Item Deleted",
      description: "The bucket list item has been removed",
    });
  };
  
  const resetForm = () => {
    setNewItem({
      title: "",
      description: "",
      category: "travel",
      priority: "medium",
      completed: false
    });
    setIsEditMode(false);
    setIsDialogOpen(false);
  };
  
  // Filter items based on completion status and category
  const filteredItems = items.filter(item => {
    if (filter === "completed" && !item.completed) return false;
    if (filter === "pending" && item.completed) return false;
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    return true;
  });
  
  // Get unique categories for dropdown
  const categories = ["all", ...Array.from(new Set(items.map(item => item.category)))];
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-amber-500";
      case "low": return "text-green-500";
      default: return "";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "travel": return "Travel";
      case "career": return "Career";
      case "personal": return "Personal";
      case "education": return "Education";
      case "adventure": return "Adventure";
      case "financial": return "Financial";
      case "relationships": return "Relationships";
      case "health": return "Health";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bucket List</h1>
          <p className="text-muted-foreground">Track your life goals and ambitions</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Bucket List Item" : "Add New Bucket List Item"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item-title">Title</Label>
                <Input
                  id="item-title"
                  placeholder="Enter a goal or dream"
                  value={newItem.title || ""}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-description">Description (Optional)</Label>
                <Textarea
                  id="item-description"
                  placeholder="Add more details about this goal"
                  value={newItem.description || ""}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-priority">Priority</Label>
                  <Select
                    value={newItem.priority}
                    onValueChange={(value) => setNewItem({ ...newItem, priority: value as "low" | "medium" | "high" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isEditMode && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="item-completed" 
                    checked={newItem.completed}
                    onCheckedChange={(checked) => {
                      setNewItem({ 
                        ...newItem, 
                        completed: !!checked,
                        dateCompleted: checked ? new Date().toISOString() : undefined
                      });
                    }} 
                  />
                  <Label htmlFor="item-completed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Completed
                  </Label>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleAddItem} disabled={!newItem.title?.trim()}>
                {isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as "all" | "completed" | "pending")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories
              .filter(cat => cat !== "all")
              .sort()
              .map(category => (
                <SelectItem key={category} value={category}>
                  {getCategoryLabel(category)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <Card key={item.id} className={item.completed ? "opacity-70" : ""}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`checkbox-${item.id}`} 
                      checked={item.completed}
                      onCheckedChange={() => handleToggleComplete(item.id)} 
                    />
                    <CardTitle className={`text-lg ${item.completed ? "line-through" : ""}`}>{item.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(item.category)}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} priority
                    </Badge>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditItem(item)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleComplete(item.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      {item.completed ? "Mark as Pending" : "Mark as Completed"}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              
              {item.description && (
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center p-6">
            <ListTodo className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Your Bucket List is Empty</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-muted-foreground mb-4">
              Start adding your dreams and aspirations to your bucket list.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Your First Goal</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BucketListPage;
