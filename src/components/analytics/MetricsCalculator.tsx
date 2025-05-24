import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "INR";

interface MetricFormData {
  customers: number;
  price: number;
  cac: number; // Customer Acquisition Cost
  churnRate: number; // Monthly churn rate in percentage
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

const MetricsCalculator = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<MetricFormData>({
    defaultValues: {
      customers: 1000,
      price: 29,
      cac: 100,
      churnRate: 5
    }
  });

  const onSubmit = (data: MetricFormData) => {
    try {
      // Calculate key metrics
      const monthlyRevenue = data.customers * data.price;
      const annualRevenue = monthlyRevenue * 12;
      const ltv = data.price / (data.churnRate / 100); // Lifetime Value
      const cacToLtv = ltv / data.cac; // LTV:CAC ratio
      const cacPaybackTime = data.cac / data.price; // CAC Payback Time in months
      
      setMetrics({
        "Monthly Revenue": monthlyRevenue,
        "Annual Revenue": annualRevenue,
        "LTV": ltv,
        "LTV:CAC Ratio": cacToLtv,
        "CAC Payback (months)": cacPaybackTime,
        "CAC": data.cac // Add CAC for chart visualization
      });
    } catch (error) {
      console.error("Error calculating metrics:", error);
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

  // Format ratio with 2 decimal places
  const formatRatio = (value: number): string => {
    return value.toFixed(2);
  };

  // Prepare chart data
  const getChartData = () => {
    if (!metrics) return [];
    
    return [
      { name: 'Monthly Revenue', value: convertCurrency(metrics['Monthly Revenue']) },
      { name: 'LTV', value: convertCurrency(metrics['LTV']) },
      { name: 'CAC', value: convertCurrency(metrics['CAC']) }
    ];
  };

  return (
    <div className="space-y-6 font-ancizar">
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
            <Label htmlFor="customers">Active Customers</Label>
            <Input
              id="customers"
              type="number"
              {...register("customers", { required: true, min: 1 })}
            />
            {errors.customers && <p className="text-red-500 text-xs mt-1">Valid customer count required</p>}
          </div>
          
          <div>
            <Label htmlFor="price">Monthly Price per Customer</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="price"
                type="number"
                className="pl-8"
                {...register("price", { required: true, min: 0.01 })}
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">Valid price required</p>}
          </div>
          
          <div>
            <Label htmlFor="cac">Customer Acquisition Cost (CAC)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="cac"
                type="number"
                className="pl-8"
                {...register("cac", { required: true, min: 0 })}
              />
            </div>
            {errors.cac && <p className="text-red-500 text-xs mt-1">Valid CAC required</p>}
          </div>
          
          <div>
            <Label htmlFor="churnRate">Monthly Churn Rate (%)</Label>
            <div className="relative">
              <Input
                id="churnRate"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("churnRate", { required: true, min: 0.1, max: 100 })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.churnRate && <p className="text-red-500 text-xs mt-1">Valid churn rate required (0.1-100%)</p>}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Calculate Metrics</Button>
      </form>

      {metrics && (
        <div className="mt-8 space-y-8">
          {/* Metrics summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Revenue</h3>
              <p className="text-2xl font-bold">{formatCurrency(metrics["Monthly Revenue"])}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Annual Revenue</h3>
              <p className="text-2xl font-bold">{formatCurrency(metrics["Annual Revenue"])}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Lifetime Value</h3>
              <p className="text-2xl font-bold">{formatCurrency(metrics["LTV"])}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">LTV:CAC Ratio</h3>
              <p className="text-2xl font-bold">{formatRatio(metrics["LTV:CAC Ratio"])}</p>
              <p className="text-xs text-gray-500 mt-1">
                {metrics["LTV:CAC Ratio"] < 3 ? 
                  "Your LTV:CAC ratio should be at least 3:1 for a sustainable business model." : 
                  "Good ratio! This indicates efficient customer acquisition."
                }
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">CAC Payback Time</h3>
              <p className="text-2xl font-bold">{formatRatio(metrics["CAC Payback (months)"])} months</p>
              <p className="text-xs text-gray-500 mt-1">
                {metrics["CAC Payback (months)"] > 12 ? 
                  "Your payback period is high. Try to reduce CAC or increase pricing." : 
                  "Good payback period! You recover your acquisition costs quickly."
                }
              </p>
            </div>
          </div>
          
          {/* Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Key Metrics Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
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
                      "Value"
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Amount" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Analysis */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-700 mb-2">Quick Analysis</h3>
            <ul className="list-disc pl-5 space-y-2 text-blue-800">
              <li>
                {metrics["LTV:CAC Ratio"] < 3 ? 
                  `Your LTV:CAC ratio (${formatRatio(metrics["LTV:CAC Ratio"])}) is below the recommended 3:1 ratio. Consider reducing acquisition costs or increasing customer retention.` :
                  `Your LTV:CAC ratio (${formatRatio(metrics["LTV:CAC Ratio"])}) is healthy, indicating efficient customer acquisition.`
                }
              </li>
              <li>
                {metrics["CAC Payback (months)"] > 12 ?
                  `It takes ${formatRatio(metrics["CAC Payback (months)"])} months to recover your customer acquisition costs, which is relatively long. Consider strategies to accelerate payback time.` :
                  `You recover your customer acquisition costs in ${formatRatio(metrics["CAC Payback (months)"])} months, which is good for cash flow.`
                }
              </li>
              <li>
                Your monthly churn rate converts to an annual churn of approximately {(1 - Math.pow(1 - (metrics["CAC Payback (months)"] / 100), 12)) * 100}%.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsCalculator;
