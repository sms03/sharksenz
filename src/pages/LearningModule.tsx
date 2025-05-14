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
  "accounts-payable": {
    title: "Accounts Payable",
    description: "Understand how accounts payable impacts cash flow and financial health for businesses. Learn best practices for managing what your company owes to suppliers and vendors.",
    sections: [
      {
        title: "What is Accounts Payable?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Accounts Payable?</h2>
          <p class="mb-4">Accounts payable (AP) represents money that a company owes to its vendors, suppliers, and creditors for goods or services purchased on credit. It's considered a short-term liability on a company's balance sheet, as most accounts payable are due within 30-90 days.</p>
          <p class="mb-6">Effectively managing accounts payable is crucial for maintaining good relationships with suppliers, optimizing cash flow, and ensuring the financial health of your business.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Components of Accounts Payable</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Purchase Orders:</strong> Documents that formalize what you're ordering from suppliers</li>
            <li><strong>Invoices:</strong> Bills from vendors requesting payment for goods or services</li>
            <li><strong>Payment Terms:</strong> The timeframe and conditions for payment (e.g., Net 30, 2/10 Net 30)</li>
            <li><strong>Vendor Credits:</strong> Reductions in amount owed due to returns or adjustments</li>
            <li><strong>Payment Approvals:</strong> Internal process for validating invoices before payment</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Business Impact</h4>
            <p>Managing accounts payable effectively impacts your:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Cash flow management and forecasting</li>
              <li>Supplier relationships and negotiating power</li>
              <li>Ability to capture early payment discounts</li>
              <li>Credit rating and borrowing capacity</li>
            </ul>
          </div>
        `
      },
      {
        title: "Accounts Payable Best Practices",
        content: `
          <h2 class="text-2xl font-bold mb-4">Accounts Payable Best Practices</h2>
          <p class="mb-6">Implementing efficient accounts payable processes can improve your company's financial management and strengthen vendor relationships. Here are key best practices:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Centralize and Digitize AP Processes</h3>
              <p>Move from paper-based to digital systems that streamline invoice processing, approvals, and payments.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Benefits:</strong> Reduced processing costs, faster processing times, better tracking, fewer errors
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Establish Clear Approval Workflows</h3>
              <p>Create a structured process for invoice verification, approval hierarchies, and payment authorization.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Implementation:</strong> Define approval thresholds, authorized approvers, and turnaround times
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Optimize Payment Timing</h3>
              <p>Pay invoices at the optimal time - not too early (wasting cash) or too late (damaging relationships).</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Strategy:</strong> Take advantage of early payment discounts when they exceed your cost of capital; otherwise, pay close to the due date
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Negotiate Favorable Payment Terms</h3>
              <p>Work with vendors to establish payment terms that benefit both parties.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Examples:</strong> Extended payment terms (Net 60 or Net 90), volume discounts, early payment incentives
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Common AP Metrics to Track</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Days Payable Outstanding (DPO):</strong> Average number of days taken to pay suppliers
              <p class="text-sm ml-4">Formula: (Accounts Payable ÷ Cost of Goods Sold) × Number of Days in Period</p>
            </li>
            <li>
              <strong>Invoice Processing Cost:</strong> Average cost to process a single invoice
              <p class="text-sm ml-4">Includes labor, software, and overhead costs</p>
            </li>
            <li>
              <strong>Invoice Processing Time:</strong> Average days from receipt to payment
              <p class="text-sm ml-4">Lower is generally better, but not if you're paying too early</p>
            </li>
            <li>
              <strong>Early Payment Discount Capture Rate:</strong> Percentage of available discounts actually taken
              <p class="text-sm ml-4">Measures effectiveness in capturing cost-saving opportunities</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, investors often ask about supplier relationships and payment terms. Favorable payment terms (like Net 60 or Net 90) can significantly improve cash flow and reduce the amount of working capital needed to operate the business, making it more attractive to investors.</p>
          </div>
        `
      },
      {
        title: "AP and Cash Flow Management",
        content: `
          <h2 class="text-2xl font-bold mb-4">AP and Cash Flow Management</h2>
          <p class="mb-6">Accounts payable has a direct impact on your cash flow. Strategic management of when and how you pay vendors can help optimize your working capital and strengthen your financial position.</p>
          
          <h3 class="text-xl font-semibold mb-3">Cash Flow Optimization Strategies</h3>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Payment Timing Strategies</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Align payment cycles with revenue cycles when possible</li>
                <li>Batch payments to reduce processing time and costs</li>
                <li>Create a payment calendar to visualize cash outflows</li>
                <li>Consider using credit cards for smaller vendors to extend payment periods</li>
                <li>Prioritize payments to critical vendors and those offering discounts</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">AP Financing Options</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Business lines of credit to manage timing mismatches</li>
                <li>Supply chain financing/reverse factoring for extended terms</li>
                <li>Procurement cards with grace periods</li>
                <li>Early payment discount programs</li>
                <li>Dynamic discounting platforms</li>
              </ul>
            </div>
          </div>
          
          <div class="border-l-4 border-shark-300 pl-4 mb-6">
            <h3 class="text-xl font-semibold mb-2">Understanding Early Payment Terms</h3>
            <p>Early payment discounts, like "2/10 Net 30," can provide significant savings.</p>
            <div class="mt-2 text-sm text-shark-600">
              <strong>What it means:</strong> 2% discount if paid within 10 days, otherwise full amount due in 30 days
            </div>
            <div class="mt-2">
              <p class="text-sm font-medium">Calculating the annualized return:</p>
              <p class="text-sm ml-4">2% discount for paying 20 days early = 36.5% annualized return (2% × 365/20)</p>
              <p class="text-sm ml-4">If your cost of capital is less than the annualized return, taking the discount makes financial sense</p>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Monitor your cash conversion cycle (CCC), which measures how long it takes to convert inventory investments into cash. A longer accounts payable period improves your CCC, while longer accounts receivable and inventory periods hurt it.</p>
          </div>
        `
      }
    ]
  },
  "accounts-receivable": {
    title: "Accounts Receivable",
    description: "Learn to effectively track and manage the money customers owe your business. Discover strategies to improve collections, reduce bad debt, and optimize cash flow from sales.",
    sections: [
      {
        title: "What is Accounts Receivable?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Accounts Receivable?</h2>
          <p class="mb-4">Accounts receivable (AR) represents money owed to your business by customers who have purchased goods or services on credit. It's recorded as a current asset on your balance sheet because it's expected to be converted to cash within a short period, typically 30-90 days.</p>
          <p class="mb-6">Effective management of accounts receivable is critical for maintaining healthy cash flow, which is especially important for growing businesses that need working capital to fund operations and expansion.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Elements of Accounts Receivable</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Credit Terms:</strong> The conditions under which you allow customers to pay later (e.g., Net 30, Net 60)</li>
            <li><strong>Invoicing:</strong> Detailed billing documents sent to customers</li>
            <li><strong>Aging Reports:</strong> Tracking tools that show how long invoices have been outstanding</li>
            <li><strong>Collections Process:</strong> Systematic approach to following up on unpaid invoices</li>
            <li><strong>Bad Debt:</strong> Amounts unlikely to be collected that may need to be written off</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Business Impact</h4>
            <p>Accounts receivable directly impacts:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Cash flow and working capital</li>
              <li>Ability to pay your own obligations (accounts payable)</li>
              <li>Need for external financing</li>
              <li>Overall business valuation</li>
            </ul>
          </div>
        `
      },
      {
        title: "Managing Accounts Receivable",
        content: `
          <h2 class="text-2xl font-bold mb-4">Managing Accounts Receivable Effectively</h2>
          <p class="mb-6">Implementing a robust accounts receivable management system can significantly improve your cash flow and reduce the risk of bad debt. Here are key strategies and best practices:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Set Clear Credit Policies</h3>
              <p>Establish and communicate clear credit terms to customers before making sales.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Elements to include:</strong> Credit application process, credit limits, payment terms, early payment incentives, late payment penalties
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Streamline Invoicing Process</h3>
              <p>Create an efficient invoicing system that minimizes delays and errors.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Best practices:</strong> Invoice immediately after delivery, use electronic invoicing, include all relevant details, clearly state payment terms and methods
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Implement Proactive Collections</h3>
              <p>Don't wait until invoices are overdue to begin the collections process.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Timeline example:</strong> Payment reminder 7 days before due date, follow-up on due date, escalating contact at 15, 30, and 45 days past due
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Offer Multiple Payment Options</h3>
              <p>Make it as easy as possible for customers to pay you.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Payment methods:</strong> Credit cards, ACH transfers, online payment portals, mobile payment solutions
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Key AR Metrics to Track</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Days Sales Outstanding (DSO):</strong> Average number of days it takes to collect payment after a sale
              <p class="text-sm ml-4">Formula: (Accounts Receivable ÷ Total Credit Sales) × Number of Days in Period</p>
            </li>
            <li>
              <strong>AR Aging Schedule:</strong> Breakdown of receivables by age categories (e.g., current, 1-30 days, 31-60 days, etc.)
              <p class="text-sm ml-4">Helps identify problematic accounts and prioritize collection efforts</p>
            </li>
            <li>
              <strong>Collection Effectiveness Index (CEI):</strong> Measures how effectively you're collecting receivables
              <p class="text-sm ml-4">Formula: [(Beginning AR + Credit Sales - Ending AR) ÷ (Beginning AR + Credit Sales - Current AR)] × 100</p>
            </li>
            <li>
              <strong>Bad Debt to Sales Ratio:</strong> Percentage of credit sales that become uncollectible
              <p class="text-sm ml-4">Formula: (Bad Debt Expense ÷ Total Credit Sales) × 100</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, investors often scrutinize a company's accounts receivable management as it directly impacts cash flow. A business with a high DSO or significant bad debt may be seen as riskier, even if sales numbers look impressive on paper. Kevin O'Leary frequently reminds entrepreneurs that "cash is king" and receivables aren't the same as cash in the bank.</p>
          </div>
        `
      },
      {
        title: "AR Financing and Optimization",
        content: `
          <h2 class="text-2xl font-bold mb-4">AR Financing and Optimization Strategies</h2>
          <p class="mb-6">Even with excellent AR management, businesses sometimes need faster access to cash tied up in receivables. Several financing options and optimization strategies can help bridge this gap:</p>
          
          <h3 class="text-xl font-semibold mb-3">Accounts Receivable Financing Options</h3>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Factoring</h4>
              <p>Selling your receivables to a third party (factor) at a discount.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>How it works:</strong> You receive 70-90% of invoice value upfront; the factor collects from your customer and pays you the remainder minus their fee
              </div>
              <div class="mt-2 text-sm">
                <strong>Pros:</strong> Immediate cash, outsourced collections<br>
                <strong>Cons:</strong> Higher cost, potential customer relationship impact
              </div>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">AR Line of Credit</h4>
              <p>Using your receivables as collateral for a revolving credit line.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>How it works:</strong> Borrow up to 70-85% of eligible receivables; you maintain customer relationships and collections
              </div>
              <div class="mt-2 text-sm">
                <strong>Pros:</strong> Lower cost than factoring, flexible borrowing<br>
                <strong>Cons:</strong> Still requires collections effort, may have covenants
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Optimization Strategies</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Early Payment Discounts:</strong> Offer customers a discount for paying early
              <p class="text-sm ml-4">Example: 2/10 Net 30 (2% discount if paid within 10 days, full amount due in 30 days)</p>
            </li>
            <li>
              <strong>Customer Segmentation:</strong> Tailor credit terms based on customer value and payment history
              <p class="text-sm ml-4">High-value reliable customers might get more favorable terms than new or high-risk ones</p>
            </li>
            <li>
              <strong>Automated Dunning:</strong> Use software to send automated payment reminders at strategic intervals
              <p class="text-sm ml-4">Reduces manual effort and ensures consistent follow-up</p>
            </li>
            <li>
              <strong>Deposits and Progress Billing:</strong> For large orders or projects, collect partial payment upfront
              <p class="text-sm ml-4">Reduces risk and improves cash flow throughout the delivery process</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>When calculating the true cost of extending credit to customers, consider not just the risk of non-payment, but also the time value of money and administrative costs of managing receivables. This helps determine whether offering discounts for early payment makes financial sense for your business.</p>
          </div>
        `
      }
    ]
  },
  "amortization": {
    title: "Amortization",
    description: "Understand how to spread the cost of intangible assets and loans over time. Learn to calculate amortization schedules and analyze their impact on financial statements.",
    sections: [
      {
        title: "Understanding Amortization",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Amortization?</h2>
          <p class="mb-4">Amortization has two primary financial meanings: (1) the gradual reduction of a loan balance through regular payments of principal and interest, and (2) the process of spreading the cost of an intangible asset over its useful life for accounting and tax purposes.</p>
          <p class="mb-6">Both types of amortization involve allocating costs over time, but they apply to different financial situations and appear differently in financial statements.</p>
          
          <h3 class="text-xl font-semibold mb-3">Loan Amortization vs. Asset Amortization</h3>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Loan Amortization</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Applies to loans with scheduled repayments</li>
                <li>Each payment covers interest and principal</li>
                <li>Early payments are mostly interest</li>
                <li>Later payments are mostly principal</li>
                <li>Examples: Mortgages, car loans, term loans</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Asset Amortization</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Applies to intangible assets with finite lives</li>
                <li>Similar to depreciation for tangible assets</li>
                <li>Reduces asset value on balance sheet</li>
                <li>Creates expense on income statement</li>
                <li>Examples: Patents, copyrights, software licenses</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Key Difference</h4>
            <p>The fundamental difference is that loan amortization involves actual cash flows (you're making payments), while asset amortization is an accounting concept that doesn't involve cash outflows when the amortization is recorded (the cash was spent when the asset was acquired).</p>
          </div>
        `
      },
      {
        title: "Loan Amortization",
        content: `
          <h2 class="text-2xl font-bold mb-4">Loan Amortization Explained</h2>
          <p class="mb-6">When you take out an amortizing loan, each payment you make goes toward both interest and principal. As the loan balance decreases, the interest portion of each payment decreases while the principal portion increases, even though the total payment remains the same.</p>
          
          <h3 class="text-xl font-semibold mb-3">Creating an Amortization Schedule</h3>
          <p class="mb-4">An amortization schedule shows how each payment is split between interest and principal, and how the loan balance decreases over time.</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">Amortization Schedule Example</h4>
            <p class="mb-3">Loan details: $100,000 loan, 5% annual interest, 5-year term, monthly payments</p>
            
            <div class="overflow-x-auto">
              <table class="min-w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="pr-4 text-left">Payment #</th>
                    <th class="pr-4 text-left">Payment Amount</th>
                    <th class="pr-4 text-left">Principal</th>
                    <th class="pr-4 text-left">Interest</th>
                    <th class="text-left">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td>Starting</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>$100,000.00</td>
                  </tr>
                  <tr class="border-b">
                    <td>1</td>
                    <td>$1,887.12</td>
                    <td>$1,470.46</td>
                    <td>$416.67</td>
                    <td>$98,529.54</td>
                  </tr>
                  <tr class="border-b">
                    <td>2</td>
                    <td>$1,887.12</td>
                    <td>$1,476.59</td>
                    <td>$410.54</td>
                    <td>$97,052.95</td>
                  </tr>
                  <tr class="border-b">
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                  </tr>
                  <tr class="border-b">
                    <td>59</td>
                    <td>$1,887.12</td>
                    <td>$1,871.76</td>
                    <td>$15.36</td>
                    <td>$1,879.43</td>
                  </tr>
                  <tr>
                    <td>60</td>
                    <td>$1,887.12</td>
                    <td>$1,879.43</td>
                    <td>$7.83</td>
                    <td>$0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <p><strong>Formula for monthly payment:</strong></p>
              <p class="font-mono text-sm mb-2">Payment = P × [r(1+r)^n] ÷ [(1+r)^n - 1]</p>
              <p class="text-sm mb-2">Where:</p>
              <ul class="list-disc pl-6 text-sm">
                <li>P = Principal (loan amount)</li>
                <li>r = Monthly interest rate (annual rate ÷ 12)</li>
                <li>n = Number of payments (months)</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Business Application</h4>
            <p>Understanding loan amortization helps you:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Project future cash flows needed for debt service</li>
              <li>Determine the true cost of financing</li>
              <li>Make informed decisions about early payoff options</li>
              <li>Compare different financing offers with varying terms</li>
            </ul>
          </div>
        `
      },
      {
        title: "Intangible Asset Amortization",
        content: `
          <h2 class="text-2xl font-bold mb-4">Intangible Asset Amortization</h2>
          <p class="mb-6">In accounting, amortization is the systematic allocation of the cost of intangible assets over their useful lives. This process recognizes that intangible assets provide economic benefits over multiple periods and their costs should be matched with those periods.</p>
          
          <h3 class="text-xl font-semibold mb-3">Amortizable Intangible Assets</h3>
          <div class="space-y-3 mb-6">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-semibold mb-1">Patents</h4>
              <p class="text-sm">Typically amortized over the legal life (20 years) or expected useful life, whichever is shorter</p>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-semibold mb-1">Copyrights</h4>
              <p class="text-sm">Legal life can be author's life plus 70 years, but typically amortized over expected economic life</p>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-semibold mb-1">Customer Lists/Relationships</h4>
              <p class="text-sm">Amortized over the expected period of benefit, often 3-10 years</p>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-semibold mb-1">Software (purchased)</h4>
              <p class="text-sm">Typically amortized over 3-5 years</p>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-semibold mb-1">Licenses and Franchises</h4>
              <p class="text-sm">Amortized over the term of the agreement</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Calculating Amortization Expense</h3>
          <div class="border rounded-lg p-5 mb-6">
            <p class="mb-3"><strong>Straight-Line Method (most common)</strong></p>
            <div class="bg-shark-50 p-3 rounded-md font-mono text-center mb-4">
              Annual Amortization Expense = (Cost - Residual Value) ÷ Useful Life
            </div>
            <p class="mb-2"><strong>Example:</strong></p>
            <ul class="list-none pl-2 space-y-1">
              <li>Patent cost: $50,000</li>
              <li>Expected useful life: 10 years</li>
              <li>Residual value: $0 (typical for intangibles)</li>
              <li>Annual amortization: $50,000 ÷ 10 = $5,000 per year</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Financial Statement Impact</h3>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Balance Sheet Effects</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Asset is recorded at cost initially</li>
                <li>Accumulated amortization increases each period</li>
                <li>Net carrying value decreases each period</li>
                <li>Formula: Net Value = Cost - Accumulated Amortization</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Income Statement Effects</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Amortization expense reduces net income</li>
                <li>Appears as operating expense or COGS</li>
                <li>Non-cash expense (added back in cash flow statement)</li>
                <li>Can impact key ratios and performance metrics</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>When pitching on Shark Tank, entrepreneurs who have valuable patents, trademarks, or other intangible assets should understand how these will be amortized. This affects financial projections and valuations. Sharks like Mark Cuban often look beyond GAAP earnings to understand the true cash generation potential of a business by adding back non-cash expenses like amortization.</p>
          </div>
        `
      }
    ]
  },
  "balance-sheet": {
    title: "Balance Sheets",
    description: "Learn to read and analyze this crucial financial statement that shows a company's assets, liabilities, and equity at a specific point in time.",
    sections: [
      {
        title: "What is a Balance Sheet?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is a Balance Sheet?</h2>
          <p class="mb-4">A balance sheet is one of the three fundamental financial statements that provides a snapshot of a company's financial position at a specific point in time. It follows the accounting equation: Assets = Liabilities + Equity, which must always be in balance.</p>
          <p class="mb-6">Unlike the income statement, which shows performance over a period, the balance sheet represents the financial position on a specific date. It's like a photograph of what a company owns, what it owes, and what remains for the owners.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Three Main Sections</h3>
          <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Assets</h4>
              <p class="mb-2">What the company owns or controls that has economic value.</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Current Assets:</strong> Cash, accounts receivable, inventory (convertible to cash within a year)</li>
                <li><strong>Non-Current Assets:</strong> Property, equipment, intangibles (long-term investments)</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Liabilities</h4>
              <p class="mb-2">What the company owes to others.</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Current Liabilities:</strong> Accounts payable, short-term debt, accrued expenses (due within a year)</li>
                <li><strong>Non-Current Liabilities:</strong> Long-term debt, deferred taxes (due beyond a year)</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Equity</h4>
              <p class="mb-2">The owners' stake in the company.</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Common Stock:</strong> Value of issued shares</li>
                <li><strong>Retained Earnings:</strong> Accumulated profits not distributed to shareholders</li>
                <li><strong>Additional Paid-in Capital:</strong> Money from investors above par value</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">The Balancing Act</h4>
            <p>The fundamental equation that governs balance sheets is:</p>
            <div class="font-mono text-center my-2">Assets = Liabilities + Equity</div>
            <p>This equation must always balance, which is why it's called a balance sheet. If a transaction affects one side of the equation, it must affect the other side by an equal amount, or it must affect two components on the same side in opposite directions.</p>
          </div>
        `
      },
      {
        title: "Reading and Analyzing Balance Sheets",
        content: `
          <h2 class="text-2xl font-bold mb-4">Reading and Analyzing Balance Sheets</h2>
          <p class="mb-6">A balance sheet provides critical insights into a company's financial health and stability. Learning to interpret it helps you understand a business's liquidity, solvency, and overall financial position.</p>
          
          <h3 class="text-xl font-semibold mb-3">Sample Balance Sheet</h3>
          <div class="border rounded-lg p-5 mb-6 overflow-x-auto">
            <h4 class="font-semibold mb-3">XYZ Company Balance Sheet</h4>
            <p class="mb-2 italic">As of December 31, 2023</p>
            
            <table class="min-w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="py-2 text-left" colspan="2">Assets</th>
                </tr>
              </thead>
              <tbody>
                <tr><td class="py-1 pr-4 font-medium">Current Assets</td><td></td></tr>
                <tr><td class="py-1 pl-4 pr-4">Cash and Cash Equivalents</td><td class="text-right">$250,000</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Accounts Receivable</td><td class="text-right">$175,000</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Inventory</td><td class="text-right">$300,000</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Prepaid Expenses</td><td class="text-right">$25,000</td></tr>
                <tr class="border-b"><td class="py-1 pl-4 pr-4 font-medium">Total Current Assets</td><td class="text-right font-medium">$750,000</td></tr>
                
                <tr><td class="py-1 pr-4 font-medium">Non-Current Assets</td><td></td></tr>
                <tr><td class="py-1 pl-4 pr-4">Property and Equipment</td><td class="text-right">$900,000</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Less: Accumulated Depreciation</td><td class="text-right">($300,000)</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Intangible Assets</td><td class="text-right">$150,000</td></tr>
                <tr class="border-b"><td class="py-1 pl-4 pr-4 font-medium">Total Non-Current Assets</td><td class="text-right font-medium">$750,000</td></tr>
                
                <tr class="border-b"><td class="py-2 pr-4 font-medium">Total Assets</td><td class="text-right font-medium">$1,500,000</td></tr>
                
                <tr class="border-b">
                  <th class="py-2 text-left" colspan="2">Liabilities and Equity</th>
                </tr>
                
                <tr><td class="py-1 pr-4 font-medium">Current Liabilities</td><td></td></tr>
                <tr><td class="py-1 pl-4 pr-4">Accounts Payable</td><td class="text-right">$125,000</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Short-term Debt</td><td class="text-right">$75,000</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Accrued Expenses</td><td class="text-right">$50,000</td></tr>
                <tr class="border-b"><td class="py-1 pl-4 pr-4 font-medium">Total Current Liabilities</td><td class="text-right font-medium">$250,000</td></tr>
                
                <tr><td class="py-1 pr-4 font-medium">Non-Current Liabilities</td><td></td></tr>
                <tr><td class="py-1 pl-4 pr-4">Long-term Debt</td><td class="text-right">$400,000</td></tr>
                <tr class="border-b"><td class="py-1 pl-4 pr-4 font-medium">Total Non-Current Liabilities</td><td class="text-right font-medium">$400,000</td></tr>
                
                <tr class="border-b"><td class="py-1 pr-4 font-medium">Total Liabilities</td><td class="text-right font-medium">$650,000</td></tr>
                
                <tr><td class="py-1 pr-4 font-medium">Shareholders' Equity</td><td></td></tr>
                <tr><td class="py-1 pl-4 pr-4">Common Stock</td><td class="text-right">$500,000</td></tr>
                <tr><td class="py-1 pl-4 pr-4">Retained Earnings</td><td class="text-right">$350,000</td></tr>
                <tr class="border-b"><td class="py-1 pl-4 pr-4 font-medium">Total Equity</td><td class="text-right font-medium">$850,000</td></tr>
                
                <tr><td class="py-2 pr-4 font-medium">Total Liabilities and Equity</td><td class="text-right font-medium">$1,500,000</td></tr>
              </tbody>
            </table>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Key Financial Ratios from the Balance Sheet</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Current Ratio:</strong> Current Assets ÷ Current Liabilities
              <p class="text-sm ml-4">Measures liquidity and ability to pay short-term obligations. Example: $750,000 ÷ $250,000 = 3.0</p>
            </li>
            <li>
              <strong>Quick Ratio (Acid Test):</strong> (Current Assets - Inventory) ÷ Current Liabilities
              <p class="text-sm ml-4">A more stringent liquidity measure. Example: ($750,000 - $300,000) ÷ $250,000 = 1.8</p>
            </li>
            <li>
              <strong>Debt-to-Equity Ratio:</strong> Total Liabilities ÷ Total Equity
              <p class="text-sm ml-4">Measures financial leverage and risk. Example: $650,000 ÷ $850,000 = 0.76</p>
            </li>
            <li>
              <strong>Working Capital:</strong> Current Assets - Current Liabilities
              <p class="text-sm ml-4">Shows operational liquidity. Example: $750,000 - $250,000 = $500,000</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Perspective</h4>
            <p>On Shark Tank, investors carefully examine balance sheets to assess a company's financial health. They look for red flags like:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Excessive debt relative to assets or equity</li>
              <li>Insufficient working capital to fund operations</li>
              <li>Bloated inventory levels that may indicate slow-moving products</li>
              <li>Large accounts receivable balances that suggest collection problems</li>
            </ul>
            <p class="mt-2">Mark Cuban often says, "The numbers tell a story." The balance sheet is a critical chapter in that story.</p>
          </div>
        `
      },
      {
        title: "Balance Sheet Strategies",
        content: `
          <h2 class="text-2xl font-bold mb-4">Balance Sheet Strategies for Businesses</h2>
          <p class="mb-6">A strategic approach to managing your balance sheet can strengthen your company's financial position, improve investor confidence, and create a foundation for growth. Here are key strategies for optimizing your balance sheet:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Optimize Working Capital</h3>
              <p>Manage the relationship between current assets and current liabilities to improve liquidity and operational efficiency.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Tactics:</strong>
                <ul class="list-disc pl-5 mt-1">
                  <li>Improve inventory management to reduce excess stock</li>
                  <li>Accelerate accounts receivable collections</li>
                  <li>Negotiate favorable payment terms with suppliers</li>
                  <li>Maintain optimal cash reserves for operations</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Manage Debt Strategically</h3>
              <p>Structure your debt to minimize cost while maintaining operational flexibility and acceptable risk levels.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Tactics:</strong>
                <ul class="list-disc pl-5 mt-1">
                  <li>Balance short-term and long-term debt appropriately</li>
                  <li>Refinance high-interest debt when possible</li>
                  <li>Match debt maturities with cash flow cycles</li>
                  <li>Maintain debt ratios that support your growth strategy</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Evaluate Asset Efficiency</h3>
              <p>Ensure assets are generating appropriate returns and divest underperforming ones.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Tactics:</strong>
                <ul class="list-disc pl-5 mt-1">
                  <li>Calculate return on assets for business segments</li>
                  <li>Consider sale-leaseback for certain fixed assets</li>
                  <li>Evaluate make-vs-buy decisions for capital-intensive processes</li>
                  <li>Regularly review the value of intangible assets</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Balance Growth with Financial Stability</h3>
              <p>Structure your balance sheet to support growth initiatives while maintaining financial resilience.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Tactics:</strong>
                <ul class="list-disc pl-5 mt-1">
                  <li>Maintain adequate liquidity buffers for unexpected challenges</li>
                  <li>Consider the optimal mix of debt and equity financing</li>
                  <li>Reinvest retained earnings strategically</li>
                  <li>Develop contingency plans for balance sheet stress scenarios</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Balance Sheet Red Flags</h3>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Declining Current Ratio:</strong> May indicate deteriorating liquidity</li>
              <li><strong>Rapidly Increasing Debt:</strong> Could signal unsustainable growth or operational problems</li>
              <li><strong>Growing Inventory Without Proportional Sales Growth:</strong> Potential obsolescence or demand issues</li>
              <li><strong>Shrinking Equity:</strong> May indicate ongoing losses or excessive distributions</li>
              <li><strong>Significant Goodwill or Intangibles:</strong> Could be overvalued and subject to future impairment</li>
            </ul>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p class="mb-3">On Shark Tank, entrepreneurs with strong balance sheets often receive better valuations and terms. Kevin O'Leary frequently emphasizes:</p>
            <blockquote class="pl-4 border-l-4 border-shark-300 italic">
              "A business with a clean balance sheet—low debt, strong working capital, and efficient asset utilization—is worth a premium because it reduces risk and increases strategic flexibility."
            </blockquote>
          </div>
        `
      }
    ]
  },
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
  "break-even": {
    title: "Break-Even Analysis",
    description: "Calculate when your business becomes profitable by determining the point where total revenue equals total costs.",
    sections: [
      {
        title: "What is Break-Even Analysis?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Break-Even Analysis?</h2>
          <p class="mb-4">Break-even analysis is a financial calculation that determines the sales volume your business needs to achieve to cover all costs—the point where total revenue equals total expenses, resulting in neither profit nor loss. It's a crucial tool for business planning, pricing strategies, and investment decisions.</p>
          <p class="mb-6">Understanding your break-even point helps answer critical questions like, "How many units must I sell to cover my costs?" or "What sales volume do I need before I start making a profit?"</p>
          
          <h3 class="text-xl font-semibold mb-3">The Break-Even Formula</h3>
          <div class="bg-shark-50 p-3 rounded-md font-mono mb-6">
            <p class="mb-2">Break-Even Point (units) = Fixed Costs ÷ (Price per Unit - Variable Cost per Unit)</p>
            <p>Break-Even Point (sales $) = Fixed Costs ÷ Contribution Margin Ratio</p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Key Components</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Fixed Costs:</strong> Expenses that remain constant regardless of sales volume (rent, salaries, insurance)</li>
            <li><strong>Variable Costs:</strong> Expenses that change directly with production volume (materials, direct labor, commissions)</li>
            <li><strong>Contribution Margin:</strong> The amount each unit contributes to covering fixed costs (Price - Variable Cost)</li>
            <li><strong>Contribution Margin Ratio:</strong> Contribution Margin ÷ Price</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>On Shark Tank, entrepreneurs are frequently asked about their break-even point. For instance, when a food product entrepreneur says it costs $2 to make each unit and sells it for $5, with monthly fixed costs of $10,000, Sharks quickly calculate the break-even point: 10,000 ÷ (5 - 2) = 3,333 units per month.</p>
          </div>
        `
      },
      {
        title: "Calculating Break-Even Point",
        content: `
          <h2 class="text-2xl font-bold mb-4">Calculating Break-Even Point</h2>
          <p class="mb-6">Let's walk through a practical example of how to calculate your break-even point:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">Example: Coffee Shop</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium">Given:</p>
                <ul class="list-disc pl-6 space-y-1">
                  <li>Fixed monthly costs: $8,000 (rent, utilities, base salaries)</li>
                  <li>Average price per coffee: $4.50</li>
                  <li>Variable costs per coffee: $1.50 (coffee beans, milk, cup, lid, labor)</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">Step 1: Calculate the contribution margin per unit</p>
                <p class="pl-4">Contribution Margin = $4.50 - $1.50 = $3.00 per coffee</p>
              </div>
              
              <div>
                <p class="font-medium">Step 2: Calculate the break-even point in units</p>
                <p class="pl-4">Break-Even Point = $8,000 ÷ $3.00 = 2,667 coffees per month</p>
              </div>
              
              <div>
                <p class="font-medium">Step 3: Calculate the break-even point in sales dollars</p>
                <p class="pl-4">Break-Even Point = 2,667 × $4.50 = $12,000 in revenue</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <p>This means the coffee shop must sell 2,667 coffees or generate $12,000 in revenue each month just to cover its costs. Any sales beyond this point contribute to profit.</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Break-Even Analysis Chart</h3>
          <p class="mb-4">A break-even chart visually represents the relationship between costs, revenue, and profit or loss:</p>
          <ul class="list-disc pl-6 mb-6 space-y-1">
            <li>The x-axis shows sales volume in units</li>
            <li>The y-axis shows dollars</li>
            <li>The fixed cost line is horizontal</li>
            <li>The total cost line starts at the fixed cost amount and increases with volume</li>
            <li>The revenue line starts at zero and increases with volume</li>
            <li>The break-even point is where the revenue and total cost lines intersect</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Calculate your break-even point for different scenarios, such as higher pricing, lower costs, or different product mixes. This sensitivity analysis helps you understand how changes in your business model affect profitability.</p>
          </div>
        `
      },
      {
        title: "Using Break-Even Analysis",
        content: `
          <h2 class="text-2xl font-bold mb-4">Strategic Uses of Break-Even Analysis</h2>
          <p class="mb-6">Break-even analysis goes beyond just knowing when you'll start making a profit. It's a versatile tool that can inform many business decisions:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Pricing Decisions</h3>
              <p>Break-even analysis helps determine how pricing changes affect the number of units you need to sell to break even.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Example:</strong> Raising your price from $10 to $12 might reduce your break-even point from 1,000 units to 750 units, making your goals more achievable.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">New Product Evaluation</h3>
              <p>Evaluate whether a new product idea can reach its break-even point within a reasonable time frame.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Action item:</strong> Calculate the market size needed to reach break-even and assess if it's realistic.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Cost Management</h3>
              <p>Identify which costs have the biggest impact on your break-even point and focus cost-reduction efforts there.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Strategy:</strong> Often, reducing fixed costs has a more dramatic effect on break-even than variable costs.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Sales Targets</h3>
              <p>Set realistic sales goals based on breaking even and then achieving target profit levels.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Formula:</strong> Units to achieve target profit = (Fixed Costs + Target Profit) ÷ Contribution Margin
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Limitations of Break-Even Analysis</h3>
          <ul class="list-disc pl-6 mb-6 space-y-1">
            <li>Assumes costs can be neatly categorized as fixed or variable</li>
            <li>Assumes selling price remains constant at all volumes</li>
            <li>Doesn't account for changing market conditions</li>
            <li>Works best for businesses with a single product or simple product mix</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, Kevin O'Leary often asks, "How long until you break even?" He knows that the path to break-even indicates whether a business model is viable. Companies with clear, achievable break-even points are more attractive investments than those requiring massive scale to cover their costs.</p>
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
    title: "Debt to Equity Ratio",
    description: "Understand how to evaluate a company's financial leverage by comparing its total debt to shareholders' equity. Learn what this key ratio reveals about risk and financial strategy.",
    sections: [
      {
        title: "What is Debt to Equity Ratio?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Debt to Equity Ratio?</h2>
          <p class="mb-4">The debt to equity ratio is a financial metric that compares a company's total debt to its shareholders' equity. It indicates how much debt a company is using to finance its assets relative to the value of shareholders' equity. This ratio is a key indicator of financial leverage and risk.</p>
          <p class="mb-6">A higher ratio suggests that a company has been aggressive in financing growth with debt, which can result in volatile earnings due to additional interest expense. A lower ratio indicates a company relies more on equity financing and may be more financially stable but could be missing opportunities to magnify returns through leverage.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Debt to Equity Formula</h3>
          <div class="bg-shark-50 p-3 rounded-md font-mono text-center mb-6">
            Debt to Equity Ratio = Total Liabilities ÷ Shareholders' Equity
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Interpreting the Ratio</h3>
          <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Low Ratio (<0.5)</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Conservative financial strategy</li>
                <li>Lower financial risk</li>
                <li>Strong financial cushion</li>
                <li>May indicate underutilized capital</li>
                <li>Potentially lower returns on equity</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Moderate Ratio (0.5-1.5)</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Balanced financial strategy</li>
                <li>Acceptable level of risk for most industries</li>
                <li>Reasonable use of leverage</li>
                <li>Better returns than low-leverage firms</li>
                <li>Generally sustainable long-term</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">High Ratio (>1.5)</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Aggressive financial strategy</li>
                <li>Higher financial risk</li>
                <li>Potentially higher ROE (when profitable)</li>
                <li>Greater vulnerability during downturns</li>
                <li>May indicate excessive borrowing</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Industry Variations</h4>
            <p>Optimal debt to equity ratios vary significantly by industry. Capital-intensive industries like utilities or manufacturing typically have higher ratios, while tech companies often have lower ratios due to less reliance on physical assets and greater market volatility.</p>
          </div>
        `
      },
      {
        title: "Calculating and Analyzing Debt to Equity",
        content: `
          <h2 class="text-2xl font-bold mb-4">Calculating and Analyzing Debt to Equity</h2>
          <p class="mb-6">Let's walk through a practical example of calculating and analyzing a company's debt to equity ratio:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">Example Calculation</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium">Given:</p>
                <ul class="list-none pl-4 space-y-1">
                  <li>Total Liabilities: $500,000</li>
                  <li>Shareholders' Equity: $250,000</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">Calculation:</p>
                <p class="pl-4">Debt to Equity Ratio = $500,000 ÷ $250,000 = 2.0</p>
              </div>
              
              <div>
                <p class="font-medium">Analysis:</p>
                <p class="pl-4">A debt to equity ratio of 2.0 means the company has $2 in debt for every $1 in equity. This indicates a relatively high level of leverage. The company is financing itself with twice as much debt as equity, which could be concerning depending on the industry and growth stage.</p>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Comprehensive Analysis Approach</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Compare to Industry Benchmarks:</strong>
              <p class="text-sm ml-4">A 2.0 ratio might be normal for a utility company but concerning for a software company</p>
            </li>
            <li>
              <strong>Examine Trend Over Time:</strong>
              <p class="text-sm ml-4">An increasing ratio could signal growing financial risk; a decreasing ratio may indicate deleveraging</p>
            </li>
            <li>
              <strong>Consider Debt Composition:</strong>
              <p class="text-sm ml-4">Long-term vs. short-term debt, interest rates, debt covenants, and repayment schedules</p>
            </li>
            <li>
              <strong>Assess Cash Flow Coverage:</strong>
              <p class="text-sm ml-4">Can the company's operating cash flow comfortably cover interest and principal payments?</p>
            </li>
            <li>
              <strong>Evaluate Growth Rate:</strong>
              <p class="text-sm ml-4">High growth may justify higher leverage if that growth translates to increased cash flow</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Perspective</h4>
            <p>On Shark Tank, a high debt to equity ratio often raises red flags for investors. Kevin O'Leary frequently questions entrepreneurs about their debt levels, concerned about how additional investment would be used. Mark Cuban typically prefers businesses with cleaner balance sheets and lower leverage, particularly for early-stage companies where profitability may not yet be consistent.</p>
          </div>
        `
      },
      {
        title: "Strategic Use of Leverage",
        content: `
          <h2 class="text-2xl font-bold mb-4">Strategic Use of Leverage</h2>
          <p class="mb-6">Understanding when and how to use debt is a critical business skill. Strategic leverage can accelerate growth and increase returns, but it must be managed carefully.</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">When Higher Leverage Makes Sense</h3>
              <p>There are situations where taking on more debt can be strategically advantageous:</p>
              <div class="mt-2 text-sm text-shark-600">
                <ul class="list-disc pl-5 mt-1">
                  <li>When interest rates are low relative to expected returns</li>
                  <li>For companies with stable, predictable cash flows</li>
                  <li>To finance acquisitions with clear synergies and integration plans</li>
                  <li>For expansion into proven markets with established demand</li>
                  <li>When tax benefits of debt interest are significant</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">When Lower Leverage Is Preferable</h3>
              <p>Conservative debt levels are often better in these scenarios:</p>
              <div class="mt-2 text-sm text-shark-600">
                <ul class="list-disc pl-5 mt-1">
                  <li>During economic uncertainty or industry volatility</li>
                  <li>For startups and early-stage companies with unproven models</li>
                  <li>When cash flows are unpredictable or seasonal</li>
                  <li>When interest rates are high or expected to rise</li>
                  <li>If the business already has significant operational leverage</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Optimizing Capital Structure</h3>
              <p>Finding the right debt to equity balance for your business:</p>
              <div class="mt-2 text-sm text-shark-600">
                <ul class="list-disc pl-5 mt-1">
                  <li>Calculate your weighted average cost of capital (WACC) at different debt levels</li>
                  <li>Stress test your financial model with higher interest rates and lower revenues</li>
                  <li>Consider the flexibility needed for future opportunities</li>
                  <li>Evaluate the impact on credit ratings and borrowing costs</li>
                  <li>Match debt maturities with the cash flow cycles of financed assets</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Warning Signs of Excessive Leverage</h3>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Rising Interest Coverage Ratio:</strong> Operating income barely covers interest payments</li>
              <li><strong>Reduced Financial Flexibility:</strong> Limited ability to raise additional capital when needed</li>
              <li><strong>Restrictive Covenants:</strong> Debt terms that severely limit operational decisions</li>
              <li><strong>Refinancing Difficulties:</strong> Struggling to roll over or refinance existing debt</li>
              <li><strong>Debt Used for Operating Expenses:</strong> Borrowing to cover day-to-day costs rather than investments</li>
            </ul>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Sharks often advise a balanced approach to leverage. Barbara Corcoran has noted that "the best entrepreneurs know when to use other people's money and when to use their own." Robert Herjavec looks for entrepreneurs who understand that debt is a tool, not a solution, and who have a clear plan for how debt will create value rather than just sustain operations.</p>
          </div>
        `
      }
    ]
  },
  "depreciation": {
    title: "Depreciation",
    description: "Learn how to account for the decreasing value of physical assets over time and understand its impact on financial statements, taxes, and business decisions.",
    sections: [
      {
        title: "What is Depreciation?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Depreciation?</h2>
          <p class="mb-4">Depreciation is an accounting method that allocates the cost of a tangible asset over its useful life. It represents how much of an asset's value has been used up over time due to wear and tear, obsolescence, or other factors that reduce its value and utility.</p>
          <p class="mb-6">Rather than recording the entire cost of an asset as an expense when it's purchased, depreciation allows businesses to spread that cost over the asset's useful life, which better matches expenses with the revenue those assets help generate.</p>
          
          <h3 class="text-xl font-semibold mb-3">Types of Assets That Are Depreciated</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Buildings and Structures:</strong> Offices, warehouses, manufacturing facilities</li>
            <li><strong>Machinery and Equipment:</strong> Production machinery, office equipment, vehicles</li>
            <li><strong>Furniture and Fixtures:</strong> Office furniture, retail displays, shelving</li>
            <li><strong>Computers and Technology:</strong> Servers, computers, telecom equipment</li>
            <li><strong>Vehicles:</strong> Company cars, trucks, delivery vehicles</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Key Concepts in Depreciation</h4>
            <ul class="list-disc pl-6 space-y-1">
              <li><strong>Asset Cost:</strong> The full purchase price plus any costs to get the asset ready for use</li>
              <li><strong>Salvage Value:</strong> The estimated value of the asset at the end of its useful life</li>
              <li><strong>Useful Life:</strong> The estimated period during which the asset will be productive</li>
              <li><strong>Depreciable Base:</strong> The asset cost minus the salvage value</li>
              <li><strong>Book Value:</strong> The original cost minus accumulated depreciation</li>
            </ul>
          </div>
        `
      },
      {
        title: "Depreciation Methods",
        content: `
          <h2 class="text-2xl font-bold mb-4">Depreciation Methods</h2>
          <p class="mb-6">There are several methods of calculating depreciation, each with different applications and effects on financial statements. The choice of method can impact reported earnings, tax liability, and financial ratios.</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Straight-Line Depreciation</h3>
              <p>The simplest and most common method, which spreads the cost evenly over the asset's useful life.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Formula:</strong> Annual Depreciation = (Cost - Salvage Value) ÷ Useful Life
              </div>
              <div class="mt-2 text-sm">
                <strong>Example:</strong> For a $10,000 machine with a $1,000 salvage value and 5-year useful life:<br>
                Annual Depreciation = ($10,000 - $1,000) ÷ 5 = $1,800 per year
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Declining Balance Method</h3>
              <p>Accelerates depreciation by applying a fixed percentage to the asset's remaining book value each year.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Formula:</strong> Annual Depreciation = Book Value × Depreciation Rate
              </div>
              <div class="mt-2 text-sm">
                <strong>Example:</strong> Using double-declining balance (2 × straight-line rate = 40%) on the same $10,000 machine:<br>
                Year 1: $10,000 × 40% = $4,000<br>
                Year 2: $6,000 × 40% = $2,400
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Units of Production Method</h3>
              <p>Bases depreciation on the actual usage or output of the asset, rather than time.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Formula:</strong> Depreciation per Unit = (Cost - Salvage Value) ÷ Estimated Total Production<br>
                Annual Depreciation = Depreciation per Unit × Units Produced in the Period
              </div>
              <div class="mt-2 text-sm">
                <strong>Example:</strong> A machine expected to produce 100,000 units over its lifetime:<br>
                Depreciation per Unit = ($10,000 - $1,000) ÷ 100,000 = $0.09 per unit<br>
                If 15,000 units are produced in Year 1, depreciation is $0.09 × 15,000 = $1,350
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Sum-of-Years' Digits (SYD)</h3>
              <p>Another accelerated method that applies a decreasing fraction to the depreciable base.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Formula:</strong> SYD = n(n+1) ÷ 2, where n is the useful life in years<br>
                Annual Depreciation = (Remaining Life ÷ SYD) × Depreciable Base
              </div>
              <div class="mt-2 text-sm">
                <strong>Example:</strong> For a 5-year asset: SYD = 5(5+1) ÷ 2 = 15<br>
                Year 1: (5 ÷ 15) × $9,000 = $3,000<br>
                Year 2: (4 ÷ 15) × $9,000 = $2,400
              </div>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Which Method to Use?</h4>
            <p>The choice of depreciation method should reflect the pattern in which the asset's benefits are expected to be consumed:</p>
            <ul class="list-disc pl-6 mt-2">
              <li><strong>Straight-Line:</strong> Best for assets that provide benefits evenly over time (buildings, furniture)</li>
              <li><strong>Accelerated Methods:</strong> Appropriate for assets that are more productive in early years (computers, technology)</li>
              <li><strong>Units of Production:</strong> Ideal for assets whose use varies significantly year to year (manufacturing equipment)</li>
            </ul>
            <p class="mt-2">Tax considerations often lead businesses to use accelerated methods for tax returns and straight-line for financial statements.</p>
          </div>
        `
      },
      {
        title: "Depreciation Impact and Strategy",
        content: `
          <h2 class="text-2xl font-bold mb-4">Depreciation Impact and Strategy</h2>
          <p class="mb-6">Depreciation affects various aspects of business finance, from tax liability to reported profits. Understanding these effects allows for strategic decision-making around asset acquisition and financial reporting.</p>
          
          <h3 class="text-xl font-semibold mb-3">Financial Statement Impact</h3>
          <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Income Statement</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Reduces reported net income</li>
                <li>Affects profit margins</li>
                <li>Non-cash expense (added back in cash flow)</li>
                <li>Influences earnings-based metrics</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Balance Sheet</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Reduces asset carrying values</li>
                <li>Accumulated depreciation increases</li>
                <li>Affects asset turnover ratios</li>
                <li>Impacts return on assets (ROA)</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Cash Flow Statement</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Added back to net income in operating activities</li>
                <li>Helps reconcile profit to cash flow</li>
                <li>No direct cash impact</li>
                <li>Improves operating cash flow vs. net income</li>
              </ul>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Strategic Considerations</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Tax Planning:</strong>
              <p class="text-sm ml-4">Accelerated depreciation methods can reduce current tax liability by increasing expenses in early years</p>
            </li>
            <li>
              <strong>Capital Budgeting:</strong>
              <p class="text-sm ml-4">Understanding depreciation's impact on financial statements helps evaluate investment decisions</p>
            </li>
            <li>
              <strong>Asset Replacement Timing:</strong>
              <p class="text-sm ml-4">Depreciation schedules can guide decisions about when to repair versus replace aging assets</p>
            </li>
            <li>
              <strong>Section 179 Deduction (US):</strong>
              <p class="text-sm ml-4">Allows businesses to deduct the full purchase price of qualifying equipment in the year it's placed in service</p>
            </li>
            <li>
              <strong>Bonus Depreciation:</strong>
              <p class="text-sm ml-4">Provides additional first-year depreciation deductions beyond normal depreciation schedules</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, entrepreneurs must understand how depreciation affects their financials. When discussing capital-intensive businesses, Sharks often focus on EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) to assess the underlying operational performance without the accounting impact of depreciation.</p>
            <p class="mt-2">Mark Cuban frequently asks about capital expenditure requirements and replacement cycles to understand the true cash needs of the business beyond reported profits, which are affected by non-cash expenses like depreciation.</p>
          </div>
        `
      }
    ]
  },
  "discounted-cash-flow": {
    title: "Discounted Cash Flow (DCF)",
    description: "Learn how to value businesses by projecting future cash flows and converting them to present value, a fundamental method for investment analysis and acquisition decisions.",
    sections: [
      {
        title: "Understanding DCF Valuation",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Discounted Cash Flow (DCF) Analysis?</h2>
          <p class="mb-4">Discounted Cash Flow (DCF) analysis is a valuation method used to estimate the value of an investment based on its expected future cash flows. By discounting projected cash flows back to the present value, DCF accounts for the time value of money—the concept that a dollar today is worth more than a dollar in the future due to its earning potential.</p>
          <p class="mb-6">DCF is widely considered one of the most thorough and accurate valuation methods, particularly for businesses with predictable cash flows. It's used by investment bankers, private equity firms, and sophisticated investors to determine if a business is likely to be a good investment at a given price.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Core Principle: Time Value of Money</h3>
          <p class="mb-4">The fundamental concept behind DCF is the time value of money. Cash received in the future is worth less than the same amount received today because:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Opportunity Cost:</strong> Money available now can be invested to generate returns</li>
            <li><strong>Inflation:</strong> Purchasing power decreases over time</li>
            <li><strong>Risk:</strong> Future cash flows are less certain than immediate ones</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">The Basic DCF Formula</h4>
            <div class="font-mono text-center my-2 text-sm">
              DCF Value = CF₁/(1+r)¹ + CF₂/(1+r)² + CF₃/(1+r)³ + ... + CFₙ/(1+r)ⁿ
            </div>
            <p class="text-sm mt-2">Where:</p>
            <ul class="list-disc pl-6 mt-1 text-sm">
              <li><strong>CF</strong> = Cash Flow in the period indicated by the subscript</li>
              <li><strong>r</strong> = Discount Rate (often the Weighted Average Cost of Capital)</li>
              <li><strong>n</strong> = Number of periods</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">When to Use DCF Valuation</h3>
          <p class="mb-4">DCF is particularly useful for:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Established Businesses:</strong> Companies with predictable cash flows and growth</li>
            <li><strong>Project Evaluation:</strong> Assessing the financial viability of new investments</li>
            <li><strong>Acquisition Analysis:</strong> Determining a fair purchase price for a business</li>
            <li><strong>Investor Pitches:</strong> Justifying valuation to potential investors</li>
            <li><strong>Exit Planning:</strong> Estimating future business value for exit strategies</li>
          </ul>
          
          <div class="border-l-4 border-shark-300 pl-4 mb-6">
            <h4 class="font-medium mb-1">DCF Limitations</h4>
            <p class="text-sm">Despite its strengths, DCF has some limitations:</p>
            <div class="mt-1 text-sm text-shark-600">
              <ul class="list-disc pl-6 mt-1">
                <li>Highly sensitive to growth and discount rate assumptions</li>
                <li>Challenging to apply to early-stage companies with unpredictable cash flows</li>
                <li>Requires detailed forecasting, which becomes less reliable over longer periods</li>
                <li>May not capture strategic value or synergies in acquisitions</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, Kevin O'Leary (Mr. Wonderful) frequently uses DCF-like thinking when evaluating businesses. His famous question, "How long will it take me to get my money back?" directly relates to discounting future returns to present value.</p>
            <p class="mt-2">When entrepreneurs claim high valuations based on future potential, Sharks often challenge these by implicitly using DCF principles to show that even with optimistic growth projections, the current valuation may not be justified after accounting for time and risk.</p>
          </div>
        `
      },
      {
        title: "Building a DCF Model",
        content: `
          <h2 class="text-2xl font-bold mb-4">Building a DCF Valuation Model</h2>
          <p class="mb-6">Creating a robust Discounted Cash Flow model involves several key steps, each requiring careful analysis and informed assumptions. Let's walk through the process of building a DCF model for business valuation:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 1: Project Free Cash Flows</h3>
              <p>Forecast the company's free cash flows (FCF) for a specific projection period (typically 5-10 years).</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Free Cash Flow Calculation:</strong>
                <div class="font-mono mt-1">
                  EBIT<br>
                  - Taxes<br>
                  + Depreciation & Amortization<br>
                  - Capital Expenditures<br>
                  - Changes in Working Capital<br>
                  = Free Cash Flow
                </div>
                <p class="mt-2">Key drivers to consider when projecting FCF:</p>
                <ul class="list-disc pl-6 mt-1">
                  <li>Revenue growth rates</li>
                  <li>Profit margins</li>
                  <li>Tax rates</li>
                  <li>Capital investment requirements</li>
                  <li>Working capital needs</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 2: Determine the Terminal Value</h3>
              <p>Calculate the business's value beyond the explicit forecast period using either:</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Perpetuity Growth Method:</strong>
                <div class="font-mono mt-1">
                  Terminal Value = FCF in Final Year × (1 + g) ÷ (r - g)
                </div>
                <p class="mt-1">Where g = perpetual growth rate (typically 2-3%) and r = discount rate</p>
                
                <strong class="mt-3 block">Exit Multiple Method:</strong>
                <div class="font-mono mt-1">
                  Terminal Value = FCF in Final Year × Exit Multiple
                </div>
                <p class="mt-1">Where Exit Multiple is often based on comparable company EV/EBITDA ratios</p>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 3: Calculate the Discount Rate</h3>
              <p>Determine the appropriate discount rate, typically using the Weighted Average Cost of Capital (WACC).</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>WACC Calculation:</strong>
                <div class="font-mono mt-1">
                  WACC = (E/V × Re) + (D/V × Rd × (1-T))
                </div>
                <p class="mt-1">Where:</p>
                <ul class="list-disc pl-6 mt-1">
                  <li>E = Market value of equity</li>
                  <li>D = Market value of debt</li>
                  <li>V = E + D (total market value)</li>
                  <li>Re = Cost of equity</li>
                  <li>Rd = Cost of debt</li>
                  <li>T = Corporate tax rate</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 4: Discount the Cash Flows</h3>
              <p>Calculate the present value of both the projected cash flows and the terminal value.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Present Value Formula:</strong>
                <div class="font-mono mt-1">
                  PV = FV ÷ (1 + r)ⁿ
                </div>
                <p class="mt-1">Where:</p>
                <ul class="list-disc pl-6 mt-1">
                  <li>PV = Present Value</li>
                  <li>FV = Future Value (the cash flow)</li>
                  <li>r = Discount Rate (WACC)</li>
                  <li>n = Number of periods into the future</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 5: Calculate Enterprise and Equity Value</h3>
              <p>Sum the present values to find the Enterprise Value, then adjust for debt and cash.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Enterprise Value:</strong>
                <div class="font-mono mt-1">
                  Enterprise Value = PV of Projected Cash Flows + PV of Terminal Value
                </div>
                
                <strong class="mt-3 block">Equity Value:</strong>
                <div class="font-mono mt-1">
                  Equity Value = Enterprise Value + Cash - Debt - Preferred Stock + Non-Operating Assets
                </div>
                
                <strong class="mt-3 block">Value Per Share:</strong>
                <div class="font-mono mt-1">
                  Value Per Share = Equity Value ÷ Shares Outstanding
                </div>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">DCF Modeling Example</h3>
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">Simplified DCF Valuation Example</h4>
            <p class="mb-2">Assumptions:</p>
            <ul class="list-none pl-4 space-y-1 mb-4">
              <li>5-year projection period</li>
              <li>Free Cash Flows: $1M (Year 1), $1.2M (Year 2), $1.4M (Year 3), $1.6M (Year 4), $1.8M (Year 5)</li>
              <li>Terminal growth rate: 2%</li>
              <li>Discount rate (WACC): 10%</li>
              <li>Cash: $5M, Debt: $8M</li>
            </ul>
            
            <div>
              <p class="font-medium">1. Calculate Terminal Value:</p>
              <p class="pl-4">Terminal Value = $1.8M × (1 + 2%) ÷ (10% - 2%) = $23.18M</p>
            </div>
            
            <div class="mt-2">
              <p class="font-medium">2. Discount all cash flows:</p>
              <p class="pl-4">
                PV of Year 1 CF: $1M ÷ (1 + 10%)¹ = $0.91M<br>
                PV of Year 2 CF: $1.2M ÷ (1 + 10%)² = $0.99M<br>
                PV of Year 3 CF: $1.4M ÷ (1 + 10%)³ = $1.05M<br>
                PV of Year 4 CF: $1.6M ÷ (1 + 10%)⁴ = $1.09M<br>
                PV of Year 5 CF: $1.8M ÷ (1 + 10%)⁵ = $1.12M<br>
                PV of Terminal Value: $23.18M ÷ (1 + 10%)⁵ = $14.38M
              </p>
            </div>
            
            <div class="mt-2">
              <p class="font-medium">3. Calculate Enterprise Value:</p>
              <p class="pl-4">EV = $0.91M + $0.99M + $1.05M + $1.09M + $1.12M + $14.38M = $19.54M</p>
            </div>
            
            <div class="mt-2">
              <p class="font-medium">4. Calculate Equity Value:</p>
              <p class="pl-4">Equity Value = $19.54M + $5M - $8M = $16.54M</p>
            </div>
          </div>
        `
      },
      {
        title: "DCF in Business Decisions",
        content: `
          <h2 class="text-2xl font-bold mb-4">Using DCF in Business Decisions</h2>
          <p class="mb-6">Discounted Cash Flow analysis is a powerful tool that goes beyond simple business valuation. When applied strategically, it can inform a wide range of critical business decisions and help entrepreneurs make more informed choices about the future of their companies.</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Capital Allocation Decisions</h3>
              <p>Use DCF to prioritize competing investment opportunities and capital projects.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Application:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Compare NPV (Net Present Value) across different potential investments</li>
                  <li>Establish minimum IRR (Internal Rate of Return) thresholds for new projects</li>
                  <li>Determine optimal timing for major capital expenditures</li>
                  <li>Evaluate whether to build new capabilities in-house or acquire them</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Acquisition Analysis</h3>
              <p>Determine appropriate purchase prices for target companies and evaluate synergies.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Strategy:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Establish maximum bid prices based on expected future cash flows</li>
                  <li>Quantify potential synergies and their impact on valuation</li>
                  <li>Model different integration scenarios and their financial implications</li>
                  <li>Compare acquisition costs to organic growth alternatives</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Business Unit Evaluation</h3>
              <p>Assess the value contribution of different business segments to inform portfolio decisions.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Applications:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Identify underperforming divisions that may be candidates for divestiture</li>
                  <li>Allocate resources based on the present value of growth opportunities</li>
                  <li>Support decisions about which product lines to expand or contract</li>
                  <li>Evaluate whether to shut down, sell, or restructure struggling operations</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Strategic Planning</h3>
              <p>Use DCF to evaluate different strategic paths and business models.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Approach:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Compare subscription vs. one-time purchase revenue models</li>
                  <li>Evaluate expansion into new geographic markets or customer segments</li>
                  <li>Assess vertical integration opportunities</li>
                  <li>Analyze potential pivots or business model transformations</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">DCF Sensitivity Analysis</h3>
          <p class="mb-4">Because DCF relies on assumptions about the future, it's crucial to conduct sensitivity analysis to understand how changes in key variables affect valuation:</p>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Key Variables for Sensitivity Testing</h4>
            <ul class="list-disc pl-6">
              <li><strong>Growth Rates:</strong> Test how different revenue growth scenarios impact valuation</li>
              <li><strong>Profit Margins:</strong> Vary margin assumptions to see effects on cash flow</li>
              <li><strong>Discount Rates:</strong> Adjust WACC up and down to reflect different risk scenarios</li>
              <li><strong>Terminal Value:</strong> Test different terminal growth rates and exit multiples</li>
              <li><strong>Capital Requirements:</strong> Vary CapEx and working capital assumptions</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Common DCF Mistakes to Avoid</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Overly Optimistic Projections:</strong> Being unrealistic about future growth or margins</li>
            <li><strong>Inconsistent Assumptions:</strong> Using assumptions that contradict each other</li>
            <li><strong>Incorrect Discount Rate:</strong> Failing to properly calculate WACC or adjust for project-specific risk</li>
            <li><strong>Terminal Value Issues:</strong> Overestimating long-term growth or using inappropriate exit multiples</li>
            <li><strong>Ignoring Working Capital:</strong> Forgetting that growth usually requires additional working capital</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>When entrepreneurs on Shark Tank present high valuations, Sharks like Mark Cuban often challenge their assumptions, essentially questioning the inputs to their implicit DCF calculations.</p>
            <p class="mt-2">Kevin O'Leary frequently structures royalty deals instead of straight equity investments, which reflects his preference for more predictable cash flows. This approach allows him to create his own DCF model with more certainty around returns, reducing his risk as an investor.</p>
          </div>
        `
      }
    ]
  },
  "ebitda": {
    title: "EBITDA",
    description: "Learn to calculate and interpret Earnings Before Interest, Taxes, Depreciation and Amortization as a measure of a company's operational performance.",
    sections: [
      {
        title: "What is EBITDA?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is EBITDA?</h2>
          <p class="mb-4">EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It's a widely used measure of a company's operational performance that removes the effects of financing decisions, tax environments, and non-cash expenses.</p>
          <p class="mb-6">EBITDA helps investors, analysts, and business owners assess a company's operating profitability and cash flow by focusing on the core business operations rather than factors that might vary due to accounting practices, capital structure, or tax strategies.</p>
          
          <h3 class="text-xl font-semibold mb-3">The EBITDA Formula</h3>
          <div class="bg-shark-50 p-3 rounded-md font-mono mb-6">
            <p>EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization</p>
          </div>
          <p class="mb-4">Alternatively, you can calculate EBITDA from operating profit:</p>
          <div class="bg-shark-50 p-3 rounded-md font-mono mb-6">
            <p>EBITDA = Operating Profit + Depreciation + Amortization</p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Why EBITDA Matters</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Operational Focus:</strong> Provides clarity on core business performance</li>
            <li><strong>Comparability:</strong> Allows comparison between companies with different capital structures, tax situations, or depreciation policies</li>
            <li><strong>Valuation Tool:</strong> Often used as a basis for business valuation (e.g., "5x EBITDA")</li>
            <li><strong>Cash Flow Proxy:</strong> Serves as a rough approximation of cash flow generation capacity</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>When entrepreneurs appear on Shark Tank, investors like Kevin O'Leary often ask about EBITDA when discussing valuation. For instance, if a company has $500,000 in EBITDA and the entrepreneur values the company at $5 million, that's a 10x EBITDA multiple, which the Sharks might consider too high for certain industries.</p>
          </div>
        `
      },
      {
        title: "Calculating and Using EBITDA",
        content: `
          <h2 class="text-2xl font-bold mb-4">Calculating and Using EBITDA</h2>
          <p class="mb-6">Let's walk through a practical example of calculating EBITDA and understanding what the number tells us:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">EBITDA Calculation Example</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium">Company Financial Data:</p>
                <ul class="list-none pl-4 space-y-1">
                  <li>Revenue: $10,000,000</li>
                  <li>Cost of Goods Sold: $6,000,000</li>
                  <li>Operating Expenses: $2,500,000</li>
                  <li>Depreciation: $500,000</li>
                  <li>Amortization: $200,000</li>
                  <li>Interest Expense: $300,000</li>
                  <li>Tax Expense: $125,000</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">Step 1: Calculate Net Income</p>
                <p class="pl-4">Revenue - COGS - Operating Expenses - Depreciation - Amortization - Interest - Taxes</p>
                <p class="pl-4">$10,000,000 - $6,000,000 - $2,500,000 - $500,000 - $200,000 - $300,000 - $125,000 = $375,000</p>
              </div>
              
              <div>
                <p class="font-medium">Step 2: Calculate EBITDA</p>
                <p class="pl-4">Net Income + Interest + Taxes + Depreciation + Amortization</p>
                <p class="pl-4">$375,000 + $300,000 + $125,000 + $500,000 + $200,000 = $1,500,000</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <p>In this example, while the company's net income is $375,000, its EBITDA is $1,500,000, showing much stronger operational performance before accounting for non-operational factors.</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">EBITDA-Related Metrics</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>EBITDA Margin:</strong> EBITDA ÷ Revenue
              <p class="text-sm ml-4">Shows what percentage of revenue is converted to EBITDA. Higher margins indicate operational efficiency.</p>
            </li>
            <li>
              <strong>Enterprise Value (EV) to EBITDA:</strong> EV ÷ EBITDA
              <p class="text-sm ml-4">A valuation multiple that compares a company's total value to its operational earnings.</p>
            </li>
            <li>
              <strong>Debt to EBITDA:</strong> Total Debt ÷ EBITDA
              <p class="text-sm ml-4">Measures leverage and shows how many years of EBITDA would be needed to pay off all debt.</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>While EBITDA is useful, don't rely on it exclusively. It ignores capital expenditures required to maintain assets and working capital needs, which can lead to overestimating a company's actual cash generation capability.</p>
          </div>
        `
      },
      {
        title: "EBITDA Limitations and Adjustments",
        content: `
          <h2 class="text-2xl font-bold mb-4">EBITDA Limitations and Adjustments</h2>
          <p class="mb-6">While EBITDA is a valuable metric, it has limitations and is often adjusted to provide a more accurate picture of a business's operational performance.</p>
          
          <h3 class="text-xl font-semibold mb-3">Limitations of EBITDA</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Ignores Capital Expenditures:</strong> Businesses eventually need to replace depreciated assets, which EBITDA doesn't account for</li>
            <li><strong>Overlooks Working Capital:</strong> Changes in inventory or accounts receivable affect cash flow but aren't reflected in EBITDA</li>
            <li><strong>Not Standardized:</strong> Not defined by Generally Accepted Accounting Principles (GAAP), allowing for manipulation</li>
            <li><strong>Debt Blind:</strong> A company with high EBITDA might still struggle if it has significant debt obligations</li>
            <li><strong>Tax Reality:</strong> Taxes are a real expense that EBITDA ignores</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-3">Adjusted EBITDA</h3>
          <p class="mb-4">Many companies report "Adjusted EBITDA," which removes unusual or non-recurring items to show a more normalized view of operations. Common adjustments include:</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Items Often Added Back</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>One-time restructuring costs</li>
                <li>Litigation expenses or settlements</li>
                <li>Stock-based compensation</li>
                <li>Foreign exchange losses</li>
                <li>Acquisition-related expenses</li>
                <li>Non-recurring professional fees</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Items Often Deducted</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>One-time gains from asset sales</li>
                <li>Insurance proceeds</li>
                <li>Foreign exchange gains</li>
                <li>Unusual income items</li>
                <li>Benefits from legal settlements</li>
              </ul>
            </div>
          </div>
          
          <div class="border-l-4 border-shark-300 pl-4 mb-6">
            <h3 class="text-xl font-semibold mb-2">Pro-Forma EBITDA</h3>
            <p>In acquisition situations, companies often present "Pro-Forma EBITDA," which shows what EBITDA would have been if recent changes (like cost-cutting measures or new contracts) had been in place for the entire period.</p>
            <div class="mt-2 text-sm text-shark-600">
              <strong>Example:</strong> "We've just signed a $1M contract that will add $400K annually to our EBITDA going forward."
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, entrepreneurs sometimes present adjusted EBITDA figures to make their businesses look more profitable. Savvy Sharks like Mark Cuban often challenge these adjustments, asking, "What's your real EBITDA without all these add-backs?" They want to see the true operational performance without financial engineering.</p>
          </div>
        `
      }
    ]
  },
  "equity-dilution": {
    title: "Equity Dilution",
    description: "Understand how fundraising and issuing new shares impacts ownership percentages and control of your business. Learn to manage dilution while still growing your company.",
    sections: [
      {
        title: "Understanding Equity Dilution",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Equity Dilution?</h2>
          <p class="mb-4">Equity dilution occurs when a company issues new shares, causing existing shareholders to own a smaller percentage of the company than they did before the issuance. While the number of shares they own remains the same, their ownership percentage and control of the company decreases.</p>
          <p class="mb-6">Dilution is a natural part of growing a business with outside capital, but understanding its mechanisms and implications is crucial for founders and early investors to make informed decisions about fundraising strategy and company governance.</p>
          
          <h3 class="text-xl font-semibold mb-3">How Dilution Works</h3>
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Dilution Example</h4>
            <p class="text-sm">Initial cap table: Founder owns 100,000 shares (100% of the company)</p>
            <p class="text-sm mt-2">Series A funding: Company issues 25,000 new shares to investors</p>
            <div class="mt-2 text-sm">
              <strong>Post-investment ownership:</strong><br>
              • Founder: 100,000 shares (80% ownership)<br>
              • Investors: 25,000 shares (20% ownership)<br>
              • Total shares: 125,000 shares
            </div>
            <p class="mt-2 text-sm">The founder's ownership has been diluted from 100% to 80%, though they still own the same number of shares.</p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Common Causes of Dilution</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Equity Financing Rounds:</strong> Raising capital by selling shares to investors</li>
            <li><strong>Employee Stock Option Pools:</strong> Creating or expanding equity compensation for employees</li>
            <li><strong>Convertible Securities:</strong> Convertible notes or SAFEs converting to equity</li>
            <li><strong>Stock Dividends:</strong> Issuing additional shares to existing shareholders</li>
            <li><strong>Mergers & Acquisitions:</strong> Paying for acquisitions with newly issued shares</li>
          </ul>
          
          <div class="border-l-4 border-shark-300 pl-4 mb-6">
            <h4 class="font-medium mb-1">Economic vs. Control Dilution</h4>
            <p class="text-sm">Dilution affects both economic interest and control:</p>
            <div class="mt-1 text-sm text-shark-600">
              <strong>Economic Dilution:</strong> Reduction in percentage of future profits and exit proceeds<br>
              <strong>Control Dilution:</strong> Reduced voting power and decision-making authority
            </div>
            <p class="mt-1 text-sm">Control thresholds to watch: Over 50% (majority control), over 67% (supermajority for major decisions), below 50% (loss of control)</p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">The Misconception of Dilution</h3>
          <p class="mb-4">A common misconception is that dilution is always negative. However, when new capital enables the company to grow faster than it would have otherwise, everyone's smaller percentage can become worth significantly more in absolute terms. This concept is often called "growing the pie" rather than just dividing it differently.</p>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, entrepreneurs frequently struggle with the concept of dilution when Sharks make offers. A typical Shark might offer "$300,000 for 30% of your company," and entrepreneurs often counter with concerns about giving up too much ownership.</p>
            <p class="mt-2">Mark Cuban often reminds entrepreneurs that "it's better to own a smaller piece of a big pie than a big piece of nothing." This captures the essence of productive dilution—accepting some reduction in percentage ownership in exchange for resources that significantly increase the company's overall value.</p>
          </div>
        `
      },
      {
        title: "Managing and Calculating Dilution",
        content: `
          <h2 class="text-2xl font-bold mb-4">Managing and Calculating Equity Dilution</h2>
          <p class="mb-6">As you raise capital across multiple rounds, understanding how to calculate, project, and manage dilution becomes increasingly important for maintaining appropriate control and economic interest in your company.</p>
          
          <h3 class="text-xl font-semibold mb-3">Calculating Dilution</h3>
          <div class="space-y-4 mb-6">
            <div>
              <p class="font-medium">Basic Dilution Formula:</p>
              <div class="font-mono text-sm bg-shark-50 p-2 rounded">
                Post-money Ownership % = (Shares Owned ÷ Total Post-money Shares) × 100%
              </div>
              <p class="text-sm mt-1">Where: Total Post-money Shares = Pre-money Shares + Newly Issued Shares</p>
            </div>
            
            <div>
              <p class="font-medium">Dilution Percentage:</p>
              <div class="font-mono text-sm bg-shark-50 p-2 rounded">
                Dilution % = (Pre-money % - Post-money %) ÷ Pre-money % × 100%
              </div>
            </div>
          </div>
          
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">Multi-Round Dilution Example</h4>
            <p class="mb-2"><strong>Starting Point:</strong> Founder owns 100% with 1,000,000 shares</p>
            
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse text-sm">
                <thead class="bg-shark-50">
                  <tr>
                    <th class="border px-4 py-2">Round</th>
                    <th class="border px-4 py-2">New Shares Issued</th>
                    <th class="border px-4 py-2">Post-Round Total Shares</th>
                    <th class="border px-4 py-2">Founder Shares</th>
                    <th class="border px-4 py-2">Founder Ownership</th>
                    <th class="border px-4 py-2">Dilution from Previous</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border px-4 py-2">Initial</td>
                    <td class="border px-4 py-2">-</td>
                    <td class="border px-4 py-2">1,000,000</td>
                    <td class="border px-4 py-2">1,000,000</td>
                    <td class="border px-4 py-2">100.0%</td>
                    <td class="border px-4 py-2">-</td>
                  </tr>
                  <tr>
                    <td class="border px-4 py-2">Employee Option Pool</td>
                    <td class="border px-4 py-2">150,000</td>
                    <td class="border px-4 py-2">1,150,000</td>
                    <td class="border px-4 py-2">1,000,000</td>
                    <td class="border px-4 py-2">87.0%</td>
                    <td class="border px-4 py-2">13.0%</td>
                  </tr>
                  <tr>
                    <td class="border px-4 py-2">Seed Round</td>
                    <td class="border px-4 py-2">250,000</td>
                    <td class="border px-4 py-2">1,400,000</td>
                    <td class="border px-4 py-2">1,000,000</td>
                    <td class="border px-4 py-2">71.4%</td>
                    <td class="border px-4 py-2">17.9%</td>
                  </tr>
                  <tr>
                    <td class="border px-4 py-2">Series A</td>
                    <td class="border px-4 py-2">400,000</td>
                    <td class="border px-4 py-2">1,800,000</td>
                    <td class="border px-4 py-2">1,000,000</td>
                    <td class="border px-4 py-2">55.6%</td>
                    <td class="border px-4 py-2">22.1%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-4 text-sm">
              Through these three funding events, the founder's ownership has decreased from 100% to 55.6%, despite maintaining the same number of shares. Each round dilutes previous shareholders proportionally.
            </p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Anti-Dilution Provisions</h3>
          <p class="mb-4">Investors often negotiate anti-dilution protections to guard against future down rounds (fundraising at lower valuations). The most common provisions are:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Full Ratchet Anti-Dilution</h4>
              <p class="text-sm">The most investor-friendly protection that adjusts the conversion price of preferred shares to the lowest price at which new stock is issued.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Impact:</strong> Significantly increases investor ownership in down rounds, highly dilutive to common shareholders
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Weighted Average Anti-Dilution</h4>
              <p class="text-sm">Adjusts conversion price based on both the lower price and the relative number of shares issued.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Formula:</strong> New Conversion Price = Old Conversion Price × (A + B) ÷ (A + C)<br>
                Where:<br>
                A = Shares outstanding before new issuance<br>
                B = Shares that would have been issued at old price to raise same amount<br>
                C = Actual new shares issued
              </div>
              <p class="mt-1 text-sm">This is more founder-friendly than full ratchet but still provides investor protection.</p>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Pay-to-Play Provisions</h4>
              <p class="text-sm">Requires investors to participate in future rounds to maintain their anti-dilution protection.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Benefit:</strong> Encourages continued investor support during challenging times
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Strategies to Minimize Harmful Dilution</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Raise Only What You Need:</strong> Take on only as much capital as required to reach key milestones</li>
            <li><strong>Milestone-Based Fundraising:</strong> Stage investments to reduce dilution until value-creating milestones are achieved</li>
            <li><strong>Negotiate Higher Valuations:</strong> Demonstrate traction and growth to justify higher valuations</li>
            <li><strong>Non-Dilutive Funding:</strong> Utilize grants, venture debt, revenue-based financing when appropriate</li>
            <li><strong>Customer Financing:</strong> Secure advance payments or favorable payment terms from customers</li>
            <li><strong>Strategic Partnerships:</strong> Form partnerships that provide resources without equity dilution</li>
          </ul>
        `
      },
      {
        title: "Strategic Dilution Decisions",
        content: `
          <h2 class="text-2xl font-bold mb-4">Making Strategic Dilution Decisions</h2>
          <p class="mb-6">While dilution is often inevitable for growing companies, making thoughtful strategic decisions about when, how much, and from whom to raise capital can significantly impact long-term founder outcomes and company success.</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Value-Added vs. Pure Financial Capital</h3>
              <p>Consider the non-financial value investors bring when evaluating dilution impact.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Beyond Money:</strong> The right investors can add significant value through:
                <ul class="list-disc pl-6 mt-1">
                  <li>Strategic guidance and mentorship</li>
                  <li>Industry connections and customer introductions</li>
                  <li>Recruiting assistance for key roles</li>
                  <li>Operational expertise in scaling</li>
                  <li>Credibility in the market</li>
                  <li>Support during future fundraising</li>
                </ul>
              </div>
              <p class="mt-1 text-sm">A smaller stake in a company supercharged by the right investors can be worth more than a larger stake in a company that grows more slowly.</p>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Maintaining Control Thresholds</h3>
              <p>Plan fundraising strategy to preserve key control positions through multiple rounds.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Critical Control Levels:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li><strong>Board Control:</strong> Structure the board composition to maintain founder influence</li>
                  <li><strong>>50% Voting Power:</strong> Retention of majority voting control for ordinary decisions</li>
                  <li><strong>>67% Voting Power:</strong> Protection against major corporate changes that require supermajority</li>
                  <li><strong>Protective Provisions:</strong> Negotiate specific protective provisions on key decisions</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Capital Efficiency and Valuation Strategy</h3>
              <p>Balance raising enough capital for growth while maximizing valuation efficiency.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Approaches:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Define clear, achievable milestones that will increase company valuation</li>
                  <li>Raise just enough to achieve the next significant milestone plus a safety margin</li>
                  <li>Demonstrate capital efficiency to increase investor confidence and valuations</li>
                  <li>Consider alternative financing structures (convertible notes, SAFEs) for early stages</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Employee Equity Considerations</h3>
              <p>Strategically allocate equity to attract and retain talent while managing dilution.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Best Practices:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Set aside option pools before fundraising rounds (typically 10-20%)</li>
                  <li>Implement vesting schedules (typically 4 years with a 1-year cliff)</li>
                  <li>Build a compensation philosophy that balances cash and equity</li>
                  <li>Structure refresher grants to retain key talent after vesting</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Founder Re-Vesting and Retention</h3>
          <p class="mb-4">As companies raise significant capital, investors often require founders to put some of their existing equity under new vesting schedules. While potentially concerning, these provisions serve important purposes:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Founder Commitment:</strong> Ensures founders remain engaged through key growth phases</li>
            <li><strong>Alignment:</strong> Keeps founder incentives aligned with the company's long-term success</li>
            <li><strong>Protection:</strong> Safeguards against a founder departure creating too much "dead equity"</li>
          </ul>
          <p class="mb-4">Founders should negotiate fair terms, like accelerated vesting upon certain exit events or termination without cause.</p>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Dilution Planning Exercise</h4>
            <p>To effectively plan for the impact of dilution, create a cap table projection that models:</p>
            <ol class="list-decimal pl-6 mt-2">
              <li>Current ownership distribution</li>
              <li>Expected future fundraising rounds and amounts</li>
              <li>Projected valuations at each round</li>
              <li>Required employee option pools</li>
              <li>Potential acquisition offers or exit scenarios</li>
            </ol>
            <p class="mt-2">This exercise helps visualize how various funding scenarios will affect ownership and control over time, allowing for more strategic decision-making.</p>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, equity negotiations are central to almost every deal. Sharks like Daymond John often test an entrepreneur's understanding of dilution by offering less money for the same equity percentage as the entrepreneur originally requested, to see if they understand the valuation implications.</p>
            <p class="mt-2">Barbara Corcoran frequently emphasizes the value beyond money that she brings, essentially arguing that the dilution from her equity stake is offset by the expertise, connections, and growth acceleration she provides. This exemplifies the "smart money vs. pure financial capital" consideration that entrepreneurs must evaluate.</p>
          </div>
        `
      }
    ]
  },
  "financial-modeling": {
    title: "Financial Modeling",
    description: "Learn how to build powerful financial models that project your business's future performance, analyze scenarios, and inform strategic decisions.",
    sections: [
      {
        title: "Financial Modeling Fundamentals",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Financial Modeling?</h2>
          <p class="mb-4">Financial modeling is the process of creating a summary of a company's expenses and earnings in the form of a spreadsheet that can be used to calculate the impact of future events or decisions. A good financial model provides a mathematical representation of a business that allows you to test assumptions, analyze scenarios, and project future financial performance.</p>
          <p class="mb-6">Whether you're starting a new venture, growing an existing business, raising capital, or considering strategic changes, financial modeling provides the quantitative foundation for sound decision-making.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Components of a Financial Model</h3>
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Assumptions and Inputs</h4>
              <p class="text-sm">The variables and parameters that drive the model's calculations.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Examples:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Revenue growth rates</li>
                  <li>Gross margin percentages</li>
                  <li>Operating expense ratios</li>
                  <li>Tax rates</li>
                  <li>Capital expenditure requirements</li>
                  <li>Working capital needs</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Financial Statements</h4>
              <p class="text-sm">The core outputs that project the financial position and performance.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Three Key Statements:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li><strong>Income Statement:</strong> Revenue, expenses, and profits over time</li>
                  <li><strong>Balance Sheet:</strong> Assets, liabilities, and equity at specific points in time</li>
                  <li><strong>Cash Flow Statement:</strong> Cash inflows and outflows across operating, investing, and financing activities</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Calculations and Formulas</h4>
              <p class="text-sm">The mathematical relationships that connect inputs to outputs.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Types of Calculations:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Revenue projections (units × price)</li>
                  <li>Cost of goods sold calculations</li>
                  <li>Depreciation schedules</li>
                  <li>Debt service and interest calculations</li>
                  <li>Tax computations</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Scenario Analysis</h4>
              <p class="text-sm">The ability to test different assumptions and see their impact on outcomes.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Common Scenarios:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Base case (most likely)</li>
                  <li>Upside case (optimistic)</li>
                  <li>Downside case (pessimistic)</li>
                  <li>Specific event scenarios (e.g., new product launch, expansion)</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Outputs and Metrics</h4>
              <p class="text-sm">Key performance indicators and financial metrics derived from the model.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Common Metrics:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Profitability ratios (Gross Margin, EBITDA Margin, Net Margin)</li>
                  <li>Return metrics (ROI, ROE, ROIC)</li>
                  <li>Liquidity ratios (Current Ratio, Quick Ratio)</li>
                  <li>Efficiency metrics (Inventory Turnover, Days Sales Outstanding)</li>
                  <li>Valuation outputs (NPV, IRR, Payback Period)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Types of Financial Models</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Three-Statement Models:</strong> Integrated income statement, balance sheet, and cash flow projections</li>
            <li><strong>DCF (Discounted Cash Flow) Models:</strong> Valuation models that discount future cash flows to present value</li>
            <li><strong>Budget Models:</strong> Detailed projections of revenue and expenses for planning purposes</li>
            <li><strong>Merger & Acquisition Models:</strong> Analysis of combining businesses and potential synergies</li>
            <li><strong>LBO (Leveraged Buyout) Models:</strong> Evaluations of acquisitions using significant debt financing</li>
            <li><strong>SaaS/Subscription Models:</strong> Specialized models for recurring revenue businesses</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, financial models take center stage as entrepreneurs present their projections to the Sharks. When Kevin O'Leary asks, "What are your sales and margins?", he's probing the assumptions in the entrepreneur's financial model.</p>
            <p class="mt-2">Lori Greiner often challenges growth projections, essentially questioning whether the financial model is realistic. Mark Cuban frequently zeroes in on cash flow projections, understanding that even profitable businesses can fail if their financial model doesn't account for adequate working capital.</p>
          </div>
        `
      },
      {
        title: "Building Your Financial Model",
        content: `
          <h2 class="text-2xl font-bold mb-4">Building a Robust Financial Model</h2>
          <p class="mb-6">Creating an effective financial model requires a methodical approach, attention to detail, and a clear understanding of your business drivers. Follow these steps to build a model that provides valuable insights for decision-making:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 1: Define the Purpose and Scope</h3>
              <p>Clarify why you're building the model and what decisions it will inform.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Key Questions:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>What specific business question are you trying to answer?</li>
                  <li>Who will use the model and what is their financial sophistication?</li>
                  <li>What time horizon should the model cover? (e.g., 3 years, 5 years, 10 years)</li>
                  <li>What level of detail is appropriate? (monthly, quarterly, annual)</li>
                  <li>What scenarios do you need to analyze?</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 2: Gather Historical Data</h3>
              <p>Collect relevant historical financial information to inform your projections.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Data Sources:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Income statements and balance sheets from previous periods</li>
                  <li>Sales data by product/service line</li>
                  <li>Customer acquisition metrics and costs</li>
                  <li>Expense breakdowns by category</li>
                  <li>Industry benchmarks and comparables</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 3: Design Model Structure</h3>
              <p>Create a clear, logical layout for your model that separates inputs, calculations, and outputs.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Best Practices:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Create separate sheets for assumptions, calculations, and outputs</li>
                  <li>Use consistent color-coding (e.g., blue for inputs, black for formulas)</li>
                  <li>Include a dashboard or summary page</li>
                  <li>Create a table of contents for complex models</li>
                  <li>Document assumptions and sources</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 4: Build the Revenue Model</h3>
              <p>Create detailed projections of how your business will generate income.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Approach:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Break down revenue by product/service lines</li>
                  <li>Model unit economics (customers × conversion rate × average purchase value)</li>
                  <li>Account for seasonality and growth trends</li>
                  <li>Consider customer cohorts and retention for subscription businesses</li>
                  <li>Include price changes and new product introductions</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 5: Model Costs and Expenses</h3>
              <p>Project all costs associated with generating revenue and running the business.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Categories:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li><strong>Cost of Goods Sold (COGS):</strong> Direct costs tied to revenue (materials, production labor, etc.)</li>
                  <li><strong>Operating Expenses:</strong> Sales, marketing, R&D, G&A</li>
                  <li><strong>Fixed vs. Variable Costs:</strong> Distinguish between costs that scale with revenue and those that don't</li>
                  <li><strong>One-time Expenses:</strong> Non-recurring costs like setup or restructuring</li>
                  <li><strong>Capital Expenditures:</strong> Long-term investments in assets</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 6: Build the Cash Flow Projection</h3>
              <p>Model the timing of cash inflows and outflows, which often differ from accrual-based revenue and expenses.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Components:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Customer payment timing (accounts receivable)</li>
                  <li>Supplier payment schedules (accounts payable)</li>
                  <li>Inventory purchases and holding periods</li>
                  <li>Tax payments</li>
                  <li>Financing activities (debt repayments, equity raises)</li>
                  <li>Capital expenditures</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 7: Incorporate Financing</h3>
              <p>Model how the business will be funded and the impact of different financing structures.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Considerations:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Equity investments and associated dilution</li>
                  <li>Debt financing and repayment schedules</li>
                  <li>Interest calculations</li>
                  <li>Convertible instruments (notes, SAFEs)</li>
                  <li>Cash runway and funding requirements</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Financial Modeling Best Practices</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Use Consistent Formulas:</strong> Structure formulas consistently across rows and columns</li>
            <li><strong>Avoid Hard-Coded Numbers:</strong> Reference assumption cells rather than embedding numbers in formulas</li>
            <li><strong>Build in Flexibility:</strong> Allow for easy scenario testing and assumption changes</li>
            <li><strong>Include Error Checks:</strong> Build in validation to catch calculation errors</li>
            <li><strong>Document Thoroughly:</strong> Include notes, sources, and explanations of methodologies</li>
            <li><strong>Format for Clarity:</strong> Use consistent formatting, clear labels, and appropriate number formatting</li>
            <li><strong>Start Simple:</strong> Begin with a basic framework and add complexity as needed</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Common Financial Modeling Mistakes</h4>
            <ul class="list-disc pl-6">
              <li><strong>Circular References:</strong> Creating calculation loops that reference their own results</li>
              <li><strong>Formula Inconsistency:</strong> Using different calculations for the same metric across periods</li>
              <li><strong>Overly Optimistic Assumptions:</strong> Projecting unrealistic growth or margin improvements</li>
              <li><strong>Ignoring Cash Flow Timing:</strong> Failing to account for the timing differences between revenue recognition and cash collection</li>
              <li><strong>Excessive Detail:</strong> Building models that are too complex to maintain or understand</li>
              <li><strong>Poor Documentation:</strong> Making it difficult for others (or yourself later) to understand assumptions</li>
            </ul>
          </div>
        `
      },
      {
        title: "Using Financial Models for Decisions",
        content: `
          <h2 class="text-2xl font-bold mb-4">Using Financial Models to Drive Decision-Making</h2>
          <p class="mb-6">A financial model is only valuable if it informs better business decisions. Here's how to leverage your financial model to evaluate options, communicate plans, and drive strategic success.</p>
          
          <h3 class="text-xl font-semibold mb-3">Scenario Analysis and Sensitivity Testing</h3>
          <p class="mb-4">Explore how different assumptions impact your financial outcomes to understand risks and opportunities.</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">Effective Scenario Analysis Techniques</h4>
            
            <div class="space-y-4">
              <div>
                <p class="font-medium">1. Define Key Scenarios</p>
                <ul class="list-disc pl-6 space-y-1">
                  <li><strong>Base Case:</strong> Your most likely projection based on reasonable assumptions</li>
                  <li><strong>Best Case:</strong> Optimistic but plausible scenario where key drivers exceed expectations</li>
                  <li><strong>Worst Case:</strong> Conservative scenario accounting for significant challenges</li>
                  <li><strong>Strategic Scenarios:</strong> Specific situations like new product launches, pricing changes, or market expansions</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">2. One-Variable Sensitivity Analysis</p>
                <p class="pl-4">Test how changes to a single variable affect outcomes while holding all else constant.</p>
                <p class="pl-4 text-sm">Example: How does a 10% increase or decrease in customer acquisition cost impact profitability?</p>
              </div>
              
              <div>
                <p class="font-medium">3. Multi-Variable Sensitivity</p>
                <p class="pl-4">Examine how changes to multiple variables simultaneously affect key metrics.</p>
                <p class="pl-4 text-sm">Example: Creating a matrix showing profit margins under different combinations of price points and production costs.</p>
              </div>
              
              <div>
                <p class="font-medium">4. Monte Carlo Simulation</p>
                <p class="pl-4">For sophisticated models, run thousands of simulations with randomly varied inputs to understand probability distributions of outcomes.</p>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Key Business Decisions Informed by Financial Models</h3>
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Fundraising Strategy</h3>
              <p>Determine how much capital to raise and when based on cash flow projections.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Model Applications:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Calculate runway under different growth scenarios</li>
                  <li>Identify optimal fundraising timing to maximize valuation</li>
                  <li>Analyze dilution impact of different investment structures</li>
                  <li>Determine use of funds allocation for maximum impact</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Pricing Strategy</h3>
              <p>Evaluate the financial impact of different pricing approaches.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Analysis Examples:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Price elasticity modeling (how volume changes with price)</li>
                  <li>Contribution margin analysis by product/service</li>
                  <li>Simulating freemium conversion metrics</li>
                  <li>Evaluating subscription vs. one-time purchase models</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Market Expansion</h3>
              <p>Assess the financial viability of entering new markets or segments.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Model Considerations:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Market-specific customer acquisition costs</li>
                  <li>Required local infrastructure and personnel</li>
                  <li>Regulatory compliance costs</li>
                  <li>Time to breakeven in new market</li>
                  <li>Opportunity cost vs. deepening existing market presence</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Product Development Investment</h3>
              <p>Evaluate the ROI of new product initiatives or feature development.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Financial Analysis:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Development cost projections</li>
                  <li>Revenue ramp timelines</li>
                  <li>Cannibalization of existing product revenue</li>
                  <li>Lifetime value of customers using new products</li>
                  <li>NPV and IRR of product investment</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Headcount Planning</h3>
              <p>Model the financial impact of hiring decisions and team growth.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Model Elements:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Fully-loaded employee costs (salary, benefits, equipment, space)</li>
                  <li>Productivity ramp timelines for new hires</li>
                  <li>Revenue impact of additional sales/marketing staff</li>
                  <li>R&D capacity and release timelines with different team sizes</li>
                  <li>Optimal hiring sequence across departments</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Communicating Model Insights</h3>
          <p class="mb-4">Effectively presenting the outputs of your financial model is crucial for influencing decisions:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Focus on Key Metrics:</strong> Highlight the most important outputs rather than overwhelming with data</li>
            <li><strong>Visual Presentation:</strong> Use charts and graphs to show trends and comparisons</li>
            <li><strong>Tell the Story:</strong> Explain what the numbers mean for the business, not just what they are</li>
            <li><strong>Address Assumptions:</strong> Be transparent about key assumptions and their rationale</li>
            <li><strong>Highlight Risks:</strong> Clearly communicate potential downside scenarios and mitigation strategies</li>
            <li><strong>Actionable Insights:</strong> Connect model outputs to specific recommendations</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Financial models are central to how the Sharks evaluate businesses on Shark Tank. Entrepreneurs who demonstrate mastery of their financial models gain credibility and often secure better deals.</p>
            <p class="mt-2">Daymond John frequently tests entrepreneurs on their unit economics, essentially probing their financial model's assumptions. Robert Herjavec often asks about cash flow projections to understand the sustainability of the business model.</p>
            <p class="mt-2">When a Shark says, "I'm going to make you an offer, but it's structured differently than what you asked for," they're typically adjusting the deal based on their own financial modeling of the business's risk and potential.</p>
          </div>
        `
      }
    ]
  },
  "gross-margin": {
    title: "Gross Margin",
    description: "Learn how to calculate and interpret gross margin, a key profitability metric that shows how efficiently a company converts sales into profit before operating expenses.",
    sections: [
      {
        title: "Understanding Gross Margin",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Gross Margin?</h2>
          <p class="mb-4">Gross margin (or gross profit margin) is the percentage of revenue that exceeds the cost of goods sold (COGS). It represents the profit a company makes after deducting the direct costs associated with producing its goods or services, but before accounting for overhead, payroll, taxes, and other operating expenses.</p>
          <p class="mb-6">Gross margin is one of the most fundamental metrics for evaluating a business's financial health and pricing strategy. A healthy gross margin ensures there's enough money left over to cover operating expenses and still generate a net profit.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Gross Margin Formula</h3>
          <div class="space-y-2 mb-6">
            <div class="bg-shark-50 p-3 rounded-md font-mono">
              <p>Gross Profit = Revenue - Cost of Goods Sold (COGS)</p>
            </div>
            <div class="bg-shark-50 p-3 rounded-md font-mono">
              <p>Gross Margin (%) = (Gross Profit ÷ Revenue) × 100</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">What's Included in COGS?</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>For Physical Products:</strong> Raw materials, direct labor, manufacturing overhead, packaging</li>
            <li><strong>For Services:</strong> Direct labor, subcontractor costs, materials used in service delivery</li>
            <li><strong>For Software:</strong> Server costs, support personnel, third-party licenses</li>
            <li><strong>For Retail:</strong> Wholesale cost of goods, freight-in, customs/duties</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>On Shark Tank, gross margin is one of the first metrics the Sharks ask about. When an entrepreneur says, "Our product costs $10 to make and sells for $30," the Sharks immediately know the gross margin is 67% ($20 profit on $30 revenue). A high gross margin gives Sharks confidence that the business can scale profitably and weather competitive pressures.</p>
          </div>
        `
      },
      {
        title: "Analyzing Gross Margin",
        content: `
          <h2 class="text-2xl font-bold mb-4">Analyzing Gross Margin</h2>
          <p class="mb-6">Gross margin varies widely by industry, so it's important to understand what constitutes a "good" margin in your specific business context. Here's how to analyze and interpret gross margin:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">Gross Margin by Industry (Examples)</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <h4 class="font-medium mb-1">High Margin (50%+)</h4>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                  <li>Software/SaaS: 70-90%</li>
                  <li>Luxury Goods: 60-80%</li>
                  <li>Pharmaceuticals: 70-90%</li>
                  <li>Fashion: 40-60%</li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium mb-1">Medium Margin (20-50%)</h4>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                  <li>Restaurants: 30-45%</li>
                  <li>Consumer Electronics: 20-40%</li>
                  <li>Furniture: 30-45%</li>
                  <li>Specialty Retail: 30-50%</li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-medium mb-1">Low Margin (<20%)</h4>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                  <li>Grocery Stores: 5-15%</li>
                  <li>Discount Retail: 10-15%</li>
                  <li>Auto Dealerships: 5-12%</li>
                  <li>Transportation: 5-15%</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Gross Margin Calculation Example</h3>
          <div class="border rounded-lg p-4 mb-6">
            <div class="space-y-3">
              <div>
                <p class="font-medium">Company Financial Data:</p>
                <ul class="list-none pl-4 space-y-1">
                  <li>Annual Revenue: $1,000,000</li>
                  <li>Cost of Goods Sold: $400,000</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">Step 1: Calculate Gross Profit</p>
                <p class="pl-4">Gross Profit = $1,000,000 - $400,000 = $600,000</p>
              </div>
              
              <div>
                <p class="font-medium">Step 2: Calculate Gross Margin</p>
                <p class="pl-4">Gross Margin = ($600,000 ÷ $1,000,000) × 100 = 60%</p>
              </div>
              
              <div>
                <p class="font-medium">Analysis:</p>
                <p class="pl-4">This company converts 60% of its sales revenue into gross profit, which is strong for most industries. If operating expenses are managed well, this should lead to healthy net profits.</p>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">What Gross Margin Tells You</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Pricing Power:</strong> High margins often indicate strong brand value or unique offerings</li>
            <li><strong>Production Efficiency:</strong> Improving margins over time may reflect better cost management</li>
            <li><strong>Competitive Position:</strong> Higher margins than competitors suggest a competitive advantage</li>
            <li><strong>Scalability:</strong> Businesses with high gross margins often scale more easily</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Track your gross margin over time and for each product line. Declining margins might indicate increasing competition, rising costs, or pricing pressure—all of which require strategic responses.</p>
          </div>
        `
      },
      {
        title: "Improving Gross Margin",
        content: `
          <h2 class="text-2xl font-bold mb-4">Improving Gross Margin</h2>
          <p class="mb-6">Enhancing your gross margin is one of the most effective ways to increase profitability. Even small improvements can significantly impact your bottom line. Here are strategies to consider:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Pricing Strategies</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Implement value-based pricing instead of cost-plus pricing</li>
                <li>Test price elasticity to find optimal price points</li>
                <li>Create premium versions or add-ons with higher margins</li>
                <li>Reduce discounting or make discounts more strategic</li>
                <li>Bundle high-margin products with lower-margin ones</li>
              </ul>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Cost Reduction</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Negotiate better terms with suppliers for volume discounts</li>
                <li>Optimize production processes to reduce waste</li>
                <li>Implement just-in-time inventory to reduce carrying costs</li>
                <li>Evaluate make-vs-buy decisions for components</li>
                <li>Redesign products to use less expensive materials without sacrificing quality</li>
              </ul>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Product Mix Optimization</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Promote higher-margin products more aggressively</li>
                <li>Consider phasing out lowest-margin products</li>
                <li>Train sales team to upsell higher-margin options</li>
                <li>Focus marketing budget on products with better margins</li>
              </ul>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Operational Efficiency</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li>Invest in automation to reduce labor costs</li>
                <li>Optimize supply chain and logistics</li>
                <li>Reduce defect rates and returns</li>
                <li>Implement economies of scale through higher volume</li>
              </ul>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">The Impact of Margin Improvements</h3>
          <div class="border rounded-lg p-4 mb-6">
            <p class="mb-3">Consider a company with:</p>
            <ul class="list-none pl-4 space-y-1 mb-4">
              <li>Revenue: $2,000,000</li>
              <li>COGS: $1,000,000</li>
              <li>Gross Profit: $1,000,000</li>
              <li>Gross Margin: 50%</li>
              <li>Operating Expenses: $800,000</li>
              <li>Net Profit: $200,000</li>
            </ul>
            
            <p class="mb-3">If they improve gross margin by just 5 percentage points to 55%:</p>
            <ul class="list-none pl-4 space-y-1 mb-4">
              <li>Revenue: $2,000,000</li>
              <li>COGS: $900,000 (reduced by $100,000)</li>
              <li>Gross Profit: $1,100,000</li>
              <li>Operating Expenses: $800,000 (unchanged)</li>
              <li>Net Profit: $300,000</li>
            </ul>
            
            <p class="font-medium">Result: A 5 percentage point improvement in gross margin increased net profit by 50%!</p>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Lori Greiner, known as the "Queen of QVC," often focuses on gross margins when evaluating products. She knows that retail partners will demand significant discounts, so she typically looks for products with at least 65-70% gross margins to ensure there's enough room for wholesale pricing while maintaining profitability.</p>
            <p class="mt-2">She once told an entrepreneur, "I need those margins to be higher if we're going to sell through retail channels. Can you get your manufacturing costs down?"</p>
          </div>
        `
      }
    ]
  },
  "inventory-management": {
    title: "Inventory Management",
    description: "Learn best practices for controlling inventory costs, optimizing stock levels, and improving cash flow in your business.",
    sections: [
      {
        title: "Inventory Management Basics",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Inventory Management?</h2>
          <p class="mb-4">Inventory management is the process of ordering, storing, tracking, and controlling inventory. Effective inventory management ensures your business has the right products in the right quantities at the right time while minimizing costs.</p>
          <p class="mb-6">Good inventory management is crucial for both product-based businesses and service businesses that maintain supplies. It directly impacts cash flow, customer satisfaction, and profitability.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Inventory Management Concepts</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Stock Levels:</strong> Minimum, maximum, and reorder points for each product</li>
            <li><strong>Lead Time:</strong> Time between ordering and receiving inventory</li>
            <li><strong>Safety Stock:</strong> Extra inventory kept to prevent stockouts</li>
            <li><strong>Carrying Costs:</strong> Expenses associated with holding inventory (storage, insurance, etc.)</li>
            <li><strong>Stockout Costs:</strong> Lost sales and damaged customer relationships from inventory shortages</li>
            <li><strong>Deadstock:</strong> Inventory that hasn't sold and likely won't sell</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>On Shark Tank, entrepreneurs are frequently asked about inventory management. Mark Cuban often inquires about inventory turnover and working capital requirements, while Lori Greiner wants to know about manufacturing lead times and minimum order quantities.</p>
            <p class="mt-2">In one memorable episode, an entrepreneur lost a deal because they had $500,000 tied up in slow-moving inventory, prompting Kevin O'Leary to say, "That's not a business, that's a warehouse!"</p>
          </div>
        `
      },
      {
        title: "Inventory Control Methods",
        content: `
          <h2 class="text-2xl font-bold mb-4">Inventory Control Methods</h2>
          <p class="mb-6">Several proven inventory control methods can help businesses maintain optimal inventory levels. The right approach depends on your business model, industry, and specific needs.</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Economic Order Quantity (EOQ)</h3>
              <p>A formula that calculates the ideal order quantity to minimize total inventory costs, including ordering and holding costs.</p>
              <div class="mt-3 p-2 bg-shark-50 rounded-md">
                <p class="text-sm font-medium">Formula:</p>
                <p class="font-mono">EOQ = √(2DS/H)</p>
                <p class="text-sm">Where: D = Annual demand, S = Order cost, H = Annual holding cost per unit</p>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Just-in-Time (JIT)</h3>
              <p>Receiving inventory only as needed for production or sales, minimizing storage costs and waste.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Benefits:</strong> Reduced holding costs, less warehouse space needed, fresher inventory
              </div>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Risks:</strong> Vulnerable to supply chain disruptions, requires reliable suppliers
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">ABC Analysis</h3>
              <p>Categorizing inventory items based on their value and importance:</p>
              <ul class="list-disc pl-6 space-y-1 text-sm mt-2">
                <li><strong>A Items:</strong> High-value items (70-80% of value, 10-20% of inventory)</li>
                <li><strong>B Items:</strong> Medium-value items (15-25% of value, 30% of inventory)</li>
                <li><strong>C Items:</strong> Low-value items (5% of value, 50-60% of inventory)</li>
              </ul>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Strategy:</strong> Focus most control efforts on "A" items
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">FIFO, LIFO, and Weighted Average</h3>
              <p>Methods for valuing inventory and determining cost of goods sold:</p>
              <ul class="list-disc pl-6 space-y-1 text-sm mt-2">
                <li><strong>FIFO (First In, First Out):</strong> Oldest inventory sold first</li>
                <li><strong>LIFO (Last In, First Out):</strong> Newest inventory sold first</li>
                <li><strong>Weighted Average:</strong> Average cost of all similar inventory items</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Don't apply the same inventory control method to all products. Use ABC analysis to identify your most valuable inventory, then apply more rigorous controls to those items while using simpler approaches for less valuable stock.</p>
          </div>
        `
      },
      {
        title: "Inventory Management Technology",
        content: `
          <h2 class="text-2xl font-bold mb-4">Inventory Management Technology</h2>
          <p class="mb-6">Modern technology has transformed inventory management, making it more accurate, efficient, and data-driven. These tools can help businesses of all sizes optimize their inventory processes.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Inventory Management Software</h4>
              <p class="mb-2">Dedicated systems for tracking inventory levels, orders, sales, and deliveries.</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Automatically calculate reorder points</li>
                <li>Generate purchase orders</li>
                <li>Track inventory across multiple locations</li>
                <li>Forecast demand based on sales history</li>
                <li>Integrate with accounting and e-commerce</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Barcode and RFID Systems</h4>
              <p class="mb-2">Technologies for quickly and accurately tracking inventory movement.</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Reduce human error in data entry</li>
                <li>Speed up receiving and shipping processes</li>
                <li>Enable real-time inventory visibility</li>
                <li>Improve accuracy of inventory counts</li>
                <li>Reduce labor costs for inventory handling</li>
              </ul>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Key Metrics to Track</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Inventory Turnover Ratio:</strong> How many times inventory is sold and replaced in a period
              <p class="text-sm ml-4">Formula: Cost of Goods Sold ÷ Average Inventory</p>
            </li>
            <li>
              <strong>Days of Inventory on Hand:</strong> Average number of days it takes to sell inventory
              <p class="text-sm ml-4">Formula: (Average Inventory ÷ Cost of Goods Sold) × 365</p>
            </li>
            <li>
              <strong>Stockout Rate:</strong> Percentage of time items are out of stock
              <p class="text-sm ml-4">Formula: (Number of Stockouts ÷ Total Number of Items) × 100</p>
            </li>
            <li>
              <strong>Carrying Cost:</strong> Total cost of holding inventory
              <p class="text-sm ml-4">Typically 15-30% of inventory value annually</p>
            </li>
            <li>
              <strong>Perfect Order Rate:</strong> Percentage of orders delivered on time, complete, and damage-free
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Daymond John, who built FUBU into a fashion empire, often emphasizes the importance of inventory management. In the fashion industry, having too much inventory of last season's styles can quickly erode profits, while stockouts of popular items mean missed sales opportunities.</p>
            <p class="mt-2">He frequently asks entrepreneurs, "What happens if this doesn't sell as quickly as you expect? How will you manage that inventory without draining your cash?"</p>
          </div>
        `
      }
    ]
  },
  "inventory-turnover": {
    title: "Inventory Turnover",
    description: "Measure how efficiently your business manages inventory by calculating how many times inventory is sold and replaced in a given period.",
    sections: [
      {
        title: "Understanding Inventory Turnover",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Inventory Turnover?</h2>
          <p class="mb-4">Inventory turnover is a financial ratio that measures how many times a company sells and replaces its inventory during a specific period, typically a year. It indicates how efficiently a business is managing its inventory and generating sales from its investment in goods.</p>
          <p class="mb-6">A high inventory turnover generally indicates efficient inventory management, strong sales, and good liquidity. A low turnover might suggest overstocking, obsolescence, or weak sales.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Inventory Turnover Formula</h3>
          <div class="bg-shark-50 p-3 rounded-md font-mono mb-2">
            <p>Inventory Turnover Ratio = Cost of Goods Sold ÷ Average Inventory</p>
          </div>
          <p class="mb-4 text-sm">Where Average Inventory = (Beginning Inventory + Ending Inventory) ÷ 2</p>
          
          <h3 class="text-xl font-semibold mb-3">Related Metric: Days Sales of Inventory (DSI)</h3>
          <p class="mb-2">Days Sales of Inventory (also called Days Inventory Outstanding) converts the inventory turnover ratio into the average number of days it takes to sell inventory.</p>
          <div class="bg-shark-50 p-3 rounded-md font-mono mb-6">
            <p>Days Sales of Inventory = 365 ÷ Inventory Turnover Ratio</p>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>When evaluating a retail business on Shark Tank, Robert Herjavec might ask about inventory turnover. If an entrepreneur reports an inventory turnover of 3 (meaning they sell through their inventory three times per year), Robert might point out that successful retailers often achieve turnover rates of 6-8, suggesting there's room for improvement in inventory management.</p>
          </div>
        `
      },
      {
        title: "Calculating and Interpreting Inventory Turnover",
        content: `
          <h2 class="text-2xl font-bold mb-4">Calculating and Interpreting Inventory Turnover</h2>
          <p class="mb-6">Let's walk through a practical example of calculating inventory turnover and understanding what the results mean for your business:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">Inventory Turnover Calculation Example</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium">Company Financial Data:</p>
                <ul class="list-none pl-4 space-y-1">
                  <li>Beginning Inventory (Jan 1): $250,000</li>
                  <li>Ending Inventory (Dec 31): $350,000</li>
                  <li>Cost of Goods Sold (Annual): $1,800,000</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">Step 1: Calculate Average Inventory</p>
                <p class="pl-4">Average Inventory = ($250,000 + $350,000) ÷ 2 = $300,000</p>
              </div>
              
              <div>
                <p class="font-medium">Step 2: Calculate Inventory Turnover Ratio</p>
                <p class="pl-4">Inventory Turnover = $1,800,000 ÷ $300,000 = 6</p>
              </div>
              
              <div>
                <p class="font-medium">Step 3: Calculate Days Sales of Inventory</p>
                <p class="pl-4">DSI = 365 ÷ 6 = 60.83 days</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <p>Interpretation: This company sells through its entire inventory 6 times per year, or roughly once every 61 days. Whether this is good or not depends on the industry.</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Benchmarking Inventory Turnover by Industry</h3>
          <p class="mb-4">Inventory turnover varies dramatically by industry. Here are some typical ranges:</p>
          
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm">
              <thead>
                <tr>
                  <th class="pr-4 text-left">Industry</th>
                  <th class="pr-4 text-left">Typical Inventory Turnover</th>
                  <th class="text-left">Typical DSI (Days)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Grocery/Supermarkets</td>
                  <td>12-18</td>
                  <td>20-30</td>
                </tr>
                <tr>
                  <td>Fashion Retail</td>
                  <td>4-6</td>
                  <td>60-90</td>
                </tr>
                <tr>
                  <td>Consumer Electronics</td>
                  <td>5-8</td>
                  <td>45-73</td>
                </tr>
                <tr>
                  <td>Furniture</td>
                  <td>3-5</td>
                  <td>73-122</td>
                </tr>
                <tr>
                  <td>Automotive Parts</td>
                  <td>2-4</td>
                  <td>91-183</td>
                </tr>
                <tr>
                  <td>Jewelry</td>
                  <td>1-2</td>
                  <td>183-365</td>
                </tr>
                <tr>
                  <td>Fast Food</td>
                  <td>20-40</td>
                  <td>9-18</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>When analyzing inventory turnover, don't just look at the aggregate number. Calculate it for different product categories or SKUs to identify which items are moving quickly and which are tying up capital with slow sales.</p>
          </div>
        `
      },
      {
        title: "Improving Inventory Turnover",
        content: `
          <h2 class="text-2xl font-bold mb-4">Improving Inventory Turnover</h2>
          <p class="mb-6">Improving inventory turnover can free up cash, reduce storage costs, and minimize the risk of obsolescence. Here are strategies to optimize your inventory turnover:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Improve Demand Forecasting</h3>
              <p>Use historical sales data, trend analysis, and seasonality factors to better predict future inventory needs.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Action item:</strong> Implement inventory forecasting software that considers multiple variables like seasonality, promotions, and market trends.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Implement Just-in-Time Inventory</h3>
              <p>Receive goods only as they are needed in the production process or for sales.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Example:</strong> A restaurant that receives fresh ingredients three times a week instead of stocking up for two weeks at once.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Optimize Product Mix</h3>
              <p>Identify and focus on fast-moving products while reducing investment in slow movers.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Strategy:</strong> Use ABC analysis to classify inventory and adjust stocking levels accordingly.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Establish Min-Max Inventory Levels</h3>
              <p>Set minimum and maximum inventory levels for each product to prevent both stockouts and overstocking.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Technique:</strong> Use reorder point formulas that account for lead time and safety stock requirements.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Clear Obsolete Inventory</h3>
              <p>Regularly identify and liquidate slow-moving, obsolete, or excess inventory.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Options:</strong> Clearance sales, bundle deals, return to vendors, or donate for tax benefits.
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Balancing Act: Turnover vs. Stockouts</h3>
          <p class="mb-4">While higher inventory turnover is generally better, pushing it too high can lead to stockouts and lost sales. The key is finding the optimal balance that maximizes cash flow without sacrificing customer satisfaction.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Signs of Too-Low Turnover</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Large amounts of capital tied up in inventory</li>
                <li>Increasing storage costs</li>
                <li>Product obsolescence or spoilage</li>
                <li>Significant discounting needed to move stock</li>
                <li>Cash flow constraints despite good sales</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Signs of Too-High Turnover</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Frequent stockouts of popular items</li>
                <li>Rush shipping costs for emergency orders</li>
                <li>Loss of bulk purchase discounts</li>
                <li>Decreased customer satisfaction</li>
                <li>Lost sales opportunities</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Barbara Corcoran often evaluates how entrepreneurs manage inventory cash flow. In one episode, she praised a founder who had negotiated 90-day payment terms with suppliers while turning inventory every 30 days, effectively allowing the business to grow using supplier financing rather than investor capital.</p>
            <p class="mt-2">She told them, "You've created a business that generates cash instead of consuming it. That's what makes you investable."</p>
          </div>
        `
      }
    ]
  },
  "market-research": {
    title: "Market Research",
    description: "Learn how to collect, analyze, and interpret information about your target market, competitors, and industry to make informed business decisions.",
    sections: [
      {
        title: "Market Research Fundamentals",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Market Research?</h2>
          <p class="mb-4">Market research is the process of gathering, analyzing, and interpreting information about a market, a product or service, and potential customers. It provides critical insights that help businesses identify opportunities, minimize risks, and make data-driven decisions.</p>
          <p class="mb-6">Effective market research answers key questions like: Who are my customers? What do they want? How much will they pay? Who are my competitors? How big is my market? How is the market evolving?</p>
          
          <h3 class="text-xl font-semibold mb-3">Types of Market Research</h3>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Primary Research</h4>
              <p class="mb-2">Original research you conduct yourself to gather new data.</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Customer surveys and questionnaires</li>
                <li>Focus groups and interviews</li>
                <li>Field trials and observations</li>
                <li>User testing</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Secondary Research</h4>
              <p class="mb-2">Using existing data collected by others.</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Industry reports and market studies</li>
                <li>Government data and statistics</li>
                <li>Trade association publications</li>
                <li>Competitor analysis and benchmarking</li>
              </ul>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Benefits of Market Research</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Reduces Business Risks:</strong> Testing ideas before full investment</li>
            <li><strong>Identifies Opportunities:</strong> Discovering unmet needs or emerging trends</li>
            <li><strong>Establishes Benchmarks:</strong> Setting realistic goals based on market standards</li>
            <li><strong>Solves Business Challenges:</strong> Diagnosing issues with marketing, products, or pricing</li>
            <li><strong>Enhances Communication:</strong> Understanding how to speak to target customers</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>On Shark Tank, entrepreneurs who can back up their business plans with solid market research typically fare better. When an entrepreneur says, "The market size is $1 billion," Sharks immediately ask, "How do you know that? What research supports your claim?"</p>
            <p class="mt-2">Those who respond with specific data from credible sources gain credibility, while those who admit they're just guessing often lose investor interest.</p>
          </div>
        `
      },
      {
        title: "Conducting Market Research",
        content: `
          <h2 class="text-2xl font-bold mb-4">Conducting Market Research</h2>
          <p class="mb-6">Whether you're launching a new business or expanding an existing one, following a structured approach to market research will yield more reliable insights.</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 1: Define Your Research Objectives</h3>
              <p>Start by clearly articulating what you want to learn and why.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Example questions:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Is there demand for my product/service?</li>
                  <li>Who are my ideal customers and what motivates them?</li>
                  <li>What pricing strategy will optimize sales and profits?</li>
                  <li>How does my offering compare to competitors?</li>
                  <li>What marketing messages resonate with my target audience?</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 2: Identify Your Target Market</h3>
              <p>Define the specific segment of the market you want to research.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Consider factors like:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Demographics: Age, gender, income, education, location</li>
                  <li>Psychographics: Values, interests, lifestyle, attitudes</li>
                  <li>Behavior: Purchasing habits, brand loyalty, usage patterns</li>
                  <li>Needs and pain points: Problems they're trying to solve</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 3: Choose Your Research Methods</h3>
              <p>Select techniques that align with your objectives, timeline, and budget.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Quantitative methods</strong> (for numerical data):
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Online surveys</li>
                  <li>Phone questionnaires</li>
                  <li>Website analytics</li>
                </ul>
                
                <strong>Qualitative methods</strong> (for insights and opinions):
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Focus groups</li>
                  <li>In-depth interviews</li>
                  <li>Observation studies</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 4: Collect and Analyze Data</h3>
              <p>Gather information systematically and look for patterns, trends, and insights.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Tips:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Use a mix of methods for more comprehensive results</li>
                  <li>Ensure sample sizes are adequate for reliable conclusions</li>
                  <li>Look for both statistical significance and practical relevance</li>
                  <li>Consider segmenting data to find patterns within subgroups</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 5: Draw Conclusions and Take Action</h3>
              <p>Transform insights into strategic decisions and concrete plans.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Applications:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Refine your product or service offering</li>
                  <li>Adjust pricing strategy</li>
                  <li>Target marketing efforts more effectively</li>
                  <li>Prioritize features or benefits in messaging</li>
                  <li>Identify new market opportunities</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>For startups with limited budgets, consider these cost-effective research approaches:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Use Google Trends to analyze search volumes and patterns</li>
              <li>Conduct competitor analysis by reviewing their websites, pricing, and customer reviews</li>
              <li>Create landing pages to test interest in concepts before building them</li>
              <li>Join relevant social media groups to observe discussions and pain points</li>
              <li>Offer pre-sales to gauge willingness to pay</li>
            </ul>
          </div>
        `
      },
      {
        title: "Competitive Analysis",
        content: `
          <h2 class="text-2xl font-bold mb-4">Competitive Analysis</h2>
          <p class="mb-6">A thorough competitive analysis helps you understand your market position, identify opportunities, and develop strategies to differentiate your business. Here's how to conduct an effective analysis of your competition:</p>
          
          <div class="border rounded-lg overflow-hidden mb-6">
            <div class="bg-shark-100 p-3">
              <h3 class="font-semibold">Competitive Analysis Framework</h3>
            </div>
            <div class="p-4">
              <h4 class="font-medium mb-2">1. Identify Your Competitors</h4>
              <ul class="list-disc pl-6 mb-4 space-y-1 text-sm">
                <li><strong>Direct competitors:</strong> Offer similar products/services to the same target market</li>
                <li><strong>Indirect competitors:</strong> Solve the same customer problem differently</li>
                <li><strong>Potential competitors:</strong> Could enter your market in the future</li>
              </ul>
              
              <h4 class="font-medium mb-2">2. Analyze Competitor Offerings</h4>
              <ul class="list-disc pl-6 mb-4 space-y-1 text-sm">
                <li>Product/service features and benefits</li>
                <li>Quality level and positioning</li>
                <li>Pricing strategies and models</li>
                <li>Unique selling propositions (USPs)</li>
                <li>Target customer segments</li>
              </ul>
              
              <h4 class="font-medium mb-2">3. Evaluate Market Presence</h4>
              <ul class="list-disc pl-6 mb-4 space-y-1 text-sm">
                <li>Market share and growth trajectory</li>
                <li>Brand reputation and customer loyalty</li>
                <li>Marketing strategies and messaging</li>
                <li>Distribution channels and partnerships</li>
                <li>Online presence and digital strategy</li>
              </ul>
              
              <h4 class="font-medium mb-2">4. Assess Strengths and Weaknesses</h4>
              <ul class="list-disc pl-6 mb-4 space-y-1 text-sm">
                <li>What do they do exceptionally well?</li>
                <li>Where are they vulnerable or underperforming?</li>
                <li>What resources or capabilities do they have?</li>
                <li>How do customers review or rate them?</li>
                <li>What are their limitations or constraints?</li>
              </ul>
              
              <h4 class="font-medium mb-2">5. Identify Your Competitive Advantage</h4>
              <ul class="list-disc pl-6 space-y-1 text-sm">
                <li>How can you differentiate from competitors?</li>
                <li>What unique value can you offer customers?</li>
                <li>Which competitor weaknesses can you address?</li>
                <li>What market segments are underserved?</li>
              </ul>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Competitive Analysis Tools</h3>
          <div class="mb-6">
            <h4 class="font-medium mb-2">SWOT Analysis</h4>
            <p class="mb-2">Examining Strengths, Weaknesses, Opportunities, and Threats for your business and competitors.</p>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-green-50 p-3 rounded">
                <p class="font-medium text-green-700">Strengths</p>
                <p class="text-sm">Internal factors giving you advantage</p>
              </div>
              <div class="bg-red-50 p-3 rounded">
                <p class="font-medium text-red-700">Weaknesses</p>
                <p class="text-sm">Internal factors putting you at disadvantage</p>
              </div>
              <div class="bg-blue-50 p-3 rounded">
                <p class="font-medium text-blue-700">Opportunities</p>
                <p class="text-sm">External factors you could leverage</p>
              </div>
              <div class="bg-orange-50 p-3 rounded">
                <p class="font-medium text-orange-700">Threats</p>
                <p class="text-sm">External factors that could cause problems</p>
              </div>
            </div>
            
            <h4 class="font-medium mb-2">Competitive Positioning Map</h4>
            <p class="mb-2">A visual tool plotting competitors along two key dimensions (e.g., price vs. quality) to identify gaps in the market.</p>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Mark Cuban often challenges entrepreneurs on their competitive awareness. In one memorable episode, he declined to invest in a business because the founder couldn't articulate how their product was differentiated from competitors'.</p>
            <p class="mt-2">Cuban said, "The biggest red flag is that you don't know your competition. If you don't know who you're up against, how can you possibly win?"</p>
          </div>
        `
      }
    ]
  },
  "npv": {
    title: "Net Present Value (NPV)",
    description: "Understand how to calculate the current value of future cash flows to make sound investment decisions for your business.",
    sections: [
      {
        title: "What is Net Present Value?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Net Present Value?</h2>
          <p class="mb-4">Net Present Value (NPV) is a financial metric that calculates the current value of all future cash flows expected from an investment or project, minus the initial investment. It accounts for the time value of money, recognizing that a dollar today is worth more than a dollar in the future due to its potential earning capacity.</p>
          <p class="mb-6">NPV is a powerful decision-making tool that helps businesses determine whether a project or investment will add value. A positive NPV indicates a potentially profitable investment, while a negative NPV suggests the investment may result in a net loss.</p>
          
          <h3 class="text-xl font-semibold mb-3">The NPV Formula</h3>
          <div class="bg-shark-50 p-3 rounded-md font-mono mb-4">
            <p>NPV = Initial Investment + Σ (Cash Flow_t / (1 + r)^t)</p>
          </div>
          <p class="mb-6 text-sm">Where:<br>
          • Initial Investment is a negative number (cash outflow)<br>
          • Cash Flow_t is the net cash flow during period t<br>
          • r is the discount rate (often the company's cost of capital)<br>
          • t is the time period</p>
          
          <h3 class="text-xl font-semibold mb-3">Why NPV Matters</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Time Value of Money:</strong> Accounts for the fact that money received in the future is worth less than money received today</li>
            <li><strong>Investment Comparison:</strong> Provides a standardized way to compare different investment opportunities</li>
            <li><strong>Risk Assessment:</strong> Incorporates risk through the discount rate</li>
            <li><strong>Shareholder Value:</strong> Helps determine if an investment will increase company value</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>When entrepreneurs present their businesses on Shark Tank, the Sharks are implicitly calculating NPV. They weigh the amount they're investing today against the future returns they expect to receive, discounted for risk and time.</p>
            <p class="mt-2">Kevin O'Leary, in particular, often discusses the "present value of future cash flows" when evaluating whether a company's valuation makes sense.</p>
          </div>
        `
      },
      {
        title: "Calculating NPV",
        content: `
          <h2 class="text-2xl font-bold mb-4">Calculating NPV</h2>
          <p class="mb-6">Let's walk through a practical example of calculating the Net Present Value of a business investment:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">NPV Calculation Example</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium">Scenario:</p>
                <p>A small business is considering purchasing a new piece of equipment for $50,000. The equipment is expected to generate the following cash flows:</p>
                <ul class="list-none pl-4 space-y-1 mt-2">
                  <li>Year 1: $15,000</li>
                  <li>Year 2: $20,000</li>
                  <li>Year 3: $25,000</li>
                  <li>Year 4: $15,000</li>
                  <li>Year 5: $10,000</li>
                </ul>
                <p class="mt-2">The business has a cost of capital (discount rate) of 10%.</p>
              </div>
              
              <div>
                <p class="font-medium">Step 1: Calculate the Present Value of Each Cash Flow</p>
                <ul class="list-none pl-4 space-y-1">
                  <li>Year 1: $15,000 ÷ (1 + 0.10)^1 = $13,636</li>
                  <li>Year 2: $20,000 ÷ (1 + 0.10)^2 = $16,529</li>
                  <li>Year 3: $25,000 ÷ (1 + 0.10)^3 = $18,783</li>
                  <li>Year 4: $15,000 ÷ (1 + 0.10)^4 = $10,245</li>
                  <li>Year 5: $10,000 ÷ (1 + 0.10)^5 = $6,209</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">Step 2: Calculate the Sum of Present Values</p>
                <p class="pl-4">$13,636 + $16,529 + $18,783 + $10,245 + $6,209 = $65,402</p>
              </div>
              
              <div>
                <p class="font-medium">Step 3: Calculate NPV by Subtracting Initial Investment</p>
                <p class="pl-4">$65,402 - $50,000 = $15,402</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <p class="font-medium">Conclusion:</p>
              <p>The NPV of this investment is positive at $15,402, which suggests the investment is likely to add value to the business and should be accepted.</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">NPV Decision Rules</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>NPV > 0:</strong> The investment is expected to add value; accept the project</li>
            <li><strong>NPV = 0:</strong> The investment is expected to break even; neutral stance</li>
            <li><strong>NPV < 0:</strong> The investment is expected to lose value; reject the project</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>When comparing multiple projects with positive NPVs, generally choose the one with the highest NPV. However, also consider non-financial factors and resource constraints that might affect implementation.</p>
          </div>
        `
      },
      {
        title: "NPV in Business Decisions",
        content: `
          <h2 class="text-2xl font-bold mb-4">NPV in Business Decisions</h2>
          <p class="mb-6">Net Present Value is a versatile tool that can be applied to various business decisions beyond simple equipment purchases. Here's how NPV can guide different types of business decisions:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">New Product Development</h3>
              <p>Calculate whether the expected future revenues from a new product line will justify the research, development, and marketing costs.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Consideration:</strong> Include all costs (development, production, marketing) and be realistic about revenue projections and time to market.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Business Expansion</h3>
              <p>Evaluate whether opening a new location or entering a new market will create shareholder value.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Consideration:</strong> Factor in the time it takes for new locations to reach maturity and profitability, which often takes longer than anticipated.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Lease vs. Buy Decisions</h3>
              <p>Determine whether it's more financially beneficial to lease or purchase assets like equipment, vehicles, or real estate.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Consideration:</strong> Include tax implications, maintenance costs, and residual value in the analysis.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Company Valuation</h3>
              <p>Estimate the value of an entire business by discounting its projected future cash flows.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Consideration:</strong> This is the discounted cash flow (DCF) method, which requires careful forecasting of future revenue, expenses, and appropriate terminal value.
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Limitations of NPV</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Cash Flow Projections:</strong> NPV is only as good as the accuracy of your future cash flow estimates</li>
            <li><strong>Discount Rate Selection:</strong> The choice of discount rate significantly affects the calculation</li>
            <li><strong>Inflexibility:</strong> Standard NPV doesn't account for management's ability to adapt to changing conditions</li>
            <li><strong>Non-Financial Factors:</strong> NPV doesn't capture strategic benefits, competitive advantages, or other qualitative factors</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-3">NPV vs. IRR</h3>
          <p class="mb-4">Internal Rate of Return (IRR) is a related metric that calculates the discount rate at which the NPV equals zero. While IRR is useful, NPV is generally preferred for decision-making because:</p>
          <ul class="list-disc pl-6 mb-6 space-y-1">
            <li>NPV assumes reinvestment at the cost of capital (more realistic)</li>
            <li>NPV provides an actual dollar value of wealth created, not just a percentage</li>
            <li>NPV avoids the mathematical issues that can arise with IRR calculations</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>When an entrepreneur on Shark Tank asks for $300,000 for 10% of their business (implying a $3 million valuation), the Sharks immediately evaluate whether the present value of future cash flows justifies that price tag.</p>
            <p class="mt-2">Mark Cuban often pushes entrepreneurs to explain exactly how his investment will generate returns that exceed what he could get elsewhere with similar risk. In essence, he's asking if the NPV of investing in their business is positive compared to his alternative investment opportunities.</p>
          </div>
        `
      }
    ]
  },
  "operating-margin": {
    title: "Operating Margin",
    description: "Understand how to calculate and improve your company's operating profitability as a percentage of revenue.",
    sections: [
      {
        title: "What is Operating Margin?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Operating Margin?</h2>
          <p class="mb-4">Operating margin (also called operating profit margin) measures how much profit a company makes from its core business operations per dollar of sales, before accounting for interest and taxes. It's calculated by dividing operating income by total revenue and expressing the result as a percentage.</p>
          <p class="mb-6">Operating margin is a key indicator of a company's operational efficiency and pricing strategy. It reveals how well a business converts sales into profits from its core activities, irrespective of its capital structure (debt levels) or tax situation.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Operating Margin Formula</h3>
          <div class="bg-shark-50 p-3 rounded-md font-mono mb-2">
            <p>Operating Margin = (Operating Income ÷ Revenue) × 100%</p>
          </div>
          <p class="mb-4 text-sm">Where:<br>
          • Operating Income = Revenue - Cost of Goods Sold - Operating Expenses</p>
          
          <h3 class="text-xl font-semibold mb-3">Components of Operating Margin</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Revenue:</strong> Total income generated from sales of goods or services</li>
            <li><strong>Cost of Goods Sold (COGS):</strong> Direct costs associated with producing goods or services sold</li>
            <li><strong>Operating Expenses:</strong> Costs related to running the business, including:
              <ul class="list-disc pl-6 mt-1 text-sm">
                <li>Selling expenses (sales salaries, commissions, advertising)</li>
                <li>General and administrative expenses (office rent, utilities, admin salaries)</li>
                <li>Research and development expenses</li>
                <li>Depreciation and amortization</li>
              </ul>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>When entrepreneurs present their businesses on Shark Tank, operating margin is one of the key metrics the Sharks use to evaluate profitability. If a business has $1 million in revenue but only $100,000 in operating income, the operating margin is 10%.</p>
            <p class="mt-2">Sharks like Kevin O'Leary often compare this to industry standards to determine if the business is performing efficiently. If competitors average 20% margins, the Sharks will want to understand why the entrepreneur's business is underperforming.</p>
          </div>
        `
      },
      {
        title: "Calculating and Interpreting Operating Margin",
        content: `
          <h2 class="text-2xl font-bold mb-4">Calculating and Interpreting Operating Margin</h2>
          <p class="mb-6">Let's walk through a practical example of calculating operating margin and understanding what it reveals about a business:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h3 class="text-xl font-semibold mb-3">Operating Margin Calculation Example</h3>
            <div class="space-y-4">
              <div>
                <p class="font-medium">Company Financial Data:</p>
                <ul class="list-none pl-4 space-y-1">
                  <li>Revenue: $1,000,000</li>
                  <li>Cost of Goods Sold: $600,000</li>
                  <li>Gross Profit: $400,000</li>
                  <li>Operating Expenses: $250,000</li>
                </ul>
              </div>
              
              <div>
                <p class="font-medium">Step 1: Calculate Operating Income</p>
                <p class="pl-4">Operating Income = Gross Profit - Operating Expenses</p>
                <p class="pl-4">Operating Income = $400,000 - $250,000 = $150,000</p>
              </div>
              
              <div>
                <p class="font-medium">Step 2: Calculate Operating Margin</p>
                <p class="pl-4">Operating Margin = (Operating Income ÷ Revenue) × 100%</p>
                <p class="pl-4">Operating Margin = ($150,000 ÷ $1,000,000) × 100% = 15%</p>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t">
              <p class="font-medium">Interpretation:</p>
              <p>This company keeps $0.15 of every dollar in sales as operating profit, before considering interest and taxes. Whether this is good depends on the industry benchmarks and the company's historical performance.</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Operating Margin Benchmarks by Industry</h3>
          <p class="mb-4">Operating margins vary widely across industries due to differences in business models, capital intensity, and competitive landscapes:</p>
          
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-sm">
              <thead>
                <tr>
                  <th class="pr-4 text-left">Industry</th>
                  <th class="text-left">Typical Operating Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software/SaaS</td>
                  <td>20-30%</td>
                </tr>
                <tr>
                  <td>Pharmaceuticals</td>
                  <td>15-25%</td>
                </tr>
                <tr>
                  <td>Luxury Goods</td>
                  <td>15-20%</td>
                </tr>
                <tr>
                  <td>Consumer Electronics</td>
                  <td>10-15%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>8-12%</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>3-8%</td>
                </tr>
                <tr>
                  <td>Airlines</td>
                  <td>5-10%</td>
                </tr>
                <tr>
                  <td>Grocery Stores</td>
                  <td>1-3%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">What Operating Margin Reveals</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Operational Efficiency:</strong> How well the company controls production and operating costs</li>
            <li><strong>Pricing Power:</strong> Ability to charge premium prices relative to costs</li>
            <li><strong>Competitive Position:</strong> Higher margins may indicate competitive advantages</li>
            <li><strong>Management Effectiveness:</strong> Reflects leadership's ability to generate profit from operations</li>
            <li><strong>Scalability:</strong> Improving margins with growing revenue suggests scalable operations</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Always analyze operating margin trends over time, not just a single period. An improving operating margin is often more significant than a high but stagnant or declining margin.</p>
          </div>
        `
      },
      {
        title: "Improving Operating Margin",
        content: `
          <h2 class="text-2xl font-bold mb-4">Improving Operating Margin</h2>
          <p class="mb-6">Enhancing operating margin is a key objective for businesses looking to increase profitability. Here are strategic approaches to improve your operating margin:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Revenue Enhancement Strategies</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Optimize Pricing:</strong> Test price elasticity and implement value-based pricing</li>
                <li><strong>Product Mix Shift:</strong> Focus marketing and sales efforts on higher-margin products</li>
                <li><strong>Cross-selling and Upselling:</strong> Increase average transaction value</li>
                <li><strong>New Revenue Streams:</strong> Introduce complementary products or services</li>
                <li><strong>Customer Targeting:</strong> Focus on customer segments with higher profit potential</li>
              </ul>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Cost of Goods Sold Reduction</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Supplier Negotiation:</strong> Secure better pricing through volume commitments or longer contracts</li>
                <li><strong>Material Optimization:</strong> Reduce waste and improve yields</li>
                <li><strong>Process Improvement:</strong> Streamline production for greater efficiency</li>
                <li><strong>Automation:</strong> Reduce labor costs through appropriate technology</li>
                <li><strong>Make vs. Buy Analysis:</strong> Determine if in-house production is more cost-effective</li>
              </ul>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Operating Expense Management</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Overhead Review:</strong> Eliminate unnecessary expenses and renegotiate fixed costs</li>
                <li><strong>Marketing Efficiency:</strong> Focus on channels with highest ROI</li>
                <li><strong>Technology Adoption:</strong> Implement systems that improve operational efficiency</li>
                <li><strong>Remote Work:</strong> Reduce office space costs where appropriate</li>
                <li><strong>Outsourcing:</strong> Consider outsourcing non-core functions</li>
              </ul>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Economies of Scale</h3>
              <ul class="list-disc pl-6 space-y-1">
                <li><strong>Volume Purchasing:</strong> Secure better unit costs through higher volumes</li>
                <li><strong>Fixed Cost Absorption:</strong> Spread fixed costs over larger revenue base</li>
                <li><strong>Specialization:</strong> Allow employees to focus on specific functions for greater efficiency</li>
                <li><strong>Learning Curve Benefits:</strong> Improve efficiency through experience and best practices</li>
              </ul>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">The Impact of Margin Improvements</h3>
          <div class="border rounded-lg p-4 mb-6">
            <p class="mb-3">Consider a company with:</p>
            <ul class="list-none pl-4 space-y-1 mb-4">
              <li>Revenue: $5,000,000</li>
              <li>Operating Income: $500,000</li>
              <li>Operating Margin: 10%</li>
            </ul>
            
            <p class="mb-3">If they improve operating margin by just 2 percentage points to 12%:</p>
            <ul class="list-none pl-4 space-y-1 mb-4">
              <li>Revenue: $5,000,000 (unchanged)</li>
              <li>Operating Income: $600,000 (increased by $100,000)</li>
              <li>Operating Margin: 12%</li>
            </ul>
            
            <p class="font-medium">Result: A 2 percentage point improvement in operating margin increased operating profit by 20%!</p>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, entrepreneurs who demonstrate a clear path to improving operating margins often receive more favorable investment terms. When Daymond John asks, "How will you use my investment?" savvy entrepreneurs respond with specific strategies to enhance margins, such as automating production, negotiating better supplier terms with increased order volumes, or developing higher-margin product lines.</p>
            <p class="mt-2">This approach shows the Sharks that the entrepreneur understands the levers that drive profitability and has a plan to increase the return on investment.</p>
          </div>
        `
      }
    ]
  },
  "pitch-basics": {
    title: "Pitch Basics",
    description: "Master the fundamentals of creating and delivering compelling business pitches to investors, customers, and partners.",
    sections: [
      {
        title: "Pitch Fundamentals",
        content: `
          <h2 class="text-2xl font-bold mb-4">What Makes a Great Pitch?</h2>
          <p class="mb-4">A business pitch is a brief presentation that provides an overview of your business, product, or idea, designed to persuade the audience to take a specific action—whether that's investing, purchasing, or forming a partnership. A great pitch combines clear communication, compelling storytelling, and convincing data to create a memorable and persuasive argument.</p>
          <p class="mb-6">Whether you're seeking investment, selling to customers, or pitching partnerships, mastering the art of the pitch is essential for business success.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Elements of a Successful Pitch</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Clear Value Proposition:</strong> A concise explanation of how your product or service solves a problem</li>
            <li><strong>Target Market Definition:</strong> Specific description of who your customers are and the size of the opportunity</li>
            <li><strong>Business Model:</strong> Explanation of how you make money</li>
            <li><strong>Competitive Advantage:</strong> What makes your solution unique or better than alternatives</li>
            <li><strong>Traction and Milestones:</strong> Evidence of progress and validation</li>
            <li><strong>Team Credentials:</strong> Why you and your team are the right people to execute the vision</li>
            <li><strong>Clear Ask:</strong> Specific request for investment, partnership, or action</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>The most successful pitches on Shark Tank quickly hook the Sharks with a clear problem statement, followed by a compelling demonstration of the solution. They include key metrics that matter to investors—market size, margins, customer acquisition costs, and current sales—and clearly articulate why their product will succeed against competition.</p>
            <p class="mt-2">As Kevin O'Leary often says, "The best pitches tell me how I'm going to make money and when I'll get my investment back."</p>
          </div>
        `
      },
      {
        title: "Crafting Your Pitch",
        content: `
          <h2 class="text-2xl font-bold mb-4">Crafting Your Pitch</h2>
          <p class="mb-6">Different situations call for different types of pitches. Here's how to structure your pitch based on the context and time available:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">The Elevator Pitch (30 seconds)</h3>
              <p>A concise overview that can be delivered in the time span of an elevator ride.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Structure:</strong>
                <ol class="list-decimal pl-6 space-y-1 mt-1">
                  <li>Problem statement (1 sentence)</li>
                  <li>Your solution (1-2 sentences)</li>
                  <li>Unique value proposition (1 sentence)</li>
                  <li>Call to action (1 sentence)</li>
                </ol>
              </div>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Example:</strong> "40% of food in America is wasted, costing families $1,500 annually. Our app connects consumers with grocery stores to purchase near-expiration food at steep discounts. Unlike coupon apps, we reduce food waste while saving consumers money and helping stores recover costs. I'd love to show you our latest data on user growth."
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">The Pitch Deck (5-10 minutes)</h3>
              <p>A presentation of 10-15 slides covering all aspects of your business, suitable for investor meetings.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Key slides to include:</strong>
                <ol class="list-decimal pl-6 space-y-1 mt-1">
                  <li>Problem/Opportunity</li>
                  <li>Solution</li>
                  <li>Market Size & Target Customer</li>
                  <li>Business Model</li>
                  <li>Technology/Product</li>
                  <li>Competitive Landscape</li>
                  <li>Traction & Milestones</li>
                  <li>Marketing & Growth Strategy</li>
                  <li>Team</li>
                  <li>Financials (current & projections)</li>
                  <li>Funding Ask & Use of Funds</li>
                </ol>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">The Sales Pitch (2-3 minutes)</h3>
              <p>A customer-focused presentation emphasizing benefits and value of your product or service.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Structure:</strong>
                <ol class="list-decimal pl-6 space-y-1 mt-1">
                  <li>Build rapport</li>
                  <li>Identify pain points/needs</li>
                  <li>Present solution with emphasis on benefits</li>
                  <li>Provide evidence (testimonials, data)</li>
                  <li>Handle objections</li>
                  <li>Clear next steps</li>
                </ol>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Pitch Don'ts</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Don't be vague</strong> about your business model or market opportunity</li>
            <li><strong>Don't use excessive jargon</strong> or technical language unless your audience is specialized</li>
            <li><strong>Don't exaggerate</strong> claims or market size without supporting data</li>
            <li><strong>Don't ignore competition</strong> or claim you have none</li>
            <li><strong>Don't present unrealistic financial projections</strong> that you can't defend</li>
            <li><strong>Don't focus only on features</strong> rather than benefits and outcomes</li>
            <li><strong>Don't exceed your allotted time</strong> without reading audience cues</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Pro Tip</h4>
            <p>Tailor your pitch to your specific audience. Investors want to hear about return on investment, customers care about benefits and value, while potential partners are interested in synergies and mutual growth opportunities.</p>
          </div>
        `
      },
      {
        title: "Delivering Your Pitch",
        content: `
          <h2 class="text-2xl font-bold mb-4">Delivering Your Pitch</h2>
          <p class="mb-6">Even the best-crafted pitch can fall flat without effective delivery. Here's how to present your pitch with confidence and impact:</p>
          
          <div class="border rounded-lg overflow-hidden mb-6">
            <div class="bg-shark-100 p-3">
              <h3 class="font-semibold">Pitch Delivery Best Practices</h3>
            </div>
            <div class="p-4 grid gap-4 md:grid-cols-2">
              <div>
                <h4 class="font-medium mb-1">Body Language</h4>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                  <li>Stand tall with shoulders back</li>
                  <li>Make consistent eye contact</li>
                  <li>Use open, deliberate gestures</li>
                  <li>Move with purpose, avoid fidgeting</li>
                  <li>Smile genuinely when appropriate</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-1">Voice and Speech</h4>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Vary tone and volume for emphasis</li>
                  <li>Pause after key points for impact</li>
                  <li>Eliminate filler words (um, uh, like)</li>
                  <li>Project enthusiasm and confidence</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-1">Visual Aids</h4>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                  <li>Keep slides simple and uncluttered</li>
                  <li>Use high-quality images and graphics</li>
                  <li>Incorporate compelling data visualizations</li>
                  <li>Ensure text is readable from a distance</li>
                  <li>Don't read directly from slides</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-1">Engagement Techniques</h4>
                <ul class="list-disc pl-5 space-y-1 text-sm">
                  <li>Start with a hook or attention-grabber</li>
                  <li>Tell relevant stories or anecdotes</li>
                  <li>Use product demonstrations when possible</li>
                  <li>Incorporate audience participation</li>
                  <li>End with a clear, compelling call to action</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Handling Questions and Objections</h3>
          <p class="mb-4">The Q&A portion often determines the success of your pitch. Here's how to handle it effectively:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Anticipate questions</strong> and prepare thorough answers in advance</li>
            <li><strong>Listen fully</strong> to each question before responding</li>
            <li><strong>Keep answers concise</strong> and directly address the question asked</li>
            <li><strong>View objections as opportunities</strong> to provide clarification</li>
            <li><strong>Be honest</strong> if you don't know an answer, but offer to follow up</li>
            <li><strong>Stay calm and positive</strong>, even with challenging questions</li>
            <li><strong>Have backup slides or data</strong> ready for common questions</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-3">Practice Makes Perfect</h3>
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <p class="mb-2">Effective practice strategies for your pitch:</p>
            <ul class="list-disc pl-6 space-y-1">
              <li>Record yourself and review your performance</li>
              <li>Practice in front of friends or colleagues who will give honest feedback</li>
              <li>Rehearse answers to difficult questions</li>
              <li>Time your delivery to ensure you stay within limits</li>
              <li>Practice in conditions similar to the actual pitch environment</li>
              <li>Memorize key data points and your opening/closing statements</li>
            </ul>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>The most memorable Shark Tank pitches combine solid business fundamentals with authentic passion and personality. Entrepreneurs who genuinely believe in their products and can clearly articulate why they matter often receive offers even when their businesses have challenges.</p>
            <p class="mt-2">As Lori Greiner says, "Entrepreneurs are the only people who will work 80 hours a week to avoid working 40 hours a week." Let your genuine enthusiasm and commitment shine through in your pitch.</p>
          </div>
        `
      }
    ]
  },
  "profit-loss": {
    title: "Profit and Loss Statement",
    description: "Learn how to read, analyze, and create a profit and loss statement (income statement) to understand your business's financial performance over a specific period.",
    sections: [
      {
        title: "What is a Profit and Loss Statement?",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is a Profit and Loss Statement?</h2>
          <p class="mb-4">A Profit and Loss (P&L) statement, also called an income statement, is a financial document that summarizes the revenues, costs, and expenses incurred during a specific period. It provides a clear picture of whether a company is generating profit or operating at a loss by showing the relationship between what a business earns and what it spends.</p>
          <p class="mb-6">P&L statements are typically prepared monthly, quarterly, and annually, allowing business owners and investors to track financial performance over time and make informed decisions about operations, investments, and strategy.</p>
          
          <h3 class="text-xl font-semibold mb-3">Key Components of a P&L Statement</h3>
          <div class="space-y-4 mb-6">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Revenue</h4>
              <p class="text-sm">The total income generated from selling products or services before any expenses are deducted.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>May include:</strong> Gross sales, less returns and allowances, service fees, subscription revenue, etc.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Cost of Goods Sold (COGS)</h4>
              <p class="text-sm">The direct costs attributable to the production of goods or services sold.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>May include:</strong> Materials, direct labor, manufacturing overhead, shipping costs, etc.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Gross Profit</h4>
              <p class="text-sm">Revenue minus COGS, representing the profit from core business operations.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Formula:</strong> Revenue - COGS = Gross Profit
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Operating Expenses</h4>
              <p class="text-sm">Costs incurred through normal business operations that aren't directly tied to production.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>May include:</strong> Rent, utilities, salaries, marketing, research and development, etc.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Operating Income</h4>
              <p class="text-sm">Gross profit minus operating expenses, showing profit from core operations.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Formula:</strong> Gross Profit - Operating Expenses = Operating Income
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Other Income/Expenses</h4>
              <p class="text-sm">Income or expenses not related to the main operations of the business.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>May include:</strong> Interest income/expense, gains/losses on asset sales, one-time expenses, etc.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Net Income (Net Profit)</h4>
              <p class="text-sm">The "bottom line" showing total profit or loss after all revenues and expenses.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Formula:</strong> Operating Income + Other Income - Other Expenses - Taxes = Net Income
              </div>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">The P&L Equation</h4>
            <p>The basic structure of a P&L statement follows this progression:</p>
            <div class="font-mono text-center my-2 text-sm">
              Revenue - COGS = Gross Profit<br>
              Gross Profit - Operating Expenses = Operating Income<br>
              Operating Income + Other Income - Other Expenses - Taxes = Net Income
            </div>
          </div>
        `
      },
      {
        title: "Reading and Analyzing a P&L",
        content: `
          <h2 class="text-2xl font-bold mb-4">Reading and Analyzing a P&L Statement</h2>
          <p class="mb-6">A P&L statement tells the story of your business's financial performance. Learning to read and analyze it effectively helps you identify strengths, weaknesses, and opportunities for improvement.</p>
          
          <h3 class="text-xl font-semibold mb-3">Sample P&L Statement</h3>
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">ABC Company - Profit and Loss Statement</h4>
            <p class="mb-2 italic">For the Quarter Ending March 31, 2025</p>
            
            <table class="min-w-full text-sm">
              <tbody>
                <tr class="border-b">
                  <td class="py-2 font-medium">Revenue</td>
                  <td class="text-right">$250,000</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pl-4">Less: Returns and Allowances</td>
                  <td class="text-right">($5,000)</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 font-medium">Net Revenue</td>
                  <td class="text-right font-medium">$245,000</td>
                </tr>
                
                <tr class="border-b">
                  <td class="py-2 pl-4">Cost of Goods Sold</td>
                  <td class="text-right">$98,000</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 font-medium">Gross Profit</td>
                  <td class="text-right font-medium">$147,000</td>
                </tr>
                <tr class="border-b">
                  <td class="py-1 pl-4 text-sm text-shark-600">Gross Margin</td>
                  <td class="text-right text-sm text-shark-600">60%</td>
                </tr>
                
                <tr class="border-b">
                  <td class="py-2 font-medium">Operating Expenses</td>
                  <td></td>
                </tr>
                <tr>
                  <td class="py-1 pl-8">Salaries and Wages</td>
                  <td class="text-right">$65,000</td>
                </tr>
                <tr>
                  <td class="py-1 pl-8">Rent</td>
                  <td class="text-right">$12,000</td>
                </tr>
                <tr>
                  <td class="py-1 pl-8">Utilities</td>
                  <td class="text-right">$4,500</td>
                </tr>
                <tr>
                  <td class="py-1 pl-8">Marketing and Advertising</td>
                  <td class="text-right">$18,000</td>
                </tr>
                <tr>
                  <td class="py-1 pl-8">Insurance</td>
                  <td class="text-right">$3,500</td>
                </tr>
                <tr class="border-b">
                  <td class="py-1 pl-8">Other Operating Expenses</td>
                  <td class="text-right">$7,000</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pl-4 font-medium">Total Operating Expenses</td>
                  <td class="text-right font-medium">$110,000</td>
                </tr>
                
                <tr class="border-b">
                  <td class="py-2 font-medium">Operating Income</td>
                  <td class="text-right font-medium">$37,000</td>
                </tr>
                
                <tr>
                  <td class="py-1 pl-4">Interest Expense</td>
                  <td class="text-right">$2,500</td>
                </tr>
                <tr class="border-b">
                  <td class="py-1 pl-4">Other Income</td>
                  <td class="text-right">$1,000</td>
                </tr>
                
                <tr class="border-b">
                  <td class="py-2 font-medium">Income Before Taxes</td>
                  <td class="text-right font-medium">$35,500</td>
                </tr>
                
                <tr class="border-b">
                  <td class="py-2 pl-4">Income Taxes</td>
                  <td class="text-right">$7,100</td>
                </tr>
                
                <tr class="border-b">
                  <td class="py-2 font-medium">Net Income</td>
                  <td class="text-right font-medium">$28,400</td>
                </tr>
                <tr>
                  <td class="py-1 pl-4 text-sm text-shark-600">Net Profit Margin</td>
                  <td class="text-right text-sm text-shark-600">11.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Key Ratios and Metrics from the P&L</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Gross Margin:</strong> (Gross Profit ÷ Revenue) × 100
              <p class="text-sm ml-4">Measures the efficiency of core operations; higher is generally better</p>
            </li>
            <li>
              <strong>Operating Margin:</strong> (Operating Income ÷ Revenue) × 100
              <p class="text-sm ml-4">Shows how well the business manages its operating expenses</p>
            </li>
            <li>
              <strong>Net Profit Margin:</strong> (Net Income ÷ Revenue) × 100
              <p class="text-sm ml-4">Indicates overall profitability after all expenses are considered</p>
            </li>
            <li>
              <strong>Operating Expense Ratio:</strong> (Operating Expenses ÷ Revenue) × 100
              <p class="text-sm ml-4">Helps identify if overhead costs are too high relative to sales</p>
            </li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, entrepreneurs are frequently asked to share their P&L details. Sharks want to see consistency in revenue growth, healthy gross margins, and a path to profitability (if not already profitable).</p>
            <p class="mt-2">When an entrepreneur says they've done $500,000 in sales with a 40% margin, the Sharks immediately want to know: Is that gross margin or net margin? What are the operating expenses? This helps them determine if the business model is truly viable at scale.</p>
          </div>
        `
      },
      {
        title: "Creating and Improving Your P&L",
        content: `
          <h2 class="text-2xl font-bold mb-4">Creating and Improving Your P&L</h2>
          <p class="mb-6">A well-prepared P&L statement provides critical insights for decision-making. Here's how to create one for your business and use it to drive improvements:</p>
          
          <h3 class="text-xl font-semibold mb-3">Steps to Create a P&L Statement</h3>
          <ol class="list-decimal pl-6 mb-6 space-y-2">
            <li><strong>Gather Financial Data:</strong> Collect all revenue and expense information for the period</li>
            <li><strong>Calculate Total Revenue:</strong> Add up all income from sales and services</li>
            <li><strong>Determine COGS:</strong> Calculate all direct costs related to producing your goods or delivering services</li>
            <li><strong>Calculate Gross Profit:</strong> Subtract COGS from Revenue</li>
            <li><strong>List Operating Expenses:</strong> Categorize and total all overhead and operational costs</li>
            <li><strong>Calculate Operating Income:</strong> Subtract Operating Expenses from Gross Profit</li>
            <li><strong>Account for Other Income/Expenses:</strong> Add other income and subtract other expenses</li>
            <li><strong>Calculate Pre-Tax Income:</strong> Operating Income plus Other Income minus Other Expenses</li>
            <li><strong>Deduct Taxes:</strong> Subtract applicable income taxes</li>
            <li><strong>Determine Net Income:</strong> Final profit or loss after all deductions</li>
          </ol>
          
          <h3 class="text-xl font-semibold mb-3">Strategies to Improve Your P&L</h3>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Increasing Revenue</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Raise prices strategically where market allows</li>
                <li>Expand product or service offerings</li>
                <li>Increase customer retention and lifetime value</li>
                <li>Improve conversion rates in sales funnel</li>
                <li>Enter new markets or customer segments</li>
                <li>Implement upselling and cross-selling tactics</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Reducing COGS</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Negotiate better rates with suppliers</li>
                <li>Buy in bulk to get volume discounts</li>
                <li>Improve production efficiency to reduce waste</li>
                <li>Optimize inventory management</li>
                <li>Automate manual processes where possible</li>
                <li>Review and refine quality control processes</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Controlling Operating Expenses</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Regularly review and audit all expenses</li>
                <li>Eliminate underutilized subscriptions or services</li>
                <li>Implement energy-efficient practices</li>
                <li>Consider remote work to reduce office expenses</li>
                <li>Focus marketing spend on highest-ROI channels</li>
                <li>Review staffing needs and productivity</li>
              </ul>
            </div>
            
            <div class="border rounded-lg p-4">
              <h4 class="font-semibold mb-2">Optimizing Financial Structure</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Refinance high-interest debt</li>
                <li>Take advantage of tax deductions and credits</li>
                <li>Consider leasing vs. buying equipment</li>
                <li>Manage cash flow to minimize interest expenses</li>
                <li>Time major purchases strategically</li>
                <li>Review and optimize tax strategies</li>
              </ul>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Common P&L Mistakes to Avoid</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Inconsistent Categorization:</strong> Ensure expenses are consistently categorized from period to period</li>
            <li><strong>Overlooking Accruals:</strong> Record revenue when earned and expenses when incurred, not just when cash changes hands</li>
            <li><strong>Ignoring Seasonality:</strong> Consider seasonal variations when comparing performance across different periods</li>
            <li><strong>Focusing Only on Revenue:</strong> Growth in top-line revenue means little if profitability is declining</li>
            <li><strong>Neglecting Trends:</strong> Look for patterns and trends across multiple periods, not just absolute numbers</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Daymond John often emphasizes the importance of understanding your numbers inside and out. He says, "If you don't know your numbers, you don't know your business."</p>
            <p class="mt-2">Entrepreneurs who can confidently discuss their P&L and show they're actively managing it to improve profitability typically receive more favorable responses from the Sharks, even if their businesses are still growing and refining their models.</p>
          </div>
        `
      }
    ]
  },
  "product-market-fit": {
    title: "Product-Market Fit",
    description: "Understand how to develop products that perfectly match market needs, creating customer demand that drives sustainable growth.",
    sections: [
      {
        title: "Understanding Product-Market Fit",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Product-Market Fit?</h2>
          <p class="mb-4">Product-market fit occurs when a product satisfies a strong market demand. It's the degree to which a product meets market needs so well that customers are willing to buy it, use it, and tell others about it. Achieving product-market fit is often considered the first significant milestone for a startup and a prerequisite for sustainable growth.</p>
          <p class="mb-6">As Marc Andreessen, co-founder of Andreessen Horowitz, famously said: "Product-market fit means being in a good market with a product that can satisfy that market."</p>
          
          <h3 class="text-xl font-semibold mb-3">Why Product-Market Fit Matters</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Efficient Growth:</strong> With product-market fit, customer acquisition becomes easier and less expensive</li>
            <li><strong>Customer Retention:</strong> Products that truly meet needs have lower churn rates</li>
            <li><strong>Word-of-Mouth:</strong> Satisfied customers become advocates, reducing marketing costs</li>
            <li><strong>Investment Readiness:</strong> Investors are more willing to fund businesses with demonstrated product-market fit</li>
            <li><strong>Strategic Focus:</strong> Clear product-market fit guides product development and marketing strategies</li>
          </ul>
          
          <h3 class="text-xl font-semibold mb-3">Signs of Product-Market Fit</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Organic Growth:</strong> Customers are finding you without excessive marketing</li>
            <li><strong>High Engagement:</strong> Users are actively using your product and returning</li>
            <li><strong>Customer Enthusiasm:</strong> Users are recommending your product to others</li>
            <li><strong>Sustainable Unit Economics:</strong> Customer lifetime value exceeds acquisition cost</li>
            <li><strong>Manageable Churn:</strong> Low customer loss rate compared to industry standards</li>
            <li><strong>Repeatable Sales Process:</strong> Consistent conversion from leads to customers</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Example</h4>
            <p>On Shark Tank, a clear indicator of product-market fit is when entrepreneurs share impressive sales numbers achieved with minimal marketing spend. When Barbara Corcoran hears that a product has generated $500,000 in sales primarily through word of mouth, she recognizes that customers are responding enthusiastically to a product that solves a real problem.</p>
            <p class="mt-2">Conversely, the Sharks are skeptical when an entrepreneur has spent significant money on marketing but has minimal sales, suggesting a lack of product-market fit.</p>
          </div>
        `
      },
      {
        title: "Finding Product-Market Fit",
        content: `
          <h2 class="text-2xl font-bold mb-4">Finding Product-Market Fit</h2>
          <p class="mb-6">Achieving product-market fit is an iterative process that requires deep customer understanding, flexibility, and persistence. Here's a systematic approach to finding your product-market fit:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 1: Identify Target Customer Segment</h3>
              <p>Begin by defining exactly who your ideal customers are and what problems they face.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Key activities:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Create detailed customer personas</li>
                  <li>Conduct customer interviews to understand pain points</li>
                  <li>Observe customers in their natural environment</li>
                  <li>Analyze competitors' customers and their feedback</li>
                  <li>Narrow your focus to a specific customer segment initially</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 2: Define the Value Proposition</h3>
              <p>Clearly articulate how your product solves customer problems better than alternatives.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Questions to answer:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>What specific problem does your product solve?</li>
                  <li>How is your solution different from existing alternatives?</li>
                  <li>What unique value do you deliver that customers can't get elsewhere?</li>
                  <li>Why should customers care about your solution?</li>
                  <li>How does your solution fit into customers' lives or workflows?</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 3: Build a Minimum Viable Product (MVP)</h3>
              <p>Create the simplest version of your product that delivers the core value proposition.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>MVP principles:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Focus on solving one core problem exceptionally well</li>
                  <li>Include only essential features that address the main pain point</li>
                  <li>Emphasize speed to market over perfection</li>
                  <li>Design the MVP to test key assumptions about customer needs</li>
                  <li>Ensure the MVP delivers enough value to generate meaningful feedback</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 4: Get the Product into Users' Hands</h3>
              <p>Release your MVP to early adopters and collect qualitative and quantitative feedback.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Approaches:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Beta testing programs with ideal customer profiles</li>
                  <li>Friends and family testing for initial feedback</li>
                  <li>Limited geographic or segment-specific launches</li>
                  <li>Pre-sales or crowdfunding campaigns</li>
                  <li>Free trials with conversion goals</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Step 5: Listen, Measure, and Iterate</h3>
              <p>Collect data, analyze results, and make improvements based on user feedback.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Key metrics to track:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Customer acquisition cost and conversion rates</li>
                  <li>Activation rate (users completing key actions)</li>
                  <li>Retention and churn rates</li>
                  <li>Net Promoter Score (NPS) or other satisfaction metrics</li>
                  <li>Feature usage and engagement patterns</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Sean Ellis Test</h4>
            <p>Product-market fit pioneer Sean Ellis developed a simple test: Ask users "How would you feel if you could no longer use our product?" If more than 40% say "very disappointed," you've likely found product-market fit.</p>
            <p class="mt-2">This single question can provide powerful insight into how essential your product has become to your customers' lives.</p>
          </div>
        `
      },
      {
        title: "After Finding Product-Market Fit",
        content: `
          <h2 class="text-2xl font-bold mb-4">After Finding Product-Market Fit</h2>
          <p class="mb-6">Finding product-market fit is not the end goal—it's the beginning of a new phase focused on growth and scaling. Here's what to do once you've achieved initial product-market fit:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Optimize Your Business Model</h3>
              <p>Refine your pricing strategy, sales process, and customer acquisition channels.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Key actions:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Test different pricing tiers and models</li>
                  <li>Identify the most profitable customer segments</li>
                  <li>Calculate and optimize unit economics</li>
                  <li>Develop a repeatable and scalable sales process</li>
                  <li>Formalize your customer success approach</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Scale Marketing and Distribution</h3>
              <p>Expand your reach by investing in marketing channels that deliver proven results.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Growth strategies:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Double down on channels with the best customer acquisition cost</li>
                  <li>Implement customer referral programs</li>
                  <li>Develop content marketing around proven pain points</li>
                  <li>Explore partnerships and integrations</li>
                  <li>Consider geographic or market segment expansion</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Expand Product Capabilities</h3>
              <p>Enhance your product with features that address additional customer needs or adjacent problems.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Product development approach:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Prioritize features based on customer feedback and usage data</li>
                  <li>Focus on improvements that increase retention first</li>
                  <li>Consider adjacent problems your customers are facing</li>
                  <li>Develop for different customer segments or use cases</li>
                  <li>Build deeper integration with customer workflows</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Build Operational Capacity</h3>
              <p>Develop the systems, processes, and team needed to support growth.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Scaling priorities:</strong>
                <ul class="list-disc pl-6 space-y-1 mt-1">
                  <li>Hire key roles to support growth (sales, marketing, customer success)</li>
                  <li>Implement scalable technology infrastructure</li>
                  <li>Develop formal onboarding and training processes</li>
                  <li>Create documentation and standardized operating procedures</li>
                  <li>Establish KPIs and reporting systems</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Preserving Product-Market Fit</h3>
          <p class="mb-4">Markets and customer needs evolve over time. To maintain product-market fit:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Continuous Customer Feedback:</strong> Maintain open channels with users</li>
            <li><strong>Competitor Monitoring:</strong> Stay aware of new entrants and innovations</li>
            <li><strong>Regular Market Research:</strong> Track changing trends and preferences</li>
            <li><strong>Innovation Pipeline:</strong> Continuously improve your core offering</li>
            <li><strong>Customer Success Metrics:</strong> Regularly measure satisfaction and engagement</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>Many entrepreneurs come to Shark Tank after finding initial product-market fit but before having the resources to scale. When Robert Herjavec or Mark Cuban invests in a company with proven product-market fit, they typically focus on helping the entrepreneur scale through their distribution networks, operational expertise, and capital for expansion.</p>
            <p class="mt-2">As Daymond John often says, "I'm not just investing in a product, I'm investing in a person and their ability to evolve the product as the market changes."</p>
          </div>
        `
      }
    ]
  },
  "retention-rate": {
    title: "Retention Rate",
    description: "Learn how to measure, analyze, and improve customer retention - a critical metric for sustainable business growth and profitability.",
    sections: [
      {
        title: "What is Retention Rate?",
        content: `
          <h2 class="text-2xl font-bold mb-4">Understanding Retention Rate</h2>
          <p class="mb-4">Retention rate measures the percentage of customers who continue to do business with your company over a specified period. It reflects your ability to keep customers engaged and satisfied with your products or services after their initial purchase or interaction.</p>
          <p class="mb-6">While acquiring new customers is important, retaining existing ones is often more cost-effective and leads to greater long-term profitability. Studies consistently show that increasing customer retention rates by just 5% can increase profits by 25% to 95%.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Retention Rate Formula</h3>
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Basic Retention Rate Formula</h4>
            <div class="font-mono text-center my-2 text-sm">
              Retention Rate = ((CE - CN) / CS) × 100%
            </div>
            <p class="text-sm mt-2">Where:</p>
            <ul class="list-disc pl-6 mt-1 text-sm">
              <li><strong>CE</strong> = Number of customers at the end of the period</li>
              <li><strong>CN</strong> = Number of new customers acquired during the period</li>
              <li><strong>CS</strong> = Number of customers at the start of the period</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Why Retention Rate Matters</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Cost Efficiency:</strong> Acquiring new customers typically costs 5-25 times more than retaining existing ones</li>
            <li><strong>Revenue Growth:</strong> Existing customers tend to spend more over time as trust builds</li>
            <li><strong>Referrals:</strong> Loyal customers are more likely to refer others to your business</li>
            <li><strong>Feedback Value:</strong> Long-term customers provide more valuable product feedback</li>
            <li><strong>Competitive Advantage:</strong> High retention creates a stable customer base that's harder for competitors to poach</li>
          </ul>
          
          <div class="border-l-4 border-shark-300 pl-4">
            <h4 class="font-medium mb-1">Retention vs. Churn</h4>
            <p class="text-sm">Retention rate and churn rate are two sides of the same coin:</p>
            <div class="mt-1 text-sm text-shark-600">
              <strong>Relationship:</strong> Churn Rate = 100% - Retention Rate
            </div>
          </div>
        `
      },
      {
        title: "Measuring and Analyzing Retention",
        content: `
          <h2 class="text-2xl font-bold mb-4">Measuring and Analyzing Retention</h2>
          <p class="mb-6">Different business models require different approaches to measuring and analyzing retention. Understanding how to properly track retention helps you identify patterns, spot issues, and make data-driven improvements.</p>
          
          <h3 class="text-xl font-semibold mb-3">Retention Metrics by Business Type</h3>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full border-collapse border border-shark-200">
              <thead class="bg-shark-50">
                <tr>
                  <th class="border border-shark-200 px-4 py-2 text-left">Business Type</th>
                  <th class="border border-shark-200 px-4 py-2 text-left">Key Retention Metrics</th>
                  <th class="border border-shark-200 px-4 py-2 text-left">Typical Measurement Period</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-shark-200 px-4 py-2">SaaS/Subscription</td>
                  <td class="border border-shark-200 px-4 py-2">Monthly/Annual Retention, Logo Retention, Revenue Retention</td>
                  <td class="border border-shark-200 px-4 py-2">Monthly, Quarterly, Annual</td>
                </tr>
                <tr>
                  <td class="border border-shark-200 px-4 py-2">E-commerce</td>
                  <td class="border border-shark-200 px-4 py-2">Repeat Purchase Rate, Purchase Frequency, Time Between Purchases</td>
                  <td class="border border-shark-200 px-4 py-2">30/60/90 Days, Annual</td>
                </tr>
                <tr>
                  <td class="border border-shark-200 px-4 py-2">Mobile Apps</td>
                  <td class="border border-shark-200 px-4 py-2">Day 1/7/30 Retention, Daily Active Users (DAU)</td>
                  <td class="border border-shark-200 px-4 py-2">Daily, Weekly, Monthly</td>
                </tr>
                <tr>
                  <td class="border border-shark-200 px-4 py-2">Service Business</td>
                  <td class="border border-shark-200 px-4 py-2">Client Retention Rate, Service Renewal Rate</td>
                  <td class="border border-shark-200 px-4 py-2">Quarterly, Annual</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Cohort Analysis</h3>
          <p class="mb-4">One of the most effective ways to analyze retention is through cohort analysis, which groups customers based on when they first became customers.</p>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Cohort Analysis Benefits</h4>
            <ul class="list-disc pl-6">
              <li>Identifies if retention is improving or declining over time</li>
              <li>Shows how product changes impact different customer groups</li>
              <li>Reveals patterns in when customers typically drop off</li>
              <li>Helps isolate seasonal effects from true retention issues</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Customer Lifetime Value (CLV) Connection</h3>
          <p class="mb-4">Retention rate directly impacts Customer Lifetime Value, making it a critical financial metric.</p>
          
          <div class="border-l-4 border-shark-300 pl-4 mb-6">
            <h4 class="font-medium mb-1">CLV Calculation</h4>
            <p class="text-sm">A basic CLV formula incorporating retention:</p>
            <div class="mt-1 text-sm text-shark-600">
              <strong>CLV = (Average Revenue per Customer × Gross Margin %) ÷ (1 - Retention Rate)</strong>
            </div>
          </div>
          
          <p>This formula shows how even small improvements in retention can dramatically increase the lifetime value of your customer base.</p>
        `
      },
      {
        title: "Strategies to Improve Retention",
        content: `
          <h2 class="text-2xl font-bold mb-4">Strategies to Improve Retention</h2>
          <p class="mb-6">Improving customer retention requires a systematic approach across multiple business functions. These strategies can help you build stronger customer relationships and reduce churn.</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Onboarding Excellence</h3>
              <p>Create a smooth, educational onboarding experience that helps customers achieve value quickly.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Implementation:</strong> Welcome sequences, tutorial videos, onboarding checklists, early success milestones
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Proactive Customer Success</h3>
              <p>Anticipate customer needs and reach out with help before they experience friction.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Examples:</strong> Usage monitoring, check-in calls, personalized training sessions, usage analytics with recommendations
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Continuous Value Delivery</h3>
              <p>Regularly enhance your product/service and communicate these improvements to customers.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Tactics:</strong> Feature updates, product roadmap sharing, exclusive beta access, added-value services
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Community Building</h3>
              <p>Foster connections between customers to create switching costs and community value.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Channels:</strong> User forums, customer events, ambassador programs, peer learning opportunities
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Responsive Feedback Loops</h3>
              <p>Actively collect and act on customer feedback to show you value their input.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Process:</strong> Regular surveys, feedback implementation announcements, "you asked, we built" communications
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Churn Analysis and Prevention</h3>
          <p class="mb-4">Identify and address warning signs before customers leave:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Declining Usage:</strong> Monitor product usage trends and engage with customers showing decreased activity</li>
            <li><strong>Missed Milestones:</strong> Track key product adoption milestones and follow up with customers who haven't reached them</li>
            <li><strong>Support Interactions:</strong> Analyze support tickets for patterns that might indicate frustration or confusion</li>
            <li><strong>NPS/CSAT Scores:</strong> Pay special attention to customers whose satisfaction scores are dropping</li>
            <li><strong>Exit Interviews:</strong> Learn from departing customers to prevent similar issues with others</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, investors like Robert Herjavec often ask about customer retention metrics as a key indicator of business health. A high retention rate demonstrates product-market fit and sustainable growth potential.</p>
            <p class="mt-2">Mark Cuban frequently emphasizes that the true value of a business lies not just in acquiring customers but in keeping them engaged over time. He looks for founders who understand their retention metrics and have strategies to improve them.</p>
          </div>
        `
      }
    ]
  },
  "roe": {
    title: "Return on Equity (ROE)",
    description: "Understand how efficiently a company generates profit relative to shareholder equity, a key metric for measuring management effectiveness and financial performance.",
    sections: [
      {
        title: "What is Return on Equity?",
        content: `
          <h2 class="text-2xl font-bold mb-4">Understanding Return on Equity (ROE)</h2>
          <p class="mb-4">Return on Equity (ROE) measures a company's profitability by revealing how much profit a company generates with the money shareholders have invested. It's one of the most important financial metrics for evaluating how efficiently management is using a company's equity capital to generate profits.</p>
          <p class="mb-6">ROE provides insight into a company's ability to generate profits without requiring additional capital, making it a favorite metric among investors like Warren Buffett, who looks for businesses with consistently high ROE.</p>
          
          <h3 class="text-xl font-semibold mb-3">The ROE Formula</h3>
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Basic ROE Calculation</h4>
            <div class="font-mono text-center my-2 text-sm">
              ROE = Net Income ÷ Shareholders' Equity × 100%
            </div>
            <p class="text-sm mt-2">Where:</p>
            <ul class="list-disc pl-6 mt-1 text-sm">
              <li><strong>Net Income</strong> = Total profit after all expenses and taxes are deducted</li>
              <li><strong>Shareholders' Equity</strong> = Assets - Liabilities (what shareholders would theoretically receive if the company liquidated)</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Interpreting ROE Values</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>High ROE (>20%):</strong> Generally indicates strong profitability and efficient use of equity</li>
            <li><strong>Average ROE (10-20%):</strong> Typically considered solid performance in many industries</li>
            <li><strong>Low ROE (&lt;10%):</strong> May suggest inefficient use of capital or industry-specific challenges</li>
            <li><strong>Negative ROE:</strong> Indicates the company is losing money, requiring careful analysis</li>
          </ul>
          
          <div class="border-l-4 border-shark-300 pl-4 mb-6">
            <h4 class="font-medium mb-1">Industry Context</h4>
            <p class="text-sm">ROE varies significantly by industry:</p>
            <div class="mt-1 text-sm text-shark-600">
              <strong>Example ROE by Industry:</strong> Technology (15-25%), Retail (15-20%), Utilities (8-12%), Banks (8-15%)
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>When entrepreneurs appear on Shark Tank, the Sharks often ask questions to determine the company's ROE, even if they don't explicitly use the term. Questions about current profit margins, capital requirements, and growth projections all help the Sharks estimate potential ROE.</p>
            <p class="mt-2">Kevin O'Leary frequently emphasizes that he expects his investments to deliver at least a 15% annual return on his money, essentially stating his minimum ROE threshold.</p>
          </div>
        `
      },
      {
        title: "Analyzing ROE Components",
        content: `
          <h2 class="text-2xl font-bold mb-4">The DuPont Analysis: Breaking Down ROE</h2>
          <p class="mb-6">To truly understand what drives a company's ROE, financial analysts use the DuPont Analysis, which breaks ROE into three key components. This decomposition helps identify whether a high ROE is the result of strong operational efficiency, effective asset utilization, or financial leverage.</p>
          
          <h3 class="text-xl font-semibold mb-3">The DuPont Formula</h3>
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <div class="font-mono text-center my-2 text-sm">
              ROE = Profit Margin × Asset Turnover × Equity Multiplier
            </div>
            <p class="text-sm mt-2">Where:</p>
            <ul class="list-disc pl-6 mt-1 text-sm">
              <li><strong>Profit Margin</strong> = Net Income ÷ Revenue (measures operational efficiency)</li>
              <li><strong>Asset Turnover</strong> = Revenue ÷ Total Assets (measures asset utilization efficiency)</li>
              <li><strong>Equity Multiplier</strong> = Total Assets ÷ Shareholders' Equity (measures financial leverage)</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Interpreting DuPont Components</h3>
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Profit Margin</h4>
              <p class="text-sm">A high profit margin indicates the company efficiently controls costs and pricing.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Strategy Focus:</strong> Cost control, pricing power, operational efficiency, product mix
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Asset Turnover</h4>
              <p class="text-sm">High asset turnover shows the company generates substantial revenue from its asset base.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Strategy Focus:</strong> Asset utilization, inventory management, receivables collection, capacity optimization
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Equity Multiplier</h4>
              <p class="text-sm">A high equity multiplier indicates greater use of debt financing (leverage).</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Strategy Focus:</strong> Capital structure, debt management, financial risk, interest coverage
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">ROE Case Study</h3>
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">Comparing Two Companies with 15% ROE</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse text-sm">
                <thead class="bg-shark-50">
                  <tr>
                    <th class="border px-4 py-2">Company</th>
                    <th class="border px-4 py-2">Profit Margin</th>
                    <th class="border px-4 py-2">Asset Turnover</th>
                    <th class="border px-4 py-2">Equity Multiplier</th>
                    <th class="border px-4 py-2">ROE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border px-4 py-2">Tech Co.</td>
                    <td class="border px-4 py-2">15%</td>
                    <td class="border px-4 py-2">0.8</td>
                    <td class="border px-4 py-2">1.25</td>
                    <td class="border px-4 py-2">15%</td>
                  </tr>
                  <tr>
                    <td class="border px-4 py-2">Retail Co.</td>
                    <td class="border px-4 py-2">3%</td>
                    <td class="border px-4 py-2">2.5</td>
                    <td class="border px-4 py-2">2.0</td>
                    <td class="border px-4 py-2">15%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-4 text-sm">
              Both companies generate the same ROE, but through completely different business models. Tech Co. relies on high margins and low leverage, while Retail Co. operates with thin margins but high turnover and more leverage. Each faces different risks and opportunities.
            </p>
          </div>
        `
      },
      {
        title: "Strategic Applications of ROE",
        content: `
          <h2 class="text-2xl font-bold mb-4">Strategic Applications of ROE</h2>
          <p class="mb-6">Return on Equity isn't just a financial metric for investors—it's a powerful strategic tool for business owners and managers to guide decision-making and improve company performance. Here's how to use ROE insights to drive business strategy:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Capital Allocation Decisions</h3>
              <p>Use ROE to evaluate potential projects and initiatives to ensure they'll generate adequate returns.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Application:</strong> Set minimum ROE thresholds for new investments based on your cost of capital and growth objectives. Prioritize projects with the highest risk-adjusted ROE.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Dividend Policy</h3>
              <p>Balance reinvestment needs with shareholder returns based on ROE performance.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Strategy:</strong> Companies with consistently high ROE may return more capital to shareholders when they lack high-return reinvestment opportunities. Companies with lower ROE but good growth prospects may retain more earnings.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Growth Strategy</h3>
              <p>Align growth initiatives with ROE improvement goals.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Approach:</strong> Focus on sustainable growth that maintains or improves ROE rather than growth that dilutes returns. The sustainable growth rate (SGR = ROE × Retention Rate) indicates how fast a company can grow using only retained earnings.
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Financial Structure Optimization</h3>
              <p>Determine the ideal balance between debt and equity to optimize ROE without excessive risk.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Consideration:</strong> While increased leverage can boost ROE, it also increases financial risk. Find the optimal debt-to-equity ratio that maximizes ROE while maintaining financial stability.
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">ROE Limitations and Considerations</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Short-term Focus:</strong> High ROE achieved by cutting essential investments may hurt long-term performance</li>
            <li><strong>Accounting Variations:</strong> Different accounting methods can affect ROE calculations</li>
            <li><strong>Industry Specificity:</strong> Some industries naturally have higher or lower ROE due to capital intensity</li>
            <li><strong>Risk Assessment:</strong> ROE doesn't directly account for business risk or volatility</li>
            <li><strong>Growth Stage:</strong> Early-stage companies often have low or negative ROE despite strong growth potential</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, Lori Greiner and Mark Cuban often look beyond current ROE to evaluate a company's potential future returns. They frequently invest in businesses with temporarily low ROE but strong fundamentals that point to higher future returns.</p>
            <p class="mt-2">Meanwhile, Kevin O'Leary typically focuses more on current ROE and immediate cash flow, as reflected in his preference for royalty deals that provide a clear path to recovering his investment with a specific return threshold.</p>
          </div>
        `
      }
    ]
  },
  "working-capital": {
    title: "Working Capital",
    description: "Learn how to manage the lifeblood of your business operations - the funds needed for day-to-day activities, inventory management, and short-term obligations.",
    sections: [
      {
        title: "Understanding Working Capital",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is Working Capital?</h2>
          <p class="mb-4">Working capital represents the difference between a company's current assets and current liabilities. In simpler terms, it's the money available to fund a company's day-to-day operations and short-term obligations. Think of working capital as the operating liquidity available to run your business.</p>
          <p class="mb-6">Effective working capital management ensures your business can maintain smooth operations, pay suppliers and employees on time, and avoid costly disruptions—all while minimizing the amount of capital tied up in low-return assets.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Working Capital Formula</h3>
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Basic Working Capital Calculation</h4>
            <div class="font-mono text-center my-2 text-sm">
              Working Capital = Current Assets - Current Liabilities
            </div>
            <p class="text-sm mt-2">Where:</p>
            <ul class="list-disc pl-6 mt-1 text-sm">
              <li><strong>Current Assets</strong> = Cash + Accounts Receivable + Inventory + Prepaid Expenses + Other Liquid Assets (convertible to cash within one year)</li>
              <li><strong>Current Liabilities</strong> = Accounts Payable + Short-term Debt + Accrued Expenses + Other Obligations due within one year</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Components of Working Capital</h3>
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Current Assets</h4>
              <p class="text-sm">Resources that are expected to be converted to cash or used up within one year.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Key Components:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Cash and Cash Equivalents</li>
                  <li>Accounts Receivable (money owed by customers)</li>
                  <li>Inventory (raw materials, work-in-progress, finished goods)</li>
                  <li>Marketable Securities</li>
                  <li>Prepaid Expenses</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Current Liabilities</h4>
              <p class="text-sm">Obligations that must be paid within one year.</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Key Components:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Accounts Payable (money owed to suppliers)</li>
                  <li>Short-term Loans and Current Portion of Long-term Debt</li>
                  <li>Accrued Expenses (e.g., wages, taxes)</li>
                  <li>Unearned Revenue (customer advances)</li>
                  <li>Other Short-term Obligations</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Interpreting Working Capital</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Positive Working Capital:</strong> The company has more current assets than liabilities, indicating good short-term financial health</li>
            <li><strong>Negative Working Capital:</strong> The company has more short-term obligations than liquid assets, potentially signaling financial distress (though some business models operate successfully with negative working capital)</li>
            <li><strong>Zero Working Capital:</strong> Current assets exactly equal current liabilities, leaving no buffer for unexpected expenses</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, Robert Herjavec and Daymond John often scrutinize entrepreneurs' working capital needs. They recognize that insufficient working capital is one of the primary reasons small businesses fail, even when they have a great product and growing sales.</p>
            <p class="mt-2">Sharks frequently ask about inventory levels, payment terms with suppliers, and customer payment cycles—all key components of working capital management—to assess whether the business has adequate capital to support growth.</p>
          </div>
        `
      },
      {
        title: "Working Capital Strategies",
        content: `
          <h2 class="text-2xl font-bold mb-4">Effective Working Capital Management</h2>
          <p class="mb-6">Strategic management of working capital can dramatically improve a company's cash flow, profitability, and ability to weather economic challenges. Here are key strategies to optimize each component of your working capital:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Inventory Management</h3>
              <p>Balance having enough stock to meet demand without tying up excessive capital in unsold goods.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Best Practices:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Implement just-in-time inventory systems</li>
                  <li>Use accurate demand forecasting</li>
                  <li>Identify and address slow-moving items</li>
                  <li>Negotiate consignment arrangements with suppliers where possible</li>
                  <li>Consider drop-shipping for certain products</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Accounts Receivable Optimization</h3>
              <p>Accelerate the collection of payments from customers.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Techniques:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Offer early payment discounts (e.g., 2/10 net 30)</li>
                  <li>Implement strict credit policies</li>
                  <li>Use electronic invoicing and payment systems</li>
                  <li>Follow up promptly on overdue accounts</li>
                  <li>Consider factoring or receivables financing for large orders</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Accounts Payable Strategy</h3>
              <p>Optimize the timing of payments to suppliers to maximize cash availability.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Approaches:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Negotiate longer payment terms with suppliers</li>
                  <li>Take advantage of early payment discounts when they exceed your cost of capital</li>
                  <li>Establish vendor-managed inventory arrangements</li>
                  <li>Consolidate purchases to gain negotiating leverage</li>
                  <li>Implement systematic approval processes to avoid premature payments</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-xl font-semibold mb-2">Cash Management</h3>
              <p>Ensure cash is working for the business while maintaining adequate liquidity.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Tactics:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Implement cash pooling across business units</li>
                  <li>Invest idle cash in liquid, low-risk instruments</li>
                  <li>Use cash flow forecasting to anticipate needs</li>
                  <li>Establish lines of credit before they're needed</li>
                  <li>Consider supply chain financing programs</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">The Working Capital Cycle</h3>
          <p class="mb-4">The working capital cycle (also called the cash conversion cycle) measures how quickly a company converts its investments in inventory and other resources into cash. The shorter the cycle, the more efficient the company's working capital management.</p>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Working Capital Cycle Formula</h4>
            <div class="font-mono text-center my-2 text-sm">
              Working Capital Cycle = Inventory Days + Receivable Days - Payable Days
            </div>
            <p class="text-sm mt-2">Where:</p>
            <ul class="list-disc pl-6 mt-1 text-sm">
              <li><strong>Inventory Days</strong> = (Average Inventory ÷ Cost of Goods Sold) × 365</li>
              <li><strong>Receivable Days</strong> = (Average Accounts Receivable ÷ Revenue) × 365</li>
              <li><strong>Payable Days</strong> = (Average Accounts Payable ÷ Cost of Goods Sold) × 365</li>
            </ul>
          </div>
          
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">Working Capital Cycle Example</h4>
            <p>Company A has the following metrics:</p>
            <ul class="list-none pl-4 space-y-1 mt-2">
              <li>Inventory Days: 60 days</li>
              <li>Receivable Days: 45 days</li>
              <li>Payable Days: 30 days</li>
            </ul>
            <p class="mt-2">Working Capital Cycle = 60 + 45 - 30 = 75 days</p>
            <p class="mt-2">This means it takes 75 days from when the company pays for inventory until it collects cash from customers. During this time, the company needs to finance its operations.</p>
          </div>
        `
      },
      {
        title: "Working Capital and Growth",
        content: `
          <h2 class="text-2xl font-bold mb-4">Working Capital and Business Growth</h2>
          <p class="mb-6">One of the most common pitfalls for growing businesses is underestimating working capital needs. As your business scales, your working capital requirements typically increase—often faster than revenue growth. Understanding and planning for these needs is critical for sustainable expansion.</p>
          
          <h3 class="text-xl font-semibold mb-3">Why Growth Increases Working Capital Needs</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Inventory Expansion:</strong> More products, product lines, and locations require greater inventory investment</li>
            <li><strong>Receivables Growth:</strong> Higher sales typically mean more outstanding customer invoices</li>
            <li><strong>Operational Scaling:</strong> Increased staffing, facilities, and other resources require more cash</li>
            <li><strong>Market Expansion:</strong> Entering new markets often requires longer cash cycles initially</li>
            <li><strong>Supply Chain Complexity:</strong> More complex operations often extend the cash conversion cycle</li>
          </ul>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">The Working Capital Trap</h4>
            <p>Many businesses fall into what's called the "working capital trap" during periods of growth. As sales increase, the business runs out of cash to fund operations—even while showing a profit on paper. This happens because the cash needed to support increased inventory and receivables outpaces the cash generated from sales.</p>
            <p class="mt-2">Companies with 20%+ growth rates are particularly vulnerable to this trap if they don't plan their working capital needs carefully.</p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Financing Working Capital for Growth</h3>
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Short-term Financing Options</h3>
              <p>Solutions for temporary or seasonal working capital needs.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Common Tools:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Business Lines of Credit</li>
                  <li>Invoice Factoring/Financing</li>
                  <li>Purchase Order Financing</li>
                  <li>Trade Credit</li>
                  <li>Credit Cards (for very short-term needs)</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Long-term Working Capital Strategies</h3>
              <p>Approaches for permanent increases in working capital requirements.</p>
              <div class="mt-2 text-sm text-shark-600">
                <strong>Strategic Options:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Equity Investment</li>
                  <li>Term Loans</li>
                  <li>SBA Loans</li>
                  <li>Retained Earnings</li>
                  <li>Venture Debt</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Working Capital Forecasting</h3>
          <p class="mb-4">Developing a working capital forecast is essential for planning growth initiatives. A basic forecast should:</p>
          <ol class="list-decimal pl-6 mb-6 space-y-2">
            <li>Project monthly sales, cost of goods sold, and operating expenses</li>
            <li>Estimate inventory requirements based on projected sales and lead times</li>
            <li>Calculate expected accounts receivable based on sales and collection cycles</li>
            <li>Project accounts payable based on purchasing needs and payment terms</li>
            <li>Determine monthly working capital needs by combining these projections</li>
          </ol>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, Barbara Corcoran often questions entrepreneurs about their cash flow cycle and working capital needs before making an investment. She understands that even profitable businesses can fail without adequate working capital.</p>
            <p class="mt-2">Mark Cuban frequently discusses the importance of managing cash flow and working capital with entrepreneurs, especially those in inventory-heavy businesses. He's been known to structure deals specifically to address working capital constraints that would otherwise limit growth.</p>
          </div>
        `
      }
    ]
  },
  "working-capital-ratio": {
    title: "Working Capital Ratio",
    description: "Master the key metric for assessing your company's short-term financial health and operational efficiency. Learn to calculate, interpret, and optimize your working capital ratio.",
    sections: [
      {
        title: "Understanding Working Capital Ratio",
        content: `
          <h2 class="text-2xl font-bold mb-4">What is the Working Capital Ratio?</h2>
          <p class="mb-4">The Working Capital Ratio (also known as the Current Ratio) is a financial metric that assesses a company's ability to pay its short-term obligations with its short-term assets. It provides a quick snapshot of a business's short-term financial health and liquidity position.</p>
          <p class="mb-6">Unlike the simple working capital calculation (current assets minus current liabilities), the working capital ratio expresses the relationship as a proportion, making it easier to compare across companies of different sizes and industries.</p>
          
          <h3 class="text-xl font-semibold mb-3">The Working Capital Ratio Formula</h3>
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Basic Calculation</h4>
            <div class="font-mono text-center my-2 text-sm">
              Working Capital Ratio = Current Assets ÷ Current Liabilities
            </div>
            <p class="text-sm mt-2">Where:</p>
            <ul class="list-disc pl-6 mt-1 text-sm">
              <li><strong>Current Assets</strong> = Cash + Marketable Securities + Accounts Receivable + Inventory + Prepaid Expenses</li>
              <li><strong>Current Liabilities</strong> = Accounts Payable + Short-term Debt + Accrued Expenses + Other Short-term Obligations</li>
            </ul>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Interpreting the Working Capital Ratio</h3>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Ratio > 1.0:</strong> The company has more current assets than current liabilities.
              <ul class="list-disc pl-6 mt-1 text-sm">
                <li>1.2 to 2.0: Generally considered healthy for most businesses</li>
                <li>> 2.0: May indicate excess capital not being efficiently deployed</li>
              </ul>
            </li>
            <li>
              <strong>Ratio = 1.0:</strong> Current assets exactly equal current liabilities, providing no buffer.
            </li>
            <li>
              <strong>Ratio < 1.0:</strong> The company has more current liabilities than assets, potentially indicating liquidity problems.
              <ul class="list-disc pl-6 mt-1 text-sm">
                <li>0.8 to 1.0: May be manageable for businesses with predictable cash flows</li>
                <li>< 0.8: Often signals financial distress, though some business models operate successfully with lower ratios</li>
              </ul>
            </li>
          </ul>
          
          <div class="border-l-4 border-shark-300 pl-4 mb-6">
            <h4 class="font-medium mb-1">Industry Context</h4>
            <p class="text-sm">Working capital ratios vary significantly by industry:</p>
            <div class="mt-1 text-sm text-shark-600">
              <ul class="list-disc pl-6 mt-1">
                <li><strong>Retail:</strong> Often 1.5-2.0 due to inventory requirements</li>
                <li><strong>Technology:</strong> Often 2.0-4.0 due to high cash reserves and low inventory</li>
                <li><strong>Utilities:</strong> Often 0.5-1.0 due to stable cash flows</li>
                <li><strong>Fast Food:</strong> Often < 1.0 due to inventory turnover and customer prepayment</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Quick Ratio Comparison</h4>
            <p>The Quick Ratio (also called the Acid-Test Ratio) is a more stringent liquidity measure that excludes inventory from current assets:</p>
            <div class="font-mono text-center my-2 text-sm">
              Quick Ratio = (Current Assets - Inventory) ÷ Current Liabilities
            </div>
            <p class="text-sm mt-2">The Quick Ratio acknowledges that inventory may not be quickly convertible to cash, making it a more conservative liquidity indicator.</p>
          </div>
        `
      },
      {
        title: "Analyzing Working Capital Ratio",
        content: `
          <h2 class="text-2xl font-bold mb-4">Analyzing Working Capital Ratio Trends</h2>
          <p class="mb-6">Looking at your working capital ratio at a single point in time provides limited insight. More valuable analysis comes from examining trends over time and comparing against industry benchmarks, competitors, and your own historical performance.</p>
          
          <h3 class="text-xl font-semibold mb-3">Trend Analysis</h3>
          <p class="mb-4">Tracking your working capital ratio over successive periods can reveal important changes in your financial health:</p>
          
          <div class="border rounded-lg p-5 mb-6">
            <h4 class="font-semibold mb-3">Sample Working Capital Ratio Trend</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse text-sm">
                <thead class="bg-shark-50">
                  <tr>
                    <th class="border px-4 py-2">Quarter</th>
                    <th class="border px-4 py-2">Current Assets</th>
                    <th class="border px-4 py-2">Current Liabilities</th>
                    <th class="border px-4 py-2">Working Capital Ratio</th>
                    <th class="border px-4 py-2">Trend Implications</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border px-4 py-2">Q1 2024</td>
                    <td class="border px-4 py-2">$500,000</td>
                    <td class="border px-4 py-2">$300,000</td>
                    <td class="border px-4 py-2">1.67</td>
                    <td class="border px-4 py-2">Healthy baseline</td>
                  </tr>
                  <tr>
                    <td class="border px-4 py-2">Q2 2024</td>
                    <td class="border px-4 py-2">$520,000</td>
                    <td class="border px-4 py-2">$325,000</td>
                    <td class="border px-4 py-2">1.60</td>
                    <td class="border px-4 py-2">Slight decrease but still healthy</td>
                  </tr>
                  <tr>
                    <td class="border px-4 py-2">Q3 2024</td>
                    <td class="border px-4 py-2">$540,000</td>
                    <td class="border px-4 py-2">$360,000</td>
                    <td class="border px-4 py-2">1.50</td>
                    <td class="border px-4 py-2">Continuing downward trend requires attention</td>
                  </tr>
                  <tr>
                    <td class="border px-4 py-2">Q4 2024</td>
                    <td class="border px-4 py-2">$530,000</td>
                    <td class="border px-4 py-2">$420,000</td>
                    <td class="border px-4 py-2">1.26</td>
                    <td class="border px-4 py-2">Significant decrease - action needed</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-4 text-sm">
              This example shows a steadily declining working capital ratio. While still above 1.0, the consistent downward trend suggests deteriorating liquidity that should be addressed before it becomes critical.
            </p>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Component Analysis</h3>
          <p class="mb-4">When you notice changes in your working capital ratio, drill down into the individual components to identify the root causes:</p>
          
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Declining Ratio Analysis</h4>
              <p class="text-sm">Potential causes of a declining working capital ratio:</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Current Asset Decreases:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Cash used for long-term investments or asset purchases</li>
                  <li>Declining sales leading to lower accounts receivable</li>
                  <li>Inventory write-downs or obsolescence</li>
                  <li>Increased efficiency in inventory management (potentially positive)</li>
                </ul>
                <strong>Current Liability Increases:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Increased short-term borrowing</li>
                  <li>Growing accounts payable due to cash flow constraints</li>
                  <li>Long-term debt becoming current as it approaches maturity</li>
                  <li>Higher accrued expenses from expanding operations</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h4 class="font-medium mb-1">Rising Ratio Analysis</h4>
              <p class="text-sm">Potential causes of an increasing working capital ratio:</p>
              <div class="mt-1 text-sm text-shark-600">
                <strong>Current Asset Increases:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Buildup of cash from profitable operations</li>
                  <li>Growing accounts receivable from sales increases</li>
                  <li>Increasing inventory levels (may signal slow turnover)</li>
                  <li>Proceeds from financing activities held as cash</li>
                </ul>
                <strong>Current Liability Decreases:</strong>
                <ul class="list-disc pl-6 mt-1">
                  <li>Paying down short-term debt</li>
                  <li>Faster payment of accounts payable (possibly foregoing discounts)</li>
                  <li>Decreasing accrued expenses</li>
                  <li>Conversion of short-term debt to long-term financing</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Seasonal Considerations</h3>
          <p class="mb-4">Many businesses experience natural fluctuations in their working capital ratio due to seasonal factors:</p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Retail:</strong> Typically shows higher ratios in pre-holiday quarters as inventory builds, followed by lower ratios post-holiday</li>
            <li><strong>Construction:</strong> Often experiences higher ratios during peak building seasons and lower ratios during off-seasons</li>
            <li><strong>Agriculture:</strong> Working capital ratios frequently fluctuate with growing and harvest cycles</li>
          </ul>
          <p>When analyzing seasonal businesses, compare ratios to the same period in previous years rather than to sequential quarters.</p>
        `
      },
      {
        title: "Optimizing Working Capital Ratio",
        content: `
          <h2 class="text-2xl font-bold mb-4">Optimizing Your Working Capital Ratio</h2>
          <p class="mb-6">Finding the optimal working capital ratio for your business involves balancing liquidity (having enough current assets to meet obligations) with efficiency (not tying up too much capital in low-return assets). Here are strategies to optimize your ratio based on your specific situation:</p>
          
          <h3 class="text-xl font-semibold mb-3">If Your Working Capital Ratio is Too Low</h3>
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Increase Current Assets</h3>
              <div class="mt-2 text-sm text-shark-600">
                <ul class="list-disc pl-6 mt-1">
                  <li><strong>Accelerate Collections:</strong> Implement more efficient billing processes, offer early payment discounts, or follow up more consistently on late payments</li>
                  <li><strong>Liquidate Underutilized Assets:</strong> Convert non-essential long-term assets to cash</li>
                  <li><strong>Attract Investment:</strong> Seek equity investment to increase cash reserves</li>
                  <li><strong>Improve Profitability:</strong> Focus on higher-margin products/services to generate more cash from operations</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Reduce Current Liabilities</h3>
              <div class="mt-2 text-sm text-shark-600">
                <ul class="list-disc pl-6 mt-1">
                  <li><strong>Restructure Debt:</strong> Convert short-term loans to long-term financing</li>
                  <li><strong>Negotiate Extended Terms:</strong> Work with suppliers to extend payment terms without penalties</li>
                  <li><strong>Reduce Inventory Orders:</strong> Lower near-term purchase commitments</li>
                  <li><strong>Manage Capital Expenditures:</strong> Lease rather than purchase equipment to preserve cash</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">If Your Working Capital Ratio is Too High</h3>
          <div class="space-y-6 mb-8">
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Reduce Excess Current Assets</h3>
              <div class="mt-2 text-sm text-shark-600">
                <ul class="list-disc pl-6 mt-1">
                  <li><strong>Invest Idle Cash:</strong> Deploy excess cash into growth initiatives or long-term investments</li>
                  <li><strong>Optimize Inventory:</strong> Implement just-in-time inventory systems to reduce stock levels</li>
                  <li><strong>Consider Dividends/Distributions:</strong> Return excess capital to owners if no high-return investment opportunities exist</li>
                  <li><strong>Tighten Credit Policies:</strong> Reduce accounts receivable by shortening payment terms for customers</li>
                </ul>
              </div>
            </div>
            
            <div class="border-l-4 border-shark-300 pl-4">
              <h3 class="text-lg font-semibold mb-2">Strategic Use of Liabilities</h3>
              <div class="mt-2 text-sm text-shark-600">
                <ul class="list-disc pl-6 mt-1">
                  <li><strong>Leverage Supplier Financing:</strong> Take full advantage of available payment terms</li>
                  <li><strong>Consider Growth Financing:</strong> Use debt financing for expansion rather than depleting current assets</li>
                  <li><strong>Renegotiate Payment Terms:</strong> Ask suppliers for volume-based extended terms</li>
                  <li><strong>Accelerate Planned Expenses:</strong> Make strategic prepayments that will benefit the business</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mb-3">Finding Your Optimal Ratio</h3>
          <p class="mb-4">The ideal working capital ratio varies by industry, business model, growth stage, and economic environment. Consider these factors when determining your optimal range:</p>
          
          <div class="bg-shark-50 p-4 rounded-lg mb-6">
            <h4 class="font-semibold text-shark-700 mb-2">Factors Affecting Optimal Ratio</h4>
            <ul class="list-disc pl-6">
              <li><strong>Business Volatility:</strong> Higher volatility requires higher ratios as a buffer</li>
              <li><strong>Growth Rate:</strong> Rapidly growing companies often need higher ratios to fund expansion</li>
              <li><strong>Industry Norms:</strong> Benchmark against peers to ensure competitiveness</li>
              <li><strong>Seasonality:</strong> Businesses with seasonal fluctuations may need higher ratios during certain periods</li>
              <li><strong>Supply Chain Reliability:</strong> Uncertain supply chains may necessitate higher inventory and thus higher ratios</li>
              <li><strong>Economic Climate:</strong> During economic uncertainty, higher ratios provide added security</li>
            </ul>
          </div>
          
          <div class="bg-shark-50 p-4 rounded-lg">
            <h4 class="font-semibold text-shark-700 mb-2">Shark Tank Connection</h4>
            <p>On Shark Tank, Kevin O'Leary often scrutinizes working capital metrics when evaluating businesses. He understands that a company with an optimal working capital ratio can respond quickly to market opportunities while maintaining financial stability.</p>
            <p class="mt-2">Lori Greiner, with her extensive retail experience, frequently asks about inventory levels and payment terms—key components of the working capital ratio—to assess whether entrepreneurs can effectively manage growth without running into cash flow problems.</p>
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
