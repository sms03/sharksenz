import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ChartSelector from "./ChartSelector";
import LineChartComponent from "./charts/LineChartComponent";
import PieChartComponent from "./charts/PieChartComponent";
import ChartContainer from "./charts/ChartContainer";
import BarChartComponent from "./charts/BarChartComponent";
import DonutChartComponent from "./charts/DonutChartComponent";
import AreaChartComponent from "./charts/AreaChartComponent";
import StackedBarChartComponent from "./charts/StackedBarChartComponent";
import RadarChartComponent from "./charts/RadarChartComponent";

interface MetricsVisualizerProps {
  chartType: string;
  setChartType: (type: string) => void;
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export interface ChartComponentProps {
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export default function MetricsVisualizer({ 
  chartType, 
  setChartType, 
  selectedCurrency,
  metrics
}: MetricsVisualizerProps) {
  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">Metrics Visualization</h3>
        <ChartSelector chartType={chartType} setChartType={setChartType} />
      </div>
      <ChartContainer>
        {chartType === "bar" && (
          <BarChartComponent selectedCurrency={selectedCurrency} metrics={metrics} />
        )}
        {chartType === "line" && (
          <LineChartComponent selectedCurrency={selectedCurrency} metrics={metrics} />
        )}
        {chartType === "pie" && (
          <PieChartComponent selectedCurrency={selectedCurrency} metrics={metrics} />
        )}
        {chartType === "donut" && (
          <DonutChartComponent selectedCurrency={selectedCurrency} metrics={metrics} />
        )}
        {chartType === "area" && (
          <AreaChartComponent selectedCurrency={selectedCurrency} metrics={metrics} />
        )}
        {chartType === "stacked" && (
          <StackedBarChartComponent selectedCurrency={selectedCurrency} metrics={metrics} />
        )}
        {chartType === "radar" && (
          <RadarChartComponent selectedCurrency={selectedCurrency} metrics={metrics} />
        )}
      </ChartContainer>
    </div>
  );
}
