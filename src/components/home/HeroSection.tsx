import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { gsap } from "gsap";

export function HeroSection() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const [animationFailed, setAnimationFailed] = useState(false);

  useEffect(() => {
    try {
      // Ensure all refs are valid before attempting animation
      if (!heroRef.current || !titleRef.current || !descriptionRef.current || !buttonsRef.current) {
        console.warn("Some refs are not available for animation");
        setAnimationFailed(true);
        return;
      }
      
      // Create a timeline for sequenced animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      // Add animations to the timeline
      tl.fromTo(heroRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8 }
      );
      
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6 }, 
        "-=0.4"
      );
      
      tl.fromTo(descriptionRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6 }, 
        "-=0.4"
      );
      
      // Only animate children if they exist
      const buttonChildren = buttonsRef.current.children;
      if (buttonChildren && buttonChildren.length > 0) {
        tl.fromTo(buttonChildren, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, 
          "-=0.3"
        );
      }
      
      // Clean up animation on component unmount
      return () => {
        tl.kill();
      };
    } catch (error) {
      console.error("Error in HeroSection animation:", error);
      setAnimationFailed(true);
    }
  }, []);

  return (
    <section className={`mb-12 ${animationFailed ? 'opacity-100' : ''}`} ref={heroRef}>
      <div className="rounded-xl bg-gradient-to-r from-shark-500 to-shark-700 px-6 py-12 text-white md:px-12 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-shark-400/10 rounded-full blur-3xl"></div>
        
        <h1 className={`mb-4 text-3xl font-bold tracking-tight md:text-4xl ${animationFailed ? 'opacity-100' : ''}`} ref={titleRef}>
          Welcome to SharkSenz
        </h1>
        <p className={`mb-6 max-w-2xl text-shark-100 md:text-lg ${animationFailed ? 'opacity-100' : ''}`} ref={descriptionRef}>
          Master the language of business and investment through interactive learning
          modules and practical tools inspired by Shark Tank.
        </p>
        <div className={`flex flex-wrap gap-4 ${animationFailed ? 'opacity-100' : ''}`} ref={buttonsRef}>
          {user ? (
            <>
              <Link
                to="/learning"
                className="rounded-lg bg-white px-4 py-2 font-medium text-shark-700 shadow-sm transition-all hover:bg-shark-50 hover:shadow-md hover:-translate-y-0.5"
              >
                Start Learning
              </Link>
              <Link
                to="/profile"
                className="rounded-lg bg-shark-600/30 px-4 py-2 font-medium text-white shadow-sm transition-all hover:bg-shark-600/50 hover:shadow-md hover:-translate-y-0.5"
              >
                View Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="flex items-center rounded-lg bg-white px-4 py-2 font-medium text-shark-700 shadow-sm transition-all hover:bg-shark-50 hover:shadow-md hover:-translate-y-0.5"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
              <Link
                to="/auth"
                className="flex items-center rounded-lg bg-shark-600/30 px-4 py-2 font-medium text-white shadow-sm transition-all hover:bg-shark-600/50 hover:shadow-md hover:-translate-y-0.5"
                state={{ isLogin: false }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
