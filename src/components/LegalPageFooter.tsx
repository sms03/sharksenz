import { Link } from "react-router-dom";

interface LegalPageFooterProps {
  currentPage: 'privacy' | 'terms' | 'cookies' | 'disclaimer';
}

const LegalPageFooter = ({ currentPage }: LegalPageFooterProps) => {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Legal Documentation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${currentPage === 'privacy' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
          <Link 
            to="/privacy-policy"
            className={`block ${currentPage === 'privacy' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
          >
            <h4 className="font-medium">Privacy Policy</h4>
            <p className="text-sm text-gray-600 mt-1">How we collect, use, and protect your personal information</p>
          </Link>
        </div>
        <div className={`p-4 rounded-lg ${currentPage === 'terms' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
          <Link 
            to="/terms-of-service"
            className={`block ${currentPage === 'terms' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
          >
            <h4 className="font-medium">Terms of Service</h4>
            <p className="text-sm text-gray-600 mt-1">Rules and guidelines for using SharkSenz's platform</p>
          </Link>
        </div>
        <div className={`p-4 rounded-lg ${currentPage === 'cookies' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
          <Link 
            to="/cookies"
            className={`block ${currentPage === 'cookies' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
          >
            <h4 className="font-medium">Cookie Policy</h4>
            <p className="text-sm text-gray-600 mt-1">Information about how we use cookies and similar technologies</p>
          </Link>
        </div>
        <div className={`p-4 rounded-lg ${currentPage === 'disclaimer' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
          <Link 
            to="/disclaimer"
            className={`block ${currentPage === 'disclaimer' ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
          >
            <h4 className="font-medium">Disclaimer</h4>
            <p className="text-sm text-gray-600 mt-1">Important notices about the limitations of our services</p>
          </Link>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-6">
        These documents were last updated on May 25, 2025. If you have any questions about our legal documents, 
        please <Link to="/contact" className="text-blue-600 hover:text-blue-800">contact us</Link>.
      </p>
    </div>
  );
};

export default LegalPageFooter;
