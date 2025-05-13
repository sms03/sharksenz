import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, PlayCircle } from "lucide-react";
import { FadeIn, SlideUpInView } from "@/components/ui/motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { XP_VALUES, addXP } from "@/utils/userProgress";
import { XPIndicator } from "@/components/ui/xp-indicator";

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
  "cap-table": {
    title: "Cap Table (Capitalization Table)",
    description: "Track company ownership, equity distribution, and dilution through funding rounds. Learn how to read, build, and use a cap table for investor negotiations.",
    sections: [
      {
        title: "What is a Cap Table?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is a Cap Table?</h2>
          <p class="mb-4">A capitalization table (cap table) is a spreadsheet or table that shows the equity ownership capitalization for a company. It details who owns what percentage of the company, including founders, investors, and employees. Cap tables are essential for understanding how ownership changes over time, especially after new funding rounds or option grants.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Tracks shares, options, warrants, and convertible securities</li>
            <li>Shows how ownership changes after each investment round</li>
            <li>Helps founders plan for dilution and future fundraising</li>
            <li>Used in due diligence by investors and acquirers</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>Sharks often ask, "How much of the company do you own?" or "What happens to my stake after future rounds?" A clear cap table answers these questions and shows you understand dilution and investor rights.</p>
          </div>
        `
      },
      {
        title: "Why Cap Tables Matter",
        content: `
          <h2 class="text-2xl font-bold mb-4">Why Cap Tables Matter</h2>
          <p class="mb-4">Cap tables are essential for understanding dilution, negotiating investments, and planning exits. They help founders and investors see the impact of new funding rounds on ownership. A well-maintained cap table builds trust with investors and helps avoid disputes.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Helps avoid surprises about dilution and control</li>
            <li>Ensures transparency for all stakeholders</li>
            <li>Required for due diligence in fundraising and acquisitions</li>
            <li>Shows vesting schedules, option pools, and convertible notes</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Use cap table software (like Carta or Pulley) as your company grows to avoid errors and keep records up to date.</p>
          </div>
        `
      },
      {
        title: "Cap Table Example & Dilution",
        content: `
          <h2 class="text-2xl font-bold mb-4">Cap Table Example & Dilution</h2>
          <p class="mb-4">Suppose your startup has 1,000,000 shares. You own 700,000 (70%), your co-founder owns 200,000 (20%), and an advisor owns 100,000 (10%). After raising money and issuing new shares to investors, your percentage ownership will decrease (dilution), but the company may be worth more overall.</p>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Sample Cap Table</h4>
            <table class="min-w-full text-sm mb-2">
              <thead><tr><th class="pr-4">Shareholder</th><th class="pr-4">Shares</th><th>% Ownership</th></tr></thead>
              <tbody>
                <tr><td>Founder A</td><td>700,000</td><td>70%</td></tr>
                <tr><td>Founder B</td><td>200,000</td><td>20%</td></tr>
                <tr><td>Advisor</td><td>100,000</td><td>10%</td></tr>
              </tbody>
            </table>
            <p>After a $1M investment for 20% of the company, the new cap table will reflect the investor's shares and the dilution of existing shareholders.</p>
          </div>
          <ul class="list-disc pl-6 mb-4">
            <li>Always model dilution before agreeing to new investment terms</li>
            <li>Understand pre-money and post-money valuation</li>
          </ul>
        `
      }
    ]
  },
  "cash-flow": {
    title: "Cash Flow",
    description: "Track the movement of money in and out of your business. Learn to analyze, forecast, and optimize cash flow for startup survival and growth.",
    sections: [
      {
        title: "What is Cash Flow?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Cash Flow?</h2>
          <p class="mb-4">Cash flow is the net amount of cash and cash-equivalents moving into and out of a business. Positive cash flow means more money is coming in than going out, which is vital for survival and growth. Cash flow is different from profit and is the lifeblood of any startup.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Operating cash flow: from core business operations (sales, expenses)</li>
            <li>Investing cash flow: from buying/selling assets (equipment, property)</li>
            <li>Financing cash flow: from loans, investments, dividends</li>
            <li>Free cash flow: cash available after capital expenditures</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Why It Matters</h4>
            <p>Even profitable companies can fail if they run out of cash. Always monitor your cash runway and plan for slow-paying customers or unexpected expenses.</p>
          </div>
        `
      },
      {
        title: "Cash Flow vs. Profit",
        content: `
          <h2 class="text-2xl font-bold mb-4">Cash Flow vs. Profit</h2>
          <p class="mb-4">Profit is not the same as cash flow. A company can be profitable on paper but run out of cash if customers delay payments or inventory builds up. Cash flow statements show the real movement of money and are critical for financial health.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Profit is an accounting concept; cash flow is about actual money in the bank</li>
            <li>Track both to avoid surprises</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>Sharks want to know, "How much cash do you have in the bank?" and "How long will it last?" They care about cash flow, not just profits. Be ready to explain your cash conversion cycle and how you manage working capital.</p>
          </div>
        `
      },
      {
        title: "Improving Cash Flow",
        content: `
          <h2 class="text-2xl font-bold mb-4">Improving Cash Flow</h2>
          <ul class="list-disc pl-6 mb-4">
            <li>Invoice promptly and follow up on late payments</li>
            <li>Negotiate better payment terms with suppliers</li>
            <li>Reduce inventory levels to free up cash</li>
            <li>Consider short-term financing or lines of credit</li>
            <li>Monitor cash flow weekly, not just monthly</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Use a cash flow forecast to anticipate shortfalls and plan corrective actions in advance.</p>
          </div>
        `
      }
    ]
  },
  "churn-rate": {
    title: "Churn Rate",
    description: "Measure how many customers you lose over time. Learn to analyze, reduce, and benchmark churn for SaaS and subscription businesses.",
    sections: [
      {
        title: "What is Churn Rate?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Churn Rate?</h2>
          <p class="mb-4">Churn rate is the percentage of customers who stop using your product or service during a given time period. It's a key metric for subscription and SaaS businesses. High churn can signal product or service issues, poor fit, or strong competition.</p>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Formula:</strong> Churn Rate = (Customers Lost ÷ Total Customers at Start) × 100%</li>
            <li>High churn means you need to acquire more customers just to maintain revenue</li>
            <li>Track churn by cohort, segment, and reason for cancellation</li>
          </ul>
        `
      },
      {
        title: "Reducing Churn",
        content: `
          <h2 class="text-2xl font-bold mb-4">Reducing Churn</h2>
          <ul class="list-disc pl-6 mb-4">
            <li>Improve onboarding and customer support</li>
            <li>Deliver ongoing value and product updates</li>
            <li>Identify and address reasons for cancellation (survey churned users)</li>
            <li>Offer win-back campaigns or loyalty incentives</li>
            <li>Benchmark churn against industry standards</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Reducing churn by even 1% can have a major impact on lifetime value and growth rate.</p>
          </div>
        `
      }
    ]
  },
  "cohort-analysis": {
    title: "Cohort Analysis",
    description: "Analyze groups of users over time to spot trends and improve retention. Learn how to use cohort analysis for actionable insights.",
    sections: [
      {
        title: "What is Cohort Analysis?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Cohort Analysis?</h2>
          <p class="mb-4">Cohort analysis groups users by shared characteristics (like signup month) and tracks their behavior over time. It helps you understand retention, engagement, and the impact of product changes. Cohort analysis is a powerful tool for SaaS, apps, and consumer businesses.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Reveals if new users are sticking around or churning</li>
            <li>Shows if product changes improve retention</li>
            <li>Helps identify high-value customer segments</li>
            <li>Can be used to test marketing campaigns or onboarding flows</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Visualize cohorts with a heatmap to quickly spot trends and outliers.</p>
          </div>
        `
      }
    ]
  },
  "contribution-margin": {
    title: "Contribution Margin",
    description: "Understand how much each sale contributes to covering fixed costs and generating profit. Learn to calculate, interpret, and improve contribution margin.",
    sections: [
      {
        title: "What is Contribution Margin?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Contribution Margin?</h2>
          <p class="mb-4">Contribution margin is the amount each sale contributes to covering fixed costs and generating profit. It's calculated as sales revenue minus variable costs. High contribution margin means more profit per sale and greater flexibility to invest in growth.</p>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Formula:</strong> Contribution Margin = Sales Revenue - Variable Costs</li>
            <li>High contribution margin means more profit per sale</li>
            <li>Track by product, customer segment, or channel</li>
            <li>Use to set pricing and prioritize high-margin products</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Improving contribution margin is often the fastest way to boost profitability.</p>
          </div>
        `
      }
    ]
  },
  "conversion-rates": {
    title: "Conversion Rates",
    description: "Track how many leads or visitors become customers. Learn to analyze, test, and improve conversion rates for growth.",
    sections: [
      {
        title: "What is a Conversion Rate?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is a Conversion Rate?</h2>
          <p class="mb-4">Conversion rate is the percentage of users who take a desired action, such as signing up, making a purchase, or subscribing. It's a key metric for marketing and sales effectiveness. Small improvements in conversion rate can have a big impact on revenue.</p>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Formula:</strong> Conversion Rate = (Conversions ÷ Total Visitors) × 100%</li>
            <li>Improving conversion rates increases revenue without more traffic</li>
            <li>Track conversion rates at each step of the funnel</li>
            <li>Segment by channel, device, or campaign</li>
          </ul>
        `
      },
      {
        title: "Improving Conversion Rates",
        content: `
          <h2 class="text-2xl font-bold mb-4">Improving Conversion Rates</h2>
          <ul class="list-disc pl-6 mb-4">
            <li>Test different headlines, images, and calls to action (A/B testing)</li>
            <li>Reduce friction in the signup or checkout process</li>
            <li>Use social proof, testimonials, and trust badges</li>
            <li>Personalize messaging and offers</li>
            <li>Analyze drop-off points and optimize the funnel</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Even a 1% increase in conversion rate can significantly boost revenue. Always be testing!</p>
          </div>
        `
      }
    ]
  },
  "customer-acquisition-cost": {
    title: "Customer Acquisition Cost (CAC)",
    description: "Calculate how much it costs to acquire a new customer. Learn to optimize CAC and balance it with lifetime value (LTV).",
    sections: [
      {
        title: "What is CAC?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Customer Acquisition Cost?</h2>
          <p class="mb-4">CAC is the total cost of acquiring a new customer, including marketing and sales expenses. It's a critical metric for understanding the efficiency of your growth efforts. Lowering CAC while maintaining growth is a key to startup success.</p>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Formula:</strong> CAC = Total Sales & Marketing Cost ÷ Number of New Customers</li>
            <li>Lower CAC means more efficient growth</li>
            <li>Track CAC by channel, campaign, and customer segment</li>
            <li>Compare CAC to LTV (lifetime value) for sustainability</li>
          </ul>
        `
      },
      {
        title: "Improving CAC",
        content: `
          <h2 class="text-2xl font-bold mb-4">Improving CAC</h2>
          <ul class="list-disc pl-6 mb-4">
            <li>Focus on high-ROI marketing channels</li>
            <li>Increase conversion rates at each funnel stage</li>
            <li>Retain customers longer (improves LTV:CAC ratio)</li>
            <li>Use referral programs and word-of-mouth</li>
            <li>Automate and optimize sales processes</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Always balance CAC with LTV. If your CAC is too high, growth will not be sustainable.</p>
          </div>
        `
      }
    ]
  },
  "debt-equity": {
    title: "Debt vs. Equity",
    description: "Understand the difference between debt and equity financing. Learn when to use each, and how they impact control, risk, and growth.",
    sections: [
      {
        title: "Debt vs. Equity Financing",
        content: `
          <h2 class="text-2xl font-bold mb-4">Debt vs. Equity Financing</h2>
          <p class="mb-4">Debt financing means borrowing money that must be repaid with interest. Equity financing means selling ownership in your company in exchange for capital. Each has pros and cons for startups, and the right choice depends on your goals, risk tolerance, and growth plans.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Debt: No ownership dilution, but must repay principal and interest</li>
            <li>Equity: No repayment required, but you give up some control and future profits</li>
            <li>Debt is often cheaper but riskier if cash flow is uncertain</li>
            <li>Equity brings partners and expertise, but dilutes your stake</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>Sharks may offer debt, equity, or a mix (convertible notes, SAFE, royalties). Be ready to explain why you prefer one over the other and how it fits your business plan.</p>
          </div>
        `
      }
    ]
  },
  "depreciation": {
    title: "Depreciation",
    description: "Spread out the cost of assets over their useful life. Learn methods, tax implications, and how depreciation affects your financials.",
    sections: [
      {
        title: "What is Depreciation?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Depreciation?</h2>
          <p class="mb-4">Depreciation is the process of allocating the cost of a tangible asset over its useful life. It reduces taxable income and reflects the asset's declining value. Depreciation is a non-cash expense, but it impacts your profit and tax liability.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Common for equipment, vehicles, buildings</li>
            <li>Not used for land or intangible assets</li>
            <li>Reduces reported profit, but not cash flow</li>
            <li>Required for GAAP and tax reporting</li>
          </ul>
        `
      },
      {
        title: "Depreciation Methods",
        content: `
          <h2 class="text-2xl font-bold mb-4">Depreciation Methods</h2>
          <ul class="list-disc pl-6 mb-4">
            <li>Straight-line: Equal expense each year</li>
            <li>Declining balance: Higher expense in early years</li>
            <li>Units of production: Based on usage</li>
            <li>Bonus depreciation: Accelerated write-off for tax purposes</li>
          </ul>
          <div class="bg-shark-50 p-4 rounded-lg mb-4">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Work with an accountant to choose the best depreciation method for your business and maximize tax benefits.</p>
          </div>
        `
      }
    ]
  }
};

export default function LearningModule() {
  const { moduleId } = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

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
      setIsCompleting(true);
      const moduleXP = XP_VALUES.MODULE_COMPLETION;
      
      toast.success(
        <div className="flex items-center gap-2">
          <span>Module completed!</span>
          <XPIndicator value={moduleXP} size="sm" showLabel={false} />
        </div>, 
        {
          description: "Your progress has been saved. Redirecting to Learning Hub...",
          duration: 3000
        }
      );
      
      // Mark module as completed in localStorage (similar to completeModule in Learning.tsx)
      if (user && user.email && moduleId) {
        try {
          // Get current progress from localStorage
          const savedProgressString = localStorage.getItem(`module_progress_${user.email}`);
          let userModules = [];
          
          if (savedProgressString) {
            try {
              const parsedProgressArray = JSON.parse(savedProgressString);
              // Validate that it's actually an array
              if (Array.isArray(parsedProgressArray)) {
                userModules = parsedProgressArray;
              } else {
                console.warn("Saved progress is not an array, initializing empty array");
                userModules = [];
              }
            } catch (e) {
              console.error("Failed to parse user module progress from localStorage", e);
              userModules = [];
            }
          }
          
          // Find the module by title in our local moduleContent data
          const currentModule = moduleContent[moduleId as keyof typeof moduleContent];
          
          if (currentModule) {
            // Find the module's category by checking which category contains this moduleId
            // Default to the moduleId if we can't determine the category
            let category = moduleId;
            
            // Look through all categories in hardcoded learningModules to find which one contains our module
            // This would be unnecessary if the moduleData already had the category information
            const allCategories = ['fundamentals', 'valuation', 'metrics', 'pitching'];
            for (const cat of allCategories) {
              if (Object.keys(moduleContent).some(key => 
                key === moduleId && moduleContent[key as keyof typeof moduleContent].title === currentModule.title)) {
                category = cat;
                break;
              }
            }
            
            // Check if module exists in userModules
            const moduleIndex = userModules.findIndex((m: any) => 
              m.title === currentModule.title && 
              (!m.category || m.category === category)
            );
            
            if (moduleIndex !== -1) {
              // Update existing module
              userModules[moduleIndex].completed = true;
              // Ensure category is set correctly
              userModules[moduleIndex].category = category;
            } else {
              // Add module if it doesn't exist
              userModules.push({
                title: currentModule.title,
                category: category,
                completed: true
              });
            }
            
            // Save updated modules back to localStorage
            localStorage.setItem(`module_progress_${user.email}`, JSON.stringify(userModules));
            
            // Check if we need to update any badges
            // For example, the "Shark Apprentice" badge is unlocked when any module is completed
            const savedBadgesString = localStorage.getItem(`badges_${user.email}`);
            if (savedBadgesString) {
              try {
                const badges = JSON.parse(savedBadgesString);
                if (Array.isArray(badges)) {
                  let badgesChanged = false;
                  const newBadges = badges.map((badge) => {
                    // Badge ID 1 is "Shark Apprentice", unlocked with first completed module
                    if (badge.id === 1 && !badge.unlocked) {
                      badgesChanged = true;
                      return { ...badge, unlocked: true };
                    }
                    return badge;
                  });
                  
                  if (badgesChanged) {
                    localStorage.setItem(`badges_${user.email}`, JSON.stringify(newBadges));
                  }
                }
              } catch (e) {
                console.error("Failed to update badges in localStorage", e);
              }
            }
            
            // Award XP for completing the module if not already completed
            // Check first if this is a new completion to avoid duplicate XP
            if (moduleIndex === -1 || userModules[moduleIndex].completed === false) {
              const xpAwarded = XP_VALUES.MODULE_COMPLETION;
              const newTotalXP = addXP(user.email, xpAwarded);
              console.log(`Added ${xpAwarded} XP for completing module. New total: ${newTotalXP} XP`);
            }
            
            // Navigate back to Learning page to show updated progress
            setTimeout(() => {
              navigate('/learning');
            }, 1500); // Short delay to allow the user to see the success toast
          }
        } catch (error) {
          console.error("Failed to save module completion to localStorage:", error);
          setIsCompleting(false); // Reset state if there's an error
        }
      }
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
            disabled={currentSection === 0 || isCompleting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentSection < moduleData.sections.length - 1 ? (
            <Button onClick={handleNextSection} disabled={isCompleting}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleNextSection} 
              disabled={isCompleting}
              className={isCompleting ? "bg-green-500 hover:bg-green-500" : ""}
            >
              {isCompleting ? "Completed!" : "Complete Module"}
              <CheckCircle className={`h-4 w-4 ml-2 ${isCompleting ? "animate-pulse" : ""}`} />
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
        
        {isCompleting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Module Completed!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Great job! Your progress has been saved.
              </p>
              <div className="bg-yellow-50 p-3 mb-4 rounded-md">
                <p className="text-lg font-semibold text-yellow-600">
                  +{XP_VALUES.MODULE_COMPLETION} XP Earned
                </p>
                <p className="text-sm text-yellow-700">
                  Keep learning to level up your profile!
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to Learning Hub...
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
