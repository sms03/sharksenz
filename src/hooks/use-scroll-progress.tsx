// Simplified and stable scroll progress hook
import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const calculateProgress = () => {
      // Use both document.body and document.documentElement for better compatibility
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const scrollHeight = documentHeight - windowHeight;
      
      if (scrollHeight <= 0) {
        return 0;
      }
      
      const calculated = scrollTop / scrollHeight;
      return Math.min(Math.max(calculated, 0), 1);
    };
    
    const handleScroll = () => {
      const newProgress = calculateProgress();
      setProgress(newProgress);
      setIsScrolling(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    // Initial calculation
    const initialProgress = calculateProgress();
    setProgress(initialProgress);
    
    // Add event listeners with passive for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    // Also listen for load events to recalculate when content loads
    window.addEventListener('load', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('load', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  
  return { progress, isScrolling };
}
