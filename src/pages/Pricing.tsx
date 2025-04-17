import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    price: { USD: "$19/mo", INR: "₹1,599/mo (incl. GST)" },
    features: [
      "All Free tier features",
      "Unlock all learning modules",
      "Full metrics dashboard",
      "Basic quizzes & achievements",
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
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Pricing Plans</h1>
        <p className="text-center text-muted-foreground mb-6">
          Choose the plan that fits your business learning needs.
        </p>
        <div className="flex justify-center mb-8 gap-4">
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
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.highlight ? "border-2 border-shark-500 shadow-lg" : ""}>
              <CardHeader>
                <CardTitle className="text-2xl text-center mb-2">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-center mb-4">{tier.price[currency]}</div>
                {currency === 'INR' && tier.name !== 'Free' && (
                  <div className="text-xs text-center text-muted-foreground mb-2">All prices include 18% GST</div>
                )}
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-shark-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={tier.highlight ? "default" : "outline"}>{tier.cta}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
