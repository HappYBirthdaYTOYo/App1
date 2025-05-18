
import { useState } from "react";
import { 
  Plus, Search, Pin, Palette, PinOff, Download, 
  MoreVertical, Trash2, Edit, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: Date;
  lastModified: Date;
}

const colorOptions = [
  { name: "Default", value: "bg-card" },
  { name: "Red", value: "bg-red-100 dark:bg-red-900/20" },
  { name: "Orange", value: "bg-orange-100 dark:bg-orange-900/20" },
  { name: "Yellow", value: "bg-yellow-100 dark:bg-yellow-900/20" },
  { name: "Green", value: "bg-green-100 dark:bg-green-900/20" },
  { name: "Blue", value: "bg-blue-100 dark:bg-blue-900/20" },
  { name: "Purple", value: "bg-purple-100 dark:bg-purple-900/20" },
  { name: "Pink", value: "bg-pink-100 dark:bg-pink-900/20" },
];

const demoNotes: Note[] = [
  {
    id: "1",
    title: "Project Ideas",
    content: "- Personal assistant app\n- Smart home dashboard\n- Recipe organizer\n- Travel planner",
    color: "bg-blue-100 dark:bg-blue-900/20",
    pinned: true,
    createdAt: new Date("2025-05-12"),
    lastModified: new Date("2025-05-15"),
  },
  {
    id: "2",
    title: "Shopping List",
    content: "- Milk\n- Eggs\n- Bread\n- Fruits\n- Vegetables",
    color: "bg-green-100 dark:bg-green-900/20",
    pinned: true,
    createdAt: new Date("2025-05-14"),
    lastModified: new Date("2025-05-14"),
  },
  {
    id: "3",
    title: "Meeting Notes",
    content: "Discussed project timeline and deliverables. Need to follow up with team about resources.",
    color: "bg-yellow-100 dark:bg-yellow-900/20",
    pinned: false,
    createdAt: new Date("2025-05-10"),
    lastModified: new Date("2025-05-10"),
  },
  {
    id: "4",
    title: "Books to Read",
    content: "1. Atomic Habits\n2. Deep Work\n3. The Psychology of Money\n4. Project Hail Mary",
    color: "bg-purple-100 dark:bg-purple-900/20",
    pinned: false,
    createdAt: new Date("2025-05-08"),
    lastModified: new Date("2025-05-13"),
  },
  {
    id: "5",
    title: "Workout Plan",
    content: "Monday: Upper body\nTuesday: Lower body\nWednesday: Cardio\nThursday: Rest\nFriday: Full body\nWeekend: Active recovery",
    color: "bg-red-100 dark:bg-red-900/20",
    pinned: false,
    createdAt: new Date("2025-05-05"),
    lastModified: new Date("2025-05-11"),
  },
];

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(demoNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: "",
    content: "",
    color: "bg-card",
    pinned: false,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

  const createNote = () => {
    if (newNote.title || newNote.content) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title || "Untitled",
        content: newNote.content || "",
        color: newNote.color || "bg-card",
        pinned: newNote.pinned || false,
        createdAt: new Date(),
        lastModified: new Date(),
      };
      
      setNotes([note, ...notes]);
      setNewNote({
        title: "",
        content: "",
        color: "bg-card",
        pinned: false,
      });
      setIsCreateDialogOpen(false);
    }
  };

  const updateNote = () => {
    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id ? { ...editingNote, lastModified: new Date() } : note
      ));
      setEditingNote(null);
      setIsEditDialogOpen(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePinned = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const NoteCard = ({ note }: { note: Note }) => {
    return (
      <Card className={`${note.color} animate-hover h-full flex flex-col`}>
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium truncate flex-1">{note.title}</h3>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => togglePinned(note.id)}
              >
                {note.pinned ? (
                  <Pin className="h-4 w-4 text-amber-500" />
                ) : (
                  <PinOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingNote(note);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => togglePinned(note.id)}>
                    {note.pinned ? (
                      <>
                        <PinOff className="h-4 w-4 mr-2" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="h-4 w-4 mr-2" />
                        Pin
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => deleteNote(note.id)} className="text-red-500">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="text-sm whitespace-pre-line line-clamp-6">
            {note.content}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground p-3 border-t">
          {formatDate(note.lastModified)}
        </div>
      </Card>
    );
  };

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Capture your thoughts quickly</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Title"
                  value={newNote.title || ""}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="text-lg font-medium border-none focus-visible:ring-0 px-0"
                />
                
                <Textarea
                  placeholder="Start typing..."
                  value={newNote.content || ""}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="min-h-[200px] resize-none border-none focus-visible:ring-0 px-0"
                />
              </div>
              
              <DialogFooter className="sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.value}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-full ${color.value} ${
                          newNote.color === color.value ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setNewNote({ ...newNote, color: color.value })}
                      />
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setNewNote({ ...newNote, pinned: !newNote.pinned })}
                  >
                    {newNote.pinned ? (
                      <>
                        <Pin className="h-3.5 w-3.5 text-amber-500" />
                        Pinned
                      </>
                    ) : (
                      <>
                        <PinOff className="h-3.5 w-3.5" />
                        Pin
                      </>
                    )}
                  </Button>
                </div>
                
                <Button onClick={createNote}>
                  Save Note
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>Edit Note</DialogTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Title"
                  value={editingNote?.title || ""}
                  onChange={(e) => setEditingNote(editingNote ? { ...editingNote, title: e.target.value } : null)}
                  className="text-lg font-medium border-none focus-visible:ring-0 px-0"
                />
                
                <Textarea
                  placeholder="Start typing..."
                  value={editingNote?.content || ""}
                  onChange={(e) => setEditingNote(editingNote ? { ...editingNote, content: e.target.value } : null)}
                  className="min-h-[200px] resize-none border-none focus-visible:ring-0 px-0"
                />
              </div>
              
              <DialogFooter className="sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {colorOptions.map((color) => (
                      <Button
                        key={color.value}
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-full ${color.value} ${
                          editingNote?.color === color.value ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setEditingNote(editingNote ? { ...editingNote, color: color.value } : null)}
                      />
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setEditingNote(editingNote ? { ...editingNote, pinned: !editingNote.pinned } : null)}
                  >
                    {editingNote?.pinned ? (
                      <>
                        <Pin className="h-3.5 w-3.5 text-amber-500" />
                        Pinned
                      </>
                    ) : (
                      <>
                        <PinOff className="h-3.5 w-3.5" />
                        Pin
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateNote}>
                    Update Note
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {pinnedNotes.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Pin className="h-4 w-4 text-amber-500" />
            <h2 className="font-semibold">Pinned Notes</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-semibold">All Notes</h2>
        <Badge variant="outline" className="ml-2">
          {unpinnedNotes.length}
        </Badge>
      </div>
      
      {unpinnedNotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {unpinnedNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notes match your search</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">You don't have any notes yet</p>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first note
            </Button>
          </div>
        )
      )}
    </div>
  );
}

export default NotesPage;
