// Simplified and stable scroll progress hook
import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const calculateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollHeight <= 0) {
        return 0;
      }
      
      return Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
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
    handleScroll();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
  
  return { progress, isScrolling };
}
