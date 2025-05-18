
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Clock, Plus, Pencil, Trash2, MoreHorizontal, Lock, 
  Calendar as CalendarIcon, AlertCircle, Mail, Eye 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isAfter, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeCapsule {
  id: string;
  title: string;
  message: string;
  deliveryDate: string;
  category: string;
  locked: boolean;
  opened: boolean;
  dateCreated: string;
  dateOpened?: string;
}

export function TimeCapsulePage() {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [newCapsule, setNewCapsule] = useState<Partial<TimeCapsule>>({
    title: "",
    message: "",
    deliveryDate: new Date().toISOString(),
    category: "future-self",
    locked: true,
    opened: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"all" | "unopened" | "opened" | "delivered">("all");
  const [viewCapsule, setViewCapsule] = useState<TimeCapsule | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Load capsules from localStorage
  useEffect(() => {
    const savedCapsules = localStorage.getItem("timeCapsules");
    if (savedCapsules) {
      try {
        setCapsules(JSON.parse(savedCapsules));
      } catch (e) {
        console.error("Error loading time capsules:", e);
      }
    }
  }, []);
  
  // Save capsules to localStorage whenever they change
  const saveCapsules = (updatedCapsules: TimeCapsule[]) => {
    localStorage.setItem("timeCapsules", JSON.stringify(updatedCapsules));
    setCapsules(updatedCapsules);
  };
  
  const handleAddCapsule = () => {
    if (!newCapsule.title?.trim() || !newCapsule.message?.trim() || !selectedDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const capsule: TimeCapsule = {
      id: isEditMode ? (newCapsule.id as string) : Date.now().toString(),
      title: newCapsule.title || "",
      message: newCapsule.message || "",
      deliveryDate: selectedDate.toISOString(),
      category: newCapsule.category || "future-self",
      locked: newCapsule.locked ?? true,
      opened: newCapsule.opened || false,
      dateCreated: isEditMode ? (newCapsule.dateCreated as string) : new Date().toISOString(),
      dateOpened: newCapsule.dateOpened,
    };
    
    let updatedCapsules: TimeCapsule[];
    
    if (isEditMode) {
      updatedCapsules = capsules.map(c => 
        c.id === capsule.id ? capsule : c
      );
      toast({
        title: "Time Capsule Updated",
        description: "Your time capsule has been updated",
      });
    } else {
      updatedCapsules = [capsule, ...capsules];
      toast({
        title: "Time Capsule Created",
        description: `Your message will be available on ${format(parseISO(capsule.deliveryDate), "PPP")}`,
      });
    }
    
    saveCapsules(updatedCapsules);
    resetForm();
  };
  
  const handleOpenCapsule = (capsule: TimeCapsule) => {
    if (capsule.locked && !isDeliveryDateReached(capsule)) {
      toast({
        title: "Cannot Open Yet",
        description: `This time capsule will be available on ${format(parseISO(capsule.deliveryDate), "PPP")}`,
        variant: "destructive",
      });
      return;
    }
    
    const updatedCapsule = {
      ...capsule,
      opened: true,
      locked: false,
      dateOpened: new Date().toISOString(),
    };
    
    const updatedCapsules = capsules.map(c => 
      c.id === capsule.id ? updatedCapsule : c
    );
    
    saveCapsules(updatedCapsules);
    setViewCapsule(updatedCapsule);
    setIsViewDialogOpen(true);
  };
  
  const handleEditCapsule = (capsule: TimeCapsule) => {
    setNewCapsule({ ...capsule });
    setSelectedDate(parseISO(capsule.deliveryDate));
    setIsEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteCapsule = (id: string) => {
    const updatedCapsules = capsules.filter(capsule => capsule.id !== id);
    saveCapsules(updatedCapsules);
    toast({
      title: "Time Capsule Deleted",
      description: "The time capsule has been removed",
    });
  };
  
  const resetForm = () => {
    setNewCapsule({
      title: "",
      message: "",
      deliveryDate: new Date().toISOString(),
      category: "future-self",
      locked: true,
      opened: false,
    });
    setSelectedDate(new Date());
    setIsEditMode(false);
    setIsDialogOpen(false);
  };
  
  const isDeliveryDateReached = (capsule: TimeCapsule) => {
    const now = new Date();
    const deliveryDate = parseISO(capsule.deliveryDate);
    return !isAfter(deliveryDate, now);
  };
  
  // Filter capsules based on view mode
  const filteredCapsules = capsules.filter(capsule => {
    if (viewMode === "unopened") return !capsule.opened;
    if (viewMode === "opened") return capsule.opened;
    if (viewMode === "delivered") return isDeliveryDateReached(capsule);
    return true;
  });
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "future-self": return "To Future Self";
      case "goals": return "Goals & Aspirations";
      case "reflection": return "Reflection";
      case "gratitude": return "Gratitude";
      case "memories": return "Memories";
      case "celebration": return "Celebration";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Time Capsule</h1>
          <p className="text-muted-foreground">Send messages to your future self</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Capsule
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Time Capsule" : "Create New Time Capsule"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="capsule-title">Title</Label>
                <Input
                  id="capsule-title"
                  placeholder="Give your time capsule a title"
                  value={newCapsule.title || ""}
                  onChange={(e) => setNewCapsule({ ...newCapsule, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capsule-message">Message</Label>
                <Textarea
                  id="capsule-message"
                  placeholder="Write your message to the future"
                  value={newCapsule.message || ""}
                  onChange={(e) => setNewCapsule({ ...newCapsule, message: e.target.value })}
                  rows={5}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capsule-category">Category</Label>
                  <Select
                    value={newCapsule.category}
                    onValueChange={(value) => setNewCapsule({ ...newCapsule, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="future-self">To Future Self</SelectItem>
                      <SelectItem value="goals">Goals & Aspirations</SelectItem>
                      <SelectItem value="reflection">Reflection</SelectItem>
                      <SelectItem value="gratitude">Gratitude</SelectItem>
                      <SelectItem value="memories">Memories</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Delivery Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="capsule-locked"
                  checked={newCapsule.locked}
                  onChange={(e) => setNewCapsule({ ...newCapsule, locked: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="capsule-locked">Lock until delivery date</Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCapsule} 
                disabled={!newCapsule.title?.trim() || !newCapsule.message?.trim() || !selectedDate}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          {viewCapsule && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-xl">{viewCapsule.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {getCategoryLabel(viewCapsule.category)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Created: {format(parseISO(viewCapsule.dateCreated), "PPP")}
                  </Badge>
                  {viewCapsule.dateOpened && (
                    <Badge variant="secondary" className="text-xs">
                      Opened: {format(parseISO(viewCapsule.dateOpened), "PPP")}
                    </Badge>
                  )}
                </div>
                
                <div className="border p-4 rounded-md bg-muted/10 whitespace-pre-wrap">
                  {viewCapsule.message}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={viewMode === "all" ? "default" : "outline"}
          onClick={() => setViewMode("all")}
        >
          All Capsules
        </Button>
        <Button
          variant={viewMode === "unopened" ? "default" : "outline"}
          onClick={() => setViewMode("unopened")}
        >
          Unopened
        </Button>
        <Button
          variant={viewMode === "opened" ? "default" : "outline"}
          onClick={() => setViewMode("opened")}
        >
          Opened
        </Button>
        <Button
          variant={viewMode === "delivered" ? "default" : "outline"}
          onClick={() => setViewMode("delivered")}
        >
          Delivered
        </Button>
      </div>
      
      {filteredCapsules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCapsules.map(capsule => {
            const isDelivered = isDeliveryDateReached(capsule);
            
            return (
              <Card key={capsule.id} className={`overflow-hidden ${capsule.opened ? "bg-muted/30" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                      {getCategoryLabel(capsule.category)}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(capsule.opened || !capsule.locked || isDelivered) && (
                          <DropdownMenuItem onClick={() => handleOpenCapsule(capsule)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEditCapsule(capsule)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCapsule(capsule.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <CardTitle className="text-lg truncate">{capsule.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Created {format(parseISO(capsule.dateCreated), "PP")}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Delivery {format(parseISO(capsule.deliveryDate), "PP")}</span>
                  </div>
                  
                  <div className="mt-3 line-clamp-2 text-muted-foreground text-sm">
                    {capsule.opened ? 
                      capsule.message : 
                      "This message is sealed until the delivery date."
                    }
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    variant={capsule.opened ? "outline" : "default"}
                    className="w-full"
                    onClick={() => handleOpenCapsule(capsule)}
                    disabled={capsule.locked && !isDelivered}
                  >
                    {capsule.locked && !isDelivered ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {isDelivered ? "Unlock" : "Locked"}
                      </>
                    ) : capsule.opened ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        View Again
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Open Now
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center p-6">
            <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>No Time Capsules Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-muted-foreground mb-4">
              Create a message to send to your future self or document memories for later.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Create Your First Time Capsule</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TimeCapsulePage;
