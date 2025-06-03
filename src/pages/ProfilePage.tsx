import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save, BookOpen, BookMarked, Presentation, BarChart3, PieChart, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ImageUploader from "@/components/ImageUploader";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

type CompletedContent = {
  content_id: string;
  title: string;
  category: string;
};

// New type for category-based progress
type CategoryProgress = {
  category: string;
  completed: number;
  total: number;
  percentage: number;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("completed");
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  // Refs for GSAP animations
  const profileRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to view your profile", {
          description: "Please sign in to continue."
        });
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  // Fetch profile data
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId
  });

  // Fetch completed content
  const {
    data: completedContent,
    isLoading: contentLoading
  } = useQuery({
    queryKey: ['completedContent', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const {
        data: progress,
        error: progressError
      } = await supabase.from('user_progress').select('content_id').eq('user_id', userId).eq('is_completed', true);
      if (progressError) throw progressError;
      if (!progress || progress.length === 0) {
        return [];
      }
      const contentIds = progress.map(item => item.content_id);
      const {
        data: content,
        error: contentError
      } = await supabase.from('learning_content').select('id, title, category').in('id', contentIds);
      if (contentError) throw contentError;

      // Map the returned data to match the CompletedContent type
      return content.map((item: any) => ({
        content_id: item.id,
        title: item.title,
        category: item.category
      })) as CompletedContent[];
    },
    enabled: !!userId
  });

  // Fetch category-based progress
  const {
    data: categoryStats,
    isLoading: categoryStatsLoading,
    error: categoryStatsError
  } = useQuery({
    queryKey: ['categoryProgress', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      // Get all categories and their counts
      const { data: allContent, error: contentError } = await supabase
        .from('learning_content')
        .select('category');
      if (contentError) throw contentError;

      // Group by category and get counts
      const categoryCounts = allContent?.reduce((acc: {[key: string]: number}, item) => {
        const category = item.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Get completed content per category
      const { data: userProgress, error: progressError } = await supabase
        .from('user_progress')
        .select('content_id, is_completed')
        .eq('user_id', userId)
        .eq('is_completed', true);
      if (progressError) throw progressError;

      // Get category information for all completed content
      const completedIds = userProgress?.map(item => item.content_id) || [];
      let categoryProgress: CategoryProgress[] = [];

      if (completedIds.length > 0) {
        const { data: completedContent, error: completedError } = await supabase
          .from('learning_content')
          .select('category')
          .in('id', completedIds);
        if (completedError) throw completedError;

        // Count completed items by category
        const completedCounts = completedContent?.reduce((acc: {[key: string]: number}, item) => {
          const category = item.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Create progress data structure
        categoryProgress = Object.entries(categoryCounts).map(([category, totalCount]) => {
          const completed = completedCounts?.[category] || 0;
          return {
            category,
            completed,
            total: totalCount,
            percentage: Math.round((completed / totalCount) * 100)
          };
        }).sort((a, b) => b.percentage - a.percentage);
      } else {
        // No completed content, set all to 0%
        categoryProgress = Object.entries(categoryCounts).map(([category, totalCount]) => ({
          category,
          completed: 0,
          total: totalCount,
          percentage: 0
        }));
      }

      return categoryProgress;
    },
    enabled: !!userId
  });

  // Fetch overall progress
  const {
    data: overallStat,
    isLoading: overallStatLoading,
    error: overallStatError
  } = useQuery({
    queryKey: ['overallProgress', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const {
        data,
        error
      } = await supabase.from('user_progress').select('is_completed').eq('user_id', userId);
      if (error) throw error;
      const total = data.length;
      const completed = data.filter((item: any) => item.is_completed).length;
      const percentage = total > 0 ? (completed / total) * 100 : 0;
      return {
        total,
        completed,
        percentage
      };
    },
    enabled: !!userId
  });

  // Fetch total content count and category distribution
  const {
    data: contentStats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['contentStats', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      // Get all categories and their counts
      const { data: allContent, error: contentError } = await supabase
        .from('learning_content')
        .select('category');
      
      if (contentError) throw contentError;
      
      // Calculate total content
      const total = allContent?.length || 0;
      
      // Group by category and get counts
      const categoryCounts = allContent?.reduce((acc: {[key: string]: number}, item) => {
        const category = item.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      
      // Get completed content per category
      const { data: userProgress, error: progressError } = await supabase
        .from('user_progress')
        .select('content_id, is_completed')
        .eq('user_id', userId)
        .eq('is_completed', true);
      
      if (progressError) throw progressError;
      
      // Get category information for all completed content
      const completedIds = userProgress?.map(item => item.content_id) || [];
      let categoryProgress: CategoryProgress[] = [];
      
      if (completedIds.length > 0) {
        const { data: completedContent, error: completedError } = await supabase
          .from('learning_content')
          .select('category')
          .in('id', completedIds);
        
        if (completedError) throw completedError;
        
        // Count completed items by category
        const completedCounts = completedContent?.reduce((acc: {[key: string]: number}, item) => {
          const category = item.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        // Create progress data structure
        categoryProgress = Object.entries(categoryCounts).map(([category, totalCount]) => {
          const completed = completedCounts?.[category] || 0;
          return {
            category,
            completed,
            total: totalCount,
            percentage: Math.round((completed / totalCount) * 100)
          };
        }).sort((a, b) => b.percentage - a.percentage);
        
        // Calculate overall percentage
        const totalCompleted = Object.values(completedCounts || {}).reduce((sum, count) => sum + count, 0);
        setOverallProgress(Math.round((totalCompleted / total) * 100));
      } else {
        // No completed content, set all to 0%
        categoryProgress = Object.entries(categoryCounts).map(([category, totalCount]) => ({
          category,
          completed: 0,
          total: totalCount,
          percentage: 0
        }));
        setOverallProgress(0);
      }
      
      setCategoryProgress(categoryProgress);
      
      return {
        totalContent: total,
        completedContent: completedIds.length,
        categoryProgress,
        overallPercentage: Math.round((completedIds.length / total) * 100)
      };
    },
    enabled: !!userId
  });

  // Update form fields when profile data is loaded
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Cleanup function
    return () => {
      // Kill all animations and ScrollTriggers to prevent memory leaks
      const scrollTriggers = ScrollTrigger.getAll();
      scrollTriggers.forEach(trigger => trigger.kill(false));
      gsap.killTweensOf("*");
    };
  }, []);

  // Profile animation - only run once when profile is loaded
  useEffect(() => {
    // Only run animation when profile is loaded for the first time and hasn't been played yet
    if (profileLoading || !profile || !profileRef.current || animationPlayed) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setAnimationPlayed(true) // Mark animation as played
      });
      tl.from(".profile-header", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all" // Clear properties after animation
      });
      tl.from(".profile-avatar", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out",
        clearProps: "all"
      }, "-=0.3");
      tl.from(".profile-details", {
        y: 15,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4, 
        ease: "power2.out",
        clearProps: "all"
      }, "-=0.2");
      tl.from(".profile-tabs", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        clearProps: "all"
      }, "-=0.2");
    }, profileRef);

    // Cleanup function for profile animations
    return () => ctx.revert();
  }, [profileLoading, profile]);
  // Content items and progress animation
  useEffect(() => {
    if ((!contentRef.current && !progressRef.current) || activeTab !== "completed") return;

    // Create a new context for this specific animation to ensure proper cleanup
    const ctx = gsap.context(() => {
      // Animate progress elements
      if (categoryProgress.length > 0) {
        gsap.from(".progress-card", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".progress-section",
            start: "top 80%",
            once: true
          }
        });
      }
      
      // Animate content items
      if (completedContent && completedContent.length > 0) {
        gsap.from(".content-item", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".content-list",
            start: "top 80%",
            once: true
          }
        });
      }
    });

    // Cleanup function for animations
    return () => ctx.revert();
  }, [categoryProgress, completedContent, activeTab]);

  // Handle profile image update
  const handleImageUploaded = (url: string) => {
    setAvatarUrl(url);
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    try {
      const {
        error
      } = await supabase.from('profiles').update({
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }).eq('id', userId);
      if (error) throw error;
      toast.success("Profile updated successfully");
      setIsEditing(false);
      await refetchProfile(); // Wait for profile to be refetched// Animate save button - use timeline to ensure proper cleanup
      const saveTl = gsap.timeline();
      saveTl.fromTo(".save-button", {
        scale: 0.9
      }, {
        scale: 1,
        duration: 0.3,
        ease: "back.out",
        clearProps: "scale" // Clear properties after animation to prevent glitches
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later."
      });
    }
  };

  if (profileError) {
    return <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
        <p className="text-gray-600 mb-6">There was an error loading your profile data. Please try again later.</p>
        <Button onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>;
  }

  return <div className="container mx-auto px-4 py-8" ref={profileRef}>
      <div className="mb-8 profile-header">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-slate-600">View and manage your profile information</p>
      </div>
      
      {profileLoading ? <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 profile-avatar">
                  {!isEditing ? (
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl || ""} />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-full max-w-xs mx-auto">
                      <ImageUploader 
                        userId={userId || ""}
                        onImageUploaded={handleImageUploaded}
                        currentImageUrl={avatarUrl || ""}
                      />
                    </div>
                  )}
                </div>
                <CardTitle className="profile-details text-base">
                  {profile?.full_name || username || "User"}
                </CardTitle>
                <p className="text-gray-500 text-sm profile-details">
                  Joined {new Date(profile?.created_at || "").toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 profile-details">
                {!isEditing ? <>
                    <div>
                      <h3 className="font-medium text-gray-500 text-sm">Username</h3>
                      <p className="text-base">{profile?.username || "Not set"}</p>
                    </div>
                    {profile?.bio && <div>
                        <h3 className="font-medium text-sm text-gray-500">Bio</h3>
                        <p>{profile.bio}</p>
                      </div>}
                  </> : <>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Username</h3>
                      <Input value={username} onChange={e => setUsername(e.target.value)} className="mb-3" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Full Name</h3>
                      <Input value={fullName} onChange={e => setFullName(e.target.value)} className="mb-3" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Bio</h3>
                      <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} />
                    </div>
                  </>}
              </CardContent>
              <CardFooter>
                {isEditing ? <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 save-button" onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div> : <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>}
              </CardFooter>
            </Card>
          </div>
          
          {/* Progress & Content */}
          <div className="lg:col-span-2">            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full profile-tabs">
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger value="completed">Learning Progress</TabsTrigger>
              </TabsList>
                <TabsContent value="completed" ref={contentRef}>
                {contentLoading || statsLoading ? <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
                    <p className="text-gray-600">Loading progress data...</p>
                  </div> : (
                  <div className="space-y-8">
                    {/* Overall Progress Card */}
                    <Card className="overflow-hidden progress-section" ref={progressRef}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Overall Learning Progress</CardTitle>
                          <div className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-semibold">
                            {contentStats?.overallPercentage || 0}% Complete
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{contentStats?.completedContent || 0} / {contentStats?.totalContent || 0} modules</span>
                            </div>
                            <Progress 
                              value={contentStats?.overallPercentage || 0} 
                              className="h-3 bg-gray-100" 
                            />
                          </div>
                          
                          {/* Category Progress */}
                          <div className="space-y-4">
                            <h3 className="font-medium text-sm text-gray-500">Progress by Category</h3>
                            
                            {categoryProgress.length > 0 ? (
                              <div className="space-y-3">
                                {categoryProgress.map((category) => (
                                  <div key={category.category} className="progress-card bg-gray-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">{category.category}</span>
                                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                        {category.percentage}%
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Progress 
                                        value={category.percentage} 
                                        className="h-2 flex-grow bg-gray-100"
                                      />
                                      <span className="text-xs text-gray-500 ml-3 min-w-[70px]">
                                        {category.completed}/{category.total} modules
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No categories available.</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Completed Content List */}
                    <div className="content-list">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Completed Modules</h3>
                        {completedContent && completedContent.length > 0 && (
                          <span className="text-sm text-gray-500">
                            {completedContent.length} {completedContent.length === 1 ? 'module' : 'modules'} completed
                          </span>
                        )}
                      </div>
                      
                      {completedContent && completedContent.length > 0 ? 
                        <div className="space-y-4">
                          {completedContent.map((item, index) => 
                            <Card key={item.content_id} className="content-item hover:shadow-md transition-shadow">
                              <CardContent className="p-4 flex justify-between items-center">
                                <div className="flex-grow">
                                  <div className="flex items-center">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                    <h4 className="font-medium">{item.title}</h4>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/content/${item.content_id}`)}>
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </div> :
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                          <BookMarked className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No completed content yet</h3>
                          <p className="text-gray-600 mb-4">
                            You haven't marked any content as complete yet.
                          </p>
                          <Button onClick={() => navigate("/content")}>
                            Explore Content Library
                          </Button>
                        </div>
                      }
                    </div>
                  </div>
                )}                </TabsContent>
            </Tabs>
          </div>
        </div>}
    </div>;
};

export default ProfilePage;
