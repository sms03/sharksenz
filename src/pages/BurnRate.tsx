import MainLayout from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import RunwayTabContent from "@/components/dashboard/RunwayTabContent";

export default function BurnRatePage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(() => localStorage.getItem("user_plan") || "free");

  // Demo metrics and currency for charts
  const demoMetrics = { monthlyBurnRate: 5000, runway: 12 };
  const demoCurrency = { code: "USD", symbol: "$", name: "US Dollar" };

  useEffect(() => {
    setPlan(localStorage.getItem("user_plan") || "free");
  }, [user]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-4">Burn Rate & Runway</h1>
        {plan === "professional" ? (
          <RunwayTabContent metrics={demoMetrics} selectedCurrency={demoCurrency} visualize={true} />
        ) : (
          <div className="p-6 border rounded-lg bg-muted/50 text-center">
            <p className="mb-2 font-semibold text-shark-700">This page is available for Pro users only.</p>
            <Button asChild variant="default">
              <a href="/pricing">Upgrade to Pro</a>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
