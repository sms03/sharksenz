import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, GraduationCap, BarChart3, Rocket, Target, Code, ChevronRight, Shield, LineChart, Zap, DollarSign, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollObserver } from "@/hooks/use-scroll";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { GettingStartedGuide } from "@/components/GettingStartedGuide";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const { scrollY, hasScrolled } = useScrollObserver({ threshold: 100 });
  
  gsap.registerPlugin(ScrollTrigger);

  // Mouse move parallax effect - disabled on mobile for performance
  useEffect(() => {
    if (isMobile) return;
    
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
  }, [isMobile]);  // GSAP animations with mobile optimizations
  useEffect(() => {
    setIsLoaded(true);
    
    // Faster animation speeds for better mobile experience
    const mobileSpeedMultiplier = isMobile ? 0.7 : 1;
    
    // Hero animations
    if (heroRef.current) {
      const tl = gsap.timeline();
      
      tl.from(".hero-logo", {
        y: -30,
        opacity: 0,
        duration: 0.6 * mobileSpeedMultiplier,
        ease: "back.out(1.7)"
      });
      tl.from(".hero-glow", {
        opacity: 0,
        scale: 0.8,
        duration: 1.2 * mobileSpeedMultiplier,
        ease: "power3.out"
      }, "-=0.4");
      tl.from(".hero-badge", {
        y: -20,
        opacity: 0,
        duration: 0.5 * mobileSpeedMultiplier,
        ease: "back.out(1.7)"
      }, "-=1.0");
      tl.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 0.7 * mobileSpeedMultiplier,
        ease: "power3.out"
      }, "-=0.5");
      tl.from(".hero-description", {
        y: 30,
        opacity: 0,
        duration: 0.6 * mobileSpeedMultiplier,
        ease: "power3.out"
      }, "-=0.4");
      tl.from(".hero-buttons", {
        y: 20,
        opacity: 0,
        duration: 0.7 * mobileSpeedMultiplier,
        ease: "power3.out"
      }, "-=0.3");
      tl.from(".floating-icon", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.4 * mobileSpeedMultiplier,
        ease: "back.out(1.7)"
      }, "-=0.2");
      tl.from(".stat-card", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5 * mobileSpeedMultiplier,
        ease: "back.out(1.4)"
      }, "-=0.1");
      tl.from(".particle", { 
        opacity: 0,
        scale: 0,
        stagger: 0.01,
        duration: 0.3 * mobileSpeedMultiplier,
        ease: "back.out"
      }, "-=0.4");
    }

    // Floating animation for icons - reduced for mobile
    gsap.to(".floating-icon", {
      y: isMobile ? "random(-4, 4)" : "random(-8, 8)", 
      duration: isMobile ? "random(2, 3)" : "random(1.5, 3.5)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.2
    });

    // Enhanced scroll-triggered animations
    gsap.utils.toArray(".scroll-animate").forEach((element: any) => {
      gsap.fromTo(element, 
        { 
          y: 60,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8 * mobileSpeedMultiplier,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // How it works section animations
    if (howItWorksRef.current) {
      gsap.fromTo(".how-it-works-card", 
        { 
          y: 80,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7 * mobileSpeedMultiplier,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Features animations with stagger
    if (featuresRef.current) {
      gsap.fromTo(".feature-card", 
        { 
          y: 50,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6 * mobileSpeedMultiplier,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Demo section animation
    if (demoRef.current) {
      gsap.fromTo(".demo-content", 
        { 
          y: 60,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8 * mobileSpeedMultiplier,
          ease: "power3.out",
          scrollTrigger: {
            trigger: demoRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Micro-interactions for scroll progress
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        // Animate header elements based on scroll progress
        gsap.to(".scroll-progress-element", {
          opacity: progress > 0.1 ? 1 : 0,
          y: progress > 0.1 ? 0 : -20,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

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
        className={`relative pt-8 sm:pt-10 pb-32 sm:pb-40 overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 min-h-[85vh] sm:min-h-[90vh] flex items-center ${isMobile ? 'touch-pan-y' : ''}`}
      >        {/* CSS for floating animation is in index.css */}
        
        {/* Animated background elements */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="hero-glow absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full opacity-10 blur-[100px]"></div>
          <div className="hero-glow absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-300 rounded-full opacity-10 blur-[80px]"></div>
          <div className="hero-glow absolute top-1/3 right-1/6 w-[300px] h-[300px] bg-cyan-300 rounded-full opacity-10 blur-[60px]"></div>
          
          {/* Random particles */}
          {generateParticles(30)}
          
          {/* Floating icons - Mobile optimized positioning */}
          <div className="absolute top-16 sm:top-20 left-[8%] sm:left-[10%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-xl rotate-12 shadow-xl hover:bg-white/20 transition-all duration-300" style={{animation: 'shark-swim 8s ease-in-out infinite'}}>
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute top-32 sm:top-40 right-[12%] sm:right-[15%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-xl -rotate-6 shadow-xl hover:bg-white/20 transition-all duration-300" style={{animation: 'shark-swim 6s ease-in-out infinite 0.5s'}}>
              <LineChart className="h-4 w-4 sm:h-6 sm:w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute bottom-24 sm:bottom-32 left-[15%] sm:left-[20%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-xl rotate-6 shadow-xl hover:bg-white/20 transition-all duration-300" style={{animation: 'shark-swim 7s ease-in-out infinite 1s'}}>
              <Rocket className="h-4 w-4 sm:h-6 sm:w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute bottom-32 sm:bottom-40 right-[20%] sm:right-[25%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-xl -rotate-12 shadow-xl hover:bg-white/20 transition-all duration-300" style={{animation: 'shark-swim 9s ease-in-out infinite 1.5s'}}>
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute top-[60%] left-[6%] sm:left-[8%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-xl rotate-6 shadow-xl">
              <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-blue-200" />
            </div>
          </div>
          <div className="absolute top-[30%] right-[6%] sm:right-[8%] floating-icon">
            <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-xl -rotate-12 shadow-xl">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-blue-200" />
            </div>
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuNSA2MEgxLjVWNTkuNUg2MFYuNUg1OS41VjYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="hero-logo bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-full shadow-xl inline-block">
              <img src="/logo_neon.png" alt="SharkSenz" className="h-16 w-16 sm:h-20 sm:w-20 animate-logo-glow" />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center rounded-full border border-blue-400/30 bg-blue-900/50 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">For Startup Founders & Entrepreneurs</span>
            </div>
            
            <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight px-2">
              The Complete Platform for
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                First-Time Founders
              </span>
            </h1>

            <p className="hero-description text-lg sm:text-xl md:text-2xl text-blue-100/90 mb-8 sm:mb-10 max-w-3xl mx-auto font-light px-4 leading-relaxed">
              The only platform that combines AI-powered pitch analysis, KPI-driven milestone tracking, and investor connections. 
              <span className="block mt-2 text-cyan-200 font-medium">Built specifically for first-time founders who need proven frameworks, not just theory.</span>
              Where Founders become Sharks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center hero-buttons w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none px-4 sm:px-0">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white border-none shadow-xl shadow-blue-500/30 h-11 sm:h-12 lg:h-14 px-6 sm:px-6 lg:px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 w-full sm:w-auto active:scale-95"
                asChild
              >
                <Link to="/pitch" className="flex items-center justify-center text-sm sm:text-base lg:text-lg font-semibold">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center">
                    Try Free Pitch Analyzer <ArrowRight className="ml-2 h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group relative overflow-hidden bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white hover:text-white shadow-xl shadow-black/10 h-11 sm:h-12 lg:h-14 px-6 sm:px-6 lg:px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-white/30 w-full sm:w-auto active:scale-95"
                asChild
              >
                <Link to="/content" className="flex items-center justify-center text-sm sm:text-base lg:text-lg font-semibold">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center">
                    Explore Learning Hub <ChevronRight className="ml-1 h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </div>
            
            {/* Stats cards - Enhanced with testimonial focus */}
            <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-6 px-4">
              <div className="stat-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl cursor-pointer transition-transform duration-200 active:scale-95">
                <p className="font-bold text-2xl sm:text-3xl text-white">1000+</p>
                <p className="text-xs sm:text-sm text-blue-200">Beta Testers</p>
              </div>
              <div className="stat-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl cursor-pointer transition-transform duration-200 active:scale-95">
                <p className="font-bold text-2xl sm:text-3xl text-white">78%</p>
                <p className="text-xs sm:text-sm text-blue-200">Improved Pitch Scores</p>
              </div>
              <div className="stat-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl cursor-pointer transition-transform duration-200 active:scale-95">
                <p className="font-bold text-2xl sm:text-3xl text-white">24/7</p>
                <p className="text-xs sm:text-sm text-blue-200">AI Coach Access</p>
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

      {/* Getting Started Guide Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <GettingStartedGuide variant="hero" />
          </div>
        </div>
      </section>

      {/* Ideal Customer Profile Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Built Specifically for First-Time Founders</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Our AI coach is trained on 500+ real startup case studies and connects you with KPI-driven milestones that matter
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Target className="text-white w-6 h-6 sm:w-8 sm:w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Tech Entrepreneurs</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Building SaaS, mobile apps, or digital platforms. Need validated business models and investor-ready pitches.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>AI-powered revenue forecasting</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>KPI tracking with industry benchmarks</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <BarChart3 className="text-white w-6 h-6 sm:w-8 sm:w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Service-Based Startups</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Consultancies, agencies, or professional services. Ready to scale beyond personal capacity.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Service pricing optimization</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Client acquisition cost analysis</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Rocket className="text-white w-6 h-6 sm:w-8 sm:w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Product Innovators</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Physical products, e-commerce, or innovative solutions. Need market validation and funding strategies.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Market size calculation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Manufacturing cost modeling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">AI-Powered Learning That Tracks What Matters</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Every milestone connects to real KPIs. Our AI coach analyzes your progress and connects you with investors when you're ready.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="how-it-works-card bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-white font-bold text-xl sm:text-2xl">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Learn With AI-Driven KPI Tracking</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Every lesson connects to measurable business outcomes. Track your Customer Acquisition Cost, Lifetime Value, and 12+ critical startup metrics.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Real-time KPI dashboards with industry benchmarks</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>AI coach trained on 500+ real startup case studies</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Milestone tracking connected to funding readiness</span>
                </div>
              </div>
            </div>
            
            <div className="how-it-works-card bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-white font-bold text-xl sm:text-2xl">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Perfect Your Pitch</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Practice explaining your startup to investors, customers, or partners. Get feedback that helps you sound confident and compelling.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Instant feedback on weak spots in your presentation</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Practice answering tough investor questions</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Track your improvement over time</span>
                </div>
              </div>
            </div>
            
            <div className="how-it-works-card bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-white font-bold text-xl sm:text-2xl">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Get Connected to Real Investors</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                When your KPIs hit investor-ready benchmarks, we connect you with our network of 50+ angel investors and VCs who invest in early-stage startups.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Access to investor directory with funding stages</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Pitch training with real investor feedback</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Guided introduction process and follow-up support</span>
                </div>
              </div>
            </div>
          </div>
          
          <div ref={demoRef} className="demo-content bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">See How Our Tools Save You Money</h3>
            <p className="text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Our Customer Value Calculator shows if your business model actually makes money. 
              Here's what a healthy startup looks like:
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 max-w-md mx-auto">
              <div className="text-left space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-200">Average Customer Value:</span>
                  <span className="font-semibold">$2,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Cost to Get One Customer:</span>
                  <span className="font-semibold">$480</span>
                </div>
                <div className="border-t border-white/20 pt-2 flex justify-between">
                  <span className="text-blue-200">Profit Ratio:</span>
                  <span className="font-bold text-green-300">5:1 ✓ Excellent</span>
                </div>
                <div className="text-xs text-blue-200 mt-2">
                  💡 Your ratio exceeds the 3:1 minimum benchmark
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              className="mt-4 sm:mt-6 bg-white text-blue-900 hover:bg-blue-50 transition-all duration-200 active:scale-95"
              asChild
            >
              <Link to="/analytics">Try Live Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Beta Tester Testimonials Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Trusted by 1000+ Beta Testers</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Real founders sharing their success stories with our AI-powered platform
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="flex items-center mb-4">
                <img src="/public/assets/team/image.jpg" alt="Sarah Chen" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-600">SaaS Founder, TechFlow</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The KPI tracking changed everything. I went from guessing my unit economics to having crystal clear metrics that investors actually cared about."
              </p>
              <div className="flex text-yellow-400 text-sm">
                ★★★★★ <span className="ml-2 text-gray-600">Improved pitch score by 85%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="flex items-center mb-4">
                <img src="/public/assets/team/image.jpg" alt="Marcus Rodriguez" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900">Marcus Rodriguez</h4>
                  <p className="text-sm text-gray-600">E-commerce Founder, GreenPath</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The AI coach caught a major flaw in my pricing strategy that would have cost me $50k in lost revenue. Worth every penny."
              </p>
              <div className="flex text-yellow-400 text-sm">
                ★★★★★ <span className="ml-2 text-gray-600">Connected with 3 investors</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="flex items-center mb-4">
                <img src="/public/assets/team/image.jpg" alt="Elena Vasquez" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900">Elena Vasquez</h4>
                  <p className="text-sm text-gray-600">Consulting Founder, BizBoost</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Finally, a platform that doesn't just teach theory. The milestone tracking kept me focused on what actually moves the needle."
              </p>
              <div className="flex text-yellow-400 text-sm">
                ★★★★★ <span className="ml-2 text-gray-600">Achieved 3:1 LTV:CAC ratio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 scroll-animate">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Our platform provides all the essential resources for startup founders at any stage
            </p>
          </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="feature-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
            <CardHeader className="pb-4">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg sm:text-xl">Comprehensive Content</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Access our A-Z library of founder knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-600 text-sm sm:text-base">
                Explore topics from fundraising to product-market fit, all organized in an easy-to-navigate format.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full transition-all duration-200 active:scale-95">
                <Link to="/content">Browse Library</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
            <CardHeader className="pb-4">
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg sm:text-xl">Track Your Progress</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Mark lessons as complete and take notes
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-600 text-sm sm:text-base">
                Keep track of what you've learned and maintain personal notes alongside each lesson.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full transition-all duration-200 active:scale-95">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
            <CardHeader className="pb-4">
              <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg sm:text-xl">Pitch Simulator</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Practice your startup pitch and get feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-600 text-sm sm:text-base">
                Refine your elevator pitch with our interactive simulator and receive instant feedback to improve.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full transition-all duration-200 active:scale-95">
                <Link to="/pitch-simulator">Try Pitch Simulator</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
            <CardHeader className="pb-4">
              <Target className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg sm:text-xl">Goal Setting</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Define your learning path
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-600 text-sm sm:text-base">
                Set clear learning objectives and track your progress towards your startup goals.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full transition-all duration-200 active:scale-95">
                <Link to="/dashboard">Set Goals</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
            <CardHeader className="pb-4">
              <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg sm:text-xl">Analytics Dashboard</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Visualize your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-600 text-sm sm:text-base">
                See your progress across different categories and identify areas for further improvement.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full transition-all duration-200 active:scale-95">
                <Link to="/dashboard">View Analytics</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="feature-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-slate-200">
            <CardHeader className="pb-4">
              <Code className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg sm:text-xl">Founder Resources</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Tools and templates for startups
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-slate-600 text-sm sm:text-base">
                Access practical tools, templates, and resources to help you implement what you've learned.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full transition-all duration-200 active:scale-95">
                <Link to="/resources">Access Resources</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
