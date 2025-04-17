import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useTheme, Theme } from "@/components/ThemeProvider";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { FadeIn } from "@/components/ui/motion";
import { Select } from "@/components/ui/select";

export default function Profile() {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [plan, setPlan] = useState(() => localStorage.getItem("user_plan") || "free");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    async function getProfile() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUsername(data.username || "");
          setAvatarUrl(data.avatar_url || "");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [user, navigate]);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const getInitials = () => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  const handlePlanChange = (newPlan: string) => {
    setPlan(newPlan);
    localStorage.setItem("user_plan", newPlan);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      // Optionally: upload to Supabase Storage here
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl">
        {/* Subscription status banner */}
        <div className={`mb-6 rounded-lg p-4 text-center font-semibold text-lg flex flex-col items-center justify-center shadow-md border ${
          plan === "free"
            ? "bg-gray-50 text-gray-700 border-gray-200"
            : plan === "starter"
            ? "bg-blue-50 text-blue-800 border-blue-200"
            : "bg-yellow-50 text-yellow-900 border-yellow-200"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {plan === "free" && (
              <span className="inline-block rounded-full bg-gray-300 text-xs px-3 py-1 font-bold uppercase tracking-wide">Free</span>
            )}
            {plan === "starter" && (
              <span className="inline-block rounded-full bg-blue-400 text-white text-xs px-3 py-1 font-bold uppercase tracking-wide">Starter</span>
            )}
            {plan === "professional" && (
              <span className="inline-block rounded-full bg-yellow-400 text-yellow-900 text-xs px-3 py-1 font-bold uppercase tracking-wide">Pro</span>
            )}
            <span className="text-base font-bold">{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</span>
          </div>
          <div className="text-sm font-normal">
            {plan === "free" && (
              <>
                <span>Limited access. </span>
                <a href="/pricing" className="text-blue-600 underline hover:text-blue-800">Upgrade for more features</a>
              </>
            )}
            {plan === "starter" && (
              <>
                <span>Starter Plan Active. </span>
                <a href="/pricing" className="text-blue-600 underline hover:text-blue-800">Upgrade to Pro</a> for full access.
              </>
            )}
            {plan === "professional" && (
              <span>Professional Plan Active. You have full access to all features!</span>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Your Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <FadeIn>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account">
                <Settings className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="avatar-url">Profile Image</Label>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="avatar-url"
                          placeholder="https://example.com/avatar.jpg"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="outline" size="icon" disabled={uploading} asChild>
                          <label>
                            <Upload className="h-4 w-4 cursor-pointer" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter a URL for your profile image or upload a new one
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email address can't be changed
                    </p>
                  </div>

                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button onClick={updateProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign out from your account on this device
                    </p>
                    <Button 
                      variant="destructive" 
                      className="mt-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-red-600">Disable/Deactivate Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable your account. You will not be able to log in or access any features until reactivated. Your data will be preserved.
                    </p>
                    <Button 
                      variant="destructive" 
                      className="mt-2"
                      onClick={() => {
                        localStorage.setItem("account_disabled", "true");
                        window.location.href = "/auth";
                      }}
                    >
                      Disable Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </MainLayout>
  );
}
