import { ResponsiveContainer, PieChart, Tooltip, Legend, Pie, Cell } from "recharts";
import { formatCurrency } from "@/utils/currency";

interface PieChartComponentProps {
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export default function PieChartComponent({ selectedCurrency, metrics }: PieChartComponentProps) {
  const data = [
    { name: "Valuation", value: metrics.valuation },
    { name: "Burn Rate", value: metrics.monthlyBurnRate },
    { name: "Runway (months)", value: metrics.runway },
    { name: "LTV", value: metrics.ltv },
    { name: "LTV:CAC", value: metrics.ltvCacRatio },
  ];
  const chartColorsArr = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#a21caf"];
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip 
            formatter={(value: number) => [
              `${formatCurrency(value, selectedCurrency)}`,
              ''
            ]}
          />
          <Legend />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColorsArr[index % chartColorsArr.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
