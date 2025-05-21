
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import gsap from "gsap";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast.error("Sign up failed", {
          description: error.message
        });
      } else {
        toast.success("Success!", {
          description: "Check your email for the confirmation link."
        });
        // In development, usually email verification is disabled
        if (data.session) {
          navigate("/content");
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
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
                  <CardTitle className="text-2xl auth-title">Welcome Back</CardTitle>
                  <CardDescription className="auth-description">Enter your email and password to sign in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  <CardTitle className="text-2xl auth-title">Create an Account</CardTitle>
                  <CardDescription className="auth-description">Enter your details to create a new account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 auth-input">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
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
