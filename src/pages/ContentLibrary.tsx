import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookOpen, Filter, Search } from "lucide-react";
import AlphabetFilter from "@/components/AlphabetFilter";
import ContentCard from "@/components/ContentCard";
import { seedAdditionalContent } from "@/seeds/additionalContent";
import gsap from "gsap";

// Type for learning content
type LearningContent = {
  id: string;
  title: string;
  content: string;
  category: string;
  first_letter: string;
  created_at: string;
  updated_at: string;
};

const fetchContent = async () => {
  const { data, error } = await supabase
    .from('learning_content')
    .select('*')
    .order('title');
  
  if (error) {
    throw new Error(`Error fetching content: ${error.message}`);
  }
  
  return data as LearningContent[];
};

const ContentLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLetter, setSelectedLetter] = useState<string>("all");
  
  const { data: content, isLoading, error, refetch } = useQuery({
    queryKey: ['learningContent'],
    queryFn: fetchContent
  });

  // Seed additional content on first load
  useEffect(() => {
    const seedContent = async () => {
      await seedAdditionalContent();
      // Refetch content after seeding
      refetch();
    };
    
    seedContent();
  }, [refetch]);

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(".content-title", { 
      y: 20, 
      opacity: 0, 
      duration: 0.6,
      ease: "power3.out" 
    });
    
    tl.from(".content-description", { 
      y: 15, 
      opacity: 0, 
      duration: 0.5,
      ease: "power3.out" 
    }, "-=0.3");
    
    tl.from(".content-filters", { 
      y: 20, 
      opacity: 0, 
      duration: 0.5,
      ease: "power3.out" 
    }, "-=0.2");
    
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Failed to load content", {
        description: "There was an error loading the content library."
      });
    }
  }, [error]);

  // Extract unique categories
  const categories = content ? 
    ['all', ...new Set(content.map(item => item.category))] : 
    ['all'];
  
  // Filter content based on search, category, and letter
  const filteredContent = content?.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      item.category === selectedCategory;
    
    const matchesLetter = selectedLetter === "all" || 
      item.first_letter.toUpperCase() === selectedLetter.toUpperCase();
    
    return matchesSearch && matchesCategory && matchesLetter;
  });

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
  };

  const viewContentDetails = (contentId: string) => {
    navigate(`/content/${contentId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 content-title">Content Library</h1>
          <p className="text-slate-600 content-description">Browse our comprehensive collection of resources for startup founders</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 content-filters">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by title or content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Button */}
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLetter("all");
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Alphabet Filter */}
      <AlphabetFilter 
        selectedLetter={selectedLetter} 
        onLetterClick={handleLetterClick} 
      />

      {/* Content Display */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        ) : filteredContent && filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item, index) => (
              <ContentCard
                key={item.id}
                content={item}
                index={index}
                onClick={() => viewContentDetails(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No content found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;
