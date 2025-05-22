
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

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("metrics");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Startup Analytics Dashboard</h1>
        <p className="text-gray-600">
          Track, analyze, and project your startup's financial health and market position
        </p>
      </div>

      <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="profit">Profit Projection</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
          <TabsTrigger value="burn">Burn Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Startup Metrics Calculator
              </CardTitle>
              <CardDescription>
                Calculate and track key performance metrics for your startup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Revenue Calculator
              </CardTitle>
              <CardDescription>
                Project and analyze your revenue streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Profit Projection
              </CardTitle>
              <CardDescription>
                Forecast your profit margins over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfitProjection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Market Analysis
              </CardTitle>
              <CardDescription>
                Real-time AI-powered market trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valuation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Valuation Calculator
              </CardTitle>
              <CardDescription>
                Estimate your startup's valuation using different methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValuationCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="burn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Burn Rate & Runway
              </CardTitle>
              <CardDescription>
                Calculate your burn rate and cash runway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BurnRateCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
