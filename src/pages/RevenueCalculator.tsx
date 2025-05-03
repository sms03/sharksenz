import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  DollarSign, 
  Users, 
  LineChart, 
  TrendingUp, 
  ArrowRight, 
  BarChart3,
  Calculator,
  Building,
  Target,
  ListChecks
} from "lucide-react";
import { currencies } from "@/utils/currency";
import { cn } from "@/lib/utils";

// Revenue models
const revenueModels = [
  {
    id: "subscription",
    name: "Subscription",
    description: "Monthly or annual recurring revenue from subscribers",
    icon: Users,
    color: "bg-blue-100 dark:bg-blue-900 text-blue-500"
  },
  {
    id: "transaction",
    name: "Transaction",
    description: "Revenue from individual sales or transactions",
    icon: DollarSign,
    color: "bg-green-100 dark:bg-green-900 text-green-500"
  },
  {
    id: "freemium",
    name: "Freemium",
    description: "Free basic version with premium paid features",
    icon: Target,
    color: "bg-purple-100 dark:bg-purple-900 text-purple-500"
  },
  {
    id: "advertising",
    name: "Advertising",
    description: "Revenue from ads displayed to users",
    icon: Building,
    color: "bg-amber-100 dark:bg-amber-900 text-amber-500"
  }
];

export default function RevenueCalculator() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(() => localStorage.getItem("user_plan") || "free");
  const [activeTab, setActiveTab] = useState("subscription");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showResults, setShowResults] = useState(false);
  
  // Common inputs
  const [customerBase, setCustomerBase] = useState("1000");
  const [growthRate, setGrowthRate] = useState(5); // monthly percentage
  const [conversionRate, setConversionRate] = useState(2); // percentage
  const [timeframe, setTimeframe] = useState(12); // months
  
  // Model-specific inputs
  const [subscriptionPrice, setSubscriptionPrice] = useState("20");
  const [churnRate, setChurnRate] = useState(5); // percentage
  
  const [transactionValue, setTransactionValue] = useState("50");
  const [repeatPurchaseRate, setRepeatPurchaseRate] = useState(20); // percentage
  
  const [premiumConversionRate, setPremiumConversionRate] = useState(5); // percentage
  const [premiumPrice, setPremiumPrice] = useState("15");
  
  const [adImpressions, setAdImpressions] = useState("10000");
  const [cpmRate, setCpmRate] = useState("2"); // cost per mille (thousand impressions)
  
  // Results
  const [revenueProjections, setRevenueProjections] = useState<number[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgMonthlyRevenue, setAvgMonthlyRevenue] = useState(0);
  
  useEffect(() => {
    setPlan(localStorage.getItem("user_plan") || "free");
  }, [user]);
  
  // Calculate projections when inputs change
  useEffect(() => {
    if (showResults) {
      calculateRevenue();
    }
  }, [
    activeTab, 
    customerBase, 
    growthRate, 
    conversionRate, 
    timeframe, 
    subscriptionPrice, 
    churnRate,
    transactionValue,
    repeatPurchaseRate,
    premiumConversionRate,
    premiumPrice,
    adImpressions,
    cpmRate,
    showResults
  ]);
  
  const calculateRevenue = () => {
    let monthlyProjections: number[] = [];
    let customers = parseInt(customerBase) || 0;
    let total = 0;
    
    // Different calculation logic based on revenue model
    if (activeTab === "subscription") {
      for (let month = 1; month <= timeframe; month++) {
        // Apply growth but also account for churn
        const newCustomers = Math.floor(customers * (growthRate / 100));
        const churnedCustomers = Math.floor(customers * (churnRate / 100));
        customers = customers + newCustomers - churnedCustomers;
        
        // Calculate month's revenue
        const monthRevenue = customers * (parseInt(subscriptionPrice) || 0);
        monthlyProjections.push(monthRevenue);
        total += monthRevenue;
      }
    } 
    else if (activeTab === "transaction") {
      for (let month = 1; month <= timeframe; month++) {
        // Grow customer base
        customers = customers + Math.floor(customers * (growthRate / 100));
        
        // Calculate transactions
        const transactions = customers * (1 + (repeatPurchaseRate / 100));
        const monthRevenue = transactions * (parseInt(transactionValue) || 0);
        monthlyProjections.push(monthRevenue);
        total += monthRevenue;
      }
    }
    else if (activeTab === "freemium") {
      for (let month = 1; month <= timeframe; month++) {
        // Grow user base
        customers = customers + Math.floor(customers * (growthRate / 100));
        
        // Calculate premium conversions
        const premiumUsers = Math.floor(customers * (premiumConversionRate / 100));
        const monthRevenue = premiumUsers * (parseInt(premiumPrice) || 0);
        monthlyProjections.push(monthRevenue);
        total += monthRevenue;
      }
    }
    else if (activeTab === "advertising") {
      let impressions = parseInt(adImpressions) || 0;
      
      for (let month = 1; month <= timeframe; month++) {
        // Grow impressions with user base
        impressions = impressions + Math.floor(impressions * (growthRate / 100));
        
        // Calculate ad revenue (CPM = cost per 1000 impressions)
        const cpm = parseFloat(cpmRate) || 0;
        const monthRevenue = (impressions / 1000) * cpm;
        monthlyProjections.push(monthRevenue);
        total += monthRevenue;
      }
    }
    
    setRevenueProjections(monthlyProjections);
    setTotalRevenue(total);
    setAvgMonthlyRevenue(total / timeframe);
  };
  
  const handleCalculate = () => {
    setShowResults(true);
    calculateRevenue();
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Revenue Calculator</h1>
            <p className="text-muted-foreground max-w-2xl">
              Project your future revenue based on different business models and growth scenarios.
            </p>
          </div>
          
          <div className="flex gap-2 items-center bg-background shadow-sm rounded-lg p-2 border">
            <DollarSign className="h-5 w-5 text-primary" />
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

        {plan === "professional" || plan === "starter" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {revenueModels.map((model) => (
                <Card 
                  key={model.id} 
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    activeTab === model.id 
                      ? "border-primary shadow-md" 
                      : "border-transparent hover:border-primary/40"
                  )}
                  onClick={() => {
                    setActiveTab(model.id);
                    setShowResults(false);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className={cn("p-2 w-fit rounded-md mb-2", model.color.split(" ").slice(0, 2).join(" "))}>
                      <model.icon className={cn("h-5 w-5", model.color.split(" ").slice(-1)[0])} />
                    </div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value);
              setShowResults(false);
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {revenueModels.map(model => (
                  <TabsTrigger key={model.id} value={model.id} className="flex items-center gap-2">
                    <model.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{model.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    {revenueModels.find(m => m.id === activeTab)?.name} Revenue Calculator
                  </CardTitle>
                  <CardDescription>
                    Enter your business metrics to project future revenue
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Base Metrics</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customer-base">
                          {activeTab === "advertising" ? "Monthly Active Users" : "Initial Customer Base"}
                        </Label>
                        <Input
                          id="customer-base"
                          type="text"
                          value={customerBase}
                          onChange={e => setCustomerBase(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="growth-rate">Monthly Growth Rate</Label>
                          <span className="text-sm text-muted-foreground">{growthRate}%</span>
                        </div>
                        <Slider
                          id="growth-rate"
                          min={0}
                          max={20}
                          step={0.5}
                          value={[growthRate]}
                          onValueChange={(values) => setGrowthRate(values[0])}
                          className="py-2"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="timeframe">Projection Timeframe</Label>
                          <span className="text-sm text-muted-foreground">{timeframe} months</span>
                        </div>
                        <Slider
                          id="timeframe"
                          min={3}
                          max={36}
                          step={1}
                          value={[timeframe]}
                          onValueChange={(values) => setTimeframe(values[0])}
                          className="py-2"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Model-Specific Metrics</h3>
                      
                      {/* Subscription Model Inputs */}
                      {activeTab === "subscription" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="subscription-price">Monthly Subscription Price</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency.symbol}
                              </span>
                              <Input
                                id="subscription-price"
                                type="text"
                                className="pl-8"
                                value={subscriptionPrice}
                                onChange={e => setSubscriptionPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="churn-rate">Monthly Churn Rate</Label>
                              <span className="text-sm text-muted-foreground">{churnRate}%</span>
                            </div>
                            <Slider
                              id="churn-rate"
                              min={0}
                              max={15}
                              step={0.1}
                              value={[churnRate]}
                              onValueChange={(values) => setChurnRate(values[0])}
                              className="py-2"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Transaction Model Inputs */}
                      {activeTab === "transaction" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="transaction-value">Average Transaction Value</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency.symbol}
                              </span>
                              <Input
                                id="transaction-value"
                                type="text"
                                className="pl-8"
                                value={transactionValue}
                                onChange={e => setTransactionValue(e.target.value.replace(/[^0-9.]/g, ''))}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="repeat-purchase">Repeat Purchase Rate</Label>
                              <span className="text-sm text-muted-foreground">{repeatPurchaseRate}%</span>
                            </div>
                            <Slider
                              id="repeat-purchase"
                              min={0}
                              max={100}
                              step={1}
                              value={[repeatPurchaseRate]}
                              onValueChange={(values) => setRepeatPurchaseRate(values[0])}
                              className="py-2"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Freemium Model Inputs */}
                      {activeTab === "freemium" && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="premium-conversion">Premium Conversion Rate</Label>
                              <span className="text-sm text-muted-foreground">{premiumConversionRate}%</span>
                            </div>
                            <Slider
                              id="premium-conversion"
                              min={0}
                              max={20}
                              step={0.1}
                              value={[premiumConversionRate]}
                              onValueChange={(values) => setPremiumConversionRate(values[0])}
                              className="py-2"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="premium-price">Premium Monthly Price</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency.symbol}
                              </span>
                              <Input
                                id="premium-price"
                                type="text"
                                className="pl-8"
                                value={premiumPrice}
                                onChange={e => setPremiumPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Advertising Model Inputs */}
                      {activeTab === "advertising" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="ad-impressions">Monthly Ad Impressions</Label>
                            <Input
                              id="ad-impressions"
                              type="text"
                              value={adImpressions}
                              onChange={e => setAdImpressions(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cpm-rate">CPM Rate</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground">
                                {selectedCurrency.symbol}
                              </span>
                              <Input
                                id="cpm-rate"
                                type="text"
                                className="pl-8"
                                value={cpmRate}
                                onChange={e => setCpmRate(e.target.value.replace(/[^0-9.]/g, ''))}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Cost per 1000 impressions
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button onClick={handleCalculate} className="gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculate Revenue
                  </Button>
                </CardFooter>
              </Card>
              
              {showResults && (
                <Card className="mt-6 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-green-500" />
                      Revenue Projections ({timeframe} months)
                    </CardTitle>
                    <CardDescription>
                      Based on your {revenueModels.find(m => m.id === activeTab)?.name.toLowerCase()} revenue model
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold text-primary">
                              {formatCurrency(totalRevenue)}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-primary/30" />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Average Monthly Revenue</p>
                            <p className="text-2xl font-bold text-primary">
                              {formatCurrency(avgMonthlyRevenue)}
                            </p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-primary/30" />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Final Monthly Revenue</p>
                            <p className="text-2xl font-bold text-primary">
                              {formatCurrency(revenueProjections[revenueProjections.length - 1])}
                            </p>
                          </div>
                          <ArrowRight className="h-8 w-8 text-primary/30" />
                        </div>
                      </div>
                      
                      <div className="h-64 flex items-center justify-center p-4 bg-muted rounded-lg">
                        <div className="text-center">
                          <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">Revenue Trend</h3>
                          <p className="text-sm text-muted-foreground">
                            {/* In a real implementation, this would be a chart component */}
                            Your revenue is projected to grow from 
                            {formatCurrency(revenueProjections[0])} to 
                            {formatCurrency(revenueProjections[revenueProjections.length - 1])} per month
                            over the {timeframe}-month period.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 border rounded-lg">
                      <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                        <ListChecks className="h-5 w-5 text-blue-500" />
                        Key Insights
                      </h3>
                      
                      <ul className="space-y-2 text-sm">
                        {activeTab === "subscription" && (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                A <strong>{churnRate}%</strong> monthly churn rate means you need to add at least
                                <strong> {Math.floor(parseInt(customerBase) * (churnRate / 100))} </strong>
                                new customers each month just to maintain your current subscriber count.
                              </p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                Your Customer Lifetime Value (LTV) is approximately 
                                <strong> {formatCurrency(parseInt(subscriptionPrice) * (100 / churnRate))}</strong>,
                                based on your current subscription price and churn rate.
                              </p>
                            </li>
                          </>
                        )}
                        
                        {activeTab === "transaction" && (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                With a <strong>{repeatPurchaseRate}%</strong> repeat purchase rate, focus on customer 
                                retention strategies to increase this metric, as it directly impacts revenue.
                              </p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                Increasing your average transaction value by just 10% to 
                                <strong> {formatCurrency(parseFloat(transactionValue) * 1.1)}</strong> would 
                                generate an additional 
                                <strong> {formatCurrency(totalRevenue * 0.1)}</strong> in revenue.
                              </p>
                            </li>
                          </>
                        )}
                        
                        {activeTab === "freemium" && (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                Your current premium conversion rate of <strong>{premiumConversionRate}%</strong> is 
                                {premiumConversionRate < 3 ? " below" : premiumConversionRate > 5 ? " above" : " near"} 
                                the industry average of 3-5% for freemium products.
                              </p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                Increasing your premium conversion rate by just 1 percentage point would add approximately
                                <strong> {formatCurrency((totalRevenue / premiumConversionRate) * 1)}</strong> to your total revenue.
                              </p>
                            </li>
                          </>
                        )}
                        
                        {activeTab === "advertising" && (
                          <>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                At your current CPM rate of <strong>{selectedCurrency.symbol}{cpmRate}</strong>, you need
                                <strong> {(1000000 / parseFloat(cpmRate)).toLocaleString()}</strong> impressions to generate 
                                {formatCurrency(1000)} in revenue.
                              </p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs">✓</span>
                              </div>
                              <p>
                                Increasing your user engagement to grow impressions by 20% would add approximately
                                <strong> {formatCurrency(totalRevenue * 0.2)}</strong> to your total revenue over the projection period.
                              </p>
                            </li>
                          </>
                        )}
                        
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex-shrink-0 mt-0.5 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-700 text-xs">✓</span>
                          </div>
                          <p>
                            At your current growth rate of <strong>{growthRate}%</strong> per month, 
                            your business is on track to {growthRate >= 10 ? "more than double" : growthRate >= 5 ? "grow significantly" : "grow steadily"} 
                            over the next year.
                          </p>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </Tabs>
          </div>
        ) : (
          <div className="p-8 border rounded-lg bg-muted/30 text-center">
            <LineChart className="h-12 w-12 mx-auto mb-4 text-primary/70" />
            <h3 className="text-xl font-semibold mb-2">Pro Feature</h3>
            <p className="mb-6 text-muted-foreground max-w-md mx-auto">
              Access our advanced revenue calculator with multiple business models, projected growth analysis, and actionable insights.
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