import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LineChart, TrendingUp, DollarSign } from "lucide-react";

export default function ProfitProjection() {
  const [revenue, setRevenue] = useState("10000");
  const [expenses, setExpenses] = useState("7000");
  const [growth, setGrowth] = useState(5); // % per month
  const [months, setMonths] = useState(12);
  const [showResults, setShowResults] = useState(false);
  const [projections, setProjections] = useState<number[]>([]);

  function calculateProjections() {
    let rev = Number(revenue);
    let exp = Number(expenses);
    let arr: number[] = [];
    for (let i = 0; i < months; i++) {
      arr.push(rev - exp);
      rev *= 1 + growth / 100;
      exp *= 1 + (growth / 2) / 100;
    }
    setProjections(arr);
    setShowResults(true);
  }

  return (
    <div className="mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Profit Projection</h1>
      <p className="text-muted-foreground mb-8">Estimate your business profit over time based on revenue, expenses, and growth rate.</p>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Projection Inputs</CardTitle>
          <CardDescription>Enter your base metrics and growth assumptions</CardDescription>
        </CardHeader>        <CardContent className="space-y-4 h-[300px]">
          <div className="space-y-2">
            <Label htmlFor="revenue">Monthly Revenue</Label>
            <Input id="revenue" type="number" value={revenue} onChange={e => setRevenue(e.target.value)} className="h-10" />
          </div>          <div className="space-y-2">
            <Label htmlFor="expenses">Monthly Expenses</Label>
            <Input id="expenses" type="number" value={expenses} onChange={e => setExpenses(e.target.value)} className="h-10" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="growth">Monthly Growth Rate</Label>
              <span className="text-sm text-muted-foreground">{growth}%</span>
            </div>
            <Slider id="growth" min={0} max={20} step={0.5} value={[growth]} onValueChange={v => setGrowth(v[0])} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="months">Projection Months</Label>
              <span className="text-sm text-muted-foreground">{months}</span>
            </div>
            <Slider id="months" min={3} max={36} step={1} value={[months]} onValueChange={v => setMonths(v[0])} />
          </div>
          <Button className="mt-4" onClick={calculateProjections}>
            <LineChart className="h-4 w-4 mr-2" />
            Project Profit
          </Button>
        </CardContent>
      </Card>
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Profit Projection ({months} months)
            </CardTitle>
            <CardDescription>Projected profit for each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {projections.map((profit, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>Month {i + 1}</span>
                  <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    {profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
