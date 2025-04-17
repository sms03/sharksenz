
import { BarChart as BarChartIcon } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/utils/currency";

// Sample data for revenue multiple visualization
const revenueMultipleData = [
  { revenue: 'Annual Revenue', value: 1000000 },
  { revenue: '3x Multiple', value: 3000000 },
  { revenue: '5x Multiple', value: 5000000 },
  { revenue: '7x Multiple', value: 7000000 },
  { revenue: '10x Multiple', value: 10000000 },
];

interface RevenueMultipleChartProps {
  currency?: { code: string; symbol: string; name: string };
}

export default function RevenueMultipleChart({ currency = { code: "USD", symbol: "$", name: "US Dollar" } }: RevenueMultipleChartProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 flex items-center gap-2 font-semibold">
        <BarChartIcon className="h-5 w-5 text-shark-500" />
        Revenue Multiple Method
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Calculation: Annual Revenue × Multiple (typically 3-10x for early-stage companies)
      </p>
      <div className="mt-4 h-48 rounded-md">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueMultipleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="revenue" />
            <YAxis tickFormatter={(value) => formatCurrency(value, currency).split('.')[0]} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value, currency), 'Valuation']} 
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Bar dataKey="value" fill="#0EA5E9" name="Valuation" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
