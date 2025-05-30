import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Linkedin, Fish, Waves } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Generate floating bubbles with enhanced styles
  const generateBubbles = (count: number) => {
    const bubbles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 12 + 6;
      const delay = Math.random() * 8;
      const duration = Math.random() * 10 + 15;
      const xPos = Math.random() * 100;
      bubbles.push(
        <div
          key={`bubble-${i}`}
          className="absolute rounded-full animate-bubble-rise opacity-70"
          style={{
            width: size + 'px',
            height: size + 'px',
            left: xPos + '%',
            bottom: '-5%',
            animationDelay: delay + 's',
            animationDuration: duration + 's',
            background: `radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.8) 0%, 
              rgba(147, 197, 253, 0.4) 30%, 
              rgba(59, 130, 246, 0.2) 70%, 
              transparent 100%)`,
            boxShadow: `
              0 0 ${size}px rgba(59, 130, 246, 0.3),
              inset 0 0 ${size/2}px rgba(255, 255, 255, 0.5),
              inset ${size/4}px ${size/4}px ${size/2}px rgba(255, 255, 255, 0.3)
            `,
            backdropFilter: 'blur(1px)'
          }}
        />
      );
    }
    return bubbles;
  };

  // Generate seaweed elements
  const generateSeaweed = (count: number) => {
    const seaweed = [];
    for (let i = 0; i < count; i++) {
      const height = Math.random() * 120 + 80;
      const width = Math.random() * 6 + 4;
      const xPos = Math.random() * 100;
      seaweed.push(
        <div
          key={`seaweed-${i}`}
          className="absolute bottom-0 animate-seaweed-sway opacity-60"
          style={{
            left: xPos + '%',
            height: height + 'px',
            width: width + 'px',
            background: `linear-gradient(to top, 
              rgba(34, 197, 94, 0.7) 0%, 
              rgba(22, 163, 74, 0.6) 30%, 
              rgba(21, 128, 61, 0.5) 60%, 
              rgba(20, 83, 45, 0.3) 100%)`,
            borderRadius: '50% 50% 50% 50% / 100% 100% 0% 0%',
            animationDelay: Math.random() * 4 + 's',
            animationDuration: Math.random() * 4 + 6 + 's',
            filter: 'blur(0.5px)',
            transform: 'scaleX(0.8)'
          }}
        />
      );
    }
    return seaweed;
  };

  // Generate small sea particles
  const generateSeaParticles = (count: number) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 2;
      particles.push(
        <div
          key={`particle-${i}`}
          className="absolute rounded-full opacity-50 animate-drift"
          style={{
            width: size + 'px',
            height: size + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            background: `radial-gradient(circle, ${
              Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(34, 211, 238, 0.6)'
            } 0%, transparent 70%)`,
            animationDelay: Math.random() * 6 + 's',
            animationDuration: Math.random() * 8 + 12 + 's'
          }}
        />
      );
    }
    return particles;
  };

  // Generate fish silhouettes
  const generateFish = (count: number) => {
    const fish = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 16 + 12;
      fish.push(
        <Fish
          key={`fish-${i}`}
          className="absolute text-blue-300/20 animate-fish-swim"
          style={{
            fontSize: size + 'px',
            left: '-10%',
            top: Math.random() * 80 + 10 + '%',
            animationDelay: Math.random() * 15 + 's',
            animationDuration: Math.random() * 20 + 25 + 's'
          }}
        />
      );
    }
    return fish;
  };
    return (
    <>
      
      {/* Enhanced footer with complete ocean depth theme */}
      <footer className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 pb-8 overflow-hidden min-h-[600px]">
        {/* Deep ocean background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-indigo-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Underwater light rays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/6 w-2 h-full bg-gradient-to-b from-cyan-400/60 via-blue-400/30 to-transparent transform rotate-12 animate-light-ray" />
          <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-teal-300/40 via-cyan-400/20 to-transparent transform -rotate-8 animate-light-ray-delayed" />
          <div className="absolute top-0 left-1/2 w-3 h-full bg-gradient-to-b from-sky-400/50 via-blue-300/25 to-transparent transform rotate-4 animate-light-ray-slow" />
          <div className="absolute top-0 right-1/6 w-1.5 h-full bg-gradient-to-b from-cyan-300/35 via-blue-400/15 to-transparent transform -rotate-6 animate-light-ray" />
        </div>
        
        {/* Enhanced floating bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateBubbles(25)}
        </div>
        
        {/* Seaweed forest */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateSeaweed(12)}
        </div>
        
        {/* Sea particles and debris */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateSeaParticles(35)}
        </div>
        
        {/* Swimming fish silhouettes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {generateFish(4)}
        </div>
        
        {/* Ocean current effects */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-current-flow"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-400/20 to-transparent animate-current-reverse"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-br from-transparent via-teal-400/15 to-transparent animate-current-diagonal"
          />
        </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced Stay Connected Section with ocean theme */}
          <div className="py-12 sm:py-16 text-center">
            <div className="relative inline-block">
              <Waves className="absolute -top-2 -left-8 text-cyan-400/60 w-6 h-6 animate-bounce" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white bg-gradient-to-r from-cyan-200 via-blue-100 to-teal-200 bg-clip-text text-transparent">
                Dive Into Our Community
              </h2>
              <Waves className="absolute -bottom-2 -right-8 text-blue-400/60 w-6 h-6 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-blue-100/80 mb-6 max-w-2xl mx-auto text-lg">
              Join the depths of entrepreneurial knowledge and never surface empty-handed!
            </p>
            <Link 
              to="/subscribe" 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-400 hover:via-blue-400 hover:to-teal-400 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-cyan-500/40 backdrop-blur-sm"
            >
              
              <span className="font-semibold">Dive In Now</span>
            </Link>
          </div>

          {/* Enhanced Footer Links with underwater coral styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-8">
            {/* About Section */}
            <div className="text-center sm:text-left relative group">
              {/* Coral-like decoration with enhanced styling */}
              <div className="absolute -top-4 -left-4 w-2 h-12 bg-gradient-to-b from-cyan-400/50 via-teal-400/40 to-green-500/30 rounded-full animate-seaweed-sway" />
              <div className="absolute -top-2 -left-1 w-1 h-8 bg-gradient-to-b from-green-400/40 to-transparent rounded-full animate-seaweed-sway" style={{ animationDelay: '1s' }} />
              
              <h3 className="font-bold text-xl mb-5 text-white group-hover:text-cyan-200 transition-colors duration-300">SharkSenz</h3>
              <p className="text-blue-100/80 mb-6 leading-relaxed">
                Navigate the treacherous waters of entrepreneurship with our comprehensive toolkit for startup success.
              </p>
              <div className="flex justify-center sm:justify-start space-x-5">
                <Link 
                  to="https://github.com/sms03" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-2 rounded-full hover:bg-blue-800/30"
                >
                  <Github className="h-6 w-6" />
                </Link>
                <Link 
                  to="https://x.com/smsxshivam" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-2 rounded-full hover:bg-blue-800/30"
                >
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link 
                  to="https://www.instagram.com/smsxart/" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-2 rounded-full hover:bg-blue-800/30"
                >
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link 
                  to="https://linkedin.com/in/sms03/" 
                  className="text-blue-200/70 hover:text-cyan-300 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-2 rounded-full hover:bg-blue-800/30"
                >
                  <Linkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left relative group">
              <div className="absolute -top-3 -left-3 w-1 h-10 bg-gradient-to-b from-blue-400/50 via-cyan-400/40 to-transparent rounded-full animate-seaweed-sway" style={{ animationDelay: '0.5s' }} />
              
              <h3 className="font-bold text-xl mb-5 text-white group-hover:text-cyan-200 transition-colors duration-300">Navigate</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/analytics" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Analytics Deep Dive</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/content" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Content Ocean</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Pricing Depths</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="text-center sm:text-left relative group">
              <div className="absolute -top-4 -left-3 w-2 h-8 bg-gradient-to-b from-teal-400/50 via-green-400/40 to-transparent rounded-full animate-seaweed-sway" style={{ animationDelay: '1.5s' }} />
              
              <h3 className="font-bold text-xl mb-5 text-white group-hover:text-cyan-200 transition-colors duration-300">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/about" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Our Story</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Send a Message</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faq" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">FAQ Treasures</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center sm:text-left relative group">
              <div className="absolute -top-3 -left-2 w-1 h-12 bg-gradient-to-b from-cyan-400/50 via-blue-400/40 to-transparent rounded-full animate-seaweed-sway" style={{ animationDelay: '2s' }} />
              
              <h3 className="font-bold text-xl mb-5 text-white group-hover:text-cyan-200 transition-colors duration-300">Legal Depths</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Privacy Sanctuary</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-of-service" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Terms Codex</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cookies" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Cookie Charter</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/disclaimer" 
                    className="text-blue-100/80 hover:text-cyan-300 transition-all duration-300 hover:pl-3 hover:pr-1 inline-block relative group"
                  >
                    <span className="relative z-10">Safe Harbor</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -left-2 -right-2" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Enhanced Copyright with ocean floor effect */}
          <div className="border-t border-cyan-400/20 mt-12 pt-8 text-center text-blue-100/70 relative">
            {/* Enhanced ocean floor pattern */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            <div className="absolute top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
            <div className="absolute top-3 left-1/6 w-16 h-px bg-gradient-to-r from-cyan-400/30 to-transparent animate-shimmer" />
            <div className="absolute top-3 right-1/4 w-20 h-px bg-gradient-to-l from-teal-400/30 to-transparent animate-shimmer" style={{ animationDelay: '1s' }} />
            <div className="absolute top-5 left-1/3 w-12 h-px bg-gradient-to-r from-blue-400/25 to-transparent animate-shimmer" style={{ animationDelay: '2s' }} />
            
            <p className="text-lg font-medium">
              &copy; {currentYear} SharkSenz. All rights reserved.
            </p>
            <p className="text-blue-200/60 mt-2 text-sm">
              Navigating entrepreneurs through the depths of success.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
