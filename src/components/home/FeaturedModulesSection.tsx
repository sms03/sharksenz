import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { 
  CircleDollarSign, 
  TrendingUp, 
  Users, 
  Presentation 
} from "lucide-react";
import { ModuleCard } from "@/components/ui/module-card";
import { useAuth } from "@/components/AuthProvider";
import { LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
try {
  gsap.registerPlugin(ScrollTrigger);
} catch (error) {
  console.error("Error registering ScrollTrigger:", error);
}

interface LearningModule {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  duration: string;
  completed: boolean;
}

// Featured learning modules
const featuredModules: LearningModule[] = [
  {
    title: "Valuation Fundamentals",
    description: "Learn how investors determine company value in Shark Tank pitches",
    icon: CircleDollarSign,
    href: "/learning/valuation",
    duration: "8 min",
    completed: false
  },
  {
    title: "Burn Rate Explained",
    description: "Understand what burn rate means and why it matters to investors",
    icon: TrendingUp,
    href: "/learning/burn-rate",
    duration: "5 min",
    completed: true
  },
  {
    title: "Customer Acquisition",
    description: "Master the concepts of CAC and how it influences investment decisions",
    icon: Users,
    href: "/learning/customer-acquisition",
    duration: "7 min",
    completed: false
  },
  {
    title: "Pitch Deck Essentials",
    description: "Create a compelling pitch that grabs shark attention in minutes",
    icon: Presentation,
    href: "/learning/pitch-deck",
    duration: "10 min",
    completed: false
  }
];

export function FeaturedModulesSection() {
  const { user } = useAuth();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const [animationFailed, setAnimationFailed] = useState(false);
  
  useEffect(() => {
    try {
      // Check if refs are available
      if (!headerRef.current || !cardsRef.current) {
        console.warn("Some refs are not available for animation in FeaturedModulesSection");
        setAnimationFailed(true);
        return;
      }
      
      // Header animation with try-catch for safety
      try {
        gsap.fromTo(
          headerRef.current, 
          { opacity: 0, y: 20 }, 
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.7, 
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              once: true
            } 
          }
        );
      } catch (error) {
        console.error("Header animation error:", error);
        // Make header visible if animation fails
        if (headerRef.current) {
          headerRef.current.style.opacity = 1;
          headerRef.current.style.transform = 'none';
        }
      }
      
      // Card animations with try-catch for safety
      try {
        const cards = cardsRef.current.children;
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards, 
            { opacity: 0, y: 40, scale: 0.95 }, 
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: 0.5, 
              stagger: 0.1,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 75%",
                once: true
              } 
            }
          );
          
          // Hover animations for cards
          Array.from(cards).forEach(card => {
            (card as HTMLElement).addEventListener('mouseenter', () => {
              gsap.to(card as HTMLElement, { 
                y: -8, 
                scale: 1.03, 
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                duration: 0.3, 
                ease: "power2.out" 
              });
            });
            
            (card as HTMLElement).addEventListener('mouseleave', () => {
              gsap.to(card as HTMLElement, { 
                y: 0, 
                scale: 1, 
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
                duration: 0.3, 
                ease: "power2.out" 
              });
            });
          });
        }
      } catch (error) {
        console.error("Cards animation error:", error);
        setAnimationFailed(true);
        
        // Make cards visible if animation fails
        if (cardsRef.current) {
          const cards = cardsRef.current.children;
          if (cards && cards.length > 0) {
            Array.from(cards).forEach(card => {
              (card as HTMLElement).style.opacity = '1';
              (card as HTMLElement).style.transform = 'none';
            });
          }
        }
      }
      
      // Clean up animations on component unmount
      return () => {
        try {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        } catch (error) {
          console.error("Error cleaning up ScrollTrigger:", error);
        }
      };
    } catch (error) {
      console.error("General animation error in FeaturedModulesSection:", error);
      setAnimationFailed(true);
      return () => {};
    }
  }, []);
  
  return (
    <section className="mb-12" ref={sectionRef}>
      <div className={`mb-6 flex items-end justify-between ${animationFailed ? 'opacity-100' : ''}`} ref={headerRef}>
        <div>
          <h2 className="text-2xl font-bold">Featured Learning Modules</h2>
          <p className="text-muted-foreground">
            Bite-sized lessons to master business concepts
          </p>
        </div>
        <Link to="/learning" className="text-sm font-medium text-shark-500 hover:underline relative group">
          View all modules
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-shark-500 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ${animationFailed ? 'opacity-100' : ''}`} ref={cardsRef}>
        {featuredModules.map((module) => (
          <ModuleCard
            key={module.title}
            title={module.title}
            description={module.description}
            icon={module.icon}
            href={user ? module.href : "/auth"}
            duration={module.duration}
          />
        ))}
      </div>
    </section>
  );
}
