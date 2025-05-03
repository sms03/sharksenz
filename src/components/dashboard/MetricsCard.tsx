import { ReactNode, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from "gsap";

interface MetricsCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  delay?: number;
}

export default function MetricsCard({ title, icon, children, delay = 0 }: MetricsCardProps) {
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const iconRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    // Card entrance animation
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay, ease: "power2.out" }
    );
    
    // Icon animation
    gsap.fromTo(
      iconRef.current,
      { opacity: 0, scale: 0.5, rotate: -10 },
      { opacity: 1, scale: 1, rotate: 0, duration: 0.4, delay: delay + 0.2, ease: "back.out(1.7)" }
    );
    
    // Title animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, delay: delay + 0.1, ease: "power2.out" }
    );
    
    // Content animation
    gsap.fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, delay: delay + 0.3, ease: "power2.out" }
    );
    
    // Hover effect
    cardRef.current.addEventListener('mouseenter', () => {
      gsap.to(cardRef.current, {
        y: -5,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(iconRef.current, {
        rotate: 5,
        scale: 1.1,
        duration: 0.4,
        ease: "power1.out"
      });
    });
    
    cardRef.current.addEventListener('mouseleave', () => {
      gsap.to(cardRef.current, {
        y: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(iconRef.current, {
        rotate: 0,
        scale: 1,
        duration: 0.4,
        ease: "power1.out"
      });
    });
    
    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mouseenter', () => {});
        cardRef.current.removeEventListener('mouseleave', () => {});
      }
    };
  }, [delay]);

  return (
    <Card ref={cardRef} className="overflow-hidden transition-all relative">
      {/* Add a subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-shark-50/30 dark:to-shark-950/20 pointer-events-none"></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium" ref={titleRef}>
          {title}
        </CardTitle>
        <div ref={iconRef} className="transition-transform">
          {icon}
        </div>
      </CardHeader>
      <CardContent ref={contentRef}>
        {children}
      </CardContent>
    </Card>
  );
}
