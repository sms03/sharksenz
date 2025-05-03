import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation presets for reuse throughout the application
export const animations = {
  fadeIn: (element: HTMLElement, delay = 0, duration = 0.6) => {
    return gsap.from(element, {
      opacity: 0,
      y: 20,
      duration,
      delay,
      ease: "power2.out"
    });
  },
  
  staggerFadeIn: (elements: HTMLElement[], delay = 0, stagger = 0.1, duration = 0.6) => {
    return gsap.from(elements, {
      opacity: 0,
      y: 20,
      duration,
      delay,
      stagger,
      ease: "power2.out"
    });
  },
  
  slideInLeft: (element: HTMLElement, delay = 0, duration = 0.8) => {
    return gsap.from(element, {
      opacity: 0,
      x: -50,
      duration,
      delay,
      ease: "power2.out"
    });
  },
  
  slideInRight: (element: HTMLElement, delay = 0, duration = 0.8) => {
    return gsap.from(element, {
      opacity: 0,
      x: 50,
      duration,
      delay,
      ease: "power2.out"
    });
  },
  
  bounceIn: (element: HTMLElement, delay = 0, duration = 0.8) => {
    return gsap.from(element, {
      opacity: 0,
      scale: 0.3,
      duration,
      delay,
      ease: "back.out(1.7)"
    });
  },
  
  pulseAnimation: (element: HTMLElement, delay = 0) => {
    return gsap.to(element, {
      scale: 1.05,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay
    });
  },

  // Scroll-triggered animations
  revealOnScroll: (element: HTMLElement, delay = 0) => {
    return ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: "power2.out"
      }),
      once: true
    });
  }
};

// Custom hooks for easy animation implementation
export const useRevealAnimation = (triggerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!triggerRef.current) return;
    
    const element = triggerRef.current;
    
    gsap.set(element, { opacity: 0, y: 30 });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        once: true
      }
    });
    
    tl.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    });
    
    return () => {
      tl.kill();
    };
  }, [triggerRef]);
};

export const useStaggeredAnimation = (containerRef: React.RefObject<HTMLElement>, childSelector: string) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const elements = container.querySelectorAll(childSelector);
    
    gsap.set(elements, { opacity: 0, y: 30 });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true
      }
    });
    
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });
    
    return () => {
      tl.kill();
    };
  }, [containerRef, childSelector]);
};