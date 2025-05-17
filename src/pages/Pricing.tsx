import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { useResponsive } from "@/hooks/use-mobile";

const tiers = [
  {
    name: "Free",
    price: { USD: "$0/mo", INR: "₹0/mo" },
    features: [
      "Access to basic learning modules",
      "Community support",
      "Limited metrics dashboard",
      "No credit card required"
    ],
    cta: "Get Started",
    highlight: false
  },
  {
    name: "Starter",
    price: { USD: "$19/mo", INR: "₹1,599/mo (incl. GST)" },    features: [
      "All Free tier features",
      "Unlock all learning modules",
      "Full metrics dashboard",
      "Advanced achievements system",
      "Email support"
    ],
    cta: "Upgrade to Starter",
    highlight: true
  },
  {
    name: "Professional",
    price: { USD: "$49/mo", INR: "₹3,999/mo (incl. GST)" },
    features: [
      "All Starter tier features",
      "Advanced analytics & reports",
      "Priority support",
      "Custom business simulations",
      "Team management tools"
    ],
    cta: "Go Professional",
    highlight: false
  }
];

export default function Pricing() {
  const { isMobile, isTablet } = useResponsive();
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleCTAClick = (tierName: string) => {
    if (tierName === "Free") {
      alert("You have selected the Free plan!");
    } else {
      setSelectedTier(tierName);
    }
  };

  const closeDialog = () => setSelectedTier(null);

  return (
    <MainLayout>      <div className="mx-auto max-w-5xl py-6 sm:py-12 px-4 sm:px-0">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-center mb-2 sm:mb-4">Pricing Plans</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Choose the plan that fits your business learning needs.
        </p>
        <div className="flex justify-center mb-6 sm:mb-8 gap-2 sm:gap-4">
          <button
            className={`px-4 py-2 rounded border ${currency === 'USD' ? 'bg-shark-500 text-white' : 'bg-white text-shark-500 border-shark-500'}`}
            onClick={() => setCurrency('USD')}
          >
            USD
          </button>
          <button
            className={`px-4 py-2 rounded border ${currency === 'INR' ? 'bg-shark-500 text-white' : 'bg-white text-shark-500 border-shark-500'}`}
            onClick={() => setCurrency('INR')}
          >
            INR
          </button>
        </div>        <div className="grid gap-4 xs:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.highlight ? "border-2 border-shark-500 shadow-lg" : ""}>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl text-center mb-1 sm:mb-2">{tier.name}</CardTitle>
                <div className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">{tier.price[currency]}</div>
                {currency === 'INR' && tier.name !== 'Free' && (
                  <div className="text-[10px] sm:text-xs text-center text-muted-foreground mb-1 sm:mb-2">All prices include 18% GST</div>
                )}
              </CardHeader>              <CardContent>
                <ul className="mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="inline-block h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-shark-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.name === "Free" ? (
                  <Button 
                    className="w-full h-8 sm:h-10 text-xs sm:text-sm" 
                    variant={tier.highlight ? "default" : "outline"} 
                    onClick={() => handleCTAClick(tier.name)}
                  >
                    {tier.cta}
                  </Button>
                ) : (                  <Dialog open={selectedTier === tier.name} onOpenChange={closeDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full h-8 sm:h-10 text-xs sm:text-sm" 
                        variant={tier.highlight ? "default" : "outline"} 
                        onClick={() => handleCTAClick(tier.name)}
                      >
                        {tier.cta}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[350px] sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center text-lg sm:text-xl">Subscribe to {tier.name} Plan</DialogTitle>
                      </DialogHeader>
                      <div className="my-3 sm:my-4 text-center">
                        <p className="mb-2 text-sm sm:text-base">You have selected the <b>{tier.name}</b> plan for <b>{tier.price[currency]}</b>.</p>
                        <p className="text-sm sm:text-base">Proceed to payment to complete your subscription.</p>
                      </div>
                      <DialogFooter>
                        <Button 
                          className="w-full h-9 sm:h-10 text-xs sm:text-sm" 
                          onClick={() => { alert('Redirecting to payment gateway...'); closeDialog(); }}
                        >
                          Proceed to Payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
