import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MetricsInputFormProps {
  revenue: string;
  setRevenue: (value: string) => void;
  expenses: string;
  setExpenses: (value: string) => void;
  cac: string;
  setCac: (value: string) => void;
  customers: string;
  setCustomers: (value: string) => void;
  growth: string;
  setGrowth: (value: string) => void;
  selectedCurrency: { symbol: string };
}

export default function MetricsInputForm({
  revenue,
  setRevenue,
  expenses,
  setExpenses,
  cac,
  setCac,
  customers,
  setCustomers,
  growth,
  setGrowth,
  selectedCurrency
}: MetricsInputFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Metrics Calculator</CardTitle>
        <CardDescription>
          Enter your business metrics to see key calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthly-revenue">Monthly Revenue ({selectedCurrency.symbol})</Label>
            <Input
              id="monthly-revenue"
              type="number"
              placeholder={`e.g. 50000`}
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly-expenses">Monthly Expenses ({selectedCurrency.symbol})</Label>
            <Input
              id="monthly-expenses"
              type="number"
              placeholder={`e.g. 30000`}
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cac">Customer Acquisition Cost ({selectedCurrency.symbol})</Label>
            <Input
              id="cac"
              type="number"
              placeholder={`e.g. 100`}
              value={cac}
              onChange={(e) => setCac(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customers">Total Customers</Label>
            <Input
              id="customers"
              type="number"
              placeholder="e.g. 500"
              value={customers}
              onChange={(e) => setCustomers(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="growth">Annual Growth Rate (e.g. 1.5 for 50%)</Label>
            <Input
              id="growth"
              type="number"
              step="0.1"
              placeholder="e.g. 1.5"
              value={growth}
              onChange={(e) => setGrowth(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
