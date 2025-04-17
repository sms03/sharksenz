import { RefreshCw, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function RunwayTabContent({ metrics, selectedCurrency, visualize }: any) {
  // Burn rate chart data
  const burnData = [
    { name: "Burn Rate", value: visualize ? metrics.monthlyBurnRate : 0 },
    { name: "Runway (months)", value: visualize ? metrics.runway : 0 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Burn Rate & Runway Analysis</CardTitle>
        <CardDescription>
          Understand how long your cash will last
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <TrendingDown className="h-5 w-5 text-shark-500" />
              Monthly Burn Rate
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              The rate at which a company spends its cash reserves each month
            </p>
            <div className="mt-4 h-48 rounded-md border bg-muted/50">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={burnData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <RefreshCw className="h-5 w-5 text-shark-500" />
              Cash Runway
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              How many months your company can operate before running out of cash
            </p>
            <div className="mt-4 h-48 rounded-md border bg-muted/50">
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">Runway timeline visualization</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
