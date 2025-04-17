
import { PieChart as PieChartIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/utils/currency";

// Sample data for DCF visualization
const dcfData = [
  { year: 'Year 1', cashFlow: 150000 },
  { year: 'Year 2', cashFlow: 220000 },
  { year: 'Year 3', cashFlow: 310000 },
  { year: 'Year 4', cashFlow: 450000 },
  { year: 'Year 5', cashFlow: 620000 },
];

interface DiscountedCashFlowChartProps {
  currency?: { code: string; symbol: string; name: string };
}

export default function DiscountedCashFlowChart({ currency = { code: "USD", symbol: "$", name: "US Dollar" } }: DiscountedCashFlowChartProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 flex items-center gap-2 font-semibold">
        <PieChartIcon className="h-5 w-5 text-shark-500" />
        Discounted Cash Flow Method
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Calculates the present value of projected future cash flows
      </p>
      <div className="mt-4 h-48 rounded-md">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dcfData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => formatCurrency(value, currency).split('.')[0]} />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value, currency), 'Cash Flow']} 
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
            <Area type="monotone" dataKey="cashFlow" fill="#93c5fd" stroke="#3b82f6" name="Projected Cash Flow" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
