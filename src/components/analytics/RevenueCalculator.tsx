
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Currency = "USD" | "EUR" | "GBP" | "JPY";

interface RevenueFormData {
  initialCustomers: number;
  monthlyGrowthRate: number;
  initialPrice: number;
  annualPriceIncrease: number;
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

const RevenueCalculator = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [projectionData, setProjectionData] = useState<any[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RevenueFormData>({
    defaultValues: {
      initialCustomers: 100,
      monthlyGrowthRate: 10,
      initialPrice: 50,
      annualPriceIncrease: 5,
      projectionMonths: 24
    }
  });

  const onSubmit = (data: RevenueFormData) => {
    const { initialCustomers, monthlyGrowthRate, initialPrice, annualPriceIncrease, projectionMonths } = data;
    
    const projectionResults = [];
    let customers = initialCustomers;
    let price = initialPrice;
    let totalRevenue = 0;
    
    for (let month = 1; month <= projectionMonths; month++) {
      // Update price annually (every 12 months)
      if (month > 1 && month % 12 === 1) {
        price = price * (1 + annualPriceIncrease / 100);
      }
      
      // Calculate monthly customer growth
      customers = customers * (1 + monthlyGrowthRate / 100);
      
      // Calculate monthly revenue
      const monthlyRevenue = customers * price;
      totalRevenue += monthlyRevenue;
      
      // Add data point to projection
      projectionResults.push({
        month,
        customers: Math.round(customers),
        price,
        monthlyRevenue,
        totalRevenue
      });
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
            <Label htmlFor="initialCustomers">Initial Customers</Label>
            <Input
              id="initialCustomers"
              type="number"
              {...register("initialCustomers", { required: true, min: 1 })}
            />
            {errors.initialCustomers && (
              <p className="text-sm text-red-500">Valid number of initial customers required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyGrowthRate">Monthly Growth Rate (%)</Label>
            <div className="relative">
              <Input
                id="monthlyGrowthRate"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("monthlyGrowthRate", { required: true, min: 0.1 })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.monthlyGrowthRate && (
              <p className="text-sm text-red-500">Valid growth rate required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialPrice">Initial Price Per Customer</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="initialPrice"
                type="number"
                className="pl-8"
                step="0.01"
                {...register("initialPrice", { required: true, min: 0.01 })}
              />
            </div>
            {errors.initialPrice && (
              <p className="text-sm text-red-500">Valid price required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="annualPriceIncrease">Annual Price Increase (%)</Label>
            <div className="relative">
              <Input
                id="annualPriceIncrease"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("annualPriceIncrease", { required: true, min: 0 })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.annualPriceIncrease && (
              <p className="text-sm text-red-500">Valid price increase rate required</p>
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
        
        <Button type="submit" className="w-full">Calculate Revenue Projection</Button>
      </form>

      {projectionData.length > 0 && (
        <div className="space-y-6 mt-8">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Final Monthly Revenue</h3>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(projectionData[projectionData.length - 1].monthlyRevenue)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(projectionData[projectionData.length - 1].totalRevenue)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Final Customer Count</h3>
              <p className="text-2xl font-bold mt-1">
                {projectionData[projectionData.length - 1].customers.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="h-96 w-full mt-6">
            <ChartContainer
              config={{
                revenue: { label: "Monthly Revenue" },
                customers: { label: "Customers" },
              }}
            >
              <LineChart data={projectionData.map(item => ({
                month: `Month ${item.month}`,
                revenue: convertCurrency(item.monthlyRevenue),
                customers: item.customers
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => {
                  if (name === "revenue") {
                    return [`${currencySymbols[currency]}${Number(value).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    })}`, "Monthly Revenue"];
                  }
                  return [value, "Customers"];
                }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  yAxisId="left" 
                  name="Monthly Revenue" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#10b981" 
                  yAxisId="right" 
                  name="Customers"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customers
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cumulative Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectionData.filter((_, index) => index % 3 === 0 || index === projectionData.length - 1).map((item) => (
                  <tr key={item.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Month {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.customers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.monthlyRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.totalRevenue)}
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

export default RevenueCalculator;
