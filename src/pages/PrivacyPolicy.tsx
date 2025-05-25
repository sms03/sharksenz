import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LegalPageFooter from "../components/LegalPageFooter";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose lg:prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">            Last updated: May 25, 2025
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            SharkSenz ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website and use our services. Please also read our <Link to="/terms-of-service" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> and <Link to="/cookies" className="text-blue-600 hover:text-blue-800">Cookie Policy</Link>.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in various ways, including:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> When you register for an account, we collect your name, 
              email address, and password. If you subscribe to a paid plan, we also collect billing information.
            </li>
            <li>
              <strong>Usage Information:</strong> We collect information about how you use our platform, 
              including the content you access, features you use, and time spent on the platform.
            </li>
            <li>
              <strong>Device Information:</strong> We collect information about the device you use to access our platform, 
              including the hardware model, operating system, and browser type.
            </li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes, including:
          </p>
          <ul>
            <li>Providing and maintaining our services</li>
            <li>Personalizing your experience</li>
            <li>Sending you administrative communications</li>
            <li>Providing customer support</li>
            <li>Improving our platform</li>
            <li>Ensuring the security of your account</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. 
            However, no method of transmission over the Internet or electronic storage is 100% secure, 
            so we cannot guarantee absolute security.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We will retain your information for as long as your account is active or as needed to provide you services. 
            We will retain and use your information as necessary to comply with our legal obligations, 
            resolve disputes, and enforce our agreements.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to object to processing of your information</li>
            <li>The right to data portability</li>
          </ul>

          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. 
            We do not knowingly collect personal information from children under 18.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: privacy@sharksenz.com<br />
            Address: 123 Startup Hub, Innovation District, San Francisco, CA 94107
          </p>

          <h2>10. Related Legal Documents</h2>
          <p>
            Please review our other legal documents that govern your use of our services:
          </p>
          <ul>
            <li><Link to="/terms-of-service" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> - The rules and guidelines for using SharkSenz</li>
            <li><Link to="/cookies" className="text-blue-600 hover:text-blue-800">Cookie Policy</Link> - Information about how we use cookies and similar technologies</li>
            <li><Link to="/disclaimer" className="text-blue-600 hover:text-blue-800">Disclaimer</Link> - Important notices about the limitations of our services</li>
          </ul>
          
          <LegalPageFooter currentPage="privacy" />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
