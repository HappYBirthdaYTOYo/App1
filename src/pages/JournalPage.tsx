
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Book, Plus, Pencil, Trash2, MoreHorizontal, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PasswordProtection from "@/components/PasswordProtection";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
}

export function JournalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    title: "",
    content: "",
    mood: "neutral"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error("Error loading journal entries:", e);
      }
    }
  }, []);
  
  // Save entries to localStorage whenever they change
  const saveEntries = (updatedEntries: JournalEntry[]) => {
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };
  
  const handleAddEntry = () => {
    if (!newEntry.title?.trim() || !newEntry.content?.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content for your entry",
        variant: "destructive",
      });
      return;
    }
    
    const entry: JournalEntry = {
      id: isEditMode ? (newEntry.id as string) : Date.now().toString(),
      title: newEntry.title || "",
      content: newEntry.content || "",
      date: isEditMode ? (newEntry.date as string) : new Date().toISOString(),
      mood: newEntry.mood
    };
    
    let updatedEntries: JournalEntry[];
    
    if (isEditMode) {
      updatedEntries = entries.map(e => 
        e.id === entry.id ? entry : e
      );
      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated",
      });
    } else {
      updatedEntries = [entry, ...entries];
      toast({
        title: "Entry Added",
        description: "New journal entry has been created",
      });
    }
    
    saveEntries(updatedEntries);
    resetForm();
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setNewEntry({ ...entry });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveEntries(updatedEntries);
    toast({
      title: "Entry Deleted",
      description: "The journal entry has been removed",
    });
  };
  
  const resetForm = () => {
    setNewEntry({
      title: "",
      content: "",
      mood: "neutral"
    });
    setIsEditMode(false);
    setIsDialogOpen(false);
  };

  // Always require password on page load
  return (
    <>
      {!isAuthenticated ? (
        <PasswordProtection 
          pageName="journal" 
          returnPath="/"
          onAuthenticated={() => setIsAuthenticated(true)} 
        />
      ) : (
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Journal</h1>
              <p className="text-muted-foreground">Document your thoughts and experiences</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{isEditMode ? "Edit Journal Entry" : "Create New Journal Entry"}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="entry-title">Title</Label>
                    <Input
                      id="entry-title"
                      placeholder="Enter a title for your entry"
                      value={newEntry.title || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entry-content">Content</Label>
                    <Textarea
                      id="entry-content"
                      placeholder="Write your thoughts..."
                      value={newEntry.content || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      rows={8}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="entry-mood">Mood (Optional)</Label>
                    <select
                      id="entry-mood"
                      value={newEntry.mood || "neutral"}
                      onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="happy">Happy</option>
                      <option value="excited">Excited</option>
                      <option value="grateful">Grateful</option>
                      <option value="calm">Calm</option>
                      <option value="neutral">Neutral</option>
                      <option value="tired">Tired</option>
                      <option value="sad">Sad</option>
                      <option value="anxious">Anxious</option>
                      <option value="frustrated">Frustrated</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddEntry} 
                    disabled={!newEntry.title?.trim() || !newEntry.content?.trim()}
                  >
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {entries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entries.map(entry => (
                <Card key={entry.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditEntry(entry)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(parseISO(entry.date), "PPP")}</span>
                      {entry.mood && entry.mood !== "neutral" && (
                        <span className="ml-2">• {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 whitespace-pre-wrap">
                    <p>{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader className="text-center p-6">
                <Book className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Your Journal is Empty</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <p className="text-muted-foreground mb-4">
                  Start documenting your thoughts and experiences.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>Create Your First Entry</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

export default JournalPage;
