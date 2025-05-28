import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* Wave divider component */}
      <div className="bg-white w-full overflow-hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 100" 
          fill="none" 
          className="w-full footer-wave"
          style={{ marginBottom: -1 }} // Ensure seamless connection with footer
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 0L48 10C96 20 192 40 288 45C384 50 480 40 576 25C672 10 768 0 864 5C960 10 1056 30 1152 40C1248 50 1344 50 1392 50L1440 50V100H0V0Z" 
            fill="#0047AB" 
          />
        </svg>
      </div>
      
      {/* Footer component */}
      <footer className="bg-gray-50 pb-8">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Stay Connected Section */}
          <div className="py-8 sm:py-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Stay Connected</h2>
            <p className="text-gray-600 mb-4 max-w-xl mx-auto">Join our community and never miss an update!</p>
            <Link to="/subscribe" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors">
              Subscribe Now
            </Link>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-4">
            {/* About */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">SharkSenz</h3>
              <p className="text-gray-600 mb-4">
                The ultimate resource for startup founders to master essential skills and build successful ventures.
              </p>              <div className="flex justify-center sm:justify-start space-x-4">
                <Link to="https://github.com/sms03" className="text-gray-500 hover:text-blue-600">
                  <Github className="h-5 w-5" />
                </Link>
                <Link to="https://twitter.com/smsxshivam" className="text-gray-500 hover:text-blue-600">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link to="https://www.instagram.com/smsxart/" className="text-gray-500 hover:text-blue-600">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link to="https://linkedin.com/in/sms03/" className="text-gray-500 hover:text-blue-600">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/analytics" className="text-gray-600 hover:text-blue-600">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/content" className="text-gray-600 hover:text-blue-600">
                    Content Library
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-blue-600">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-blue-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-blue-600">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>            {/* Legal */}
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-600 hover:text-blue-600">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="text-gray-600 hover:text-blue-600">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
            <p>&copy; {currentYear} SharkSenz. All rights reserved.</p>
            <div className="mt-2 text-sm flex justify-center space-x-4">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-blue-600">Privacy Policy</Link>
              <span className="text-gray-400">|</span>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-blue-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
