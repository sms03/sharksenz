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
import { User, Edit, Save, BookOpen, BookMarked } from "lucide-react";
import gsap from "gsap";

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
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  
  // Refs for GSAP animations
  const profileRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
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
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId
  });
  
  // Fetch completed content
  const { data: completedContent, isLoading: contentLoading } = useQuery({
    queryKey: ['completedContent', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('content_id')
        .eq('user_id', userId)
        .eq('is_completed', true);
      
      if (progressError) throw progressError;
      
      if (!progress || progress.length === 0) {
        return [];
      }
      
      const contentIds = progress.map(item => item.content_id);
      
      const { data: content, error: contentError } = await supabase
        .from('learning_content')
        .select('id, title, category')
        .in('id', contentIds);
      
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

  // Update form fields when profile data is loaded
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  // GSAP animations
  useEffect(() => {
    if (!profileLoading && profile && profileRef.current) {
      const tl = gsap.timeline();
      
      tl.from(".profile-header", { 
        y: 20, 
        opacity: 0, 
        duration: 0.6,
        ease: "power3.out" 
      });
      
      tl.from(".profile-avatar", { 
        scale: 0.8, 
        opacity: 0, 
        duration: 0.5,
        ease: "back.out" 
      }, "-=0.3");
      
      tl.from(".profile-details", { 
        y: 15, 
        opacity: 0, 
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out" 
      }, "-=0.2");
      
      tl.from(".profile-tabs", { 
        y: 20, 
        opacity: 0, 
        duration: 0.5,
        ease: "power3.out" 
      }, "-=0.2");
    }
    
    if (completedContent && contentRef.current) {
      gsap.from(".content-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
        }
      });
    }
  }, [profileLoading, profile, completedContent]);

  const handleSaveProfile = async () => {
    if (!userId) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          full_name: fullName,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetchProfile();
      
      // Animate save button
      gsap.fromTo(".save-button", 
        { scale: 0.9 }, 
        { scale: 1, duration: 0.3, ease: "back.out" }
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later."
      });
    }
  };

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
        <p className="text-gray-600 mb-6">There was an error loading your profile data. Please try again later.</p>
        <Button onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" ref={profileRef}>
      <div className="mb-8 profile-header">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-slate-600">View and manage your profile information</p>
      </div>
      
      {profileLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 profile-avatar">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || ""} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="profile-details">
                  {profile?.full_name || username || "User"}
                </CardTitle>
                <p className="text-gray-500 text-sm profile-details">
                  Joined {new Date(profile?.created_at || "").toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 profile-details">
                {!isEditing ? (
                  <>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Username</h3>
                      <p>{profile?.username || "Not set"}</p>
                    </div>
                    {profile?.bio && (
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Bio</h3>
                        <p>{profile.bio}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Username</h3>
                      <Input 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        className="mb-3"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Full Name</h3>
                      <Input 
                        value={fullName} 
                        onChange={e => setFullName(e.target.value)} 
                        className="mb-3"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Avatar URL</h3>
                      <Input 
                        value={avatarUrl} 
                        onChange={e => setAvatarUrl(e.target.value)} 
                        className="mb-3"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Bio</h3>
                      <Textarea 
                        value={bio} 
                        onChange={e => setBio(e.target.value)} 
                        rows={4}
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 save-button"
                      onClick={handleSaveProfile}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {/* Progress & Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="completed" className="w-full profile-tabs">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="completed">Completed Content</TabsTrigger>
                <TabsTrigger value="notes">My Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="completed" ref={contentRef}>
                {contentLoading ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
                    <p className="text-gray-600">Loading content...</p>
                  </div>
                ) : completedContent && completedContent.length > 0 ? (
                  <div className="space-y-4">
                    {completedContent.map((item, index) => (
                      <Card key={item.content_id} className="content-item">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/content/${item.content_id}`)}
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
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
                )}
              </TabsContent>
              
              <TabsContent value="notes">
                <Card>
                  <CardContent className="pt-6">
                    {/* Notes implementation will go here */}
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Your Notes Feature</h3>
                      <p className="text-gray-600 mb-4">
                        You can find all your content notes in their respective content pages.
                      </p>
                      <Button onClick={() => navigate("/content")}>
                        Go to Content Library
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
