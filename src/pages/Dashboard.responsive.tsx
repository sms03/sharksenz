import { useState, useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import RevenueCalculator from "./RevenueCalculator";
import MarketAnalysis from "./MarketAnalysis";
import ProfitProjection from "./ProfitProjection";

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
  
  // Add responsive state for mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  // Add effect to check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get user plan from localStorage (default to free)
  const [plan] = useState(() => localStorage.getItem("user_plan") || "free");

  // Only show advanced metrics/charts for paid users
  const isPaid = plan === "starter" || plan === "professional";

  // Calculate metrics from inputs
  const metrics = calculateMetrics(revenue, expenses, customers, cac, growth);

  // All metrics/charts zero if not visualized
  const zeroMetrics = { valuation: 0, monthlyBurnRate: 0, runway: 0, ltv: 0, ltvCacRatio: 0 };
  const displayMetrics = visualize ? metrics : zeroMetrics;

  const location = useLocation();
  const navigate = useNavigate();

  // Determine tab from route
  let initialTab = "calculator";
  if (location.pathname.endsWith("/revenue")) initialTab = "revenue";
  else if (location.pathname.endsWith("/valuation")) initialTab = "valuation";
  else if (location.pathname.endsWith("/runway")) initialTab = "runway";
  else if (location.pathname.endsWith("/market")) initialTab = "market";
  else if (location.pathname.endsWith("/profit")) initialTab = "profit";

  const [tab, setTab] = useState(initialTab);

  // Sync tab with route
  function handleTabChange(value: string) {
    setTab(value);
    if (value === "calculator") navigate("/dashboard");
    else if (value === "revenue") navigate("/dashboard/revenue");
    else if (value === "valuation") navigate("/dashboard/valuation");
    else if (value === "runway") navigate("/dashboard/runway");
    else if (value === "market") navigate("/dashboard/market");
    else if (value === "profit") navigate("/dashboard/profit");
  }
  
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="font-heading mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold">Metrics Dashboard</h1>
            <p className="font-subheading-libre text-sm sm:text-base md:text-lg text-muted-foreground">
              Calculate and visualize key business metrics
            </p>
          </div>
          
          <CurrencySelector 
            selectedCurrency={selectedCurrency} 
            setSelectedCurrency={setSelectedCurrency} 
          />
        </div>
        
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <div className="overflow-x-auto pb-2 -mx-3 px-3 scrollbar-thin">
            <TabsList className={`grid w-full ${isMobile ? 'min-w-[800px]' : ''} grid-cols-2 sm:grid-cols-3 md:grid-cols-6`}>
              <TabsTrigger value="calculator" className="text-xs sm:text-sm">
                <Calculator className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{isMobile ? "Metrics" : "Metrics Calculator"}</span>
              </TabsTrigger>
              <TabsTrigger value="revenue" className="text-xs sm:text-sm">
                <BarChart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{isMobile ? "Revenue" : "Revenue Calculator"}</span>
              </TabsTrigger>
              <TabsTrigger value="market" className="text-xs sm:text-sm">
                <PieChart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{isMobile ? "Market" : "Market Analysis"}</span>
              </TabsTrigger>
              <TabsTrigger value="profit" className="text-xs sm:text-sm">
                <LineChart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{isMobile ? "Profit" : "Profit Projection"}</span>
              </TabsTrigger>
              <TabsTrigger value="valuation" disabled={!isPaid} className="text-xs sm:text-sm">
                <CircleDollarSign className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Valuation</span>
              </TabsTrigger>
              <TabsTrigger value="runway" disabled={!isPaid} className="text-xs sm:text-sm">
                <TrendingDown className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{isMobile ? "Runway" : "Burn Rate & Runway"}</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="calculator" className="mt-4 sm:mt-6 overflow-auto scrollbar-shark">
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
          
          <TabsContent value="revenue" className="mt-6 overflow-auto scrollbar-shark">
            <RevenueCalculator />
          </TabsContent>
          
          <TabsContent value="market" className="mt-6 overflow-auto scrollbar-shark">
            <MarketAnalysis />
          </TabsContent>
          
          <TabsContent value="profit" className="mt-6 overflow-auto scrollbar-shark">
            <ProfitProjection />
          </TabsContent>
          
          <TabsContent value="valuation" className="mt-6 overflow-auto scrollbar-shark">
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
          
          <TabsContent value="runway" className="mt-6 overflow-auto scrollbar-shark">
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
