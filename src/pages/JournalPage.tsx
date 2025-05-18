
import { useState } from "react";
import { 
  Plus, Calendar, Download, Lock, ChevronLeft, ChevronRight,
  Smile, Meh, Frown, ThumbsUp, ThumbsDown, Quote, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: "great" | "good" | "neutral" | "bad" | "terrible";
  isPrivate: boolean;
  quote?: string;
}

const demoEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date("2025-05-17"),
    content: "Today was incredibly productive! Finished the new project proposal ahead of schedule and received positive feedback from the team. Had lunch with Alex, and we discussed potential collaboration opportunities. In the evening, I started reading that book on productivity I've been meaning to get to. Overall, feeling energized and motivated.",
    mood: "great",
    isPrivate: false,
    quote: "The secret of getting ahead is getting started.",
  },
  {
    id: "2",
    date: new Date("2025-05-16"),
    content: "Struggled with focus today. Had a hard time getting through my to-do list, but managed to complete the most critical tasks. The team meeting went well, though I felt I could have contributed more. Need to work on better sleep habits - going to bed earlier tonight.",
    mood: "neutral",
    isPrivate: false,
  },
  {
    id: "3",
    date: new Date("2025-05-15"),
    content: "Had a disagreement with Jamie at work that put me in a bad mood for most of the day. Tried to shake it off by going for a run after work, which helped somewhat. Need to follow up tomorrow and clear the air. Made comfort food for dinner and watched a favorite movie to improve my mood.",
    mood: "bad",
    isPrivate: true,
  },
  {
    id: "4",
    date: new Date("2025-05-14"),
    content: "Great progress on the side project today! The new feature is coming together nicely. Spent the evening with family and had a delicious dinner. Finding a good balance between work and personal life this week.",
    mood: "good",
    isPrivate: false,
    quote: "Small progress is still progress.",
  },
];

const moodOptions = [
  { value: "great", label: "Great", icon: <Smile className="h-5 w-5 text-green-500" /> },
  { value: "good", label: "Good", icon: <ThumbsUp className="h-5 w-5 text-emerald-500" /> },
  { value: "neutral", label: "Neutral", icon: <Meh className="h-5 w-5 text-amber-500" /> },
  { value: "bad", label: "Bad", icon: <ThumbsDown className="h-5 w-5 text-orange-500" /> },
  { value: "terrible", label: "Terrible", icon: <Frown className="h-5 w-5 text-red-500" /> },
];

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(demoEntries);
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    content: "",
    mood: "neutral",
    isPrivate: false,
    quote: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Filter entries for the current month/year or selected date
  const getFilteredEntries = () => {
    if (selectedDate) {
      return entries.filter(
        entry => entry.date.toDateString() === selectedDate.toDateString()
      );
    }
    
    return entries.filter(
      entry => 
        entry.date.getMonth() === currentViewDate.getMonth() &&
        entry.date.getFullYear() === currentViewDate.getFullYear()
    );
  };

  const filteredEntries = getFilteredEntries();
  
  const addEntry = () => {
    if (newEntry.content) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date(),
        content: newEntry.content,
        mood: newEntry.mood as "great" | "good" | "neutral" | "bad" | "terrible",
        isPrivate: newEntry.isPrivate || false,
        quote: newEntry.quote,
      };
      
      setEntries([entry, ...entries]);
      setNewEntry({
        content: "",
        mood: "neutral",
        isPrivate: false,
        quote: "",
      });
      setIsDialogOpen(false);
    }
  };
  
  const previousMonth = () => {
    const date = new Date(currentViewDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentViewDate(date);
    setSelectedDate(null);
  };
  
  const nextMonth = () => {
    const date = new Date(currentViewDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentViewDate(date);
    setSelectedDate(null);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  
  const getMoodIcon = (mood: string) => {
    const option = moodOptions.find(opt => opt.value === mood);
    return option ? option.icon : null;
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const EntryCard = ({ entry }: { entry: JournalEntry }) => {
    return (
      <Card className={cn(
        "mb-6 overflow-hidden animate-hover",
        entry.isPrivate ? "border-amber-200 dark:border-amber-800" : ""
      )}>
        <div className="bg-muted/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-background rounded-full p-1.5">
              {getMoodIcon(entry.mood)}
            </div>
            <div>
              <h3 className="font-medium">
                {formatDate(entry.date)}
                {isToday(entry.date) && <Badge className="ml-2 bg-primary">Today</Badge>}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {entry.isPrivate && (
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-5">
          <div className="whitespace-pre-line">
            {entry.content}
          </div>
          
          {entry.quote && (
            <div className="mt-4 border-l-4 border-primary/30 pl-4 py-2 italic text-muted-foreground">
              "{entry.quote}"
            </div>
          )}
        </CardContent>
        
        <div className="border-t flex items-center justify-end gap-2 px-4 py-2">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </Card>
    );
  };
  
  const CalendarView = () => {
    const monthDate = new Date(currentViewDate);
    const month = monthDate.toLocaleString("default", { month: "long" });
    const year = monthDate.getFullYear();
    
    // Get entries grouped by day for the current month
    const entriesByDay: Record<number, JournalEntry[]> = {};
    entries.forEach(entry => {
      if (
        entry.date.getMonth() === monthDate.getMonth() &&
        entry.date.getFullYear() === monthDate.getFullYear()
      ) {
        const day = entry.date.getDate();
        if (!entriesByDay[day]) {
          entriesByDay[day] = [];
        }
        entriesByDay[day].push(entry);
      }
    });
    
    // Create calendar days
    const days = [];
    const daysInMonth = new Date(year, monthDate.getMonth() + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEntries = !!entriesByDay[day];
      const date = new Date(year, monthDate.getMonth(), day);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push(
        <Button
          key={`day-${day}`}
          variant={isSelected ? "default" : "outline"}
          className={cn(
            "h-14 w-full relative",
            isToday(date) && !isSelected && "border-primary text-primary",
            hasEntries && !isSelected && "bg-primary/10"
          )}
          onClick={() => setSelectedDate(date)}
        >
          <span>{day}</span>
          {hasEntries && (
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <span className={`block h-1.5 w-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"}`}></span>
            </span>
          )}
        </Button>
      );
    }
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl">
            {month} {year}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs text-muted-foreground font-medium py-1"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {/* Offset for first day of month */}
          {Array(new Date(year, monthDate.getMonth(), 1).getDay())
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
          
          {/* Calendar days */}
          {days}
        </div>
        
        {selectedDate && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Entries for {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(null)}>
                Show All
              </Button>
            </div>
            
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No entries for this date
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Journal</h1>
          <p className="text-muted-foreground">Record your daily experiences</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Journal Entry</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label className="mb-2 block">How are you feeling today?</Label>
                  <RadioGroup
                    value={newEntry.mood}
                    onValueChange={(value) => setNewEntry({ ...newEntry, mood: value as any })}
                    className="flex gap-4"
                  >
                    {moodOptions.map((option) => (
                      <div key={option.value} className="flex flex-col items-center gap-1">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.value}
                          className="flex flex-col items-center gap-1 rounded-lg border border-muted p-3 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer"
                        >
                          {option.icon}
                          <span className="text-xs font-normal">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="entry-content">Entry</Label>
                  <Textarea
                    id="entry-content"
                    placeholder="What's on your mind today?"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    className="min-h-[200px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="entry-quote" className="flex items-center gap-2">
                    <Quote className="h-4 w-4" />
                    Quote (Optional)
                  </Label>
                  <Input
                    id="entry-quote"
                    placeholder="Add an inspiring quote or thought"
                    value={newEntry.quote || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, quote: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-private"
                    checked={newEntry.isPrivate}
                    onChange={(e) => setNewEntry({ ...newEntry, isPrivate: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="is-private" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" /> Mark as private
                  </Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addEntry} disabled={!newEntry.content?.trim()}>
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="entries" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="entries" className="flex items-center">
            <Meh className="h-4 w-4 mr-2" />
            Recent Entries
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="entries" className="mt-0">
          <div className="space-y-2">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No journal entries yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first entry
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default JournalPage;
