
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">SharkSenz</h3>
            <p className="text-gray-600 mb-4">
              The ultimate resource for startup founders to master essential skills and build successful ventures.
            </p>
            <div className="flex space-x-4">
              <Link to="https://github.com/sms03" className="text-gray-500 hover:text-blue-600">
                <Github className="h-5 w-5" />
              </Link>
              <Link to="https://twitter.com/smsxshivam" className="text-gray-500 hover:text-blue-600">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="https://www.instagram.com/smsxart/" className="text-gray-500 hover:text-blue-600">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
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

          <div>
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
          </div>


          {/* Legal */}
          <div>
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
            </ul>
          </div>
        </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {currentYear} SharkSenz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
