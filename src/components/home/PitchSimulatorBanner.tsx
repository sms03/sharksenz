import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered with error handling
try {
  gsap.registerPlugin(ScrollTrigger);
} catch (error) {
  console.error("Error registering ScrollTrigger:", error);
}

export function PitchSimulatorBanner() {
  const bannerRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const [animationFailed, setAnimationFailed] = useState(false);
  
  useEffect(() => {
    try {
      // Verify refs are available
      if (!bannerRef.current || !textRef.current || !buttonRef.current) {
        console.warn("Some refs are not available for animation in PitchSimulatorBanner");
        setAnimationFailed(true);
        return;
      }
      
      // Create a timeline for the banner animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 70%",
          once: true
        },
        onComplete: () => {
          // Ensure elements are visible when animation completes
          if (bannerRef.current) bannerRef.current.style.opacity = '1';
          if (textRef.current) textRef.current.style.opacity = '1';
          if (buttonRef.current) buttonRef.current.style.opacity = '1';
        }
      });
      
      // Add shine effect element with error handling
      try {
        const banner = bannerRef.current;
        const shine = document.createElement('div');
        shine.className = 'absolute inset-0 pointer-events-none';
        banner.appendChild(shine);
        
        // Banner reveal animation
        tl.fromTo(banner, 
          { opacity: 0, scale: 0.95 }, 
          { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }
        );
        
        // Text animation with check for children
        if (textRef.current && textRef.current.children && textRef.current.children.length > 0) {
          tl.fromTo(textRef.current.children, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 },
            "-=0.3"
          );
        } else {
          // If no children, animate the container itself
          tl.fromTo(textRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.3"
          );
        }
        
        // Button animation
        tl.fromTo(buttonRef.current, 
          { opacity: 0, scale: 0.8 }, 
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
          "-=0.2"
        );
        
        // Add shine animation that repeats
        try {
          tl.fromTo(shine, 
            { background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)", left: "-100%", width: "100px", height: "100%" },
            { left: "200%", repeat: -1, repeatDelay: 3, duration: 1.5, ease: "power2.inOut" }
          );
        } catch (shineError) {
          console.error("Shine animation error:", shineError);
          // Non-critical animation, can continue without it
        }
        
        // Button hover animation with try-catch
        try {
          const button = buttonRef.current;
          if (button) {
            button.addEventListener('mouseenter', () => {
              gsap.to(button, { 
                scale: 1.05, 
                backgroundColor: "#0F4C70", 
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)", 
                duration: 0.3 
              });
            });
            
            button.addEventListener('mouseleave', () => {
              gsap.to(button, { 
                scale: 1, 
                backgroundColor: "#0F5B83", 
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
                duration: 0.3 
              });
            });
          }
        } catch (hoverError) {
          console.error("Button hover animation error:", hoverError);
          // Non-critical animation, can continue without it
        }
        
        // Clean up animations on component unmount
        return () => {
          try {
            if (shine && banner && banner.contains(shine)) {
              banner.removeChild(shine);
            }
            tl.kill();
            ScrollTrigger.getAll().forEach(trigger => {
              if (trigger.vars && trigger.vars.trigger === banner) {
                trigger.kill();
              }
            });
          } catch (cleanupError) {
            console.error("Animation cleanup error:", cleanupError);
          }
        };
      } catch (error) {
        console.error("Inner animation error:", error);
        setAnimationFailed(true);
        return () => {};
      }
    } catch (error) {
      console.error("General animation error in PitchSimulatorBanner:", error);
      setAnimationFailed(true);
      return () => {};
    }
  }, []);

  return (
    <section className="my-16 overflow-hidden">
      <div 
        ref={bannerRef} 
        className={`rounded-xl border bg-gradient-to-r from-shark-500/90 to-shark-600 p-6 md:p-8 text-white shadow-xl relative overflow-hidden ${animationFailed ? 'opacity-100' : ''} h-[250px] flex flex-col justify-center`}
      >
        <div ref={textRef} className={`mb-6 text-center ${animationFailed ? 'opacity-100' : ''}`}>
          <h2 className="font-heading mb-2 text-2xl font-bold">Ready to pitch like a pro?</h2>
          <p className="font-body-lora mx-auto max-w-2xl text-shark-100">
            Practice your pitch, get feedback, and refine your presentation skills
            with our interactive Pitch Simulator.
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            ref={buttonRef}
            to="/pitch-simulator"
            className={`font-subheading-libre rounded-lg bg-shark-500 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-shark-600 ${animationFailed ? 'opacity-100' : ''} h-12 flex items-center justify-center w-64`}
          >
            Try the Pitch Simulator
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-shark-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
      </div>
    </section>
  );
}
