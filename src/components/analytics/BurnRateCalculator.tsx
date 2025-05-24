import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from "recharts";
import { Plus, X, Save, AlertCircle } from "lucide-react";

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "INR";

interface ExpenseItem {
  name: string;
  amount: number;
}

interface BurnRateFormData {
  cashBalance: number;
  monthlyRevenue: number;
  monthlyRevenueGrowth: number;
  expenses: ExpenseItem[];
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

const BurnRateCalculator = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [calculationResults, setCalculationResults] = useState<any | null>(null);
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<BurnRateFormData>({
    defaultValues: {
      cashBalance: 500000,
      monthlyRevenue: 50000,
      monthlyRevenueGrowth: 5,
      expenses: [
        { name: "Salaries & Benefits", amount: 80000 },
        { name: "Office & Facilities", amount: 10000 },
        { name: "Marketing", amount: 15000 },
        { name: "Software & Tools", amount: 5000 }
      ]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses"
  });
  const onSubmit = (data: BurnRateFormData) => {
    try {
      const { cashBalance, monthlyRevenue, monthlyRevenueGrowth, expenses } = data;
      
      // Calculate total monthly expenses
      let totalMonthlyExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      // Calculate current burn rate
      const currentBurnRate = totalMonthlyExpenses - monthlyRevenue;
      
      // Calculate runway (in months)
      const initialRunway = currentBurnRate > 0 ? cashBalance / currentBurnRate : Infinity;
      
      // Project cash flow for 24 months
      const projectionMonths = 24;
      const projectionData = [];
      
      let remainingCash = cashBalance;
      let revenue = monthlyRevenue;
      let burnRate = currentBurnRate;
      let cumulativeBurn = 0;
      
      for (let month = 1; month <= projectionMonths; month++) {
        // Increase revenue based on growth rate
        revenue = revenue * (1 + monthlyRevenueGrowth / 100);
        
        // Calculate burn rate for this month
        burnRate = totalMonthlyExpenses - revenue;
        
        // Update remaining cash
        remainingCash -= burnRate;
        cumulativeBurn += burnRate > 0 ? burnRate : 0;
        
        // Add data point to projection
        projectionData.push({
          month,
          cashBalance: Math.max(0, remainingCash),
          burnRate: burnRate > 0 ? burnRate : 0,
          revenue,
          expenses: totalMonthlyExpenses,
          cumulativeBurn
        });
        
        // Stop if we run out of cash
        if (remainingCash <= 0) {
          break;
        }
      }
      
      // Calculate when cash runs out (runway)
      const runwayMonth = projectionData.findIndex(data => data.cashBalance <= 0);
      const runway = runwayMonth !== -1 ? runwayMonth + 1 : projectionMonths > 24 ? "24+" : "∞";
      
      // Calculate breakeven month
      const breakevenMonth = projectionData.findIndex(data => data.burnRate <= 0);
      const breakeven = breakevenMonth !== -1 ? breakevenMonth + 1 : "Not within 24 months";
      
      setCalculationResults({
        totalMonthlyExpenses,
        currentBurnRate,
        runway,
        breakeven,
        projectionData
      });
    } catch (error) {
      console.error("Error calculating burn rate:", error);
      // Show an error state instead of crashing
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
      maximumFractionDigits: 0
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
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cashBalance">Current Cash Balance</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="cashBalance"
                type="number"
                className="pl-8"
                {...register("cashBalance", { required: true, min: 0 })}
              />
            </div>
            {errors.cashBalance && (
              <p className="text-sm text-red-500">Valid cash balance required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyRevenue">Current Monthly Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="monthlyRevenue"
                type="number"
                className="pl-8"
                {...register("monthlyRevenue", { required: true, min: 0 })}
              />
            </div>
            {errors.monthlyRevenue && (
              <p className="text-sm text-red-500">Valid monthly revenue required</p>
            )}
          </div>
          
          <div className="space-y-2 md:col-span-2">
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
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Monthly Expenses</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => append({ name: "", amount: 0 })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Expense name"
                  {...register(`expenses.${index}.name` as const, { required: true })}
                />
                {errors.expenses?.[index]?.name && (
                  <p className="text-xs text-red-500 mt-1">Name required</p>
                )}
              </div>
              <div className="w-1/3 relative">
                <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
                <Input
                  type="number"
                  className="pl-8"
                  placeholder="Amount"
                  {...register(`expenses.${index}.amount` as const, { 
                    required: true,
                    min: 0,
                    valueAsNumber: true
                  })}
                />
                {errors.expenses?.[index]?.amount && (
                  <p className="text-xs text-red-500 mt-1">Valid amount required</p>
                )}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => remove(index)}
                className="mt-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Calculate Burn Rate & Runway
        </Button>
      </form>

      {calculationResults && (
        <div className="space-y-6 mt-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`bg-gray-50 p-4 rounded-lg ${calculationResults.currentBurnRate > 0 ? 'border-l-4 border-yellow-500' : 'border-l-4 border-green-500'}`}>
              <h3 className="text-sm font-medium text-gray-500">Monthly Burn Rate</h3>
              <p className="text-2xl font-bold mt-1">
                {calculationResults.currentBurnRate > 0 
                  ? formatCurrency(calculationResults.currentBurnRate)
                  : `(${formatCurrency(Math.abs(calculationResults.currentBurnRate))} positive cash flow)`
                }
              </p>
            </div>
            
            <div className={`bg-gray-50 p-4 rounded-lg ${typeof calculationResults.runway === 'number' && calculationResults.runway < 6 ? 'border-l-4 border-red-500' : 'border-l-4 border-blue-500'}`}>
              <h3 className="text-sm font-medium text-gray-500">Cash Runway</h3>
              <p className="text-2xl font-bold mt-1">
                {typeof calculationResults.runway === 'number' 
                  ? `${calculationResults.runway} months`
                  : calculationResults.runway
                }
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500">Breakeven Point</h3>
              <p className="text-2xl font-bold mt-1">
                {typeof calculationResults.breakeven === 'number' 
                  ? `Month ${calculationResults.breakeven}`
                  : calculationResults.breakeven
                }
              </p>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3">Monthly Financials</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm text-gray-500">Total Monthly Expenses</h5>
                <p className="text-xl font-semibold mt-1">
                  {formatCurrency(calculationResults.totalMonthlyExpenses)}
                </p>
              </div>
              <div>
                <h5 className="text-sm text-gray-500">Current Monthly Revenue</h5>
                <p className="text-xl font-semibold mt-1">
                  {formatCurrency(calculationResults.projectionData[0].revenue)}
                </p>
              </div>
            </div>
          </div>

          {/* Cash Projection Chart */}
          <div className="h-96 w-full mt-8 bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">Cash Projection Chart</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={calculationResults.projectionData.map((item: any) => ({
                    month: `Month ${item.month}`,
                    cashBalance: convertCurrency(item.cashBalance),
                    burnRate: convertCurrency(item.burnRate)
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    yAxisId="left" 
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}K`;
                      }
                      return value;
                    }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}K`;
                      }
                      return value;
                    }} 
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${currencySymbols[currency]}${Number(value).toLocaleString()}`,
                      name === "cashBalance" ? "Cash Balance" : "Burn Rate"
                    ]} 
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="cashBalance" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    yAxisId="left"
                    name="Cash Balance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="burnRate" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    yAxisId="right"
                    name="Burn Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          {calculationResults.currentBurnRate > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="text-lg font-medium text-blue-700 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Burn Rate Analysis
              </h4>
              
              <div className="space-y-3">
                {calculationResults.runway < 6 && (
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-red-100 text-red-700 h-5 w-5 text-xs mr-2 mt-0.5">!</span>
                    <p className="text-red-800">
                      Your current runway is less than 6 months. Consider reducing expenses or securing additional funding immediately.
                    </p>
                  </div>
                )}
                
                {calculationResults.runway >= 6 && calculationResults.runway < 12 && (
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 h-5 w-5 text-xs mr-2 mt-0.5">!</span>
                    <p className="text-yellow-800">
                      Your runway is less than 12 months. Start planning for your next funding round or identify ways to reduce burn rate.
                    </p>
                  </div>
                )}
                
                {calculationResults.runway >= 12 && calculationResults.runway !== "∞" && calculationResults.runway !== "24+" && (
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-700 h-5 w-5 text-xs mr-2 mt-0.5">✓</span>
                    <p className="text-green-800">
                      Your runway is over 12 months, which provides a good buffer. Continue monitoring your burn rate and growth metrics.
                    </p>
                  </div>
                )}
                
                {(calculationResults.runway === "∞" || calculationResults.runway === "24+") && (
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-700 h-5 w-5 text-xs mr-2 mt-0.5">✓</span>
                    <p className="text-green-800">
                      You have a very healthy runway or are cash flow positive. Consider investing in growth opportunities.
                    </p>
                  </div>
                )}
                
                {typeof calculationResults.breakeven === 'number' && calculationResults.breakeven <= 12 && (
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 h-5 w-5 text-xs mr-2 mt-0.5">i</span>
                    <p className="text-blue-800">
                      You're projected to reach breakeven within a year (month {calculationResults.breakeven}), which is positive. Stay focused on meeting your revenue targets.
                    </p>
                  </div>
                )}
                
                {calculationResults.breakeven === "Not within 24 months" && (
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 h-5 w-5 text-xs mr-2 mt-0.5">i</span>
                    <p className="text-blue-800">
                      You're not projected to reach breakeven within the next 24 months. Consider strategies to increase revenue growth or reduce expenses.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BurnRateCalculator;
