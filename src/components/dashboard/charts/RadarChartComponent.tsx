import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from "recharts";

interface RadarChartComponentProps {
  selectedCurrency: { code: string; symbol: string; name: string };
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
}

export default function RadarChartComponent({ selectedCurrency, metrics }: RadarChartComponentProps) {
  const data = [
    { metric: "Valuation", value: metrics.valuation },
    { metric: "Burn Rate", value: metrics.monthlyBurnRate },
    { metric: "Runway", value: metrics.runway },
    { metric: "LTV", value: metrics.ltv },
    { metric: "LTV:CAC", value: metrics.ltvCacRatio },
  ];
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis />
          <Radar name="Metric Value" dataKey="value" stroke="#0ea5e9" fill="#bae6fd" fillOpacity={0.6} />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}