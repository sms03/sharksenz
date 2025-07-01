import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, UserCircle, BarChart, Lock, 
  ChevronDown, Home, LibrarySquare, LineChart, CreditCard, Info, FileText, TrendingUp, Presentation
} from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRouteIndicator } from "@/components/ProtectedRouteIndicator";
import gsap from "gsap";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollObserver } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { hasScrolled: scrolled, scrollY, isScrollingUp } = useScrollObserver({ 
    threshold: 20, 
    scrollUp: true 
  });

  // Use useRef to track previous scroll position for animation effects
  const prevScrollY = useRef(0);
  
  // Check if user is scrolling down significantly (hide navbar)
  const [hideOnScroll, setHideOnScroll] = useState(false);
  
  useEffect(() => {
    // Logic to show/hide navbar on scroll
    // Only hide when scrolling down AND past threshold
    if (scrollY > 100) {
      if (scrollY > prevScrollY.current + 20 && !isScrollingUp) {
        setHideOnScroll(true);
      } else if (isScrollingUp) {
        setHideOnScroll(false);
      }
    } else {
      setHideOnScroll(false);
    }
    
    prevScrollY.current = scrollY;
  }, [scrollY, isScrollingUp]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
    // Function to check if a route is protected
  const isProtectedRoute = (path: string): boolean => {
    return ['/analytics', '/content', '/market-trends', '/profile', '/pitch'].some(route => 
      path.startsWith(route)
    );
  };
  
  // Track mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobile) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };
    // Function to render nav links with protection indicators when needed
  const renderNavLink = (path: string, label: string, isDesktop: boolean = true, icon?: React.ReactNode) => {
    const isActive = location.pathname === path;
    const needsProtection = !user && isProtectedRoute(path);
    const isHovered = hoveredItem === path;    const baseClasses = isDesktop
      ? cn(
          "relative group flex items-center gap-2 px-4 py-2 rounded-full font-normal transition-all duration-300 transform hover:scale-105 overflow-hidden",
          isActive 
            ? "text-blue-700 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 shadow-sm border border-blue-200/30" 
            : "text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50/80 hover:via-cyan-50/60 hover:to-blue-50/80",
          // Ocean wave effect on hover
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400/10 before:via-cyan-400/15 before:to-teal-400/10 before:opacity-0 before:transition-all before:duration-500 hover:before:opacity-100",
          // Enhanced ripple effect with sea theme
          "after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-blue-400/40 after:to-transparent after:opacity-0 after:transition-all after:duration-300 hover:after:opacity-100",
          // Deep sea shadow on hover
          "hover:shadow-md hover:shadow-blue-200/20"
        )
      : cn(
          "group flex items-center gap-3 px-4 py-3 mx-2 rounded-full font-normal transition-all duration-300 transform hover:scale-[1.02] overflow-hidden",
          isActive 
            ? "text-blue-700 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 shadow-sm border border-blue-200/30" 
            : "text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50/90 hover:via-cyan-50/70 hover:to-blue-50/90",
          // Mobile ocean wave effect
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400/5 before:via-cyan-400/10 before:to-blue-400/5 before:opacity-0 before:transition-all before:duration-300 hover:before:opacity-100"
        );
    
    return (
      <Link 
        to={path}
        className={baseClasses}
        onClick={isDesktop ? undefined : () => setIsMenuOpen(false)}
        onMouseEnter={isDesktop ? () => setHoveredItem(path) : undefined}
        onMouseLeave={isDesktop ? () => setHoveredItem(null) : undefined}
      >        {icon && (
          <span className={cn(
            "transition-all duration-300 group-hover:scale-105 relative z-10",
            isActive ? "text-blue-700 drop-shadow-sm" : "text-current"
          )}>
            {icon}
          </span>
        )}
        <span className="relative z-10 transition-all duration-300">{label}</span>
        {needsProtection && (
          <Lock className={cn(
            "h-3.5 w-3.5 transition-all duration-300 relative z-10",
            isActive ? "text-blue-700/80" : "text-gray-400 group-hover:text-blue-600"
          )} />
        )}
          {/* Enhanced Ocean bubble effect on active state */}
        {isActive && isDesktop && (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute top-2 left-6 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0ms' }} />
            <div className="absolute top-4 right-8 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '600ms' }} />
            <div className="absolute bottom-3 left-1/2 w-0.5 h-0.5 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '1200ms' }} />
            <div className="absolute top-1/2 left-4 w-0.5 h-0.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '4s' }} />
            <div className="absolute bottom-2 right-6 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '900ms', animationDuration: '3s' }} />
          </div>
        )}
        
        {/* Enhanced flowing water effect on hover */}
        {isHovered && !isActive && isDesktop && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-cyan-400/10 to-blue-400/5 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-400/5 to-transparent" style={{ animation: 'sea-shimmer 3s ease-in-out infinite' }} />
          </div>
        )}
      </Link>
    );
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);  // Simplified GSAP animations - Initial load
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Only run animation on initial load
    if (navRef.current) {
      // Logo entrance
      tl.fromTo(".nav-logo", 
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      
      // Desktop nav items
      tl.fromTo(".desktop-nav-item", 
        { y: -8, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.3, 
          ease: "power2.out" 
        }, 
        "-=0.2"
      );
      
      // Auth button
      tl.fromTo(".nav-auth", 
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 
        "-=0.1"
      );
    }
  }, []);
  
  // Simplified Mobile menu animation
  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(".mobile-nav", 
        { opacity: 0, y: -15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.25,
          ease: "power2.out"
        }
      );
      
      gsap.fromTo(".mobile-nav-item", 
        { x: -10, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          stagger: 0.04, 
          duration: 0.25,
          delay: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [isMenuOpen]);
  
  // Simplified Scroll animations
  useEffect(() => {
    if (scrolled && !isMenuOpen) {
      gsap.fromTo(navRef.current, 
        { boxShadow: "none" },
        { 
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)", 
          duration: 0.3,
          ease: "power2.out"
        }
      );
    } else if (!scrolled && !isMenuOpen) {
      gsap.to(navRef.current, { 
        boxShadow: "none", 
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [scrolled, isMenuOpen]);
  return (    <header 
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 relative overflow-hidden", 
        scrolled 
          ? "bg-gradient-to-r from-blue-50/95 via-cyan-50/95 to-teal-50/95 backdrop-blur-md border-b border-blue-200/30 shadow-lg py-1" 
          : "bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/80 py-2",
        // Always keep navbar visible for better founder workflow
        "transform translate-y-0",
        isMenuOpen && "bg-gradient-to-r from-blue-50/98 via-white/98 to-cyan-50/98 shadow-xl"
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Ocean wave background animation */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-cyan-400/15 to-teal-400/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(20, 184, 166, 0.04) 0%, transparent 50%)
            `,
            animation: 'ocean-flow 20s ease-in-out infinite'
          }} />
        </div>
      </div>
      
      {/* Floating bubbles effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-8 right-1/3 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-teal-400/35 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-6 right-1/4 w-0.5 h-0.5 bg-blue-300/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-4 left-1/3 w-0.5 h-0.5 bg-cyan-300/60 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center h-16">          {/* Logo with ocean-themed styling */}
          <Link to="/" className="flex items-center space-x-2 nav-logo group relative">
            <div className="relative">
              <img 
                src="/logo_transparent.png" 
                alt="SharkSenz Logo" 
                className={cn(
                  "transition-all duration-300 group-hover:scale-105 relative z-10",
                  scrolled ? "h-9 w-auto" : "h-10 w-auto"
                )} 
              />
              {/* Ocean ripple effect around logo on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-teal-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </div>
            <span className={cn(
              "font-bold transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-cyan-600 group-hover:to-teal-600 group-hover:bg-clip-text",
              scrolled ? "text-lg" : "text-xl",
              "text-gray-800"
            )}>SharkSenz</span>
            
            {/* Subtle water droplet effect */}
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </Link>{/* Desktop Navigation */}            <nav className="hidden md:flex items-center space-x-1">
            <div className="desktop-nav-item">
              {renderNavLink("/", "Home", true, <Home className="h-4 w-4" />)}
            </div>
            
            <div className="desktop-nav-item">
              {!user ? (
                renderNavLink("/analytics", "Analytics", true, <LineChart className="h-4 w-4" />)
              ) : (
                renderNavLink("/analytics", "Analytics", true, <LineChart className="h-4 w-4" />)
              )}
            </div>
            
            <div className="desktop-nav-item" data-tour="content">
              {!user ? (
                renderNavLink("/content", "Content", true, <LibrarySquare className="h-4 w-4" />)
              ) : (
                renderNavLink("/content", "Content", true, <LibrarySquare className="h-4 w-4" />)
              )}
            </div>
            
            <div className="desktop-nav-item" data-tour="market-trends">
              {!user ? (
                renderNavLink("/market-trends", "Trends", true, <TrendingUp className="h-4 w-4" />)
              ) : (
                renderNavLink("/market-trends", "Trends", true, <TrendingUp className="h-4 w-4" />)
              )}
            </div>
            
            <div className="desktop-nav-item" data-tour="pitch-simulator">
              {!user ? (
                renderNavLink("/pitch-simulator", "Pitch Simulator", true, <Presentation className="h-4 w-4" />)
              ) : (
                renderNavLink("/pitch-simulator", "Pitch Simulator", true, <Presentation className="h-4 w-4" />)
              )}
            </div>
            
            <div className="desktop-nav-item">
              {renderNavLink("/pricing", "Pricing", true, <CreditCard className="h-4 w-4" />)}
            </div>
            
            <div className="desktop-nav-item">
              {renderNavLink("/about", "About", true, <Info className="h-4 w-4" />)}
            </div>
            
            <div className="ml-3 nav-auth">
              <AuthButton />
            </div>
          </nav>          {/* Mobile Menu Button with Ocean Effects */}          
          <button 
            className={cn(
              "md:hidden flex items-center justify-center p-2 rounded-full transition-all duration-300 transform active:scale-95 relative overflow-hidden",
              isMenuOpen 
                ? "bg-gradient-to-r from-blue-100 via-cyan-50 to-blue-100 text-blue-700 shadow-md" 
                : "text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/80 hover:via-cyan-50/60 hover:to-blue-50/80"
            )}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {/* Ocean ripple effect on button press */}
            {isMenuOpen && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20 animate-pulse" />
            )}
            
            {isMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-300 relative z-10" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-300 relative z-10" />
            )}
            
            {/* Subtle bubble effect on hover */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-blue-400/60 rounded-full animate-ping" style={{ animationDelay: '0ms' }} />
              <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-cyan-400/60 rounded-full animate-ping" style={{ animationDelay: '400ms' }} />
            </div>
          </button>
        </div>        {/* Mobile Navigation with Ocean Theme */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu-wrapper overflow-hidden">
            {/* Ocean wave separator */}
            <div className="h-1 bg-gradient-to-r from-blue-400/30 via-cyan-400/50 to-teal-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
            
            <nav className="md:hidden py-3 border-t border-blue-100/50 mobile-nav bg-gradient-to-br from-blue-50/95 via-white/95 to-cyan-50/95 backdrop-blur-md relative overflow-hidden">
              {/* Underwater ambiance for mobile menu */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-2 right-8 w-1 h-1 bg-blue-400/40 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-4 left-12 w-0.5 h-0.5 bg-cyan-400/50 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-teal-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
              </div>
                <div className="flex flex-col space-y-1 py-2 px-2 relative z-10">
                <div className="mobile-nav-item">
                  {renderNavLink("/", "Home", false, <Home className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/analytics", "Analytics", false, <LineChart className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/content", "Content", false, <LibrarySquare className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/market-trends", "Trends", false, <TrendingUp className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/pitch-simulator", "Pitch Simulator", false, <Presentation className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/pricing", "Pricing", false, <CreditCard className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/about", "About", false, <Info className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item mt-3 pt-3 border-t border-gray-100">
                  <div className="px-3 py-2">
                    <AuthButton />
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;