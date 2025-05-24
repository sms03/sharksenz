import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "INR";

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
  JPY: "¥",
  INR: "₹"
};

const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 151.13,
  INR: 85.15
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
    try {
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
    } catch (error) {
      console.error("Error calculating profit projection:", error);
    }
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

  // Calculate average profit margin
  const getAverageProfitMargin = (): string => {
    if (projectionData.length === 0) return "0";
    
    const sum = projectionData.reduce((acc, item) => acc + item.profitMargin, 0);
    return (sum / projectionData.length).toFixed(2);
  };
  
  // Calculate breakeven month
  const getBreakevenMonth = (): string => {
    if (projectionData.length === 0) return "N/A";
    
    const breakeven = projectionData.findIndex(item => item.netProfit > 0);
    return breakeven === -1 ? "Not within projection" : `Month ${breakeven + 1}`;
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
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="initialRevenue">Initial Monthly Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="initialRevenue"
                type="number"
                className="pl-8"
                {...register("initialRevenue", { required: true, min: 0 })}
              />
            </div>
            {errors.initialRevenue && (
              <p className="text-red-500 text-xs mt-1">Valid revenue amount required</p>
            )}
          </div>
          
          <div>
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
              <p className="text-red-500 text-xs mt-1">Valid growth rate required</p>
            )}
          </div>
          
          <div>
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
              <p className="text-red-500 text-xs mt-1">Valid percentage (0-100) required</p>
            )}
          </div>
          
          <div>
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
              <p className="text-red-500 text-xs mt-1">Valid fixed costs amount required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="fixedCostsGrowthRate">Quarterly Fixed Costs Growth (%)</Label>
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
              <p className="text-red-500 text-xs mt-1">Valid growth rate required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="projectionMonths">Projection Months</Label>
            <Input
              id="projectionMonths"
              type="number"
              min={1}
              max={60}
              step={1}
              {...register("projectionMonths", { 
                required: true,
                min: 1,
                max: 60,
                valueAsNumber: true
              })}
            />
            {errors.projectionMonths && (
              <p className="text-red-500 text-xs mt-1">Enter a value between 1-60 months</p>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Generate Profit Projection</Button>
      </form>

      {projectionData.length > 0 && (
        <div className="space-y-8 mt-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Final Monthly Revenue</h3>
              <p className="text-2xl font-bold">{formatCurrency(projectionData[projectionData.length - 1].revenue)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Average Profit Margin</h3>
              <p className="text-2xl font-bold">{getAverageProfitMargin()}%</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Breakeven Point</h3>
              <p className="text-2xl font-bold">{getBreakevenMonth()}</p>
            </div>
          </div>

          {/* Revenue & Profit Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Revenue & Profit Projection</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={projectionData.map(item => ({
                    month: `Month ${item.month}`,
                    revenue: convertCurrency(item.revenue),
                    grossProfit: convertCurrency(item.grossProfit),
                    netProfit: convertCurrency(item.netProfit)
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `${currencySymbols[currency]}${Number(value).toLocaleString()}`, 
                      ""
                    ]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#4f46e5" fill="#c7d2fe" name="Revenue" />
                  <Area type="monotone" dataKey="grossProfit" stackId="2" stroke="#16a34a" fill="#bbf7d0" name="Gross Profit" />
                  <Area type="monotone" dataKey="netProfit" stackId="3" stroke="#0ea5e9" fill="#bae6fd" name="Net Profit" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Margin Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Profit Margin Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={projectionData.map(item => ({
                    month: `Month ${item.month}`,
                    profitMargin: item.profitMargin
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    unit="%" 
                    domain={['auto', 'auto']} 
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}%`, 
                      "Profit Margin"
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="profitMargin" 
                    stroke="#f97316" 
                    fill="#fed7aa"
                    name="Profit Margin" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Financials Table */}
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium p-4 border-b">Monthly Financials</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable Costs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fixed Costs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Profit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectionData.filter((_, i) => i % 3 === 0 || i === projectionData.length - 1).map((item) => (
                  <tr key={item.month}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Month {item.month}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.revenue)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.variableCosts)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.fixedCosts)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.netProfit)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.profitMargin.toFixed(2)}%</td>
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
