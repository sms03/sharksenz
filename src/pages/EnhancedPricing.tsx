import { Check, HelpCircle, ArrowRight, AlertCircle, Sparkles, Zap, Crown, Target, Rocket } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { CashfreePayment } from "@/components/CashfreePayment";
import { useNavigate } from "react-router-dom";

interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  priceMonthly: Record<string, number>;
  priceYearly: Record<string, number>;
  features: Array<{
    text: string;
    included: boolean;
    tooltip?: string;
    highlight?: boolean;
  }>;
  buttonText: string;
  recommended?: boolean;
  popular?: boolean;
  icon: React.ElementType;
  gradient: string;
}

const EnhancedPricing = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"usd" | "eur" | "gbp" | "inr">("usd");
  const navigate = useNavigate();

  const currencySymbols: Record<string, string> = {
    usd: "$",
    eur: "€", 
    gbp: "£",
    inr: "₹",
  };

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free Preview",
      subtitle: "Perfect for trying out",
      description: "Get a taste of our AI analysis and see the value before upgrading",
      priceMonthly: { usd: 0, eur: 0, gbp: 0, inr: 0 },
      priceYearly: { usd: 0, eur: 0, gbp: 0, inr: 0 },
      features: [
        { text: "Free pitch analysis preview", included: true, highlight: true },
        { text: "Basic feedback & insights", included: true },
        { text: "Overall pitch score", included: true },
        { text: "3 key improvement areas", included: true },
        { text: "Detailed scoring breakdown", included: false },
        { text: "Personalized action plan", included: false },
        { text: "GTM strategy recommendations", included: false },
        { text: "AI-powered pitch simulator", included: false },
      ],
      buttonText: "Try Free Preview",
      icon: Target,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      id: "starter", 
      name: "Starter Analysis",
      subtitle: "One-time purchase",
      description: "Complete AI analysis for your current pitch - perfect for immediate needs",
      priceMonthly: { usd: 19, eur: 17, gbp: 15, inr: 1599 },
      priceYearly: { usd: 19, eur: 17, gbp: 15, inr: 1599 },
      features: [
        { text: "Complete AI pitch analysis", included: true, highlight: true },
        { text: "Detailed scoring breakdown", included: true },
        { text: "Personalized action plan", included: true },
        { text: "GTM strategy recommendations", included: true },
        { text: "Competitive positioning advice", included: true },
        { text: "Investor appeal score", included: true },
        { text: "PDF report download", included: true },
        { text: "Multiple pitch analysis", included: false },
        { text: "Progress tracking", included: false },
      ],
      buttonText: "Get Full Analysis",
      popular: true,
      icon: Zap,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      id: "pro",
      name: "Pro Advisor",
      subtitle: "Monthly subscription",
      description: "Ongoing AI mentorship for serious founders building their startup",
      priceMonthly: { usd: 39, eur: 35, gbp: 30, inr: 3299 },
      priceYearly: { usd: 390, eur: 350, gbp: 300, inr: 32999 },
      features: [
        { text: "Unlimited pitch analysis", included: true, highlight: true },
        { text: "AI-powered pitch simulator", included: true, highlight: true },
        { text: "Progress tracking & history", included: true },
        { text: "Advanced GTM strategies", included: true },
        { text: "Investor deck templates", included: true },
        { text: "Financial model review", included: true },
        { text: "Weekly strategy sessions", included: true },
        { text: "Priority email support", included: true },
        { text: "Cancel anytime", included: true },
      ],
      buttonText: "Start Pro Plan",
      recommended: true,
      icon: Crown,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      subtitle: "For accelerators & VCs",
      description: "White-label solution for accelerators, VCs, and startup programs",
      priceMonthly: { usd: 199, eur: 179, gbp: 149, inr: 16699 },
      priceYearly: { usd: 1990, eur: 1790, gbp: 1490, inr: 166999 },
      features: [
        { text: "White-label branding", included: true, highlight: true },
        { text: "Bulk analysis capabilities", included: true },
        { text: "Team management", included: true },
        { text: "Custom scoring criteria", included: true },
        { text: "API access", included: true },
        { text: "Dedicated support", included: true },
        { text: "Custom integrations", included: true },
        { text: "Analytics dashboard", included: true },
      ],
      buttonText: "Contact Sales",
      icon: Rocket,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const getPrice = (plan: PricingPlan) => {
    const priceObj = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
    return priceObj[currency];
  };

  const getOriginalPrice = (plan: PricingPlan) => {
    // Show original price for starter plan (limited time discount)
    if (plan.id === "starter") {
      return { usd: 49, eur: 44, gbp: 39, inr: 4099 }[currency];
    }
    return null;
  };

  const getSavings = () => {
    if (billing === "yearly") return "Save 17%";
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Limited Time: 60% Off Starter Analysis
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Choose Your
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                AI Advisory Plan
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              From free previews to comprehensive startup mentorship. 
              Find the perfect level of AI guidance for your journey.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <Label htmlFor="billing" className={billing === "monthly" ? "font-medium" : "text-muted-foreground"}>
                Monthly
              </Label>
              <Switch
                id="billing"
                checked={billing === "yearly"}
                onCheckedChange={(checked) => setBilling(checked ? "yearly" : "monthly")}
              />
              <Label htmlFor="billing" className={billing === "yearly" ? "font-medium" : "text-muted-foreground"}>
                Yearly
              </Label>
              {billing === "yearly" && (
                <Badge variant="secondary" className="ml-2">
                  Save 17%
                </Badge>
              )}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Label className="text-sm text-muted-foreground">Currency:</Label>
              <Select value={currency} onValueChange={(value: any) => setCurrency(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                  <SelectItem value="inr">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = getPrice(plan);
              const originalPrice = getOriginalPrice(plan);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative h-full ${
                    plan.recommended 
                      ? "border-2 border-purple-500 shadow-lg scale-105" 
                      : plan.popular 
                        ? "border-2 border-blue-500 shadow-md"
                        : "border border-slate-200"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white px-4">
                        Recommended
                      </Badge>
                    </div>
                  )}
                  
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-blue-600">
                      {plan.subtitle}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Price */}
                    <div className="text-center mb-6">
                      {price === 0 ? (
                        <div className="text-3xl font-bold">Free</div>
                      ) : (
                        <div className="space-y-1">
                          {originalPrice && (
                            <div className="text-lg text-muted-foreground line-through">
                              {currencySymbols[currency]}{originalPrice}
                            </div>
                          )}
                          <div className="text-3xl font-bold">
                            {currencySymbols[currency]}{price}
                            {plan.id !== "starter" && (
                              <span className="text-base font-normal text-muted-foreground">
                                /{billing === "monthly" ? "mo" : "yr"}
                              </span>
                            )}
                          </div>
                          {originalPrice && (
                            <Badge variant="destructive" className="text-xs">
                              60% OFF
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              feature.highlight ? "text-blue-500" : "text-green-500"
                            }`} />
                          ) : (
                            <div className="h-4 w-4 mt-0.5 flex-shrink-0 rounded-full border border-muted-foreground/30" />
                          )}
                          <div className="flex-1">
                            <span className={`text-sm ${
                              !feature.included ? "text-muted-foreground" : 
                              feature.highlight ? "font-medium text-blue-700" : ""
                            }`}>
                              {feature.text}
                            </span>
                            {feature.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-3 w-3 ml-1 inline text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{feature.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="space-y-3">
                      {plan.id === "free" ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/pitch-simulator')}
                        >
                          {plan.buttonText}
                        </Button>
                      ) : plan.id === "enterprise" ? (
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate('/contact')}
                        >
                          {plan.buttonText}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <CashfreePayment
                                                  amount={price}
                                                  currency={currency}
                                                  planName={plan.name}
                                                  billingCycle={billing} children={""}                          />
                          {plan.id === "starter" && (
                            <p className="text-xs text-center text-muted-foreground">
                              One-time payment • No subscription
                            </p>
                          )}
                          {plan.id === "pro" && (
                            <p className="text-xs text-center text-muted-foreground">
                              Cancel anytime • No long-term commitment
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Money-back guarantee */}
                    {plan.id !== "free" && plan.id !== "enterprise" && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-800 text-center font-medium">
                          30-day money-back guarantee
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's included in the free preview?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The free preview gives you a taste of our AI analysis including an overall pitch score, 
                    2-3 key strengths, areas for improvement, and quick wins. It's designed to show you 
                    the value before you decide to upgrade.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How is the Starter Analysis different from Pro?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Starter Analysis is a one-time comprehensive analysis of your current pitch. 
                    Pro Advisor is an ongoing subscription that includes unlimited analysis, 
                    progress tracking, AI simulator, and continuous mentorship as your startup evolves.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade from Starter to Pro anytime. Pro subscriptions can be cancelled 
                    anytime with no long-term commitment. We'll prorate any unused time if you decide to change.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's your refund policy?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied 
                    with the analysis quality or find it doesn't meet your needs, we'll provide a full refund.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedPricing;
