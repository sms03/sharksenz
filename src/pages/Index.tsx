import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, GraduationCap, BarChart3, Rocket, Target, Code, ChevronRight, Shield, LineChart, Zap, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  gsap.registerPlugin(ScrollTrigger);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the container
      const x = (clientX / width - 0.5) * 2;
      const y = (clientY / height - 0.5) * 2;
      
      setMousePosition({ x, y });
      
      // Apply parallax effect to glow elements
      gsap.to(".hero-glow", {
        x: x * 25,
        y: y * 25,
        duration: 1.5,
        ease: "power2.out"
      });
      
      // Apply subtle movement to floating icons
      gsap.to(".floating-icon", {
        x: x * 8,
        y: y * 8,
        duration: 1,
        ease: "power1.out"
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    setIsLoaded(true);
    
    // Hero animations
    if (heroRef.current) {
      const tl = gsap.timeline();
      tl.from(".hero-logo", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
      tl.from(".hero-glow", {
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power3.out"
      }, "-=0.5");
      tl.from(".hero-badge", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=1.2");
      tl.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");
      tl.from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out"
      }, "-=0.5");
      tl.from(".hero-buttons .button", {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.4");
      tl.from(".floating-icon", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.3");
      tl.from(".stat-card", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "back.out(1.4)"
      }, "-=0.2");
      tl.from(".particle", { 
        opacity: 0,
        scale: 0,
        stagger: 0.02,
        duration: 0.4,
        ease: "back.out"
      }, "-=0.6");
    }

    // Floating animation for icons
    gsap.to(".floating-icon", {
      y: "random(-8, 8)", 
      duration: "random(1.5, 3.5)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.2
    });

    // Features animations
    if (featuresRef.current) {
      gsap.from(".feature-card", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 75%"
        }
      });
    }
  }, []);

  // Generate random particles for background effect
  const generateParticles = (count: number) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 2;
      particles.push(
        <div 
          key={i}
          className="particle absolute rounded-full bg-blue-100 opacity-30"
          style={{
            width: size + 'px',
            height: size + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `float ${Math.random() * 10 + 10}s linear infinite`
          }}
        />
      );
    }
    return particles;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative pt-20 pb-20 overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 min-h-[90vh] flex items-center"
      >        {/* CSS for floating animation is in index.css */}
        
        {/* Animated background elements */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="hero-glow absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full opacity-10 blur-[100px]"></div>
          <div className="hero-glow absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-300 rounded-full opacity-10 blur-[80px]"></div>
          <div className="hero-glow absolute top-1/3 right-1/6 w-[300px] h-[300px] bg-cyan-300 rounded-full opacity-10 blur-[60px]"></div>
          
          {/* Random particles */}
          {generateParticles(30)}
          
          {/* Floating icons */}
          <div className="absolute top-20 left-[10%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl rotate-12 shadow-xl">
              <Shield className="h-6 w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute top-40 right-[15%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl -rotate-6 shadow-xl">
              <LineChart className="h-6 w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute bottom-32 left-[20%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl rotate-6 shadow-xl">
              <Rocket className="h-6 w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute bottom-40 right-[25%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl -rotate-12 shadow-xl">
              <BookOpen className="h-6 w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute top-[60%] left-[8%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl rotate-6 shadow-xl">
              <Zap className="h-6 w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute top-[30%] right-[8%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl -rotate-12 shadow-xl">
              <DollarSign className="h-6 w-6 text-blue-200" />
            </div>
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuNSA2MEgxLjVWNTkuNUg2MFYuNUg1OS41VjYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="hero-logo bg-white/10 backdrop-blur-md p-3 rounded-full shadow-xl inline-block">
              <img src="/logo_transparent.png" alt="SharkSenz" className="h-16 w-16" />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center rounded-full border border-blue-400/30 bg-blue-900/50 backdrop-blur-md px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">The Ultimate Founder Resource</span>
            </div>
            
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Where <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Founders</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C32.3333 1.16667 96.7 -3.5 154.5 5.5C212.3 14.5 277.667 8.33333 299 5.5" stroke="url(#paint0_linear)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="1" y1="5.5" x2="299" y2="5.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#60A5FA"/>
                      <stop offset="1" stopColor="#67E8F9" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span> Become <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Sharks</span>
            </h1>
            
            <p className="hero-description text-xl md:text-2xl text-blue-100/90 mb-10 max-w-2xl mx-auto font-light">
              Master essential skills and knowledge to build successful startups. 
              From idea validation to scaling, we've got you covered.
            </p>
            
            <div className="flex flex-wrap gap-5 justify-center hero-buttons">
              <Button size="lg" className="button bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-none shadow-lg shadow-blue-500/25 h-14 px-8 transition-all duration-300 transform hover:scale-105">
                <Link to="/content" className="flex items-center text-lg">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="button text-blue-100 border-blue-400/30 hover:bg-blue-800/50 backdrop-blur-sm h-14 px-8 transition-all duration-300 transform hover:scale-105">
                <Link to="/content" className="flex items-center text-lg">
                  Browse Library <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Stats cards - reformatted for better visual appeal */}
            <div className="mt-16 flex flex-wrap justify-center gap-6">
              <div className="stat-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-xl cursor-pointer">
                <p className="font-bold text-3xl text-white">50+</p>
                <p className="text-sm text-blue-200">Learning Modules</p>
              </div>
              <div className="stat-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-xl cursor-pointer">
                <p className="font-bold text-3xl text-white">1000+</p>
                <p className="text-sm text-blue-200">Startup Founders</p>
              </div>
              <div className="stat-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-xl cursor-pointer">
                <p className="font-bold text-3xl text-white">24/7</p>
                <p className="text-sm text-blue-200">Learning Access</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="none" className="w-full">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 120L48 100C96 80 192 40 288 35C384 30 480 60 576 75C672 90 768 90 864 85C960 80 1056 70 1152 60C1248 50 1344 40 1392 35L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our platform provides all the essential resources for startup founders at any stage
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="feature-card hover:shadow-md transition-shadow">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Comprehensive Content</CardTitle>
              <CardDescription>
                Access our A-Z library of founder knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Explore topics from fundraising to product-market fit, all organized in an easy-to-navigate format.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/content">Browse Library</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-shadow">
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Track Your Progress</CardTitle>
              <CardDescription>
                Mark lessons as complete and take notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Keep track of what you've learned and maintain personal notes alongside each lesson.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-shadow">
            <CardHeader>
              <Rocket className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Pitch Simulator</CardTitle>
              <CardDescription>
                Practice your startup pitch and get feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Refine your elevator pitch with our interactive simulator and receive instant feedback to improve.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/profile">Try Pitch Simulator</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-shadow">
            <CardHeader>
              <Target className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Goal Setting</CardTitle>
              <CardDescription>
                Define your learning path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Set clear learning objectives and track your progress towards your startup goals.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">Set Goals</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Visualize your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                See your progress across different categories and identify areas for further improvement.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">View Analytics</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-shadow">
            <CardHeader>
              <Code className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Founder Resources</CardTitle>
              <CardDescription>
                Tools and templates for startups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Access practical tools, templates, and resources to help you implement what you've learned.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/resources">Access Resources</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
