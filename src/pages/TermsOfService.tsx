import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose lg:prose-lg max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            Last updated: May 23, 2025
          </p>
          
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using SharkSenz's website and services, you agree to be bound by these Terms of Service 
            and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
            from using or accessing this site.
          </p>
          
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials (information or software) on SharkSenz's website 
            for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
            and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on SharkSenz's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          
          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information at all times. 
            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities 
            or actions under your password. You agree not to disclose your password to any third party.
          </p>

          <h2>4. Subscription and Payments</h2>
          <p>
            Some features of our platform require a paid subscription. By subscribing to a paid plan, you agree to pay 
            the subscription fees indicated for your selected plan. All payments are non-refundable except as expressly 
            provided in these Terms.
          </p>
          <p>
            We may change our fees and payment structure at any time. If there are changes to your subscription fee, 
            we will notify you before these changes take effect.
          </p>

          <h2>5. Content</h2>
          <p>
            Our platform contains content owned by SharkSenz and third-party content. All content on the platform is 
            protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, 
            modify, or create derivative works of our content without explicit permission.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall SharkSenz, its officers, directors, employees, or agents be liable for any indirect, 
            incidental, special, consequential, or punitive damages, including without limitation, loss of profits, 
            data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability 
            to access or use the service.
          </p>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
            whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the 
            service will immediately cease.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try 
            to provide notice prior to any new terms taking effect. By continuing to access or use our service after 
            these revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, 
            without regard to its conflict of law provisions.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            Email: legal@sharksenz.com<br />
            Address: 123 Startup Hub, Innovation District, San Francisco, CA 94107
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
