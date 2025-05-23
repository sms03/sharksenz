
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import gsap from "gsap";
import MainLayout from "@/layouts/MainLayout";
import { UserOnboarding } from "@/components/UserOnboarding";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState(""); // Can be email or username
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/content");
      }
    };
    checkSession();
  }, [navigate]);

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(".auth-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    tl.from(".auth-title", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.4");
    tl.from(".auth-description", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.3");
    tl.from(".auth-input", {
      y: 15,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: "power3.out"
    }, "-=0.2");
    tl.from(".auth-button", {
      scale: 0.9,
      opacity: 0,
      duration: 0.4,
      ease: "power3.out"
    }, "-=0.1");
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate inputs
    if (!username.trim()) {
      toast.error("Username is required");
      setIsLoading(false);
      return;
    }
    
    if (!fullName.trim()) {
      toast.error("Full name is required");
      setIsLoading(false);
      return;
    }
    
    try {
      // Check if username already exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();
      
      if (existingUser) {
        toast.error("Username already exists", {
          description: "Please choose a different username"
        });
        setIsLoading(false);
        return;
      }
      
      // Sign up with email and password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username
          }
        }
      });
      
      if (error) {
        toast.error("Sign up failed", {
          description: error.message
        });
      } else {
        // Update profiles table with additional info to ensure data is immediately available
        if (data.user) {
          setUserId(data.user.id);
          
          // Double-check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select()
            .eq('id', data.user.id)
            .single();
            
          if (existingProfile) {
            // Update existing profile
            await supabase
              .from('profiles')
              .update({
                username,
                full_name: fullName,
                updated_at: new Date().toISOString()
              })
              .eq('id', data.user.id);
          } else {
            // Create new profile if not created by trigger
            await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  username,
                  full_name: fullName,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);
          }
          
          toast.success("Account created successfully!");
          
          // Show onboarding for new users
          if (data.session) {
            setShowOnboarding(true);
          } else {
            toast.info("Check your email for the confirmation link.");
          }
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Determine if the identifier is an email
      const isEmail = loginIdentifier.includes('@');
      let signInOptions;
      
      if (isEmail) {
        signInOptions = {
          email: loginIdentifier,
          password
        };
      } else {
        // Find user by username first
        const { data: users, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', loginIdentifier)
          .single();
          
        if (userError || !users) {
          toast.error("Sign in failed", {
            description: "Username not found"
          });
          setIsLoading(false);
          return;
        }

        // Get user email using auth.admin is not the right approach here
        // Instead, use the special function we created to get the user
        const { data: authData, error: authError } = await supabase
          .rpc('get_user_by_username', { username_input: loginIdentifier });

        if (!authData) {
          toast.error("Sign in failed", {
            description: "User not found"
          });
          setIsLoading(false);
          return;
        }

        // Since our function returns the user id, we need to get the email address
        const { data: userData, error: userDataError } = await supabase.auth.admin.getUserById(
          authData.toString()
        );
        
        if (userDataError || !userData?.user?.email) {
          toast.error("Sign in failed", {
            description: "Could not retrieve user details"
          });
          setIsLoading(false);
          return;
        }
        
        signInOptions = {
          email: userData.user.email,
          password
        };
      }

      // Sign in with the determined options
      const { data, error } = await supabase.auth.signInWithPassword(signInOptions);
      
      if (error) {
        toast.error("Sign in failed", {
          description: error.message
        });
      } else {
        toast.success("Welcome back!");
        navigate("/content");
      }
    } catch (error) {
      console.error("Error during signin:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
    navigate("/content");
  };
  
  if (showOnboarding) {
    return <UserOnboarding userId={userId} onFinish={handleFinishOnboarding} />;
  }
  
  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[80vh] py-10">
        <Card className="w-full max-w-md shadow-lg auth-card">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardHeader>
                  <CardTitle className="text-2xl auth-title font-ancizar font-semibold">Welcome Back</CardTitle>
                  <CardDescription className="auth-description">Enter your email/username and password to sign in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signin-identifier">Email or Username</Label>
                    <Input 
                      id="signin-identifier" 
                      type="text" 
                      placeholder="your@email.com or username" 
                      value={loginIdentifier} 
                      onChange={e => setLoginIdentifier(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full auth-button" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardHeader>
                  <CardTitle className="text-2xl auth-title font-ancizar font-semibold">Create an Account</CardTitle>
                  <CardDescription className="auth-description">Enter your details to create a new account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <Input 
                      id="signup-fullname" 
                      type="text" 
                      placeholder="John Doe" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input 
                      id="signup-username" 
                      type="text" 
                      placeholder="johndoe" 
                      value={username} 
                      onChange={e => setUsername(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                    />
                    <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full auth-button" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Auth;
