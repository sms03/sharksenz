import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, UserCircle, BarChart, Lock, 
  ChevronDown, Home, LibrarySquare, LineChart, CreditCard, Info, FileText
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
    return ['/content', '/analytics', '/profile'].some(route => 
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
          "relative group flex items-center gap-2 px-4 py-2 rounded-lg font-normal transition-all duration-300 transform hover:scale-105",
          isActive 
            ? "text-blue-600 bg-blue-50/80" 
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50/80"
        )
      : cn(
          "group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg font-normal transition-all duration-300 transform hover:scale-[1.02]",
          isActive 
            ? "text-blue-600 bg-blue-50/80" 
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50/80"
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
            "transition-all duration-300 group-hover:scale-105",
            isActive ? "text-blue-600" : "text-current"
          )}>
            {icon}
          </span>
        )}
        <span className="relative z-10 transition-all duration-300">{label}</span>
        {needsProtection && (
          <Lock className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            isActive ? "text-blue-600/80" : "text-gray-400 group-hover:text-blue-500"
          )} />
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
        "sticky top-0 z-50 transition-all duration-300", 
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-1" 
          : "bg-white py-2",
        hideOnScroll ? "transform -translate-y-full" : "transform translate-y-0",
        isMenuOpen && "bg-white shadow-md"
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">          {/* Logo with subtle styling */}
          <Link to="/" className="flex items-center space-x-2 nav-logo group">
            <img 
              src="/logo_transparent.png" 
              alt="SharkSenz Logo" 
              className={cn(
                "transition-all duration-300 group-hover:scale-105",
                scrolled ? "h-9 w-auto" : "h-10 w-auto"
              )} 
            />
            <span className={cn(
              "font-bold transition-all duration-300 group-hover:text-blue-600",
              scrolled ? "text-lg" : "text-xl"
            )}>SharkSenz</span>
          </Link>          {/* Desktop Navigation */}          
          <nav className="hidden md:flex items-center space-x-1">
            <div className="desktop-nav-item">
              {renderNavLink("/", "Home", true, <Home className="h-4 w-4" />)}
            </div>
            
            <div className="desktop-nav-item">
              {!user ? (
                <ProtectedRouteIndicator>
                  {renderNavLink("/content", "Content", true, <LibrarySquare className="h-4 w-4" />)}
                </ProtectedRouteIndicator>
              ) : (
                renderNavLink("/content", "Content", true, <LibrarySquare className="h-4 w-4" />)
              )}
            </div>
            
            <div className="desktop-nav-item">
              {!user ? (
                <ProtectedRouteIndicator>
                  {renderNavLink("/analytics", "Analytics", true, <LineChart className="h-4 w-4" />)}
                </ProtectedRouteIndicator>
              ) : (
                renderNavLink("/analytics", "Analytics", true, <LineChart className="h-4 w-4" />)
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
          </nav>{/* Mobile Menu Button */}          <button 
            className={cn(
              "md:hidden flex items-center justify-center p-2 rounded-lg transition-all duration-300 transform active:scale-95",
              isMenuOpen 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            )}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-300" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-300" />
            )}
          </button>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu-wrapper overflow-hidden">            <nav className="md:hidden py-3 border-t border-gray-100 mobile-nav bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-1 py-2 px-2">
                <div className="mobile-nav-item">
                  {renderNavLink("/", "Home", false, <Home className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/content", "Content Library", false, <LibrarySquare className="h-4 w-4" />)}
                </div>
                
                <div className="mobile-nav-item">
                  {renderNavLink("/analytics", "Analytics", false, <LineChart className="h-4 w-4" />)}
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