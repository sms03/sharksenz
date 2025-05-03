import MainLayout from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import ValuationTabContent from "@/components/dashboard/ValuationTabContent";
import { 
  CircleDollarSign, 
  TrendingUp, 
  BarChart3, 
  LineChart,
  Calculator
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { currencies } from "@/utils/currency";

export default function ValuationPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(() => localStorage.getItem("user_plan") || "free");
  const [activeTab, setActiveTab] = useState("vc");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  // Demo metrics for illustrations and examples
  const demoMetrics = {
    revenue: 500000,
    growth: 25,
    customers: 1000,
    retention: 85,
    margins: 40,
    cac: 200,
    ltv: 1800,
    valuation: 3500000
  };

  useEffect(() => {
    setPlan(localStorage.getItem("user_plan") || "free");
  }, [user]);

  // Valuation methodology descriptions
  const valuationMethods = [
    {
      id: "vc",
      name: "VC Method",
      description: "Calculates valuation based on projected future revenue and exit multiples.",
      icon: CircleDollarSign,
      color: "bg-blue-100 dark:bg-blue-900",
      formula: "Valuation = Terminal Value ÷ Expected Return",
      bestFor: "Early-stage startups seeking venture capital funding"
    },
    {
      id: "dcf",
      name: "Discounted Cash Flow",
      description: "Estimates the value of an investment based on its expected future cash flows.",
      icon: TrendingUp,
      color: "bg-green-100 dark:bg-green-900",
      formula: "Valuation = CF₁/(1+r)¹ + CF₂/(1+r)² + ... + CFₙ/(1+r)ⁿ",
      bestFor: "Established companies with predictable cash flows"
    },
    {
      id: "multiple",
      name: "Revenue Multiple",
      description: "Values a company as a multiple of its annual revenue, based on industry benchmarks.",
      icon: BarChart3,
      color: "bg-purple-100 dark:bg-purple-900",
      formula: "Valuation = Annual Revenue × Industry Multiple",
      bestFor: "Software and SaaS companies with strong growth"
    },
    {
      id: "cmv",
      name: "Comparable Market Value",
      description: "Establishes value by comparing to similar companies that have recently been funded or acquired.",
      icon: LineChart,
      color: "bg-amber-100 dark:bg-amber-900",
      formula: "Valuation = Average of comparable company valuations",
      bestFor: "Companies with clear market comparables"
    }
  ];

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Startup Valuation Estimator</h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate your startup's value using industry-standard methodologies and metrics that investors use.
            </p>
          </div>
          
          <div className="flex gap-2 items-center bg-background shadow-sm rounded-lg p-2 border">
            <CircleDollarSign className="h-5 w-5 text-primary" />
            <select 
              className="bg-transparent border-none text-sm font-medium focus:outline-none"
              value={selectedCurrency.code}
              onChange={(e) => {
                const selected = currencies.find(c => c.code === e.target.value);
                if (selected) setSelectedCurrency(selected);
              }}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Valuation Methodologies</CardTitle>
              <CardDescription>
                Select a methodology that best fits your company stage and type
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {valuationMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={cn(
                      "rounded-lg p-4 cursor-pointer transition-all border-2",
                      activeTab === method.id 
                        ? "border-primary shadow-md" 
                        : "border-transparent hover:border-primary/40"
                    )}
                    onClick={() => setActiveTab(method.id)}
                  >
                    <div className={cn("p-2 rounded-md w-fit mb-3", method.color)}>
                      <method.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold mb-1">{method.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <div className="text-xs bg-muted p-2 rounded-md font-mono">
                      {method.formula}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {plan === "professional" ? (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full scrollbar-shark">
              <TabsList className="grid w-full grid-cols-4">
                {valuationMethods.map(method => (
                  <TabsTrigger key={method.id} value={method.id} className="flex items-center gap-2">
                    <method.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{method.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="mt-6 p-6 bg-muted/30 rounded-lg scrollbar-shark">
                {valuationMethods.map(method => (
                  <TabsContent key={method.id} value={method.id} className="scrollbar-shark">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{method.name} Calculator</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {method.description} This method is best for {method.bestFor.toLowerCase()}.
                        </p>
                      </div>
                      
                      <ValuationTabContent 
                        selectedCurrency={selectedCurrency} 
                        methodId={method.id}
                      />
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Valuation Insights</CardTitle>
                <CardDescription>
                  Factors that can significantly impact your startup's valuation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Growth Rate
                    </h4>
                    <p className="text-sm">
                      Startups growing 100%+ annually often receive higher valuation multiples.
                      Investors typically value growth trajectories more than current profitability.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      Market Size
                    </h4>
                    <p className="text-sm">
                      Addressing a large TAM (Total Addressable Market) of $1B+ increases 
                      the ceiling for potential returns, driving higher valuations.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-purple-500" />
                      Unit Economics
                    </h4>
                    <p className="text-sm">
                      Strong LTV:CAC ratios ({'>'}3:1) and high gross margins ({'>'}70%) 
                      demonstrate a sustainable business model that can scale profitably.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-8 border rounded-lg bg-muted/30 text-center">
            <CircleDollarSign className="h-12 w-12 mx-auto mb-4 text-primary/70" />
            <h3 className="text-xl font-semibold mb-2">Pro Feature</h3>
            <p className="mb-6 text-muted-foreground max-w-md mx-auto">
              Access our advanced valuation tools with multiple methodologies, benchmarks, and detailed reports to present to investors.
            </p>
            <Button asChild variant="default" size="lg" className="animate-pulse">
              <a href="/pricing">Upgrade to Pro</a>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
