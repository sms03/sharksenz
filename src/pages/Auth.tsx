import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { useResponsive } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { LogIn, UserPlus, Github } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { gsap } from 'gsap';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signInWithOAuth } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  
  // Refs for GSAP animations
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const loginTabRef = useRef(null);
  const signupTabRef = useRef(null);
  
  // Initial animation on component mount
  useEffect(() => {
    // Logo animation
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
    );
    
    // Card animation
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 }
    );
    
    // Create floating animation for the card
    gsap.to(cardRef.current, {
      y: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    // Subtle background pulse animation
    const bg = document.querySelector('.auth-background');
    if (bg) {
      gsap.to(bg, {
        backgroundPosition: '100% 100%',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "none"
      });
    }
  }, []);
  
  // Form fields animation
  useEffect(() => {
    if (!formRef.current) return;
    
    // Use a small timeout to ensure DOM has updated
    setTimeout(() => {
      const formElements = formRef.current?.querySelectorAll('div.space-y-2, button.w-full');
      
      if (formElements?.length) {
        gsap.fromTo(
          formElements,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: "power2.out",
            delay: 0.1
          }
        );
      }
    }, 50);
  }, [activeTab]);

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate('/');
    }
    
    // Check if we have isLogin state from navigation
    if (location.state && location.state.isLogin === false) {
      setActiveTab('signup');
    }
  }, [user, navigate, location.state]);

  // Tab switch animation
  const handleTabChange = (value) => {
    if (value === activeTab) return; // Avoid unnecessary animations if tab hasn't changed
    
    // Kill any ongoing animations to prevent conflicts
    gsap.killTweensOf(formRef.current);
    
    // Animate out current form
    gsap.to(formRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(value);
        
        // Reset form position immediately before animating in
        gsap.set(formRef.current, { y: 10 });
        
        // Animate in the new form
        gsap.to(formRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          delay: 0.05
        });
        
        // Animate highlighted tab
        const targetTabRef = value === 'login' ? loginTabRef : signupTabRef;
        gsap.fromTo(
          targetTabRef.current,
          { scale: 0.95 },
          { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
      }
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Success animation before redirect
      gsap.to(cardRef.current, {
        y: -20,
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          toast.success('Logged in successfully!');
          navigate('/');
        }
      });
    } catch (error) {
      // Error animation shake
      gsap.to(cardRef.current, {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          toast.error(error.message);
          setLoading(false);
        }
      });
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      // Success animation
      gsap.to(cardRef.current, {
        y: -10,
        scale: 1.03,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(cardRef.current, {
            y: 0,
            scale: 1,
            duration: 0.4,
            delay: 0.2,
            ease: "power2.in",
            onComplete: () => {
              toast.success('Check your email for the confirmation link!');
              handleTabChange('login');
              setLoading(false);
            }
          });
        }
      });
    } catch (error) {
      // Error animation shake
      gsap.to(cardRef.current, {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          toast.error(error.message);
          setLoading(false);
        }
      });
    }
  };
  
  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithOAuth('google');
    } catch (error) {
      toast.error('Failed to sign in with Google');
      setLoading(false);
    }
  };

  // Button hover animations
  const buttonHoverEnter = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.2,
      ease: "power1.out"
    });
  };
  
  const buttonHoverLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: "power1.out"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-shark-800 to-shark-950 auth-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-shark-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-shark-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-shark-500/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="absolute top-4 left-4" ref={logoRef}>
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate('/')}
          onMouseEnter={buttonHoverEnter}
          onMouseLeave={buttonHoverLeave}
        >
          <img src="/logo.png" alt="SharkSenz Logo" className="h-6 w-auto mr-2" />
          <span className="text-xl font-bold">SharkSenz</span>
        </Button>
      </div>
        <Card className="w-full max-w-[350px] xs:max-w-md relative z-10 h-auto min-h-[480px] sm:min-h-[520px]" ref={cardRef}>
        <CardHeader className="text-center pb-2 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl">Welcome to SharkSenz</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Your gateway to mastering business concepts and financial literacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">              <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4">
              <TabsTrigger 
                value="login" 
                ref={loginTabRef}
                className="h-9 sm:h-10 text-xs sm:text-sm"
              >
                <LogIn className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                ref={signupTabRef}
                className="h-9 sm:h-10 text-xs sm:text-sm"
              >
                <UserPlus className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <div ref={formRef}>
              <TabsContent value="login" forceMount className={activeTab === 'login' ? 'block' : 'hidden'}>
                <form onSubmit={handleLogin} className="space-y-3">                  <div className="space-y-1">
                    <Label htmlFor="email-login" className="text-xs sm:text-sm">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login" className="text-xs sm:text-sm">Password</Label>
                      <Button variant="link" className="px-0 text-[10px] sm:text-xs h-auto py-0" type="button">
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="password-login"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>                  <Button 
                    type="submit" 
                    className="w-full h-8 sm:h-10 text-xs sm:text-sm" 
                    disabled={loading}
                    onMouseEnter={buttonHoverEnter}
                    onMouseLeave={buttonHoverLeave}                  >
                    {loading ? "Logging in..." : "Sign In"}
                  </Button>
                  
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white h-10" 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    onMouseEnter={buttonHoverEnter}
                    onMouseLeave={buttonHoverLeave}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    <span>Don't have an account? </span>
                    <Button 
                      variant="link" 
                      className="p-0"
                      type="button"
                      onClick={() => handleTabChange('signup')}
                    >
                      Sign up
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" forceMount className={activeTab === 'signup' ? 'block' : 'hidden'}>
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-10" 
                    disabled={loading}
                    onMouseEnter={buttonHoverEnter}
                    onMouseLeave={buttonHoverLeave}                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                  
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white h-10" 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    onMouseEnter={buttonHoverEnter}
                    onMouseLeave={buttonHoverLeave}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      />
                    </svg>
                    Sign up with Google
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    <span>Already have an account? </span>
                    <Button 
                      variant="link" 
                      className="p-0"
                      type="button"
                      onClick={() => handleTabChange('login')}
                    >
                      Sign in
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
