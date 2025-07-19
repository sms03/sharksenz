import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "Getting Started",
      items: [
        {
          question: "Who is SharkSenz designed for?",
          answer: "SharkSenz is built specifically for first-time founders in tech (SaaS, mobile apps), service-based startups (consultancies, agencies), and product innovators (e-commerce, physical products). Our AI coach is trained on 500+ real startup case studies to provide relevant, actionable guidance."
        },
        {
          question: "What makes SharkSenz different from other founder tools?",
          answer: "Unlike generic business education platforms, SharkSenz connects every lesson to measurable KPIs and real business outcomes. Our AI coach tracks 12+ critical startup metrics and connects you with investors when your metrics hit funding-ready benchmarks. You get practical tools, not just theory."
        },
        {
          question: "Do I need any business experience to use SharkSenz?",
          answer: "No! SharkSenz is designed for first-time founders. Our AI coach starts with the basics and adapts to your learning pace. We provide templates, calculators, and step-by-step guidance for everything from idea validation to investor pitches."
        }
      ]
    },
    {
      category: "AI Coach & KPIs",
      items: [
        {
          question: "How does the AI coach work?",
          answer: "Our AI coach is trained on 500+ real startup case studies and connects to your business metrics in real-time. It analyzes your Customer Acquisition Cost, Lifetime Value, revenue growth, and 9 other critical KPIs to provide personalized recommendations and milestone tracking."
        },
        {
          question: "What KPIs does the platform track?",
          answer: "We track 12+ critical metrics including Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), Monthly Recurring Revenue (MRR), churn rate, gross margins, burn rate, runway, and more. Each metric comes with industry benchmarks so you know where you stand."
        },
        {
          question: "Can the AI coach help with my specific business model?",
          answer: "Yes! Our AI is trained on SaaS, e-commerce, service-based, and product startups. It understands different business models and provides relevant KPI benchmarks and strategies for your specific industry and stage."
        }
      ]
    },
    {
      category: "Investor Connections",
      items: [
        {
          question: "How do I get connected to investors?",
          answer: "When your KPIs hit investor-ready benchmarks (typically 3:1 LTV:CAC ratio, 6-month runway, consistent growth), our platform automatically flags you for our investor network. We have 50+ angel investors and VCs who specialize in early-stage startups."
        },
        {
          question: "What kind of investors are in your network?",
          answer: "Our network includes angel investors, seed funds, and Series A VCs who focus on tech startups, SaaS companies, and innovative products. They're specifically interested in data-driven founders who can demonstrate strong unit economics."
        },
        {
          question: "Is there a cost for investor introductions?",
          answer: "Investor introductions are included in our Pro and Shark tiers. We don't take equity or fees from successful fundraising - our goal is to help you succeed and build long-term relationships."
        }
      ]
    },
    {
      category: "Pricing & Features",
      items: [
        {
          question: "Can I try SharkSenz for free?",
          answer: "Yes! Our free tier includes access to the pitch analyzer, basic KPI tracking, and 10 learning modules. You can upgrade anytime to unlock the full AI coach, investor connections, and premium templates."
        },
        {
          question: "What's included in the paid plans?",
          answer: "Paid plans include unlimited AI coach access, advanced KPI dashboards, investor network access, premium templates, priority support, and milestone tracking. Pro plans start at $49/month with annual discounts available."
        },
        {
          question: "Do you offer refunds?",
          answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the platform within your first 30 days, we'll provide a full refund, no questions asked."
        }
      ]
    },
    {
      category: "Technical Support",
      items: [
        {
          question: "I'm experiencing technical issues. How do I get help?",
          answer: "For technical issues, email us at support@sharksenz.com or use the live chat in your dashboard. Pro and Shark tier users get priority support with 24-hour response times."
        },
        {
          question: "Can I integrate SharkSenz with my existing tools?",
          answer: "We're working on integrations with popular tools like Stripe, Google Analytics, and HubSpot. Currently, you can export your data and KPIs to Excel/Google Sheets for use in other platforms."
        },
        {
          question: "Is my data secure?",
          answer: "Absolutely. We use enterprise-grade security, encrypt all data in transit and at rest, and follow SOC 2 compliance standards. Your business data is never shared without your explicit permission."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about SharkSenz, our AI coach, and how we help first-time founders succeed.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">{categoryIndex + 1}</span>
                </div>
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <Card key={itemIndex} className="border border-blue-100">
                      <CardHeader 
                        className="cursor-pointer hover:bg-blue-50/50 transition-colors duration-200"
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <CardTitle className="flex items-center justify-between text-lg">
                          <span>{item.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      {isOpen && (
                        <CardContent className="border-t border-blue-100">
                          <p className="text-gray-700 leading-relaxed">
                            {item.answer}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our team is here to help! Reach out to us directly and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50"
                asChild
              >
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <a href="mailto:support@sharksenz.com">
                  Email Us Directly
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
