// Hook for scroll-based animations with mobile optimization
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    delay = 0
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;
    
    // Mobile optimization: reduce threshold for better performance
    const mobileThreshold = isMobile ? Math.max(threshold * 0.7, 0.05) : threshold;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold: mobileThreshold,
        rootMargin: isMobile ? '0px 0px -20px 0px' : rootMargin,
      }
    );
    
    observer.observe(currentElement);
    
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, delay, hasAnimated, isMobile]);
  
  return {
    elementRef,
    isVisible,
    hasAnimated
  };
}

// Hook for managing multiple scroll animations with staggered delays
export function useStaggeredScrollAnimation(count: number, baseDelay: number = 0) {
  const isMobile = useIsMobile();
  const staggerDelay = isMobile ? baseDelay * 0.5 : baseDelay; // Faster on mobile
  
  const animations = Array.from({ length: count }, (_, index) => 
    useScrollAnimation({ 
      delay: staggerDelay * index,
      threshold: isMobile ? 0.05 : 0.1
    })
  );
  
  return animations;
}

// Hook for scroll progress tracking with enhanced performance
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          
          // Handle edge cases - avoid division by zero
          if (scrollHeight <= 0) {
            setProgress(0);
            setIsScrolling(false);
            ticking = false;
            return;
          }
          
          const newProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
          
          // Only update if there's a meaningful change to prevent unnecessary renders
          setProgress(prevProgress => {
            const diff = Math.abs(newProgress - prevProgress);
            return diff > 0.001 ? newProgress : prevProgress;
          });
          
          setIsScrolling(true);
          
          // Clear previous timeout
          clearTimeout(scrollTimeout);
          
          // Set isScrolling to false after scrolling stops
          // Reduced timeout for mobile for better responsiveness
          scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
          }, isMobile ? 100 : 150);
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Initial calculation on mount
    const initialCalculation = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        setProgress(Math.min(Math.max(scrollTop / scrollHeight, 0), 1));
      }
    };
    
    // Calculate initial state
    initialCalculation();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Recalculate on window resize (handles dynamic content)
    const handleResize = () => {
      setTimeout(initialCalculation, 100); // Debounce resize
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile]);
  
  return { progress, isScrolling };
}
