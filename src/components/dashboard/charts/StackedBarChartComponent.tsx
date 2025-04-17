import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/utils/currency";

interface StackedBarChartComponentProps {
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export default function StackedBarChartComponent({ selectedCurrency, metrics }: StackedBarChartComponentProps) {
  // Example: stack valuation and LTV, burn rate and runway, ltvCacRatio as separate
  const data = [
    { name: "Valuation & LTV", valuation: metrics.valuation, ltv: metrics.ltv },
    { name: "Burn & Runway", burn: metrics.monthlyBurnRate, runway: metrics.runway },
    { name: "LTV:CAC", ltvCacRatio: metrics.ltvCacRatio },
  ];
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => [formatCurrency(value, selectedCurrency), 'Value']} />
          <Legend />
          <Bar dataKey="valuation" stackId="a" fill="#3b82f6" name="Valuation" />
          <Bar dataKey="ltv" stackId="a" fill="#10b981" name="LTV" />
          <Bar dataKey="burn" stackId="b" fill="#ef4444" name="Burn Rate" />
          <Bar dataKey="runway" stackId="b" fill="#f59e0b" name="Runway" />
          <Bar dataKey="ltvCacRatio" fill="#a21caf" name="LTV:CAC" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}