import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LegalPageFooter from "../components/LegalPageFooter";

const CookiePolicy = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose lg:prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            Last updated: May 25, 2025
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            This Cookie Policy explains how SharkSenz ("we," "us," or "our") uses cookies and similar 
            technologies to recognize you when you visit our website. It explains what these technologies are 
            and why we use them, as well as your rights to control our use of them.
          </p>
          
          <h2>2. What Are Cookies</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
            as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, SharkSenz) are called "first-party cookies." 
            Cookies set by parties other than the website owner are called "third-party cookies." 
            Third-party cookies enable third-party features or functionality to be provided on or through the website 
            (such as advertising, interactive content, and analytics).
          </p>
          
          <h2>3. Why We Use Cookies</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons 
            in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
            Other cookies also enable us to track and target the interests of our users to enhance the experience on our website. 
            Third parties serve cookies through our website for analytics and other purposes.
          </p>
          
          <h2>4. Types of Cookies We Use</h2>
          <p>
            The specific types of first and third-party cookies served through our website include:
          </p>
          <ul>
            <li>
              <strong>Essential cookies:</strong> These cookies are strictly necessary to provide you with services available 
              through our website and to use some of its features, such as access to secure areas.
            </li>
            <li>
              <strong>Performance and functionality cookies:</strong> These cookies are used to enhance the performance and 
              functionality of our website but are non-essential to their use.
            </li>
            <li>
              <strong>Analytics and customization cookies:</strong> These cookies collect information that is used either in 
              aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.
            </li>
            <li>
              <strong>Advertising cookies:</strong> These cookies are used to make advertising messages more relevant to you.
            </li>
          </ul>
          
          <h2>5. Your Choices Regarding Cookies</h2>
          <p>
            If you would like to delete cookies or instruct your web browser to delete or refuse cookies, 
            please visit the help pages of your web browser.
          </p>
          <p>
            Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the 
            features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
          </p>

          <h2>6. Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting 
            the new Cookie Policy on this page and updating the "Last updated" date.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Cookie Policy, please contact us at:
          </p>
          <p>
            Email: privacy@sharksenz.com<br />
            Address: 123 Startup Hub, Innovation District, San Francisco, CA 94107
          </p>
          
          <h2>8. Related Legal Documents</h2>
          <p>
            Our Cookie Policy is part of a broader set of legal documents that govern your relationship with SharkSenz:
          </p>
          <ul>
            <li><Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link> - Details on how we collect, use, and protect your personal information</li>
            <li><Link to="/terms-of-service" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> - The comprehensive agreement governing your use of our platform</li>
            <li><Link to="/disclaimer" className="text-blue-600 hover:text-blue-800">Disclaimer</Link> - Important information about the limitations of our services</li>
          </ul>
        </div>

        <LegalPageFooter currentPage="cookies" />
      </div>
    </div>
  );
};

export default CookiePolicy;
