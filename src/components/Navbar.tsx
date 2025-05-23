import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle, BarChart } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import gsap from "gsap";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
      gsap.fromTo(".mobile-nav", {
        opacity: 0,
        y: -10
      }, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power3.out"
      });
    }
  }, [isMenuOpen]);
  return <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 nav-logo">
            <img src="/logo_transparent.png" alt="SharkSenz Logo" className="h-10 w-auto" />
            <span className="font-bold text-xl">SharkSenz</span>
          </Link>          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/content" className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link ${location.pathname === "/content" ? "text-blue-600" : ""}`}>
              Content Library
            </Link>
            <Link to="/analytics" className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link flex items-center ${location.pathname === "/analytics" ? "text-blue-600" : ""}`}>
              <BarChart className="h-4 w-4 mr-1" />
              Analytics
            </Link>
            <Link to="/about" className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link ${location.pathname === "/about" ? "text-blue-600" : ""}`}>
              About Us
            </Link>
            <Link to="/pricing" className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link ${location.pathname === "/pricing" ? "text-blue-600" : ""}`}>
              Pricing
            </Link>
            <Link to="/contact" className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link ${location.pathname === "/contact" ? "text-blue-600" : ""}`}>
              Contact
            </Link>
            <Link to="/profile" className={`text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 nav-link flex items-center ${location.pathname === "/profile" ? "text-blue-600" : ""}`}>
              <UserCircle className="h-4 w-4 mr-1" />
              Profile
            </Link>
            <div className="nav-auth">
              <AuthButton />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && <nav className="md:hidden py-4 border-t border-gray-200 mobile-nav">
            <div className="flex flex-col space-y-4">
              <Link to="/content" className={`text-gray-600 hover:text-blue-600 font-medium py-2 ${location.pathname === "/content" ? "text-blue-600" : ""}`} onClick={() => setIsMenuOpen(false)}>
                Content Library
              </Link>
              <Link to="/analytics" className={`text-gray-600 hover:text-blue-600 font-medium py-2 flex items-center ${location.pathname === "/analytics" ? "text-blue-600" : ""}`} onClick={() => setIsMenuOpen(false)}>
                <BarChart className="h-4 w-4 mr-1" />
                Analytics
              </Link>
              <Link to="/about" className={`text-gray-600 hover:text-blue-600 font-medium py-2 ${location.pathname === "/about" ? "text-blue-600" : ""}`} onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/pricing" className={`text-gray-600 hover:text-blue-600 font-medium py-2 ${location.pathname === "/pricing" ? "text-blue-600" : ""}`} onClick={() => setIsMenuOpen(false)}>
                Pricing
              </Link>
              <Link to="/contact" className={`text-gray-600 hover:text-blue-600 font-medium py-2 ${location.pathname === "/contact" ? "text-blue-600" : ""}`} onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/profile" className={`text-gray-600 hover:text-blue-600 font-medium py-2 flex items-center ${location.pathname === "/profile" ? "text-blue-600" : ""}`} onClick={() => setIsMenuOpen(false)}>
                <UserCircle className="h-4 w-4 mr-1" />
                Profile
              </Link>
              <div className="py-2">
                <AuthButton />
              </div>
            </div>
          </nav>}
      </div>
    </header>;
};
export default Navbar;