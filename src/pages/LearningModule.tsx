import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, PlayCircle } from "lucide-react";
import { FadeIn, SlideUpInView } from "@/components/ui/motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Sample module content (would come from database in real app)
const moduleContent = {
  "business-model": {
    title: "Business Model Basics",
    description: "Learn the core components of any successful business model",
    sections: [
      {
        title: "Introduction to Business Models",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is a Business Model?</h2>
          <p class="mb-4">A business model describes how a company creates, delivers, and captures value. It's the blueprint for how your business will make money and sustain itself.</p>
          <p class="mb-6">The most successful entrepreneurs don't just have great ideas—they have a clear understanding of how those ideas will generate revenue and become sustainable businesses.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Components of a Business Model</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Value Proposition:</strong> What problem are you solving? Why would customers choose your solution over competitors?</li>
            <li><strong>Customer Segments:</strong> Who are you creating value for? Who are your most important customers?</li>
            <li><strong>Revenue Streams:</strong> How will you make money? What are customers willing to pay for?</li>
            <li><strong>Cost Structure:</strong> What are the most important costs in your business?</li>
            <li><strong>Key Activities:</strong> What key activities does your value proposition require?</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>When entrepreneurs pitch on Shark Tank, the Sharks immediately want to understand the business model. They ask questions like:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>"What does it cost to make?"</li>
              <li>"What do you sell it for?"</li>
              <li>"How do you acquire customers?"</li>
              <li>"Is this a product or a company?"</li>
            </ul>
          </div>
        `
      },
      {
        title: "Types of Business Models",
        content: `
          <h2 class="text-2xl font-bold mb-4">Common Business Models</h2>
          <p class="mb-6">There are numerous business models that companies use. Understanding these can help you determine which is right for your business or identify how to innovate.</p>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-semibold mb-2">Subscription Model</h3>
              <p>Customers pay a recurring fee for access to a product or service. Examples: Netflix, Spotify, SaaS companies.</p>
              <div class="mt-2 text-shark-600 text-sm">
                <strong>Pros:</strong> Predictable revenue, high customer lifetime value<br>
                <strong>Cons:</strong> Customer acquisition can be expensive, churn management is critical
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-2">Marketplace Model</h3>
              <p>Platforms that connect buyers and sellers, taking a commission on transactions. Examples: Airbnb, Uber, eBay.</p>
              <div class="mt-2 text-shark-600 text-sm">
                <strong>Pros:</strong> Scalable with network effects<br>
                <strong>Cons:</strong> Chicken-and-egg problem of building both sides of the marketplace
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-2">Freemium Model</h3>
              <p>Basic services are free, but premium features require payment. Examples: Dropbox, LinkedIn, mobile games.</p>
              <div class="mt-2 text-shark-600 text-sm">
                <strong>Pros:</strong> Low barrier to entry for new users<br>
                <strong>Cons:</strong> Must carefully balance free and paid features
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-2">E-commerce Model</h3>
              <p>Selling products directly to consumers online. Examples: Amazon, Shopify stores.</p>
              <div class="mt-2 text-shark-600 text-sm">
                <strong>Pros:</strong> Direct consumer relationships, higher margins than wholesale<br>
                <strong>Cons:</strong> Logistics and customer service challenges
              </div>
            </div>
          </div>
          
          <div class="mt-8 p-4 border border-shark-200 rounded-lg">
            <h4 class="font-semibold mb-2">Business Model Innovation</h4>
            <p>Many successful companies didn't invent new products—they innovated on the business model. For example, Dollar Shave Club disrupted the razor industry not with a better razor but with a subscription model that eliminated retail markup.</p>
          </div>
        `
      },
      {
        title: "Business Model Canvas",
        content: `
          <h2 class="text-2xl font-bold mb-4">The Business Model Canvas</h2>
          <p class="mb-6">The Business Model Canvas is a strategic management template for developing new or documenting existing business models. It's a visual chart with elements describing a firm's value proposition, infrastructure, customers, and finances.</p>
          
          <div class="border rounded-lg overflow-hidden mb-6">
            <div class="bg-shark-100 p-3">
              <h3 class="font-semibold">The 9 Building Blocks</h3>
            </div>
            <div class="p-4 grid gap-4 md:grid-cols-2">
              <div>
                <h4 class="font-medium mb-1">1. Customer Segments</h4>
                <p class="text-sm">Who are your customers? Create different segments based on needs, behaviors.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">2. Value Propositions</h4>
                <p class="text-sm">What value do you deliver to customers? Which problems are you solving?</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">3. Channels</h4>
                <p class="text-sm">How do you reach your customers? How do they want to be reached?</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">4. Customer Relationships</h4>
                <p class="text-sm">What type of relationship does each customer segment expect?</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">5. Revenue Streams</h4>
                <p class="text-sm">How does the business earn revenue from each customer segment?</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">6. Key Resources</h4>
                <p class="text-sm">What assets are indispensable to your business model?</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">7. Key Activities</h4>
                <p class="text-sm">What activities must you perform well in your business model?</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">8. Key Partnerships</h4>
                <p class="text-sm">Who are your key partners and suppliers?</p>
              </div>
              <div class="md:col-span-2">
                <h4 class="font-medium mb-1">9. Cost Structure</h4>
                <p class="text-sm">What are the most important costs inherent in your business model?</p>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Filling Out Your Canvas</h3>
          <p class="mb-4">When creating your business model canvas:</p>
          <ol class="list-decimal pl-6 space-y-2 mb-6">
            <li>Start with customer segments and value propositions</li>
            <li>Move to how you'll deliver that value (channels, relationships)</li>
            <li>Define how you'll earn money (revenue streams)</li>
            <li>Identify what you need to deliver that value (resources, activities, partners)</li>
            <li>Calculate what it will cost (cost structure)</li>
          </ol>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, entrepreneurs who can clearly articulate each element of their business model have a much higher chance of getting investment. The Sharks want to see that you've thought through every aspect of how your business works.</p>
          </div>
        `
      },
    ]
  },
  "burn-rate": {
    title: "Burn Rate & Runway",
    description: "Calculate how long your cash will last",
    sections: [
      {
        title: "Understanding Burn Rate",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Burn Rate?</h2>
          <p class="mb-4">Burn rate is the rate at which a company is losing money, typically expressed as a monthly amount. It's a critical metric for startups and growing businesses, especially those that aren't yet profitable.</p>
          <p class="mb-6">Understanding your burn rate helps you determine how long your current cash reserves will last—known as your "runway"—and when you'll need to raise additional capital or reach profitability.</p>
          
          <h3 class="text-xl font-semibold mb-3">Types of Burn Rate</h3>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Gross Burn Rate</h4>
              <p>The total amount of operating costs you incur each month.</p>
              <div class="mt-3 p-2 bg-shark-50 rounded-md">
                <p class="text-sm font-medium">Formula:</p>
                <p class="font-mono">Gross Burn = Total Monthly Expenses</p>
              </div>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Net Burn Rate</h4>
              <p>The rate at which a company is losing money after accounting for revenue.</p>
              <div class="mt-3 p-2 bg-shark-50 rounded-md">
                <p class="text-sm font-medium">Formula:</p>
                <p class="font-mono">Net Burn = Total Monthly Expenses - Monthly Revenue</p>
              </div>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>On Shark Tank, entrepreneurs are often asked about their burn rate. When a company says they're spending $50,000 per month but only making $30,000 in revenue, their net burn rate is $20,000 per month.</p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Why Burn Rate Matters</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Financial Planning:</strong> Helps you plan for future fundraising needs</li>
            <li><strong>Strategic Decisions:</strong> Influences decisions about growth, hiring, and expansion</li>
            <li><strong>Investor Conversations:</strong> A key metric investors use to evaluate your business</li>
            <li><strong>Business Viability:</strong> Indicates if your business model is working</li>
          </ul>
        `
      },
      {
        title: "Calculating Runway",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Runway?</h2>
          <p class="mb-6">Runway is the amount of time your business can continue operating before it runs out of cash, assuming your burn rate stays constant and you don't raise additional funds.</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">Runway Formula</h3>
            <div class="bg-shark-50 p-3 rounded-md font-mono text-center mb-4">
              Runway (months) = Cash in Bank ÷ Monthly Net Burn Rate
            </div>
            <p class="mb-2"><strong>Example:</strong></p>
            <ul class="list-disc pl-6 space-y-1">
              <li>Cash in bank: $500,000</li>
              <li>Monthly expenses: $100,000</li>
              <li>Monthly revenue: $40,000</li>
              <li>Net burn rate: $60,000 per month</li>
              <li>Runway = $500,000 ÷ $60,000 = 8.33 months</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Extending Your Runway</h3>
          <p class="mb-3">There are two primary ways to extend runway:</p>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Reduce Burn Rate</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Cut non-essential expenses</li>
                <li>Renegotiate contracts with vendors</li>
                <li>Consider layoffs or hiring freezes</li>
                <li>Reduce office space or go remote</li>
                <li>Focus marketing on highest ROI channels</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Increase Cash</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Raise prices or introduce premium tiers</li>
                <li>Improve sales conversion rates</li>
                <li>Raise additional funding</li>
                <li>Offer prepaid annual contracts</li>
                <li>Explore new revenue streams</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">The Shark Tank Rule of Thumb</h4>
            <p>Sharks typically want to see at least 18 months of runway after their investment. This gives the company enough time to hit key milestones before needing to raise again.</p>
            <p class="mt-2">Mark Cuban often says, "Running out of cash isn't a business model." Sharks want to invest in companies that have a clear path to profitability or significant value creation before the cash runs out.</p>
          </div>
        `
      },
      {
        title: "Managing Burn Rate Effectively",
        content: `
          <h2 class="text-2xl font-bold mb-4">Burn Rate Management Strategies</h2>
          <p class="mb-6">Successfully managing your burn rate requires balancing growth with sustainability. Here are key strategies to optimize your burn rate:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Prioritize Customer Acquisition Costs</h3>
              <p>Ensure your CAC (Customer Acquisition Cost) is sustainable relative to your LTV (Lifetime Value). As a general rule, your LTV should be at least 3x your CAC.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Action item:</strong> Calculate your LTV:CAC ratio monthly and adjust marketing spend accordingly.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Focus on Unit Economics</h3>
              <p>Before scaling, make sure you have positive unit economics—that is, you make money on each individual sale or customer when accounting for direct costs.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Action item:</strong> Break down costs per unit sold or per customer and identify ways to improve margins.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Use the 40% Rule</h3>
              <p>For SaaS businesses, the "40% rule" suggests that your growth rate plus your profit margin should equal 40%. This balances growth and burn.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Example:</strong> If growing at 100% year-over-year, you can "afford" to have a -60% profit margin.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Maintain a Burn Multiple</h3>
              <p>Your burn multiple is how much you're burning relative to your growth: Burn Multiple = Net Burn ÷ Net New ARR.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Target:</strong> A burn multiple under 1.5 is typically considered good. Under 1 is excellent.
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Warning Signs of Unhealthy Burn</h3>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Increasing burn without proportional growth</strong> — If you're spending more but not growing faster</li>
              <li><strong>Burn rate growing faster than revenue</strong> — Your economics are moving in the wrong direction</li>
              <li><strong>Less than 6 months of runway</strong> — Dangerously low cushion for unexpected events</li>
              <li><strong>High burn with low capital efficiency</strong> — Getting less than $1 of ARR for every $1-2 spent</li>
            </ul>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">What Would the Sharks Say?</h4>
            <p class="mb-3">On Shark Tank, entrepreneurs with high burn rates face tough questions:</p>
            <ul class="list-disc pl-6">
              <li>"Why are you spending so much without proven unit economics?"</li>
              <li>"How will my investment extend your runway, and what milestones will you hit?"</li>
              <li>"What's your path to profitability, and when will you get there?"</li>
            </ul>
          </div>
        `
      }
    ]
  },
  "valuation-fundamentals": {
    title: "Startup Valuation Methods",
    description: "Learn how investors value early-stage companies",
    sections: [
      {
        title: "Valuation Fundamentals",
        content: `
          <h2 class="text-2xl font-bold mb-4">Understanding Startup Valuation</h2>
          <p class="mb-4">Valuation is both an art and a science, especially for early-stage companies without significant revenue or profits. Understanding different valuation methods helps you negotiate better with investors.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Valuation Concepts</h3>
          <div class="space-y-4 mb-6">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-semibold mb-2">Pre-money vs Post-money</h4>
              <p>Pre-money valuation is your company's value before investment. Post-money is pre-money plus the investment amount.</p>
              <div class="mt-2 bg-shark-50 p-3 rounded-md">
                <p class="font-mono">Post-money = Pre-money + Investment</p>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-semibold mb-2">Dilution</h4>
              <p>When you raise money, existing shareholders get diluted. The percentage depends on the valuation and investment amount.</p>
              <div class="mt-2 bg-shark-50 p-3 rounded-md">
                <p class="font-mono">Ownership % = Investment ÷ Post-money Valuation</p>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>When a Shark offers "$100,000 for 20%", they're suggesting a post-money valuation of $500,000. The implied pre-money valuation is $400,000.</p>
          </div>
        `
      },
      {
        title: "Valuation Methods",
        content: `
          <h2 class="text-2xl font-bold mb-4">Common Valuation Methods</h2>
          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">1. Comparable Analysis</h3>
              <p class="mb-3">Looking at similar companies that have raised money or been acquired.</p>
              <div class="bg-shark-50 p-3 rounded-md">
                <h4 class="font-medium mb-2">Key Metrics:</h4>
                <ul class="list-disc pl-6 space-y-1">
                  <li>Revenue multiples</li>
                  <li>User/customer multiples</li>
                  <li>Market size comparisons</li>
                </ul>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">2. Scorecard Method</h3>
              <p class="mb-3">Comparing your startup to typical angel-funded companies in your region.</p>
              <div class="bg-shark-50 p-3 rounded-md">
                <h4 class="font-medium mb-2">Factors:</h4>
                <ul class="list-disc pl-6 space-y-1">
                  <li>Team strength (30%)</li>
                  <li>Market size (25%)</li>
                  <li>Product/Technology (15%)</li>
                  <li>Competitive environment (10%)</li>
                  <li>Marketing/Sales (10%)</li>
                  <li>Need for additional investment (5%)</li>
                  <li>Other factors (5%)</li>
                </ul>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">3. DCF Analysis</h3>
              <p class="mb-3">Discounted Cash Flow analysis for more mature startups with predictable revenue.</p>
              <div class="bg-shark-50 p-3 rounded-md">
                <p class="font-mono mb-2">Present Value = Future Cash Flows ÷ (1 + Discount Rate)^n</p>
                <p class="text-sm">Note: Often less relevant for early-stage startups due to uncertainty in projections.</p>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "Negotiating Valuation",
        content: `
          <h2 class="text-2xl font-bold mb-4">Valuation Negotiation Strategies</h2>
          <p class="mb-6">Negotiating valuation is about more than just numbers—it's about telling your story and backing it up with data.</p>

          <div class="space-y-6 mb-6">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Key Value Drivers</h3>
              <ul class="list-disc pl-6 space-y-2">
                <li><strong>Traction:</strong> Users, revenue, growth rates</li>
                <li><strong>Team:</strong> Experience, track record, domain expertise</li>
                <li><strong>Technology:</strong> IP, patents, technical innovation</li>
                <li><strong>Market:</strong> Size, growth rate, competitive position</li>
                <li><strong>Timing:</strong> Market readiness, competitive landscape</li>
              </ul>
            </div>

            <div class="bg-shark-50 p-4 rounded-lg">
              <h4 class="font-semibold text-shark-700 mb-2">Red Flags That Lower Valuation</h4>
              <ul class="list-disc pl-6 space-y-2">
                <li>No clear path to profitability</li>
                <li>High customer acquisition costs</li>
                <li>Weak competitive moat</li>
                <li>Inexperienced team</li>
                <li>Small or shrinking market</li>
              </ul>
            </div>
          </div>
        `
      }
    ]
  },
};

export default function LearningModule() {
  const { moduleId } = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId || !moduleContent[moduleId as keyof typeof moduleContent]) {
      // Handle invalid module ID
      return;
    }

    // Get module data
    setModuleData(moduleContent[moduleId as keyof typeof moduleContent]);
    setLoading(false);

    // If user is logged in, track progress
    if (user) {
      // In a real app, would fetch progress from database
      // For demo, just set progress based on section
      setProgress(((currentSection + 1) / moduleContent[moduleId as keyof typeof moduleContent].sections.length) * 100);
    }
  }, [moduleId, currentSection, user]);

  const handleNextSection = () => {
    if (!moduleData) return;
    
    if (currentSection < moduleData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      
      // In a real app, would save progress to database
      setProgress(((currentSection + 2) / moduleData.sections.length) * 100);
      
      // Scroll to top
      window.scrollTo(0, 0);
    } else {
      // Module completed
      toast.success("Module completed! Great job!");
      
      // In a real app, would mark module as completed in the database
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setProgress(((currentSection) / moduleData.sections.length) * 100);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading module content...</p>
        </div>
      </MainLayout>
    );
  }

  if (!moduleData) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-4xl text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Module Not Found</h1>
          <p className="mb-6">The module you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/learning">Return to Learning Hub</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link to="/learning" className="inline-flex items-center text-sm text-shark-600 hover:text-shark-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Learning Hub
          </Link>
        </div>
        
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{moduleData.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{moduleData.description}</p>
            
            {user && (
              <div className="flex items-center">
                <div className="mr-4 text-sm font-medium">
                  {currentSection + 1} of {moduleData.sections.length} sections
                </div>
                <div className="flex-1">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {moduleData.sections.map((section: any, index: number) => (
            <Button
              key={index}
              variant={currentSection === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentSection(index)}
              className="flex-shrink-0"
            >
              {index < currentSection && (
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              )}
              {section.title}
            </Button>
          ))}
        </div>

        <SlideUpInView>
          <Card>
            <CardContent className="p-6 md:p-8">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: moduleData.sections[currentSection].content }}
              />
            </CardContent>
          </Card>
        </SlideUpInView>

        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousSection}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentSection < moduleData.sections.length - 1 ? (
            <Button onClick={handleNextSection}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNextSection}>
              Complete Module
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        <div className="mt-12 rounded-lg border p-6 bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0 bg-shark-100 text-shark-700 p-3 rounded-full">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to apply this knowledge?</h3>
              <p className="text-muted-foreground mb-4">
                Test your understanding of {moduleData.title} with interactive exercises.
              </p>
              <Button asChild variant="outline">
                <Link to="/achievements">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Take the Quiz
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
