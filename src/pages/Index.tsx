
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, GraduationCap, BarChart3, Rocket, Target, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    // Hero animations
    if (heroRef.current) {
      const tl = gsap.timeline();
      
      tl.from(".hero-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      tl.from(".hero-description", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4");
      
      tl.from(".hero-buttons .button", {
        y: 15,
        opacity: 0,
        stagger: 0.2,
        duration: 0.5,
        ease: "back.out(1.4)"
      }, "-=0.2");

      tl.from(".hero-badge", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "back.out"
      }, "-=0.3");
    }

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
            
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-white px-4 py-1 mb-6 hero-badge">
              <span className="text-xs font-medium text-blue-700">The Ultimate Founder Resource</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 hero-title bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
              Alpha Founder Academy
            </h1>
            
            <p className="text-xl text-slate-700 mb-8 hero-description max-w-2xl mx-auto">
              Master the essential skills and knowledge every founder needs to build successful startups. 
              From idea validation to scaling, we've got you covered.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center hero-buttons">
              <Button size="lg" className="button">
                <Link to="/content" className="flex items-center">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="button">
                <Link to="/content">
                  Browse Library
                </Link>
              </Button>
            </div>
            
            {/* Stats badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <div className="bg-white border border-gray-100 rounded-lg px-5 py-3 shadow-sm hero-badge">
                <p className="font-bold text-2xl text-blue-700">50+</p>
                <p className="text-sm text-gray-600">Learning Modules</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg px-5 py-3 shadow-sm hero-badge">
                <p className="font-bold text-2xl text-blue-700">1000+</p>
                <p className="text-sm text-gray-600">Startup Founders</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg px-5 py-3 shadow-sm hero-badge">
                <p className="font-bold text-2xl text-blue-700">24/7</p>
                <p className="text-sm text-gray-600">Learning Access</p>
              </div>
            </div>
          </div>
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
