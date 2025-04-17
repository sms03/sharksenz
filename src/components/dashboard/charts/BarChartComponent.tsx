import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { formatCurrency } from "@/utils/currency";

interface BarChartComponentProps {
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export default function BarChartComponent({ selectedCurrency, metrics }: BarChartComponentProps) {
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
        <BarChart data={data}>
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
          <Bar dataKey="value" fill="#3b82f6" name="Metric Value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
