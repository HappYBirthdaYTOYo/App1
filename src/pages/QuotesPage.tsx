
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Quote, Plus, Pencil, Trash2, MoreHorizontal, 
  Search, Filter, Heart, Copy, Share
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Quote {
  id: string;
  content: string;
  author: string;
  source?: string;
  category: string;
  tags: string[];
  favorite: boolean;
  dateAdded: string;
}

export function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState<Partial<Quote>>({
    content: "",
    author: "",
    source: "",
    category: "motivation",
    tags: [],
    favorite: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [favoriteFilter, setFavoriteFilter] = useState<boolean>(false);
  const [newTag, setNewTag] = useState("");
  
  // Load quotes from localStorage
  useEffect(() => {
    const savedQuotes = localStorage.getItem("quotes");
    if (savedQuotes) {
      try {
        setQuotes(JSON.parse(savedQuotes));
      } catch (e) {
        console.error("Error loading quotes:", e);
      }
    }
  }, []);
  
  // Save quotes to localStorage whenever they change
  const saveQuotes = (updatedQuotes: Quote[]) => {
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
    setQuotes(updatedQuotes);
  };
  
  const handleAddQuote = () => {
    if (!newQuote.content?.trim() || !newQuote.author?.trim()) {
      toast({
        title: "Error",
        description: "Please enter both quote content and author",
        variant: "destructive",
      });
      return;
    }
    
    const quote: Quote = {
      id: isEditMode ? (newQuote.id as string) : Date.now().toString(),
      content: newQuote.content || "",
      author: newQuote.author || "",
      source: newQuote.source,
      category: newQuote.category || "motivation",
      tags: newQuote.tags || [],
      favorite: newQuote.favorite || false,
      dateAdded: isEditMode ? (newQuote.dateAdded as string) : new Date().toISOString(),
    };
    
    let updatedQuotes: Quote[];
    
    if (isEditMode) {
      updatedQuotes = quotes.map(q => 
        q.id === quote.id ? quote : q
      );
      toast({
        title: "Quote Updated",
        description: "Your quote has been updated",
      });
    } else {
      updatedQuotes = [quote, ...quotes];
      toast({
        title: "Quote Added",
        description: "New quote added to your collection",
      });
    }
    
    saveQuotes(updatedQuotes);
    resetForm();
  };
  
  const handleToggleFavorite = (id: string) => {
    const updatedQuotes = quotes.map(quote => {
      if (quote.id === id) {
        return { ...quote, favorite: !quote.favorite };
      }
      return quote;
    });
    
    saveQuotes(updatedQuotes);
  };
  
  const handleEditQuote = (quote: Quote) => {
    setNewQuote({ ...quote });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleDeleteQuote = (id: string) => {
    const updatedQuotes = quotes.filter(quote => quote.id !== id);
    saveQuotes(updatedQuotes);
    toast({
      title: "Quote Deleted",
      description: "The quote has been removed from your collection",
    });
  };
  
  const resetForm = () => {
    setNewQuote({
      content: "",
      author: "",
      source: "",
      category: "motivation",
      tags: [],
      favorite: false,
    });
    setIsEditMode(false);
    setIsDialogOpen(false);
  };
  
  const addTagToQuote = () => {
    if (newTag.trim() && !newQuote.tags?.includes(newTag)) {
      setNewQuote({
        ...newQuote,
        tags: [...(newQuote.tags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };
  
  const removeTagFromQuote = (tag: string) => {
    setNewQuote({
      ...newQuote,
      tags: newQuote.tags?.filter(t => t !== tag),
    });
  };
  
  const handleCopyQuote = (quote: Quote) => {
    const textToCopy = `"${quote.content}" — ${quote.author}`;
    navigator.clipboard.writeText(textToCopy);
    toast({ title: "Quote copied to clipboard" });
  };
  
  // Filter quotes based on search term, category, and favorite status
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = searchTerm === "" || 
      quote.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || quote.category === categoryFilter;
    
    const matchesFavorite = !favoriteFilter || quote.favorite;
    
    return matchesSearch && matchesCategory && matchesFavorite;
  });
  
  // Get unique categories for dropdown
  const categories = ["all", ...Array.from(new Set(quotes.map(quote => quote.category)))];
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "motivation": return "Motivation";
      case "inspiration": return "Inspiration";
      case "personal": return "Personal Growth";
      case "success": return "Success";
      case "philosophy": return "Philosophy";
      case "wisdom": return "Wisdom";
      case "life": return "Life";
      case "love": return "Love";
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quotes Collection</h1>
          <p className="text-muted-foreground">Save and organize inspiring quotes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Quote
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Quote" : "Add New Quote"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quote-content">Quote</Label>
                <Textarea
                  id="quote-content"
                  placeholder="Enter the quote"
                  value={newQuote.content || ""}
                  onChange={(e) => setNewQuote({ ...newQuote, content: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quote-author">Author</Label>
                <Input
                  id="quote-author"
                  placeholder="Who said or wrote this quote"
                  value={newQuote.author || ""}
                  onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quote-source">Source (Optional)</Label>
                <Input
                  id="quote-source"
                  placeholder="Book, speech, article, etc."
                  value={newQuote.source || ""}
                  onChange={(e) => setNewQuote({ ...newQuote, source: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quote-category">Category</Label>
                <select
                  id="quote-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newQuote.category}
                  onChange={(e) => setNewQuote({ ...newQuote, category: e.target.value })}
                >
                  <option value="motivation">Motivation</option>
                  <option value="inspiration">Inspiration</option>
                  <option value="personal">Personal Growth</option>
                  <option value="success">Success</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="wisdom">Wisdom</option>
                  <option value="life">Life</option>
                  <option value="love">Love</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTagToQuote();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTagToQuote}>
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {newQuote.tags?.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTagFromQuote(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="quote-favorite"
                  checked={newQuote.favorite}
                  onChange={(e) => setNewQuote({ ...newQuote, favorite: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="quote-favorite">Mark as favorite</Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddQuote} 
                disabled={!newQuote.content?.trim() || !newQuote.author?.trim()}
              >
                {isEditMode ? "Update" : "Add"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes, authors, or tags..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories
            .filter(cat => cat !== "all")
            .sort()
            .map(category => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
        </select>
        
        <Button
          variant={favoriteFilter ? "default" : "outline"}
          onClick={() => setFavoriteFilter(!favoriteFilter)}
          className={favoriteFilter ? "bg-red-500 hover:bg-red-600" : ""}
        >
          <Heart className={cn("h-4 w-4 mr-2", favoriteFilter ? "fill-current" : "")} />
          Favorites
        </Button>
      </div>
      
      {filteredQuotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuotes.map(quote => (
            <Card key={quote.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">
                    {getCategoryLabel(quote.category)}
                  </Badge>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", quote.favorite ? "text-red-500" : "")}
                    onClick={() => handleToggleFavorite(quote.id)}
                  >
                    <Heart className={cn("h-4 w-4", quote.favorite ? "fill-current" : "")} />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCopyQuote(quote)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Quote
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteQuote(quote.id)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <blockquote className="italic text-lg border-l-4 pl-4 border-primary">
                    {quote.content}
                  </blockquote>
                  
                  <div className="mt-2 font-medium text-right">
                    — {quote.author}
                  </div>
                  
                  {quote.source && (
                    <div className="text-sm text-muted-foreground text-right mt-1">
                      {quote.source}
                    </div>
                  )}
                </div>
                
                {quote.tags && quote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {quote.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center p-6">
            <Quote className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Your Quote Collection is Empty</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-muted-foreground mb-4">
              Start saving your favorite quotes to inspire and motivate you.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Your First Quote</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default QuotesPage;
