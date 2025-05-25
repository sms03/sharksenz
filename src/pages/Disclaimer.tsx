import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LegalPageFooter from "../components/LegalPageFooter";

const Disclaimer = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
        
        <div className="prose lg:prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            Last updated: May 25, 2025
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            The information provided on SharkSenz ("we," "us," or "our") is for general informational purposes only. 
            All information on the site is provided in good faith, however, we make no representation or warranty of any kind, 
            express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any 
            information on the site.
          </p>
          
          <h2>2. No Professional Advice</h2>
          <p>
            The information on our website is not intended to be a substitute for professional advice. 
            We do not provide business, legal, financial, investment, tax, or professional advice of any kind. 
            Before making any business or financial decisions, you should consult with a qualified professional 
            who can provide advice tailored to your specific circumstances and needs.
          </p>
          
          <h2>3. External Links</h2>
          <p>
            Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with us. 
            Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these 
            external websites.
          </p>
          
          <h2>4. Errors and Omissions</h2>
          <p>
            The information given by the SharkSenz platform could include technical, typographical, or photographic errors. 
            We reserve the right to change or update information and to correct errors, inaccuracies, or omissions at any time 
            without prior notice.
          </p>
          
          <h2>5. No Guarantees</h2>
          <p>
            SharkSenz does not guarantee any specific results from the use of our platform or the information 
            provided on the website. Business outcomes vary based on numerous factors beyond our control, and success 
            in using our educational content cannot be guaranteed.
          </p>
          
          <h2>6. User Responsibility</h2>
          <p>
            By using SharkSenz, you accept personal responsibility for the outcomes of your actions in your business or career. 
            We provide tools and information, but the implementation and results are your responsibility.
          </p>

          <h2>7. Changes to This Disclaimer</h2>
          <p>
            We may update our Disclaimer from time to time. We will notify you of any changes by posting 
            the new Disclaimer on this page and updating the "Last updated" date.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Disclaimer, please contact us at:
          </p>
          <p>
            Email: legal@sharksenz.com<br />
            Address: 123 Startup Hub, Innovation District, San Francisco, CA 94107
          </p>
          
          <h2>9. Related Legal Documents</h2>
          <p>
            This Disclaimer should be read in conjunction with our other legal documents:
          </p>
          <ul>
            <li><Link to="/terms-of-service" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> - The full terms governing your use of SharkSenz</li>
            <li><Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link> - How we handle your personal data and protect your privacy</li>
            <li><Link to="/cookies" className="text-blue-600 hover:text-blue-800">Cookie Policy</Link> - Information about how we use cookies and similar technologies</li>
          </ul>
        </div>

        <LegalPageFooter currentPage="disclaimer" />
      </div>
    </div>
  );
};

export default Disclaimer;
