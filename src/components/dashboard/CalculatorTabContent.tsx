import { FadeIn, FadeInStagger } from "@/components/ui/motion";
import MetricsInputForm from "./MetricsInputForm";
import MetricsDisplay from "./MetricsDisplay";
import { useState } from "react";

interface CalculatorTabContentProps {
  revenue: string;
  setRevenue: (value: string) => void;
  expenses: string;
  setExpenses: (value: string) => void;
  cac: string;
  setCac: (value: string) => void;
  customers: string;
  setCustomers: (value: string) => void;
  growth: string;
  setGrowth: (value: string) => void;
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
  selectedCurrency: { name: string; symbol: string; code: string };
  chartType: string;
  setChartType: (type: string) => void;
  onCalculate?: () => void;
}

export default function CalculatorTabContent({
  revenue,
  setRevenue,
  expenses,
  setExpenses,
  cac,
  setCac,
  customers,
  setCustomers,
  growth,
  setGrowth,
  metrics,
  selectedCurrency,
  chartType,
  setChartType,
  onCalculate
}: CalculatorTabContentProps) {
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCalculate) onCalculate();
  };

  const handleInputChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCalculate) onCalculate();
    setter(e.target.value);
  };

  return (
    <form onSubmit={handleCalculate}>
      <FadeInStagger>
        <div className="grid gap-6 md:grid-cols-2">
          <FadeIn>
            <MetricsInputForm
              revenue={revenue}
              setRevenue={setRevenue}
              expenses={expenses}
              setExpenses={setExpenses}
              cac={cac}
              setCac={setCac}
              customers={customers}
              setCustomers={setCustomers}
              growth={growth}
              setGrowth={setGrowth}
              selectedCurrency={selectedCurrency}
            />
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <MetricsDisplay 
                metrics={metrics}
                selectedCurrency={selectedCurrency}
              />
            </FadeIn>
          </div>
        </div>
      </FadeInStagger>
      <button type="submit" className="w-full rounded-md bg-shark-500 py-2 font-medium text-white hover:bg-shark-600 mt-4">
        Calculate Metrics
      </button>
    </form>
  );
}
