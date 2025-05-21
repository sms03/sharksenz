
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, Bookmark, CheckCircle, Save } from "lucide-react";
import gsap from "gsap";

type LearningContent = {
  id: string;
  title: string;
  content: string;
  category: string;
  first_letter: string;
  created_at: string;
  updated_at: string;
};

type UserProgress = {
  id: string;
  content_id: string;
  user_id: string;
  is_completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const ContentDetail = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProgressId, setUserProgressId] = useState<string | null>(null);
  
  // Refs for GSAP animations
  const contentRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  
  // Fetch content details
  const { data: content, isLoading: contentLoading, error: contentError } = useQuery({
    queryKey: ['contentDetail', contentId],
    queryFn: async () => {
      if (!contentId) throw new Error("Content ID is required");
      
      const { data, error } = await supabase
        .from('learning_content')
        .select('*')
        .eq('id', contentId)
        .single();
      
      if (error) throw error;
      return data as LearningContent;
    },
    enabled: !!contentId
  });

  // Check auth status and fetch user progress
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session && contentId) {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('content_id', contentId)
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching user progress:", error);
          return;
        }
        
        if (data) {
          setUserProgressId(data.id);
          setNotes(data.notes || "");
          setIsCompleted(data.is_completed || false);
        }
      }
    };
    
    checkAuth();
  }, [contentId]);

  // GSAP animations
  useEffect(() => {
    if (!contentLoading && content) {
      const tl = gsap.timeline();
      
      // Main content animations
      tl.from(".detail-back-button", { 
        x: -20, 
        opacity: 0, 
        duration: 0.4,
        ease: "power3.out" 
      });
      
      tl.from(".detail-title", { 
        y: 20, 
        opacity: 0, 
        duration: 0.5,
        ease: "power3.out" 
      }, "-=0.2");
      
      tl.from(".detail-meta", { 
        y: 10, 
        opacity: 0, 
        duration: 0.4,
        ease: "power3.out" 
      }, "-=0.3");
      
      tl.from(".detail-complete-button", { 
        scale: 0.9, 
        opacity: 0, 
        duration: 0.4,
        ease: "back.out" 
      }, "-=0.2");
      
      // Content body animation with staggered paragraphs
      const contentElement = contentRef.current;
      if (contentElement) {
        tl.from(contentElement.querySelectorAll("p"), { 
          y: 15, 
          opacity: 0, 
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out" 
        }, "-=0.2");
      }
      
      // Notes sidebar animation
      tl.from(notesRef.current, { 
        x: 30, 
        opacity: 0, 
        duration: 0.5,
        ease: "power3.out" 
      }, "-=0.5");
    }
  }, [contentLoading, content]);

  const handleSaveNotes = async () => {
    if (!isLoggedIn) {
      toast.error("You need to sign in to save notes", {
        description: "Please sign in or create an account to track your progress."
      });
      navigate("/auth");
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      if (userProgressId) {
        // Update existing progress
        const { error } = await supabase
          .from('user_progress')
          .update({ notes, updated_at: new Date().toISOString() })
          .eq('id', userProgressId);
          
        if (error) throw error;
      } else {
        // Create new progress
        const { error, data } = await supabase
          .from('user_progress')
          .insert({
            content_id: contentId,
            user_id: session.user.id,
            notes,
            is_completed: false
          })
          .select();
          
        if (error) throw error;
        if (data && data[0]) {
          setUserProgressId(data[0].id);
        }
      }
      
      // Animate the save button
      const saveButton = document.querySelector(".notes-save-button");
      if (saveButton) {
        gsap.fromTo(saveButton, 
          { scale: 0.95 }, 
          { scale: 1, duration: 0.3, ease: "back.out" }
        );
      }
      
      toast.success("Notes saved successfully", {
        description: "Your notes have been saved."
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes", {
        description: "There was an error saving your notes. Please try again."
      });
    }
  };

  const handleToggleCompletion = async () => {
    if (!isLoggedIn) {
      toast.error("You need to sign in to mark content as complete", {
        description: "Please sign in or create an account to track your progress."
      });
      navigate("/auth");
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const newIsCompleted = !isCompleted;
      setIsCompleted(newIsCompleted);
      
      if (userProgressId) {
        // Update existing progress
        const { error } = await supabase
          .from('user_progress')
          .update({ 
            is_completed: newIsCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('id', userProgressId);
          
        if (error) throw error;
      } else {
        // Create new progress
        const { error, data } = await supabase
          .from('user_progress')
          .insert({
            content_id: contentId,
            user_id: session.user.id,
            notes: "",
            is_completed: newIsCompleted
          })
          .select();
          
        if (error) throw error;
        if (data && data[0]) {
          setUserProgressId(data[0].id);
        }
      }
      
      // Animate the completion button
      const completeButton = document.querySelector(".detail-complete-button");
      if (completeButton) {
        gsap.fromTo(completeButton, 
          { scale: 0.95 }, 
          { scale: 1, duration: 0.3, ease: "back.out" }
        );
      }
      
      toast.success(
        newIsCompleted 
          ? "Marked as completed" 
          : "Marked as not completed",
        {
          description: newIsCompleted
            ? "This content has been marked as completed."
            : "This content has been marked as not completed."
        }
      );
    } catch (error) {
      console.error("Error updating completion status:", error);
      setIsCompleted(!isCompleted); // Revert the UI state
      toast.error("Failed to update completion status", {
        description: "There was an error updating your progress. Please try again."
      });
    }
  };

  if (contentLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
        <p className="text-gray-600">Loading content...</p>
      </div>
    );
  }

  if (contentError || !content) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Content Not Found</h1>
        <p className="text-gray-600 mb-6">The content you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/content")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Library
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-8">
        <Button variant="outline" onClick={() => navigate("/content")} className="detail-back-button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content Library
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 detail-title">{content.title}</h1>
                <div className="flex items-center detail-meta">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {content.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-4">
                    Updated: {new Date(content.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <Button
                variant={isCompleted ? "default" : "outline"}
                onClick={handleToggleCompletion}
                className="detail-complete-button"
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </div>
            
            {/* Content Body */}
            <div className="prose max-w-none" ref={contentRef}>
              {content.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar - Notes */}
        <div className="lg:col-span-1" ref={notesRef}>
          <Card className="sticky top-24">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium flex items-center">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Your Notes
                </h3>
                {!isLoggedIn && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate("/auth")}
                  >
                    Sign in to save
                  </Button>
                )}
              </div>
            </div>
            <div className="p-4">
              <Textarea
                placeholder="Add your notes here..."
                className="min-h-[300px] mb-4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!isLoggedIn}
              />
              <Button 
                onClick={handleSaveNotes}
                disabled={!isLoggedIn}
                className="w-full notes-save-button"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Notes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
