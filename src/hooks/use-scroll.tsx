// filepath: d:\GitHub\sharksenz\src\hooks\use-scroll.tsx
import { useState, useEffect } from 'react';

interface ScrollOptions {
  threshold?: number;
  scrollUp?: boolean;
}

export function useScrollObserver(options: ScrollOptions = {}) {
  const { threshold = 100, scrollUp = false } = options;
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
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
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, lastScrollY, scrollUp]);

  return { hasScrolled, scrollY, isScrollingUp };
}
