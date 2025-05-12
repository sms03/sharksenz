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
  "cohort-analysis": {
    title: "Cohort Analysis",
    description: "Analyze user behavior over time",
    sections: [
      {
        title: "Cohort Analysis Basics",
        content: `
          <h2 class="text-2xl font-bold mb-4">Understanding Cohort Analysis</h2>
          <p class="mb-6">Cohort analysis is a powerful analytical tool that groups users into "cohorts" based on shared characteristics and tracks their behavior over time. It reveals patterns that are otherwise hidden in aggregated data.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">What Is a Cohort?</h3>
              <p class="mb-3">A cohort is a group of users who share a common characteristic or experience within a defined time period. Common cohort types include:</p>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li><strong>Acquisition cohorts:</strong> Grouped by when users joined/signed up (most common)</li>
                <li><strong>Behavioral cohorts:</strong> Grouped by actions they've taken (e.g., completed onboarding)</li>
                <li><strong>Size cohorts:</strong> Grouped by transaction size or subscription tier</li>
                <li><strong>Channel cohorts:</strong> Grouped by acquisition source (organic search, paid ads, etc.)</li>
                <li><strong>Demographic cohorts:</strong> Grouped by age, location, or other demographics</li>
              </ul>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Why Cohort Analysis Matters</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Reveals True Business Health</h4>
                  <p class="text-sm">Aggregate metrics can mask underlying problems. For example, total revenue might be growing, but newer cohorts might have worse retention.</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Isolates Product & Marketing Impact</h4>
                  <p class="text-sm">By comparing cohorts from before and after changes, you can measure the impact of product updates or marketing campaigns.</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Identifies Retention Patterns</h4>
                  <p class="text-sm">Shows when and why users typically disengage, helping focus retention efforts at critical moments.</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Improves Forecasting</h4>
                  <p class="text-sm">Historical cohort behavior patterns can predict how new cohorts will perform over time.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Cohort Analysis vs. Segment Analysis</h4>
            <p class="mb-3">These are often confused but are different:</p>
            <ul class="list-disc pl-6">
              <li><strong>Cohort analysis:</strong> Groups users based on when they joined or experienced something, then tracks them over time</li>
              <li><strong>Segment analysis:</strong> Groups users based on shared attributes (demographics, behavior) without necessarily tracking time progression</li>
            </ul>
          </div>
        `
      },
      {
        title: "Implementing Cohort Analysis",
        content: `
          <h2 class="text-2xl font-bold mb-4">Creating & Interpreting Cohort Analysis</h2>
          <p class="mb-6">How to set up, analyze, and act on cohort data.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Retention Cohort Analysis</h3>
              <p class="mb-3">The most common cohort analysis tracks what percentage of users are still active over time:</p>
              <div class="overflow-x-auto">
                <table class="min-w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-shark-100">
                      <th class="border p-2">Cohort</th>
                      <th class="border p-2">Month 0</th>
                      <th class="border p-2">Month 1</th>
                      <th class="border p-2">Month 2</th>
                      <th class="border p-2">Month 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border p-2 font-medium">Jan 2023</td>
                      <td class="border p-2">100%</td>
                      <td class="border p-2">72%</td>
                      <td class="border p-2">63%</td>
                      <td class="border p-2">58%</td>
                    </tr>
                    <tr>
                      <td class="border p-2 font-medium">Feb 2023</td>
                      <td class="border p-2">100%</td>
                      <td class="border p-2">68%</td>
                      <td class="border p-2">59%</td>
                      <td class="border p-2">52%</td>
                    </tr>
                    <tr>
                      <td class="border p-2 font-medium">Mar 2023</td>
                      <td class="border p-2">100%</td>
                      <td class="border p-2">75%</td>
                      <td class="border p-2">67%</td>
                      <td class="border p-2">-</td>
                    </tr>
                    <tr>
                      <td class="border p-2 font-medium">Apr 2023</td>
                      <td class="border p-2">100%</td>
                      <td class="border p-2">79%</td>
                      <td class="border p-2">-</td>
                      <td class="border p-2">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="mt-3 text-sm">In this example, we can see the March and April cohorts have better retention, which might indicate product or market improvements.</p>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Cohort Analysis Metrics</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Retention Rate</h4>
                  <p class="text-sm">Percentage of users still active after a specific time period</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Churn Rate</h4>
                  <p class="text-sm">Percentage of users who have stopped using your product (1 - retention rate)</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Lifetime Value (LTV)</h4>
                  <p class="text-sm">Average revenue generated by a cohort over their lifetime</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Payback Period</h4>
                  <p class="text-sm">Time it takes for a cohort's revenue to exceed their acquisition cost</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Cohort Analysis</h4>
            <p class="mb-3">How cohort analysis applies to Shark Tank pitches:</p>
            <ul class="list-disc pl-6">
              <li>Sharks want to see evidence of improving retention in newer cohorts</li>
              <li>They look for increasing LTV across cohorts as a sign of business health</li>
              <li>They're interested in channel cohort analysis to identify scalable acquisition sources</li>
              <li>They value businesses with predictable cohort behavior for forecasting</li>
            </ul>
          </div>
        `
      }
    ]
  },
  "conversion-rates": {
    title: "Conversion Rates",
    description: "Tracking how prospects become customers",
    sections: [
      {
        title: "Understanding Conversion Rates",
        content: `
          <h2 class="text-2xl font-bold mb-4">Conversion Rate Fundamentals</h2>
          <p class="mb-6">Conversion rates measure the percentage of potential customers who complete a desired action. They're crucial metrics for evaluating marketing effectiveness and sales funnel efficiency.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Basic Conversion Rate Formula</h3>
              <div class="bg-shark-50 p-3 rounded-md mb-4">
                <p class="font-mono text-center">Conversion Rate (%) = (Number of Conversions ÷ Total Visitors or Opportunities) × 100</p>
              </div>
              <p class="mb-3"><strong>Examples:</strong></p>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Website: 500 purchases ÷ 10,000 visitors = 5% conversion rate</li>
                <li>Sales: 20 closed deals ÷ 200 leads = 10% conversion rate</li>
                <li>Email: 150 clicks ÷ 5,000 recipients = 3% conversion rate</li>
              </ul>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Common Conversion Metrics</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">E-commerce Conversions</h4>
                  <ul class="list-disc pl-6 text-sm">
                    <li>Product Page to Add-to-Cart</li>
                    <li>Cart to Checkout</li>
                    <li>Checkout to Purchase (Cart Abandonment Rate)</li>
                    <li>Overall Visitor to Purchase</li>
                  </ul>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">SaaS Conversions</h4>
                  <ul class="list-disc pl-6 text-sm">
                    <li>Visitor to Free Trial/Signup</li>
                    <li>Free Trial to Paid Conversion</li>
                    <li>Basic Plan to Premium Upgrade</li>
                  </ul>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">B2B Sales Conversions</h4>
                  <ul class="list-disc pl-6 text-sm">
                    <li>Lead to Qualified Lead</li>
                    <li>Qualified Lead to Meeting</li>
                    <li>Meeting to Proposal</li>
                    <li>Proposal to Closed Deal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Industry Benchmarks</h4>
            <p class="mb-3">Average conversion rates vary by industry:</p>
            <ul class="list-disc pl-6">
              <li><strong>E-commerce:</strong> 1-4% overall visitor-to-purchase</li>
              <li><strong>B2B:</strong> 3-5% visitor-to-lead, 10-20% lead-to-customer</li>
              <li><strong>SaaS:</strong> 3-5% visitor-to-trial, 15-25% trial-to-paid</li>
              <li><strong>Email marketing:</strong> 2-5% clickthrough rate, 0.5-3% conversion</li>
            </ul>
          </div>
        `
      },
      {
        title: "Improving Conversion Rates",
        content: `
          <h2 class="text-2xl font-bold mb-4">Optimization Strategies</h2>
          <p class="mb-6">Improving conversion rates can dramatically impact your business growth while maintaining the same level of traffic or leads.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Sales Funnel Analysis</h3>
              <p class="mb-3">Identifying where prospects drop off in your funnel:</p>
              <img src="/images/conversion-funnel.png" alt="Sales Funnel" class="mb-4 mx-auto max-w-xs rounded-lg shadow-md"/>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Customer Journey Mapping</h4>
                  <p class="text-sm">Document each touchpoint in your customer journey and measure conversion at each step. This reveals bottlenecks and opportunities.</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Funnel Visualization</h4>
                  <p class="text-sm">Create visual representations of your conversion funnel to spot significant drop-offs that need attention.</p>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Testing & Optimization</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">A/B Testing</h4>
                  <p class="text-sm">Systematically test different versions of landing pages, emails, ads, and other touchpoints to identify which performs better.</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">User Testing</h4>
                  <p class="text-sm">Observe how real users interact with your website or product to identify confusion, friction, or barriers to conversion.</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Conversion Rate Optimization (CRO)</h4>
                  <p class="text-sm">Implement methodical processes for improving conversion through hypotheses, tests, and iterations.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Conversion Insight</h4>
            <p class="mb-3">In Shark Tank presentations, investors focus on these conversion metrics:</p>
            <ul class="list-disc pl-6">
              <li>Customer acquisition channels and their conversion rates</li>
              <li>Sales conversion rate (leads to purchases)</li>
              <li>Customer retention and repeat purchase rates</li>
              <li>Upsell and cross-sell conversion rates</li>
              <li>Evidence of improving conversion over time</li>
            </ul>
          </div>
        `
      }
    ]
  },
  "nps": {
    title: "NPS & Customer Satisfaction",
    description: "Measuring customer loyalty and satisfaction",
    sections: [
      {
        title: "NPS Fundamentals",
        content: `
          <h2 class="text-2xl font-bold mb-4">Net Promoter Score (NPS)</h2>
          <p class="mb-6">NPS is a widely-used metric that measures customer loyalty and satisfaction by asking customers how likely they are to recommend your product or service to others.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">The NPS Question</h3>
              <p class="mb-3">NPS is based on a single question:</p>
              <div class="bg-shark-50 p-3 rounded-md mb-4">
                <p class="italic">"On a scale of 0-10, how likely are you to recommend [company/product/service] to a friend or colleague?"</p>
              </div>
              <div class="grid grid-cols-11 gap-1 mb-3">
                <div class="flex items-center justify-center h-8 rounded bg-red-500">
                  <span class="text-white font-medium">0</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-red-500">
                  <span class="text-white font-medium">1</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-red-500">
                  <span class="text-white font-medium">2</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-red-500">
                  <span class="text-white font-medium">3</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-red-500">
                  <span class="text-white font-medium">4</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-red-500">
                  <span class="text-white font-medium">5</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-red-500">
                  <span class="text-white font-medium">6</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-yellow-500">
                  <span class="text-white font-medium">7</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-yellow-500">
                  <span class="text-white font-medium">8</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-green-500">
                  <span class="text-white font-medium">9</span>
                </div>
                <div class="flex items-center justify-center h-8 rounded bg-green-500">
                  <span class="text-white font-medium">10</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4 mt-2">
                <div class="bg-red-100 p-2 text-center rounded">
                  <p class="font-medium text-red-700">Detractors</p>
                  <p class="text-xs text-red-600">Scores 0-6</p>
                </div>
                <div class="bg-yellow-100 p-2 text-center rounded">
                  <p class="font-medium text-yellow-700">Passives</p>
                  <p class="text-xs text-yellow-600">Scores 7-8</p>
                </div>
                <div class="bg-green-100 p-2 text-center rounded">
                  <p class="font-medium text-green-700">Promoters</p>
                  <p class="text-xs text-green-600">Scores 9-10</p>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Calculating NPS</h3>
              <div class="bg-shark-50 p-3 rounded-md mb-4">
                <p class="font-mono text-center">NPS = % of Promoters - % of Detractors</p>
              </div>
              <p class="mb-3"><strong>Example:</strong></p>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>100 customers respond to your NPS survey</li>
                <li>45 give scores of 9-10 (Promoters): 45%</li>
                <li>30 give scores of 7-8 (Passives): 30% (not used in calculation)</li>
                <li>25 give scores of 0-6 (Detractors): 25%</li>
                <li>NPS = 45% - 25% = 20</li>
              </ul>
              <p class="mt-3 text-sm">NPS ranges from -100 (all detractors) to +100 (all promoters)</p>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">NPS Benchmarks</h4>
            <ul class="list-disc pl-6">
              <li><strong>Above 70:</strong> Exceptional (top performers like Apple)</li>
              <li><strong>50-70:</strong> Excellent</li>
              <li><strong>30-50:</strong> Good</li>
              <li><strong>0-30:</strong> Needs improvement</li>
              <li><strong>Below 0:</strong> Critical issues to address</li>
            </ul>
            <p class="mt-3 text-sm"><em>Note: Benchmarks vary by industry. B2B typically has higher NPS than B2C.</em></p>
          </div>
        `
      },
      {
        title: "Customer Satisfaction Metrics",
        content: `
          <h2 class="text-2xl font-bold mb-4">Beyond NPS: Customer Satisfaction Metrics</h2>
          <p class="mb-6">While NPS is popular, a comprehensive customer satisfaction strategy includes multiple complementary metrics.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Key Satisfaction Metrics</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Customer Satisfaction Score (CSAT)</h4>
                  <p class="text-sm">Measures satisfaction with a specific interaction or feature</p>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="italic text-sm">"How satisfied are you with your recent experience?" (1-5 scale)</p>
                  </div>
                  <p class="mt-1 text-sm">CSAT = (Number of satisfied responses ÷ Total responses) × 100</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Customer Effort Score (CES)</h4>
                  <p class="text-sm">Measures how easy it was for customers to accomplish their goals</p>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="italic text-sm">"How easy was it to solve your problem today?" (1-7 scale)</p>
                  </div>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Customer Health Score</h4>
                  <p class="text-sm">A composite metric combining usage data, support interactions, and feedback</p>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Using Satisfaction Data</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Closing the Feedback Loop</h4>
                  <ul class="list-disc pl-6 text-sm">
                    <li>Follow up with detractors to resolve issues</li>
                    <li>Thank promoters and encourage referrals</li>
                    <li>Track issues mentioned in feedback to identify patterns</li>
                  </ul>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Prioritizing Improvements</h4>
                  <p class="text-sm">Use customer feedback to inform product roadmap and service improvements</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Predictive Analysis</h4>
                  <p class="text-sm">Use satisfaction metrics to predict and prevent churn</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Perspective</h4>
            <ul class="list-disc pl-6">
              <li>Sharks value businesses with solid NPS scores (30+)</li>
              <li>They appreciate evidence of responding to customer feedback</li>
              <li>They look for improving trends in satisfaction metrics over time</li>
              <li>Customer testimonials and case studies can reinforce satisfaction claims</li>
            </ul>
          </div>
        `
      }
    ]
  },
  "presentation-skills": {
    title: "Presentation Skills",
    description: "Deliver your pitch with confidence",
    sections: [
      {
        title: "The Power of Delivery",
        content: `
          <h2 class="text-2xl font-bold mb-4">Why Presentation Skills Matter</h2>
          <p class="mb-6">A great idea can be lost if it's not communicated clearly and confidently. Investors on Shark Tank and in real life invest in people as much as ideas. Your delivery can make or break your pitch.</p>
          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Key Elements of Effective Delivery</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li><strong>Confidence:</strong> Stand tall, make eye contact, and project your voice.</li>
                <li><strong>Clarity:</strong> Speak at a measured pace, avoid jargon, and use simple language.</li>
                <li><strong>Passion:</strong> Show genuine enthusiasm for your business.</li>
                <li><strong>Body Language:</strong> Use purposeful gestures, avoid fidgeting, and smile.</li>
                <li><strong>Engagement:</strong> Involve your audience with questions or stories.</li>
              </ul>
            </div>
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Common Mistakes to Avoid</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Reading slides word-for-word</li>
                <li>Speaking too quickly or too softly</li>
                <li>Overloading with data or technical details</li>
                <li>Ignoring time limits</li>
                <li>Failing to practice or anticipate questions</li>
              </ul>
            </div>
          </div>
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Perspective</h4>
            <ul class="list-disc pl-6">
              <li>Sharks often comment on the entrepreneur's confidence and communication style.</li>
              <li>Clear, concise, and passionate delivery stands out.</li>
              <li>Practice and preparation are always evident to investors.</li>
            </ul>
          </div>
        `
      },
      {
        title: "Practical Tips & Checklist",
        content: `
          <h2 class="text-2xl font-bold mb-4">How to Prepare for a Winning Presentation</h2>
          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Before the Pitch</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Rehearse your pitch out loud, ideally in front of others</li>
                <li>Record yourself and review your delivery</li>
                <li>Time your presentation and adjust to fit limits</li>
                <li>Prepare for likely questions and objections</li>
                <li>Visualize success and manage nerves with deep breathing</li>
              </ul>
            </div>
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">During the Pitch</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Start with a strong opening (hook, story, or bold statement)</li>
                <li>Maintain eye contact and positive body language</li>
                <li>Use pauses for emphasis and to let key points sink in</li>
                <li>Adapt to your audience's reactions and questions</li>
                <li>End with a clear, confident ask or call to action</li>
              </ul>
            </div>
          </div>
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Quick Checklist</h4>
            <ul class="list-disc pl-6">
              <li>✔ Practiced and timed your pitch</li>
              <li>✔ Prepared for tough questions</li>
              <li>✔ Slides are clear and support your story</li>
              <li>✔ Confident, authentic delivery</li>
              <li>✔ Strong opening and closing</li>
            </ul>
          </div>
        `
      }
    ]
  },
  "unit-economics": {
    title: "Unit Economics",
    description: "Understanding cost and revenue per unit",
    sections: [
      {
        title: "Unit Economics Basics",
        content: `
          <h2 class="text-2xl font-bold mb-4">Understanding Unit Economics</h2>
          <p class="mb-6">Unit economics examines the revenues and costs associated with a single unit of your business model, helping you determine if your core business is fundamentally profitable.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">What Is a "Unit"?</h3>
              <p class="mb-3">The definition of a "unit" varies by business model:</p>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li><strong>E-commerce:</strong> A single order or transaction</li>
                <li><strong>SaaS:</strong> One customer for one month/year</li>
                <li><strong>Marketplace:</strong> A single transaction on the platform</li>
                <li><strong>Consumer app:</strong> One user or one user-month</li>
                <li><strong>Hardware:</strong> One device sold</li>
              </ul>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Core Unit Economics Formulas</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Unit Revenue</h4>
                  <p class="text-sm">The average revenue generated from a single unit</p>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">Unit Revenue = Total Revenue ÷ Number of Units</p>
                  </div>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Unit Cost</h4>
                  <p class="text-sm">The direct costs associated with producing and delivering a single unit</p>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">Unit Cost = Total Variable Costs ÷ Number of Units</p>
                  </div>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Unit Margin</h4>
                  <p class="text-sm">The profit earned on each unit</p>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">Unit Margin = Unit Revenue - Unit Cost</p>
                  </div>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Unit Margin Percentage</h4>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">Unit Margin % = (Unit Margin ÷ Unit Revenue) × 100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Why Unit Economics Matter</h4>
            <ul class="list-disc pl-6">
              <li>Demonstrates the fundamental viability of your business model</li>
              <li>Helps identify when you'll reach profitability</li>
              <li>Shows whether scaling will improve or worsen your financial position</li>
              <li>Guides pricing, cost-cutting, and marketing decisions</li>
              <li>Critical for investor presentations and fundraising</li>
            </ul>
          </div>
        `
      },
      {
        title: "Advanced Unit Economics",
        content: `
          <h2 class="text-2xl font-bold mb-4">Beyond Basic Unit Economics</h2>
          <p class="mb-6">Advanced unit economics incorporates customer acquisition costs and lifetime value to provide a more complete picture of business sustainability.</p>

          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Customer Acquisition Cost (CAC) Integration</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">CAC Per Unit</h4>
                  <p class="text-sm">For businesses with repeat customers, you need to amortize CAC across multiple units:</p>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">CAC Per Unit = Customer Acquisition Cost ÷ Average Units Per Customer</p>
                  </div>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Fully-Loaded Unit Economics</h4>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">Fully-Loaded Unit Margin = Unit Revenue - Unit Cost - CAC Per Unit</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Payback Period Analysis</h3>
              <p class="mb-3">How long it takes to recover the cost of acquiring a customer:</p>
              <div class="space-y-4">
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Simple Payback Period</h4>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">Payback Period (in units) = CAC ÷ Unit Margin</p>
                  </div>
                  <p class="mt-2 text-sm">Example: If CAC is $300 and unit margin is $30, it takes 10 units to recover CAC</p>
                </div>
                <div class="border-l-4 border-shark-300 pl-4">
                  <h4 class="font-medium mb-1">Time-Based Payback Period</h4>
                  <div class="bg-shark-50 p-2 rounded-md mt-2">
                    <p class="font-mono text-sm">Payback Period (in months) = CAC ÷ (Unit Margin × Units Per Month)</p>
                  </div>
                  <p class="mt-2 text-sm">Example: If a customer purchases 2 units per month, payback period is 5 months</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Unit Economics Evaluation</h4>
            <p class="mb-3">Sharks typically evaluate businesses using unit economics:</p>
            <ul class="list-disc pl-6">
              <li>They want to see positive unit economics (profit per unit)</li>
              <li>They look for CAC payback periods under 12 months</li>
              <li>They analyze whether unit economics improve with scale</li>
              <li>They question businesses with negative unit economics</li>
              <li>They evaluate whether you understand your own unit economics</li>
            </ul>
          </div>
        `
      }
    ]
  },
  "visual-design": {
    title: "Visual Design",
    description: "Create compelling visuals for your presentations",
    sections: [
      {
        title: "Principles of Great Visual Design",
        content: `
          <h2 class="text-2xl font-bold mb-4">Why Visuals Matter in a Pitch</h2>
          <p class="mb-6">Investors see hundreds of presentations. Clean, clear, and visually appealing slides help your message stand out and make complex ideas easy to grasp.</p>
          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Core Design Principles</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li><strong>Simplicity:</strong> One idea per slide, minimal text</li>
                <li><strong>Contrast:</strong> Use color and size to highlight key points</li>
                <li><strong>Alignment:</strong> Keep elements visually organized</li>
                <li><strong>Consistency:</strong> Use a unified color palette and fonts</li>
                <li><strong>Whitespace:</strong> Give your content room to breathe</li>
              </ul>
            </div>
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Common Visual Mistakes</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Overcrowded slides with too much text or data</li>
                <li>Low-contrast colors that are hard to read</li>
                <li>Inconsistent fonts, colors, or layouts</li>
                <li>Poor-quality images or graphics</li>
                <li>Distracting animations or transitions</li>
              </ul>
            </div>
          </div>
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank & Real-World Examples</h4>
            <ul class="list-disc pl-6">
              <li>Winning pitches use visuals to clarify—not clutter—their story</li>
              <li>Charts, product photos, and infographics are more memorable than text</li>
              <li>Consistent branding builds trust and professionalism</li>
            </ul>
          </div>
        `
      },
      {
        title: "Slide Design Best Practices",
        content: `
          <h2 class="text-2xl font-bold mb-4">How to Design Slides That Impress</h2>
          <div class="space-y-6 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Slide-by-Slide Tips</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li><strong>Title Slide:</strong> Company name, logo, and a tagline or value prop</li>
                <li><strong>Problem Slide:</strong> Use a bold statement or image to illustrate the pain point</li>
                <li><strong>Solution Slide:</strong> Visuals of your product/service in action</li>
                <li><strong>Market Slide:</strong> Simple charts or infographics, not dense tables</li>
                <li><strong>Financials Slide:</strong> Use graphs, not spreadsheets</li>
                <li><strong>Team Slide:</strong> Photos and short bios, not paragraphs</li>
              </ul>
            </div>
            <div class="border rounded-lg p-4">
              <h3 class="text-xl font-semibold mb-2">Resources for Better Visuals</h3>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>Use free tools like Canva, Figma, or Google Slides for design</li>
                <li>Leverage high-quality stock images and icons (Unsplash, Noun Project)</li>
                <li>Test your slides on different screens for readability</li>
                <li>Ask for feedback from peers before presenting</li>
              </ul>
            </div>
          </div>
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Quick Visual Design Checklist</h4>
            <ul class="list-disc pl-6">
              <li>✔ Slides are clean and uncluttered</li>
              <li>✔ Key points are visually highlighted</li>
              <li>✔ Consistent branding and style</li>
              <li>✔ Images and charts are high quality</li>
              <li>✔ Every slide supports your story</li>
            </ul>
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
