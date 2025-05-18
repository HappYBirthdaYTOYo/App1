
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, Save, Trash, Pin, PinOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WritingItem {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export function WritingPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writings, setWritings] = useState<WritingItem[]>(() => {
    const savedWritings = localStorage.getItem("writings");
    return savedWritings ? JSON.parse(savedWritings) : [];
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your writing",
        variant: "destructive",
      });
      return;
    }
    
    const newWriting: WritingItem = {
      id: Date.now().toString(),
      title,
      content,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedWritings = [newWriting, ...writings];
    setWritings(updatedWritings);
    localStorage.setItem("writings", JSON.stringify(updatedWritings));
    
    setTitle("");
    setContent("");
    
    toast({
      title: "Writing saved",
      description: "Your writing has been saved successfully",
    });
  };

  const togglePin = (id: string) => {
    const updatedWritings = writings.map(writing => 
      writing.id === id ? { ...writing, pinned: !writing.pinned } : writing
    );
    
    setWritings(updatedWritings);
    localStorage.setItem("writings", JSON.stringify(updatedWritings));
  };

  const deleteWriting = (id: string) => {
    const updatedWritings = writings.filter(writing => writing.id !== id);
    setWritings(updatedWritings);
    localStorage.setItem("writings", JSON.stringify(updatedWritings));
    
    toast({
      title: "Writing deleted",
      description: "Your writing has been deleted",
    });
  };

  const pinnedWritings = writings.filter(writing => writing.pinned);
  const unpinnedWritings = writings.filter(writing => !writing.pinned);
  const sortedWritings = [...pinnedWritings, ...unpinnedWritings];

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Creative Writing</h1>
          <p className="text-muted-foreground">Unleash your creativity with writing</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <PenTool className="h-5 w-5" /> New Writing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mb-2"
              />
              <Textarea 
                placeholder="Start writing..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2 space-y-4">
          {sortedWritings.length > 0 ? (
            sortedWritings.map(writing => (
              <Card key={writing.id} className={`${writing.pinned ? "border-primary" : ""}`}>
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <CardTitle className="text-lg">{writing.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => togglePin(writing.id)}
                    >
                      {writing.pinned ? 
                        <PinOff className="h-4 w-4" /> : 
                        <Pin className="h-4 w-4" />
                      }
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteWriting(writing.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(writing.createdAt).toLocaleDateString()}
                  </p>
                  <p className="whitespace-pre-wrap">{writing.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>No writings yet. Create your first piece!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default WritingPage;
