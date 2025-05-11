import MainLayout from "@/layouts/MainLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import RunwayTabContent from "@/components/dashboard/RunwayTabContent";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Clock,
  AlertTriangle,
  Calendar,
  BarChart3,
  LineChart,
  Plus,
  Minus,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { currencies } from "@/utils/currency";
import { useNavigate } from "react-router-dom";

export default function BurnRatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(() => localStorage.getItem("user_plan") || "free");
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  
  // Financial inputs
  const [cashBalance, setCashBalance] = useState("500000");
  const [monthlyRevenue, setMonthlyRevenue] = useState("120000");
  const [monthlyExpenses, setMonthlyExpenses] = useState("150000");
  const [revenueGrowth, setRevenueGrowth] = useState(5); // percentage per month
  const [expenseGrowth, setExpenseGrowth] = useState(2); // percentage per month
  
  // Calculated metrics
  const [burnRate, setBurnRate] = useState(0);
  const [runwayMonths, setRunwayMonths] = useState(0);
  const [breakEvenDate, setBreakEvenDate] = useState("");
  const [scenarios, setScenarios] = useState<{label: string, runway: number, color: string}[]>([]);

  // Demo metrics and currency for charts
  const demoMetrics = { 
    monthlyBurnRate: Number(monthlyExpenses) - Number(monthlyRevenue), 
    runway: calculateRunway(),
    cashBalance: Number(cashBalance),
    breakEvenDate: calculateBreakEvenDate()
  };

  useEffect(() => {
    setPlan(localStorage.getItem("user_plan") || "free");
  }, [user]);
  
  useEffect(() => {
    // Calculate burn rate (negative value means positive cash flow)
    const calculatedBurnRate = Number(monthlyExpenses) - Number(monthlyRevenue);
    setBurnRate(calculatedBurnRate);
    
    // Calculate runway in months
    const calculatedRunway = calculateRunway();
    setRunwayMonths(calculatedRunway);
    
    // Calculate break even date
    const calculatedBreakEvenDate = calculateBreakEvenDate();
    setBreakEvenDate(calculatedBreakEvenDate);
    
    // Generate scenario analysis
    const scenarioData = generateScenarios();
    setScenarios(scenarioData);
  }, [cashBalance, monthlyRevenue, monthlyExpenses, revenueGrowth, expenseGrowth]);
  
  function calculateRunway(): number {
    const currentBurn = Number(monthlyExpenses) - Number(monthlyRevenue);
    
    // If we have positive cash flow, runway is infinity (return -1 as a marker)
    if (currentBurn <= 0) return -1;
    
    // Without growth, simple calculation
    if (revenueGrowth === 0 && expenseGrowth === 0) {
      return Math.floor(Number(cashBalance) / currentBurn);
    }
    
    // With growth, we need to simulate month by month
    let remainingCash = Number(cashBalance);
    let currentRevenue = Number(monthlyRevenue);
    let currentExpenses = Number(monthlyExpenses);
    let months = 0;
    
    // Cap at 60 months (5 years) to prevent infinite loops
    while (remainingCash > 0 && months < 60) {
      const monthlyBurn = currentExpenses - currentRevenue;
      remainingCash -= monthlyBurn;
      
      // Growth rates
      currentRevenue *= (1 + revenueGrowth / 100);
      currentExpenses *= (1 + expenseGrowth / 100);
      
      months++;
      
      // If revenue exceeds expenses, we've reached profitability
      if (currentRevenue >= currentExpenses) {
        // We'll return this as a special case (infinite runway)
        return -1;
      }
    }
    
    return months;
  }
  
  function calculateBreakEvenDate(): string {
    // If revenue already exceeds expenses, we're already at break-even
    if (Number(monthlyRevenue) >= Number(monthlyExpenses)) {
      return "Already profitable";
    }
    
    // If growth rates don't favor break-even, it'll never happen
    if (revenueGrowth <= expenseGrowth) {
      return "Not on current trajectory";
    }
    
    // Calculate how many months until revenue = expenses
    let currentRevenue = Number(monthlyRevenue);
    let currentExpenses = Number(monthlyExpenses);
    let months = 0;
    
    // Cap at 120 months (10 years) to prevent infinite loops
    while (currentRevenue < currentExpenses && months < 120) {
      currentRevenue *= (1 + revenueGrowth / 100);
      currentExpenses *= (1 + expenseGrowth / 100);
      months++;
    }
    
    if (months >= 120) {
      return "Not within 10 years";
    }
    
    // Calculate the actual date
    const today = new Date();
    const breakEvenMonth = new Date(today.setMonth(today.getMonth() + months));
    return breakEvenMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  
  function generateScenarios() {
    return [
      {
        label: "Conservative",
        runway: calculateScenarioRunway(revenueGrowth - 2, expenseGrowth + 1),
        color: "text-amber-500"
      },
      {
        label: "Base Case",
        runway: runwayMonths,
        color: "text-blue-500"
      },
      {
        label: "Optimistic",
        runway: calculateScenarioRunway(revenueGrowth + 3, expenseGrowth - 1),
        color: "text-green-500"
      }
    ];
  }
  
  function calculateScenarioRunway(revGrowth: number, expGrowth: number): number {
    const currentBurn = Number(monthlyExpenses) - Number(monthlyRevenue);
    
    // If we have positive cash flow, runway is infinity (return -1 as a marker)
    if (currentBurn <= 0) return -1;
    
    // With growth, we need to simulate month by month
    let remainingCash = Number(cashBalance);
    let currentRevenue = Number(monthlyRevenue);
    let currentExpenses = Number(monthlyExpenses);
    let months = 0;
    
    // Cap at 60 months (5 years) to prevent infinite loops
    while (remainingCash > 0 && months < 60) {
      const monthlyBurn = currentExpenses - currentRevenue;
      remainingCash -= monthlyBurn;
      
      // Growth rates
      currentRevenue *= (1 + revGrowth / 100);
      currentExpenses *= (1 + expGrowth / 100);
      
      months++;
      
      // If revenue exceeds expenses, we've reached profitability
      if (currentRevenue >= currentExpenses) {
        return -1;
      }
    }
    
    return months;
  }
  
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  function formatRunway(months: number): string {
    if (months === -1) {
      return "∞ (Profitable)";
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Burn Rate & Runway Calculator</h1>
            <p className="text-muted-foreground max-w-2xl">
              Track your cash burn, estimate runway, and plan for different scenarios to ensure your startup's financial health.
            </p>
          </div>
          
          <div className="flex gap-2 items-center bg-background shadow-sm rounded-lg p-2 border">
            <Wallet className="h-5 w-5 text-primary" />
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

        {plan === "professional" ? (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calculator" className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  <span>Runway Calculator</span>
                </TabsTrigger>
                <TabsTrigger value="scenarios" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Scenario Planning</span>
                </TabsTrigger>
                <TabsTrigger value="visualize" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span>Visualize</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="calculator">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Inputs</CardTitle>
                        <CardDescription>
                          Enter your current financial data
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cash-balance">Current Cash Balance</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                              {selectedCurrency.symbol}
                            </span>                            <Input
                              id="cash-balance"
                              type="text"
                              className="pl-8 h-10"
                              value={cashBalance}
                              onChange={e => setCashBalance(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="monthly-revenue">Monthly Revenue</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                              {selectedCurrency.symbol}
                            </span>                            <Input
                              id="monthly-revenue"
                              type="text"
                              className="pl-8 h-10"
                              value={monthlyRevenue}
                              onChange={e => setMonthlyRevenue(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="monthly-expenses">Monthly Expenses</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                              {selectedCurrency.symbol}
                            </span>                            <Input
                              id="monthly-expenses"
                              type="text"
                              className="pl-8 h-10"
                              value={monthlyExpenses}
                              onChange={e => setMonthlyExpenses(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="revenue-growth">Monthly Revenue Growth</Label>
                            <span className="text-sm text-muted-foreground">{revenueGrowth}%</span>
                          </div>
                          <Slider
                            id="revenue-growth"
                            min={0}
                            max={20}
                            step={0.5}
                            value={[revenueGrowth]}
                            onValueChange={(values) => setRevenueGrowth(values[0])}
                            className="py-2"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="expense-growth">Monthly Expense Growth</Label>
                            <span className="text-sm text-muted-foreground">{expenseGrowth}%</span>
                          </div>
                          <Slider
                            id="expense-growth"
                            min={0}
                            max={10}
                            step={0.5}
                            value={[expenseGrowth]}
                            onValueChange={(values) => setExpenseGrowth(values[0])}
                            className="py-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Projections</CardTitle>
                        <CardDescription>
                          Based on your current financial data
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <TrendingDown className={cn(
                                "h-5 w-5",
                                burnRate <= 0 ? "text-green-500" : "text-red-500"
                              )} />
                              <h3 className="font-semibold">Monthly Burn Rate</h3>
                            </div>
                            <div className={cn(
                              "text-2xl font-bold",
                              burnRate <= 0 ? "text-green-500" : "text-red-500"
                            )}>
                              {burnRate <= 0 
                                ? `+${formatCurrency(Math.abs(burnRate))}` 
                                : formatCurrency(burnRate)}
                              <span className="text-sm font-normal text-muted-foreground ml-2">per month</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {burnRate <= 0 
                                ? "You have positive cash flow! You're generating more revenue than expenses." 
                                : "This is how much cash your company is using each month."}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-blue-500" />
                              <h3 className="font-semibold">Cash Runway</h3>
                            </div>
                            <div className="text-2xl font-bold text-blue-500">
                              {formatRunway(runwayMonths)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {runwayMonths === -1 
                                ? "You're cash flow positive! Your runway is unlimited." 
                                : `At your current burn rate, your cash will last until approximately ${new Date(new Date().setMonth(new Date().getMonth() + runwayMonths)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-purple-500" />
                              <h3 className="font-semibold">Break-Even Point</h3>
                            </div>
                            <div className="text-2xl font-bold text-purple-500">
                              {breakEvenDate}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {breakEvenDate === "Already profitable" 
                                ? "Congratulations! Your revenue already exceeds your expenses." 
                                : breakEvenDate === "Not on current trajectory" 
                                ? "Your expenses are growing faster than revenue. Adjust your growth rates to reach break-even." 
                                : `If growth rates remain consistent, you'll reach break-even by ${breakEvenDate}.`}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => setActiveTab("visualize")}
                        >
                          <LineChart className="h-4 w-4" />
                          <span>Visualize Cash Flow</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="scenarios">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scenario Analysis</CardTitle>
                      <CardDescription>
                        Compare different financial scenarios and their impact on your runway
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {scenarios.map((scenario, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4">
                              <div className="flex items-center gap-2">
                                <div className={cn("p-2 rounded-full bg-muted", scenario.color)}>
                                  {index === 0 ? (
                                    <TrendingDown className="h-4 w-4" />
                                  ) : index === 1 ? (
                                    <ArrowRight className="h-4 w-4" />
                                  ) : (
                                    <TrendingUp className="h-4 w-4" />
                                  )}
                                </div>
                                <h3 className="font-semibold">{scenario.label}</h3>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Runway</p>
                                <div className={cn("text-xl font-bold", scenario.color)}>
                                  {formatRunway(scenario.runway)}
                                </div>
                              </div>
                              
                              <div className="text-sm">
                                {index === 0 && (
                                  <p>Lower revenue growth ({revenueGrowth - 2}%), higher expense growth ({expenseGrowth + 1}%)</p>
                                )}
                                {index === 1 && (
                                  <p>Current projections with {revenueGrowth}% revenue and {expenseGrowth}% expense growth</p>
                                )}
                                {index === 2 && (
                                  <p>Higher revenue growth ({revenueGrowth + 3}%), lower expense growth ({expenseGrowth - 1}%)</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <h3 className="font-semibold">Runway Analysis Recommendations</h3>
                          </div>
                          
                          <div className="space-y-3">
                            <p className="text-sm">
                              {runwayMonths < 6 && runwayMonths !== -1 ? (
                                <span className="text-red-500 font-medium">Critical runway alert: Less than 6 months remaining.</span>
                              ) : runwayMonths < 12 && runwayMonths !== -1 ? (
                                <span className="text-amber-500 font-medium">Caution: Less than 12 months of runway.</span>
                              ) : runwayMonths === -1 ? (
                                <span className="text-green-500 font-medium">Strong position: Cash flow positive.</span>
                              ) : (
                                <span className="text-blue-500 font-medium">Healthy runway: {formatRunway(runwayMonths)} remaining.</span>
                              )}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-start gap-2">
                                <Plus className="h-4 w-4 text-green-500 mt-0.5" />
                                <p>
                                  <span className="font-medium">Revenue opportunities:</span> {' '}
                                  {Number(monthlyRevenue) < Number(monthlyExpenses) ? 
                                    `Increase revenue by at least ${formatCurrency(Number(monthlyExpenses) - Number(monthlyRevenue))} monthly to achieve break-even.` :
                                    `Continue growing revenue to increase your cash reserves.`}
                                </p>
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <Minus className="h-4 w-4 text-red-500 mt-0.5" />
                                <p>
                                  <span className="font-medium">Cost-cutting potential:</span> {' '}
                                  Look for opportunities to reduce monthly expenses without hampering growth, especially in non-core activities.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="visualize">
                  <Card>
                    <CardHeader>
                      <CardTitle>Runway Visualization</CardTitle>
                      <CardDescription>
                        Visualize your cash flow and runway projections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RunwayTabContent 
                        metrics={demoMetrics} 
                        selectedCurrency={selectedCurrency} 
                        visualize={true}
                        cashBalance={Number(cashBalance)}
                        monthlyRevenue={Number(monthlyRevenue)}
                        monthlyExpenses={Number(monthlyExpenses)}
                        revenueGrowth={revenueGrowth}
                        expenseGrowth={expenseGrowth}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Runway Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Most investors recommend maintaining a minimum of 12-18 months of runway to provide sufficient time for business development and fundraising.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-blue-500" />
                    Path to Profitability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    In challenging funding environments, demonstrating a clear path to profitability is critical for raising capital and ensuring business sustainability.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Crisis Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Always have a financial contingency plan that can extend runway by 30-50% through cost-cutting if market conditions deteriorate unexpectedly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="p-8 border rounded-lg bg-muted/30 text-center">
            <TrendingDown className="h-12 w-12 mx-auto mb-4 text-primary/70" />
            <h3 className="text-xl font-semibold mb-2">Pro Feature</h3>
            <p className="mb-6 text-muted-foreground max-w-md mx-auto">
              Access our advanced burn rate calculator with scenario planning, cash flow visualization, and actionable recommendations.
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
