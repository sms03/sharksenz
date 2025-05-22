
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Currency = "USD" | "EUR" | "GBP" | "JPY";

interface ProfitFormData {
  initialRevenue: number;
  monthlyRevenueGrowth: number;
  costOfGoods: number;
  fixedCosts: number;
  fixedCostsGrowthRate: number;
  projectionMonths: number;
}

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥"
};

const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 151.13
};

const ProfitProjection = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [projectionData, setProjectionData] = useState<any[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfitFormData>({
    defaultValues: {
      initialRevenue: 10000,
      monthlyRevenueGrowth: 5,
      costOfGoods: 30,
      fixedCosts: 5000,
      fixedCostsGrowthRate: 2,
      projectionMonths: 24
    }
  });

  const onSubmit = (data: ProfitFormData) => {
    const { initialRevenue, monthlyRevenueGrowth, costOfGoods, fixedCosts, fixedCostsGrowthRate, projectionMonths } = data;
    
    const projectionResults = [];
    let revenue = initialRevenue;
    let fixedCostsMonthly = fixedCosts;
    
    for (let month = 1; month <= projectionMonths; month++) {
      // Calculate variable costs based on cost of goods percentage
      const variableCosts = revenue * (costOfGoods / 100);
      
      // Calculate profit
      const grossProfit = revenue - variableCosts;
      const netProfit = grossProfit - fixedCostsMonthly;
      const profitMargin = (netProfit / revenue) * 100;
      
      // Add data point to projection
      projectionResults.push({
        month,
        revenue,
        variableCosts,
        fixedCosts: fixedCostsMonthly,
        grossProfit,
        netProfit,
        profitMargin
      });
      
      // Update for next month
      revenue = revenue * (1 + monthlyRevenueGrowth / 100);
      
      // Update fixed costs quarterly (every 3 months)
      if (month % 3 === 0) {
        fixedCostsMonthly = fixedCostsMonthly * (1 + fixedCostsGrowthRate / 100);
      }
    }
    
    setProjectionData(projectionResults);
  };

  // Convert value to selected currency
  const convertCurrency = (value: number): number => {
    return value / exchangeRates[currency];
  };

  // Format currency with symbol
  const formatCurrency = (value: number): string => {
    return `${currencySymbols[currency]}${convertCurrency(value).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="w-40">
          <Label htmlFor="currency">Currency</Label>
          <Select 
            value={currency}
            onValueChange={(value) => setCurrency(value as Currency)}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initialRevenue">Initial Monthly Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="initialRevenue"
                type="number"
                className="pl-8"
                {...register("initialRevenue", { required: true, min: 1 })}
              />
            </div>
            {errors.initialRevenue && (
              <p className="text-sm text-red-500">Valid initial revenue required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyRevenueGrowth">Monthly Revenue Growth (%)</Label>
            <div className="relative">
              <Input
                id="monthlyRevenueGrowth"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("monthlyRevenueGrowth", { required: true })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.monthlyRevenueGrowth && (
              <p className="text-sm text-red-500">Valid growth rate required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="costOfGoods">Cost of Goods Sold (%)</Label>
            <div className="relative">
              <Input
                id="costOfGoods"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("costOfGoods", { required: true, min: 0, max: 100 })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.costOfGoods && (
              <p className="text-sm text-red-500">Valid percentage required (0-100)</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fixedCosts">Monthly Fixed Costs</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="fixedCosts"
                type="number"
                className="pl-8"
                {...register("fixedCosts", { required: true, min: 0 })}
              />
            </div>
            {errors.fixedCosts && (
              <p className="text-sm text-red-500">Valid fixed costs required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fixedCostsGrowthRate">Fixed Costs Quarterly Growth (%)</Label>
            <div className="relative">
              <Input
                id="fixedCostsGrowthRate"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("fixedCostsGrowthRate", { required: true })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.fixedCostsGrowthRate && (
              <p className="text-sm text-red-500">Valid growth rate required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectionMonths">Projection Months</Label>
            <Input
              id="projectionMonths"
              type="number"
              {...register("projectionMonths", { required: true, min: 1, max: 60 })}
            />
            {errors.projectionMonths && (
              <p className="text-sm text-red-500">Valid projection period required (1-60 months)</p>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Calculate Profit Projection</Button>
      </form>

      {projectionData.length > 0 && (
        <div className="space-y-6 mt-8">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Final Monthly Profit</h3>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(projectionData[projectionData.length - 1].netProfit)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Final Profit Margin</h3>
              <p className="text-2xl font-bold mt-1">
                {projectionData[projectionData.length - 1].profitMargin.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Breakeven Month</h3>
              <p className="text-2xl font-bold mt-1">
                {(() => {
                  const breakevenMonth = projectionData.findIndex(item => item.netProfit > 0) + 1;
                  return breakevenMonth > 0 ? `Month ${breakevenMonth}` : 'Not reached';
                })()}
              </p>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="h-96 w-full mt-6">
            <ChartContainer
              config={{
                revenue: { label: "Revenue" },
                costs: { label: "Costs" },
                profit: { label: "Profit" },
              }}
            >
              <AreaChart 
                data={projectionData.map(item => ({
                  month: `Month ${item.month}`,
                  revenue: convertCurrency(item.revenue),
                  costs: convertCurrency(item.variableCosts + item.fixedCosts),
                  profit: convertCurrency(item.netProfit)
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  return [`${currencySymbols[currency]}${Number(value).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                  })}`, name];
                }} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="costs" 
                  stackId="2"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="Costs"
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Profit"
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variable Costs
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fixed Costs
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Profit
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectionData.filter((_, index) => index % 3 === 0 || index === projectionData.length - 1).map((item) => (
                  <tr key={item.month}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Month {item.month}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.variableCosts)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.fixedCosts)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${item.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.netProfit)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${item.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.profitMargin.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitProjection;
