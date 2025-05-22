
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Currency = "USD" | "EUR" | "GBP" | "JPY";

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
  JPY: "¥"
};

const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 151.13
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
      "CAC Payback (months)": cacPaybackTime
    });
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

  // Prepare chart data
  const getChartData = () => {
    if (!metrics) return [];
    
    return [
      { name: 'Monthly Revenue', value: convertCurrency(metrics['Monthly Revenue']) },
      { name: 'Annual Revenue', value: convertCurrency(metrics['Annual Revenue']) },
      { name: 'LTV', value: convertCurrency(metrics['LTV']) },
      { name: 'CAC', value: convertCurrency(metrics['CAC Payback (months)'] || 0) }
    ];
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
            <Label htmlFor="customers">Monthly Active Customers</Label>
            <Input
              id="customers"
              type="number"
              {...register("customers", { required: true, min: 1 })}
            />
            {errors.customers && (
              <p className="text-sm text-red-500">Valid number of customers required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price Per Customer (Monthly)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="price"
                type="number"
                className="pl-8"
                step="0.01"
                {...register("price", { required: true, min: 0.01 })}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-red-500">Valid price required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cac">Customer Acquisition Cost (CAC)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="cac"
                type="number"
                className="pl-8"
                step="0.01"
                {...register("cac", { required: true, min: 0.01 })}
              />
            </div>
            {errors.cac && (
              <p className="text-sm text-red-500">Valid CAC required</p>
            )}
          </div>
          
          <div className="space-y-2">
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
            {errors.churnRate && (
              <p className="text-sm text-red-500">Valid churn rate required (0.1-100)</p>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Calculate Metrics</Button>
      </form>

      {metrics && (
        <div className="space-y-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">{key}</h3>
                <p className="text-2xl font-bold mt-1">
                  {key.includes("Ratio") ? value.toFixed(2) : 
                   key.includes("Payback") ? `${value.toFixed(1)} months` : 
                   formatCurrency(value)}
                </p>
              </div>
            ))}
          </div>

          <div className="h-96 w-full mt-6">
            <ChartContainer
              config={{
                revenue: { label: "Revenue" },
              }}
            >
              {/* Wrap the RechartsBarChart in a fragment to make it a single child */}
              <>
                <RechartsBarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip currency={currency} />} />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Value" />
                </RechartsBarChart>
                <ChartTooltip />
              </>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  currency: Currency;
}

const CustomTooltip = ({ active, payload, currency }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  
  return (
    <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
      <p className="font-medium">{data.name}</p>
      <p className="text-blue-600 font-medium">
        {currencySymbols[currency]}{data.value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })}
      </p>
    </div>
  );
};

export default MetricsCalculator;
