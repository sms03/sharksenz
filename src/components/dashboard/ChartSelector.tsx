import { BarChart, LineChart, PieChart, Donut, AreaChart, Layers, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ChartSelectorProps {
  chartType: string;
  setChartType: (type: string) => void;
}

export default function ChartSelector({ chartType, setChartType }: ChartSelectorProps) {
  // Get user plan from localStorage (default to free)
  const [plan, setPlan] = useState(() => localStorage.getItem("user_plan") || "free");
  useEffect(() => {
    setPlan(localStorage.getItem("user_plan") || "free");
  }, []);
  const isPaid = plan === "starter" || plan === "professional";
  // Only allow advanced charts for Pro users
  const isPro = plan === "professional";

  return (
    <div className="flex gap-2">
      <Button 
        variant={chartType === "bar" ? "default" : "outline"} 
        size="sm"
        onClick={() => setChartType("bar")}
      >
        <BarChart className="mr-2 h-4 w-4" />
        Bar Chart
      </Button>
      <Button 
        variant={chartType === "line" ? "default" : "outline"} 
        size="sm"
        onClick={() => setChartType("line")}
      >
        <LineChart className="mr-2 h-4 w-4" />
        Line Chart
      </Button>
      <Button 
        variant={chartType === "pie" ? "default" : "outline"} 
        size="sm"
        onClick={() => setChartType("pie")}
      >
        <PieChart className="mr-2 h-4 w-4" />
        Pie Chart
      </Button>
      <Button 
        variant={chartType === "donut" ? "default" : "outline"} 
        size="sm"
        onClick={() => setChartType("donut")}
        disabled={!isPro}
        title={!isPro ? "Upgrade to Pro to unlock Donut Chart" : undefined}
      >
        <Donut className="mr-2 h-4 w-4" />
        Donut Chart
      </Button>
      <Button 
        variant={chartType === "area" ? "default" : "outline"} 
        size="sm"
        onClick={() => setChartType("area")}
        disabled={!isPro}
        title={!isPro ? "Upgrade to Pro to unlock Area Chart" : undefined}
      >
        <AreaChart className="mr-2 h-4 w-4" />
        Area Chart
      </Button>
      <Button 
        variant={chartType === "stacked" ? "default" : "outline"} 
        size="sm"
        onClick={() => setChartType("stacked")}
        disabled={!isPro}
        title={!isPro ? "Upgrade to Pro to unlock Stacked Bar" : undefined}
      >
        <Layers className="mr-2 h-4 w-4" />
        Stacked Bar
      </Button>
      <Button 
        variant={chartType === "radar" ? "default" : "outline"} 
        size="sm"
        onClick={() => setChartType("radar")}
        disabled={!isPro}
        title={!isPro ? "Upgrade to Pro to unlock Radar Chart" : undefined}
      >
        <Radar className="mr-2 h-4 w-4" />
        Radar Chart
      </Button>
    </div>
  );
}
