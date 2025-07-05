// Highly accurate scroll progress hook that matches exact scroll position
import { useState, useEffect, useCallback } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Precise calculation that matches browser scrollbar exactly
  const calculateProgress = useCallback(() => {
    // Get current scroll position - use the most reliable method
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    
    // Get document dimensions exactly as browser calculates them
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Maximum scroll position (this is what browser uses for scrollbar)
    const maxScrollTop = scrollHeight - clientHeight;
    
    if (maxScrollTop <= 0) {
      return 0;
    }
    
    // Calculate exact progress as browser scrollbar position
    const progressValue = scrollTop / maxScrollTop;
    
    // Ensure precise bounds and handle floating point precision
    return Math.min(Math.max(progressValue, 0), 1);
  }, []);
  
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let animationFrame: number | null = null;
    
    const updateProgress = () => {
      const newProgress = calculateProgress();
      setProgress(newProgress);
      animationFrame = null;
    };
    
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Cancel any pending animation frame to prevent multiple updates
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      
      // Schedule update for next frame - ensures smooth, instant response
      animationFrame = requestAnimationFrame(updateProgress);
      
      // Reset scrolling state
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };
    
    const handleResize = () => {
      // Immediate recalculation on resize without RAF delay
      const newProgress = calculateProgress();
      setProgress(newProgress);
    };
    
    // Set initial progress
    const initialProgress = calculateProgress();
    setProgress(initialProgress);
    
    // Add optimized event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    
    // Handle dynamic content changes that affect document height
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    
    if (document.documentElement) {
      resizeObserver.observe(document.documentElement);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      resizeObserver.disconnect();
      
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      clearTimeout(scrollTimeout);
    };
  }, [calculateProgress]);
  
  return { progress, isScrolling };
}
