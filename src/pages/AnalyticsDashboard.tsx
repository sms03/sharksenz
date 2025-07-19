import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MetricsCalculator from "@/components/analytics/MetricsCalculator";
import RevenueCalculator from "@/components/analytics/RevenueCalculator";
import ProfitProjection from "@/components/analytics/ProfitProjection";
import ValuationCalculator from "@/components/analytics/ValuationCalculator";
import BurnRateCalculator from "@/components/analytics/BurnRateCalculator";
import TimelinePlanner from "@/components/analytics/TimelinePlanner";
import { GuidedTour } from "@/components/GuidedTour";
import { BarChart, LineChart, Info, Target, TrendingUp, Calendar, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Custom styles for responsive tabs
const tabStyles = `
  @media (max-width: 640px) {
    .tab-list-scroll {
      padding-bottom: 8px;
      margin-bottom: 4px;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }
    
    .tab-list-scroll:after {
      content: '';
      display: block;
      min-width: 12px;
      height: 1px;
    }
  }
`;

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("metrics");
  const [showTour, setShowTour] = useState(false);
  
  // Cohort benchmarks data - industry standards
  const cohortBenchmarks = {
    saas: {
      ltvcac: { good: 3, excellent: 5, current: 0 },
      churnRate: { good: 5, excellent: 2, current: 0 },
      grossMargin: { good: 80, excellent: 90, current: 0 },
      paybackPeriod: { good: 12, excellent: 6, current: 0 }
    },
    ecommerce: {
      ltvcac: { good: 2.5, excellent: 4, current: 0 },
      churnRate: { good: 10, excellent: 5, current: 0 },
      grossMargin: { good: 60, excellent: 80, current: 0 },
      paybackPeriod: { good: 8, excellent: 4, current: 0 }
    },
    marketplace: {
      ltvcac: { good: 4, excellent: 7, current: 0 },
      churnRate: { good: 8, excellent: 3, current: 0 },
      grossMargin: { good: 70, excellent: 85, current: 0 },
      paybackPeriod: { good: 10, excellent: 6, current: 0 }
    }
  };

  // Common investor objections AI digest
  const investorObjections = [
    {
      objection: "Market size too small",
      frequency: "87%",
      response: "Demonstrate TAM/SAM/SOM breakdown with realistic growth assumptions",
      priority: "high"
    },
    {
      objection: "Competitive advantage unclear",
      frequency: "76%",
      response: "Highlight unique IP, network effects, or switching costs",
      priority: "high"
    },
    {
      objection: "Unit economics don't work",
      frequency: "69%",
      response: "Show path to positive LTV:CAC ratio >3:1 with timeline",
      priority: "critical"
    },
    {
      objection: "Go-to-market strategy vague",
      frequency: "64%",
      response: "Present specific customer acquisition channels with CAC data",
      priority: "high"
    },
    {
      objection: "Team lacks domain expertise",
      frequency: "58%",
      response: "Highlight relevant experience or advisory board additions",
      priority: "medium"
    },
    {
      objection: "Timeline too aggressive",
      frequency: "52%",
      response: "Break down milestones with conservative estimates and buffers",
      priority: "medium"
    }
  ];

  const startTour = () => {
    setShowTour(true);
  };  return (
    <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4" data-tour="analytics">
      <style dangerouslySetInnerHTML={{ __html: tabStyles }} />
      
      {/* Header with Tour Button */}
      <div className="mb-6 sm:mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Startup Analytics Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            AI-powered KPI tracking with investor readiness benchmarks and milestone tracking
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={startTour}
          className="flex items-center space-x-2"
        >
          <Info className="w-4 h-4" />
          <span>Take Tour</span>
        </Button>
      </div>

      {/* AI-Powered KPI Tracking */}
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI-Powered KPI Tracking</h2>
              <p className="text-blue-100">
                Your metrics connected to investor readiness benchmarks and milestone tracking
              </p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="bg-green-500 text-white">
                78% Ready for Seed Funding
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold">3.2:1</p>
              <p className="text-sm text-blue-200">LTV:CAC Ratio</p>
              <p className="text-xs text-green-400">✓ Above 3:1 benchmark</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <p className="text-2xl font-bold">23%</p>
              <p className="text-sm text-blue-200">Monthly Growth</p>
              <p className="text-xs text-cyan-400">⚡ Strong growth rate</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold">14 mo</p>
              <p className="text-sm text-blue-200">Runway</p>
              <p className="text-xs text-yellow-400">⚠ Consider extending</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-sm text-blue-200 mb-2">
              🎯 <strong>Next Milestone:</strong> Achieve 18-month runway for Series A readiness
            </p>
            <p className="text-xs text-blue-300">
              💡 AI Recommendation: Focus on improving gross margins to extend runway and attract growth investors
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Investor Objections AI Digest */}
      <Card className="mb-6 border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg text-orange-800">
            <Target className="w-5 h-5 mr-2" />
            AI Digest: Common Investor Objections
          </CardTitle>
          <CardDescription>
            Prepare for these frequent investor concerns based on 1000+ pitch analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {investorObjections.slice(0, 3).map((item, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={item.priority === 'critical' ? 'destructive' : item.priority === 'high' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.frequency}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.priority}</span>
                </div>
                <h4 className="font-semibold text-sm text-orange-900 mb-1">{item.objection}</h4>
                <p className="text-xs text-gray-600">{item.response}</p>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3 text-orange-600">
            View all objections & responses →
          </Button>
        </CardContent>
      </Card>

      {/* Cohort Benchmarks Quick View */}
      <Card className="mb-6 border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg text-blue-800">
            <Users className="w-5 h-5 mr-2" />
            Industry Benchmarks
          </CardTitle>
          <CardDescription>
            Compare your metrics against successful startups in your sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">3:1</div>
              <div className="text-xs text-gray-600">Min LTV:CAC</div>
              <div className="text-xs text-green-600">5:1 Excellent</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">&lt;12mo</div>
              <div className="text-xs text-gray-600">CAC Payback</div>
              <div className="text-xs text-green-600">&lt;6mo Excellent</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">&lt;5%</div>
              <div className="text-xs text-gray-600">Monthly Churn</div>
              <div className="text-xs text-green-600">&lt;2% Excellent</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">80%+</div>
              <div className="text-xs text-gray-600">Gross Margin</div>
              <div className="text-xs text-green-600">90%+ Excellent</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-2 -mx-3 px-3 tab-list-scroll">
          <TabsList className="inline-flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 min-w-max sm:min-w-0 w-full">
            <TabsTrigger value="metrics" className="text-xs sm:text-sm whitespace-nowrap flex-1">
              <Target className="w-3 h-3 mr-1" />Metrics
            </TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs sm:text-sm whitespace-nowrap flex-1">
              <LineChart className="w-3 h-3 mr-1" />Revenue
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm whitespace-nowrap flex-1">
              <TrendingUp className="w-3 h-3 mr-1" />Pricing
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm whitespace-nowrap flex-1">
              <Calendar className="w-3 h-3 mr-1" />Timeline
            </TabsTrigger>
            <TabsTrigger value="profit" className="text-xs sm:text-sm whitespace-nowrap flex-1">Profit</TabsTrigger>
            <TabsTrigger value="valuation" className="text-xs sm:text-sm whitespace-nowrap flex-1">Valuation</TabsTrigger>
            <TabsTrigger value="burn" className="text-xs sm:text-sm whitespace-nowrap flex-1">Burn Rate</TabsTrigger>
          </TabsList>
        </div>        <TabsContent value="metrics" className="space-y-4">
          <Card className="overflow-hidden" data-tour="metrics-calculator">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <BarChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Startup Metrics Calculator
                <Badge variant="secondary" className="ml-2 text-xs">Priority #1</Badge>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Calculate LTV:CAC ratio first - it's the #1 metric investors examine. Benchmark: 3:1 minimum, 5:1+ excellent
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <MetricsCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <LineChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Revenue Calculator
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Project and analyze your revenue streams
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <RevenueCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Pricing Strategy Tracker
                <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Track pricing experiments, A/B tests, and optimize your pricing strategy over time
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="space-y-6">
                {/* Current Pricing Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Current Price Point</h4>
                    <div className="text-2xl font-bold text-blue-600">$29/mo</div>
                    <div className="text-sm text-blue-600">Last updated 2 weeks ago</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Conversion Rate</h4>
                    <div className="text-2xl font-bold text-green-600">12.5%</div>
                    <div className="text-sm text-green-600">+2.1% vs last month</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">Price Elasticity</h4>
                    <div className="text-2xl font-bold text-purple-600">-1.8</div>
                    <div className="text-sm text-purple-600">Moderately elastic</div>
                  </div>
                </div>

                {/* Pricing Timeline */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Pricing Timeline & Tests
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">$25 → $29 Price Increase</div>
                        <div className="text-sm text-gray-600">A/B test concluded - 8% churn increase, 15% revenue increase</div>
                      </div>
                      <Badge variant="default">Implemented</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <div className="font-medium">$35 Premium Tier Test</div>
                        <div className="text-sm text-gray-600">Testing higher-value package with advanced features</div>
                      </div>
                      <Badge variant="secondary">Running</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <div className="font-medium">Annual Discount Strategy</div>
                        <div className="text-sm text-gray-600">Planned: 20% annual discount to improve cash flow</div>
                      </div>
                      <Badge variant="outline">Planned</Badge>
                    </div>
                  </div>
                </div>

                {/* Competitor Analysis */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">Competitive Pricing Landscape</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Competitor A</span>
                        <span className="font-medium">$25/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Competitor B</span>
                        <span className="font-medium">$39/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-blue-600">Your Product</span>
                        <span className="font-medium text-blue-600">$29/mo</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Your pricing sits in the middle range. Consider value-based pricing tests to move towards premium positioning.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Timeline & Milestone Planner
                <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Plan and track your startup milestones with realistic timelines and dependencies
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <TimelinePlanner />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <LineChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Profit Projection
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Forecast your profit margins over time
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <ProfitProjection />
            </CardContent>
          </Card>
        </TabsContent>        <TabsContent value="valuation" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <BarChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Valuation Calculator
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Estimate your startup's valuation using different methods
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <ValuationCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="burn" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <LineChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Burn Rate & Runway
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Calculate your burn rate and cash runway
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <BurnRateCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guided Tour Component */}
      <GuidedTour 
        isActive={showTour} 
        onClose={() => setShowTour(false)}
        onComplete={() => setShowTour(false)}
      />
    </div>
  );
};

export default AnalyticsDashboard;
