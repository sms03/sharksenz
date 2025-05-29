import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Generate floating bubbles
  const generateBubbles = (count: number) => {
    const bubbles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 4;
      const delay = Math.random() * 5;
      const duration = Math.random() * 8 + 12;
      bubbles.push(
        <div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-gradient-to-t from-blue-400/20 via-cyan-300/30 to-blue-200/40 animate-float opacity-60"
          style={{
            width: size + 'px',
            height: size + 'px',
            left: Math.random() * 100 + '%',
            bottom: '10%',
            animationDelay: delay + 's',
            animationDuration: duration + 's',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.2)'
          }}
        />
      );
    }
    return bubbles;
  };

  // Generate small sea particles
  const generateSeaParticles = (count: number) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 3 + 1;
      particles.push(
        <div
          key={`particle-${i}`}
          className="absolute rounded-full opacity-40"
          style={{
            width: size + 'px',
            height: size + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            background: `radial-gradient(circle, ${
              Math.random() > 0.5 ? 'rgba(96, 165, 250, 0.6)' : 'rgba(103, 232, 249, 0.5)'
            } 0%, transparent 70%)`,
            animation: `sway ${Math.random() * 6 + 8}s ease-in-out infinite`,
            animationDelay: Math.random() * 4 + 's'
          }}
        />
      );
    }
    return particles;
  };
  
  return (
    <>
      {/* Enhanced wave divider with ocean gradients */}
      <div className="bg-white w-full overflow-hidden relative">
        {/* Ocean depth gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-blue-100/20" />
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 100" 
          fill="none" 
          className="w-full footer-wave relative z-10"
          style={{ marginBottom: -1 }}
        >
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.9"/>
              <stop offset="50%" stopColor="#1e40af" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 0L48 10C96 20 192 40 288 45C384 50 480 40 576 25C672 10 768 0 864 5C960 10 1056 30 1152 40C1248 50 1344 50 1392 50L1440 50V100H0V0Z" 
            fill="url(#oceanGradient)"
            className="animate-wave-gentle"
          />
        </svg>
      </div>
      
      {/* Footer component with ocean theme */}
      <footer className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 pb-8 overflow-hidden">
        {/* Underwater ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-indigo-900/60" />
        
        {/* Floating bubbles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateBubbles(15)}
        </div>
        
        {/* Sea particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateSeaParticles(25)}
        </div>
        
        {/* Ocean depth rays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-cyan-400/40 via-transparent to-transparent transform rotate-12 animate-sway" style={{ animationDelay: '0s' }} />
          <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-blue-300/30 via-transparent to-transparent transform -rotate-6 animate-sway" style={{ animationDelay: '2s' }} />
          <div className="absolute top-0 left-1/2 w-1.5 h-full bg-gradient-to-b from-teal-400/25 via-transparent to-transparent transform rotate-3 animate-sway" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Subtle underwater current effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
            style={{
              animation: 'swim 20s ease-in-out infinite',
              transform: 'skewX(-12deg)'
            }}
          />
          <div 
            className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-400/15 to-transparent"
            style={{
              animation: 'swim-reverse 25s ease-in-out infinite',
              animationDelay: '5s',
              transform: 'skewX(8deg)'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Stay Connected Section with ocean theme */}
          <div className="py-8 sm:py-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Stay Connected</h2>
            <p className="text-blue-100/80 mb-4 max-w-xl mx-auto">Join our community and never miss an update!</p>
            <Link 
              to="/subscribe" 
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Subscribe Now
            </Link>
          </div>

          {/* Footer Links with underwater styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-4">
            {/* About */}
            <div className="text-center sm:text-left relative">
              {/* Subtle coral-like decoration */}
              <div className="absolute -top-2 -left-2 w-1 h-8 bg-gradient-to-b from-cyan-400/40 to-transparent rounded-full animate-sway" style={{ animationDelay: '0s' }} />
              
              <h3 className="font-semibold text-lg mb-4 text-white">SharkSenz</h3>
              <p className="text-blue-100/70 mb-4">
                The ultimate resource for startup founders to master essential skills and build successful ventures.
              </p>
              <div className="flex justify-center sm:justify-start space-x-4">
                <Link 
                  to="https://github.com/sms03" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link 
                  to="https://twitter.com/smsxshivam" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link 
                  to="https://www.instagram.com/smsxart/" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link 
                  to="https://linkedin.com/in/sms03/" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left relative">
              <div className="absolute -top-2 -left-2 w-0.5 h-6 bg-gradient-to-b from-blue-400/40 to-transparent rounded-full animate-sway" style={{ animationDelay: '1s' }} />
              
              <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/analytics" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/content" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Content Library
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="text-center sm:text-left relative">
              <div className="absolute -top-2 -left-2 w-1.5 h-4 bg-gradient-to-b from-teal-400/40 to-transparent rounded-full animate-sway" style={{ animationDelay: '2s' }} />
              
              <h3 className="font-semibold text-lg mb-4 text-white">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/about" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faq" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center sm:text-left relative">
              <div className="absolute -top-2 -left-2 w-0.5 h-10 bg-gradient-to-b from-cyan-400/40 to-transparent rounded-full animate-sway" style={{ animationDelay: '0.5s' }} />
              
              <h3 className="font-semibold text-lg mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-of-service" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cookies" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/disclaimer" 
                    className="text-blue-100/70 hover:text-cyan-300 transition-all duration-300 hover:pl-2"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright with ocean floor effect */}
          <div className="border-t border-blue-400/20 mt-8 pt-6 text-center text-blue-100/60 relative">
            {/* Ocean floor pattern */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="absolute top-2 left-1/4 w-8 h-px bg-gradient-to-r from-blue-400/20 to-transparent" />
            <div className="absolute top-2 right-1/3 w-12 h-px bg-gradient-to-l from-cyan-400/20 to-transparent" />
            
            <p>&copy; {currentYear} SharkSenz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
