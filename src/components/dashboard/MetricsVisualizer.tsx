import { useRef, useEffect, useState } from "react";
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
import { gsap } from "gsap";

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
  const [previousChartType, setPreviousChartType] = useState(chartType);
  const chartContainerRef = useRef(null);
  const headerRef = useRef(null);
  
  // Animation for chart type transitions
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Only animate if the chart type has changed
    if (previousChartType !== chartType) {
      // Animation timeline for smooth chart transitions
      const tl = gsap.timeline();
      
      // Animate out current chart
      tl.to(chartContainerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in"
      });
      
      // Set a slight delay before animating in new chart
      tl.add(() => {
        setPreviousChartType(chartType);
      });
      
      // Animate in new chart
      tl.to(chartContainerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }, [chartType, previousChartType]);
  
  // Initial load animation
  useEffect(() => {
    // Header animation
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
    
    // Chart container animation
    gsap.fromTo(
      chartContainerRef.current,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.7, 
        delay: 0.2,
        ease: "power2.out" 
      }
    );
  }, []);
  
  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4" ref={headerRef}>
        <h3 className="text-xl font-semibold">Metrics Visualization</h3>
        <ChartSelector chartType={chartType} setChartType={setChartType} />
      </div>
      <div ref={chartContainerRef} className="transition-all relative">
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
        
        {/* Add decorative animated elements */}
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-shark-500/5 rounded-full blur-xl animate-pulse opacity-70 pointer-events-none"></div>
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-shark-600/5 rounded-full blur-xl animate-pulse opacity-70 pointer-events-none"></div>
      </div>
    </div>
  );
}
