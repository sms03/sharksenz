import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/utils/currency";

interface AreaChartComponentProps {
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export default function AreaChartComponent({ selectedCurrency, metrics }: AreaChartComponentProps) {
  const data = [
    { name: "Valuation", value: metrics.valuation },
    { name: "Burn Rate", value: metrics.monthlyBurnRate },
    { name: "Runway", value: metrics.runway },
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
          <Tooltip formatter={(value: number) => [formatCurrency(value, selectedCurrency), 'Value']} />
          <Legend />
          <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#bae6fd" name="Metric Value" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}