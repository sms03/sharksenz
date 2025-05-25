import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricsCalculator from "@/components/analytics/MetricsCalculator";
import RevenueCalculator from "@/components/analytics/RevenueCalculator";
import ProfitProjection from "@/components/analytics/ProfitProjection";
import MarketAnalysis from "@/components/analytics/MarketAnalysis";
import ValuationCalculator from "@/components/analytics/ValuationCalculator";
import BurnRateCalculator from "@/components/analytics/BurnRateCalculator";
import { BarChart, LineChart } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("metrics");  return (
    <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4">
      <style dangerouslySetInnerHTML={{ __html: tabStyles }} />
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Startup Analytics Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Track, analyze, and project your startup's financial health and market position
        </p>
      </div>      <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-2 -mx-3 px-3 tab-list-scroll">
          <TabsList className="inline-flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 min-w-max sm:min-w-0 w-full">
            <TabsTrigger value="metrics" className="text-xs sm:text-sm whitespace-nowrap flex-1">Metrics</TabsTrigger>
            <TabsTrigger value="revenue" className="text-xs sm:text-sm whitespace-nowrap flex-1">Revenue</TabsTrigger>
            <TabsTrigger value="profit" className="text-xs sm:text-sm whitespace-nowrap flex-1">Profit Projection</TabsTrigger>
            <TabsTrigger value="market" className="text-xs sm:text-sm whitespace-nowrap flex-1">Market Analysis</TabsTrigger>
            <TabsTrigger value="valuation" className="text-xs sm:text-sm whitespace-nowrap flex-1">Valuation</TabsTrigger>
            <TabsTrigger value="burn" className="text-xs sm:text-sm whitespace-nowrap flex-1">Burn Rate</TabsTrigger>
          </TabsList>
        </div><TabsContent value="metrics" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <BarChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Startup Metrics Calculator
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Calculate and track key performance metrics for your startup
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
        </TabsContent>        <TabsContent value="profit" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <BarChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Market Analysis
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Real-time AI-powered market trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <MarketAnalysis />
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
    </div>
  );
};

export default AnalyticsDashboard;
