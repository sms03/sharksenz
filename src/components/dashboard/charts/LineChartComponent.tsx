import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area } from "recharts";
import { sampleRevenueData } from "@/data/chartData";
import { formatCurrency } from "@/utils/currency";

interface LineChartComponentProps {
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export default function LineChartComponent({ selectedCurrency, metrics }: LineChartComponentProps) {
  const data = [
    { name: "Valuation", value: metrics.valuation },
    { name: "Burn Rate", value: metrics.monthlyBurnRate },
    { name: "Runway (months)", value: metrics.runway },
    { name: "LTV", value: metrics.ltv },
    { name: "LTV:CAC", value: metrics.ltvCacRatio },
  ];
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [
              `${formatCurrency(value, selectedCurrency)}`,
              'Value'
            ]}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            fill="#93c5fd" 
            name="Metric Value"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
