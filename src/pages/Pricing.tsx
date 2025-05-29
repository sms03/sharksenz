import { Check, HelpCircle, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PricingPlan {
  name: string;
  description: string;
  priceMonthly: Record<string, number>;
  priceYearly: Record<string, number>;
  features: Array<{
    text: string;
    included: boolean;
    tooltip?: string;
  }>;
  buttonText: string;
  recommended?: boolean;
}

const Pricing = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"usd" | "eur" | "gbp" | "inr">("usd");

  const currencySymbols: Record<string, string> = {
    usd: "$",
    eur: "€",
    gbp: "£",
    inr: "₹",
  };

  const exchangeRates: Record<string, number> = {
    usd: 1,
    eur: 0.92,
    gbp: 0.79,
    inr: 83.27,
  };

  const plans: PricingPlan[] = [
    {
      name: "Tiger Shark (Free)",
      description: "Perfect for aspiring entrepreneurs",
      priceMonthly: {
        usd: 0,
        eur: 0,
        gbp: 0,
        inr: 0,
      },
      priceYearly: {
        usd: 0,
        eur: 0,
        gbp: 0,
        inr: 0,
      },
      features: [
        { text: "Basic Founder Content Library", included: true },
        { text: "Limited Analytics Tools", included: true },
        { text: "Community Forum Access", included: true },
        { text: "Weekly Newsletter", included: true },
        { text: "Advanced Tools", included: false },
        { text: "Pitch Simulator", included: false },
        { text: "Mentor Access", included: false },
      ],
      buttonText: "Get Started Free",
    },
    {
      name: "Great White Shark (Pro)",
      description: "For serious startup founders",
      priceMonthly: {
        usd: 29.99,
        eur: 28.99,
        gbp: 25.99,
        inr: 2499,
      },
      priceYearly: {
        usd: 299,
        eur: 275,
        gbp: 245,
        inr: 24899,
      },
      features: [
        { text: "Full Content Library Access", included: true },
        { text: "All Analytics Tools", included: true },
        { text: "Priority Community Support", included: true },
        { text: "Weekly Webinars", included: true },
        { text: "Basic Pitch Simulator", included: true },
        { text: "1 Mentor Session Monthly", included: true },
        { text: "Unlimited Downloads", included: false },
      ],
      buttonText: "Start Pro Plan",
      recommended: true,
    },
    {
      name: "Megalodon Shark (Max)",
      description: "For startup teams and accelerators",
      priceMonthly: {
        usd: 98.99,
        eur: 90.99,
        gbp: 84.99,
        inr: 7999,
      },
      priceYearly: {
        usd: 998,
        eur: 919,
        gbp: 875,
        inr: 84999,
      },
      features: [
        { text: "Everything in Pro Plan", included: true },
        { text: "Team Collaboration Features", included: true, tooltip: "Work together with up to 10 team members" },
        { text: "White-label Reports", included: true },
        { text: "Advanced Pitch Simulator", included: true },
        { text: "Unlimited Mentor Sessions", included: true },
        { text: "API Access", included: true, tooltip: "Access to our API for custom integrations" },
        { text: "Custom Branding", included: true },
      ],
      buttonText: "Contact Sales",
    },
  ];

  const handleBillingToggle = () => {
    setBilling(billing === "monthly" ? "yearly" : "monthly");
  };

  const getPrice = (plan: PricingPlan) => {
    const price =
      billing === "monthly"
        ? plan.priceMonthly[currency]
        : plan.priceYearly[currency];
    return `${currencySymbols[currency]}${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const getInterval = () => {
    return billing === "monthly" ? "/mo" : "/year";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Choose the perfect plan to accelerate your founder journey
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 items-center mb-8">
            <div className="flex items-center space-x-2">
              <Label htmlFor="billing-toggle" className={billing === "monthly" ? "font-medium" : ""}>
                Monthly
              </Label>
              <Switch 
                id="billing-toggle" 
                checked={billing === "yearly"} 
                onCheckedChange={handleBillingToggle}
              />
              <Label htmlFor="billing-toggle" className={`${billing === "yearly" ? "font-medium" : ""} flex items-center`}>
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Save 15%
                </span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 ml-6">
              <Label htmlFor="currency-select" className="text-sm">
                Currency:
              </Label>
              <Select
                value={currency}
                onValueChange={(value: "usd" | "eur" | "gbp" | "inr") => setCurrency(value)}
              >
                <SelectTrigger className="w-28" id="currency-select">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="py-12">
        <div className="container mx-auto px-4">          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-xl overflow-hidden ${
                  plan.recommended
                    ? "border-blue-500 shadow-lg shadow-blue-100"
                    : "border-gray-200"
                }`}
              >
                {plan.recommended && (
                  <div className="bg-blue-500 text-white text-center py-2 font-medium text-sm">
                    RECOMMENDED
                  </div>
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-600 mb-6">{plan.description}</p>                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {getPrice(plan)}
                    </span>
                    <span className="text-gray-600">
                      {plan.priceMonthly[currency] > 0 ? getInterval() : ""}
                    </span>
                    {currency === "inr" && plan.priceMonthly.inr > 0 && (
                      <div className="text-xs text-green-600 mt-1 font-medium">
                        GST Included
                      </div>
                    )}
                  </div>

                  <Button
                    className={`w-full ${
                      plan.recommended
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                    variant={plan.name === "Starter" ? "outline" : "default"}
                  >
                    {plan.buttonText}
                  </Button>

                  <div className="border-t border-gray-200 mt-6 pt-6">
                    <p className="font-medium mb-4">Plan includes:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className={`flex items-start ${
                            !feature.included ? "text-gray-400" : ""
                          }`}
                        >
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                          ) : (
                            <svg
                              className="h-5 w-5 text-gray-300 mr-2 shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                          <span>
                            {feature.text}
                            {feature.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="inline-block ml-1 h-4 w-4 text-gray-400" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>{feature.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}          </div>
          
          {currency === "inr" && (
            <div className="mt-12 max-w-4xl mx-auto bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800">GST Information</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    All prices displayed in INR are inclusive of Goods and Services Tax (GST) at the current rate of 18%. 
                    A detailed tax invoice will be provided with your purchase that itemizes the GST component.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    GST Registration: XXGSTXXXXXXXX • HSN/SAC Code: 998431 (Online Information and Database Access or Retrieval Services)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-xl text-gray-700 mb-8">
              We offer tailored packages for accelerators, incubators, and educational institutions.
              Contact our sales team to discuss your specific needs.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Contact Sales <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-3">Can I change plans later?</h3>
              <p className="text-gray-700">
                Yes, you can upgrade, downgrade or cancel your plan at any time. Changes to your subscription will take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-3">How do I get started?</h3>
              <p className="text-gray-700">
                Simply create a free account and you'll get immediate access to our Starter plan. You can upgrade to a premium plan at any time.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-3">Is there a free trial?</h3>
              <p className="text-gray-700">
                We offer a 14-day free trial for our Professional plan. No credit card required to start, and you can downgrade to the free tier anytime.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-700">
                We accept all major credit cards (Visa, Mastercard, American Express), as well as PayPal. For Enterprise plans, we can also accept wire transfers.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-3">Do you offer refunds?</h3>
              <p className="text-gray-700">
                Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service, contact support for a full refund.
              </p>
            </div>
              <div>
              <h3 className="font-bold text-xl mb-3">What currencies do you accept?</h3>
              <p className="text-gray-700">
                We accept payments in USD, EUR, GBP, and INR. All charges will be processed in your selected currency. 
                For INR payments, prices are inclusive of 18% GST as per Indian tax regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/*<section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-bold">Sarah Thompson</h4>
                  <p className="text-sm text-gray-600">Founder, EcoTech Solutions</p>
                </div>
              </div>
              <p className="text-gray-700">
                "SharkSenz's Professional plan has been a game-changer for my startup. The analytics tools alone have saved us thousands in consulting fees."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-bold">Alex Rodriguez</h4>
                  <p className="text-sm text-gray-600">CEO, FinTech Innovators</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The mentor sessions included in the Enterprise plan have been invaluable. Being able to speak directly with industry experts has accelerated our growth tremendously."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h4 className="font-bold">Michelle Wong</h4>
                  <p className="text-sm text-gray-600">Founder, Health.io</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I started with the free plan and upgraded to Professional as my startup grew. The content library is extensive and the pitch simulator helped me secure our seed round."
              </p>
            </div>
          </div>
        </div>
      </section>*/}

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Founder Journey?</h2>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of successful founders who have built their startups with SharkSenz.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-gray-600">No credit card required for free plan</p>
          </div>
        </div>
      </section>

      {/* GST Disclaimer for INR */}
      {currency === "inr" && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 max-w-3xl mx-auto mt-8 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="text-sm">
              All prices in INR are exclusive of GST. 18% GST will be applied at checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
