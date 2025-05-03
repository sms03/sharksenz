import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pageRef = useRef(null);
  const overlayRef = useRef(null);
  const [transitionComplete, setTransitionComplete] = useState(false);
  
  useEffect(() => {
    // Defensive fallback: If the animation doesn't complete in 2 seconds, force hide the overlay
    const fallbackTimer = setTimeout(() => {
      setTransitionComplete(true);
    }, 2000);
    
    try {
      // Initial page load animation
      const tl = gsap.timeline({
        onComplete: () => {
          setTransitionComplete(true);
          clearTimeout(fallbackTimer);
        }
      });
      
      // First, ensure the overlay is visible and covering the content
      tl.set(overlayRef.current, { 
        opacity: 1,
        y: 0
      });
      
      // Set initial state of the content
      tl.set(pageRef.current, {
        opacity: 0,
        y: 20
      });
      
      // Animate the overlay away
      tl.to(overlayRef.current, {
        y: '-100%',
        duration: 0.7,
        ease: "power2.inOut",
      });
      
      // Animate in the content
      tl.to(pageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");
      
      // Clean up animation on component unmount
      return () => {
        tl.kill();
        clearTimeout(fallbackTimer);
      };
    } catch (error) {
      console.error("Animation error:", error);
      setTransitionComplete(true);
      clearTimeout(fallbackTimer);
      return () => clearTimeout(fallbackTimer);
    }
  }, []);
  
  return (
    <div className="relative overflow-hidden">
      {/* Transition overlay */}
      <div 
        ref={overlayRef}
        className={`fixed inset-0 z-50 bg-gradient-to-b from-shark-900 to-shark-800 transform ${transitionComplete ? 'hidden' : ''}`}
      />
      
      {/* Page content */}
      <div ref={pageRef} className={transitionComplete ? 'opacity-100' : ''}>
        {children}
      </div>
    </div>
  );
}