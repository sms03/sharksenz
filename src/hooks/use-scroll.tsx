// filepath: d:\GitHub\sharksenz\src\hooks\use-scroll.tsx
import { useState, useEffect } from 'react';

interface ScrollOptions {
  threshold?: number;
  scrollUp?: boolean;
  throttleMs?: number; // Add throttling for better mobile performance
}

export function useScrollObserver(options: ScrollOptions = {}) {
  const { threshold = 100, scrollUp = false, throttleMs = 16 } = options; // 60fps throttling
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Detect if user has scrolled beyond threshold
          if (currentScrollY > threshold) {
            setHasScrolled(true);
          } else {
            setHasScrolled(false);
          }
          
          // Detect scroll direction
          if (scrollUp) {
            setIsScrollingUp(currentScrollY < lastScrollY);
            setLastScrollY(currentScrollY);
          }
          
          setScrollY(currentScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Add event listener for scroll with passive flag for better mobile performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, lastScrollY, scrollUp]);

  return { hasScrolled, scrollY, isScrollingUp };
}
