
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookText } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { useEffect } from "react";
import gsap from "gsap";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // GSAP animations for navbar
  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(".nav-logo", { 
      x: -20, 
      opacity: 0, 
      duration: 0.5,
      ease: "power3.out" 
    });
    
    tl.from(".nav-link", { 
      y: -10, 
      opacity: 0, 
      stagger: 0.1,
      duration: 0.3,
      ease: "power3.out" 
    }, "-=0.2");
    
    tl.from(".nav-auth", { 
      x: 20, 
      opacity: 0, 
      duration: 0.5,
      ease: "power3.out" 
    }, "-=0.4");
    
    // Mobile menu animation
    if (isMenuOpen) {
      gsap.fromTo(".mobile-nav", 
        { opacity: 0, y: -10 }, 
        { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [isMenuOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 nav-logo">
            <BookText className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">Alpha Founder Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/content" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link">
              Content Library
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link">
              Dashboard
            </Link>
            <div className="nav-auth">
              <AuthButton />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 mobile-nav">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/content" 
                className="text-gray-600 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Content Library
              </Link>
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-blue-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="py-2">
                <AuthButton />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
