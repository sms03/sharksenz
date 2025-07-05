import { useState, useEffect } from 'react';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollY = window.scrollY;
      const scrollProgress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;
      
      setProgress(scrollProgress);
      setIsScrolling(true);
      
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolling(false), 150);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      clearTimeout(timeout);
    };
  }, []);

  return { progress, isScrolling };
};