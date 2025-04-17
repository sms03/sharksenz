import { useState } from "react";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Calculator,
  CircleDollarSign,
  TrendingDown
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { currencies } from "@/utils/currency";
import { calculateMetrics } from "@/utils/calculations";
import CurrencySelector from "@/components/dashboard/CurrencySelector";
import CalculatorTabContent from "@/components/dashboard/CalculatorTabContent";
import ValuationTabContent from "@/components/dashboard/ValuationTabContent";
import RunwayTabContent from "@/components/dashboard/RunwayTabContent";
import { Button } from "@/components/ui/button";
import MetricsVisualizer from "@/components/dashboard/MetricsVisualizer";

export interface CalculatorTabContentProps {
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
  metrics: any;
  selectedCurrency: any;
  chartType: string;
  setChartType: (type: string) => void;
  onCalculate: () => void;
}

export default function Dashboard() {
  const [revenue, setRevenue] = useState("");
  const [cac, setCac] = useState("");
  const [expenses, setExpenses] = useState("");
  const [customers, setCustomers] = useState("");
  const [growth, setGrowth] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [chartType, setChartType] = useState("bar");
  const { user } = useAuth();
  
  // Add a state to control if metrics are visualized
  const [visualize, setVisualize] = useState(false);

  // Get user plan from localStorage (default to free)
  const [plan] = useState(() => localStorage.getItem("user_plan") || "free");

  // Only show advanced metrics/charts for paid users
  const isPaid = plan === "starter" || plan === "professional";

  // Calculate metrics from inputs
  const metrics = calculateMetrics(revenue, expenses, customers, cac, growth);

  // All metrics/charts zero if not visualized
  const zeroMetrics = { valuation: 0, monthlyBurnRate: 0, runway: 0, ltv: 0, ltvCacRatio: 0 };
  const displayMetrics = visualize ? metrics : zeroMetrics;
  
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Metrics Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Calculate and visualize key business metrics
            </p>
          </div>
          
          <CurrencySelector 
            selectedCurrency={selectedCurrency} 
            setSelectedCurrency={setSelectedCurrency} 
          />
        </div>
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">
              <Calculator className="mr-2 h-4 w-4" />
              Metrics Calculator
            </TabsTrigger>
            <TabsTrigger value="valuation" disabled={!isPaid}>
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Valuation
            </TabsTrigger>
            <TabsTrigger value="runway" disabled={!isPaid}>
              <TrendingDown className="mr-2 h-4 w-4" />
              Burn Rate & Runway
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="mt-6">
            <CalculatorTabContent 
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
              metrics={metrics}
              selectedCurrency={selectedCurrency}
              chartType={chartType}
              setChartType={setChartType}
              onCalculate={() => setVisualize(true)}
            />
            {visualize && (
              <div className="mt-8">
                <MetricsVisualizer 
                  chartType={chartType}
                  setChartType={setChartType}
                  selectedCurrency={selectedCurrency}
                  metrics={metrics}
                />
              </div>
            )}
            {!isPaid && (
              <div className="mt-8 p-6 border rounded-lg bg-muted/50 text-center">
                <p className="mb-2 font-semibold text-shark-700">Upgrade to Starter or Professional to unlock advanced analytics, valuation, and runway tools!</p>
                <Button asChild variant="default">
                  <a href="/pricing">Upgrade Now</a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="valuation" className="mt-6">
            {isPaid ? (
              <ValuationTabContent selectedCurrency={selectedCurrency} />
            ) : (
              <div className="p-6 border rounded-lg bg-muted/50 text-center">
                <p className="mb-2 font-semibold text-shark-700">This feature is available for paid users only.</p>
                <Button asChild variant="default">
                  <a href="/pricing">Upgrade Now</a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="runway" className="mt-6">
            {isPaid ? (
              <RunwayTabContent />
            ) : (
              <div className="p-6 border rounded-lg bg-muted/50 text-center">
                <p className="mb-2 font-semibold text-shark-700">This feature is available for paid users only.</p>
                <Button asChild variant="default">
                  <a href="/pricing">Upgrade Now</a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
