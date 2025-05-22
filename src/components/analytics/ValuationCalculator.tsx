
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Currency = "USD" | "EUR" | "GBP" | "JPY";

interface ValuationFormData {
  annualRevenue: number;
  growthRate: number;
  profitMargin: number;
  industry: string;
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

// Industry-specific revenue multiples
const revenueMultiples: Record<string, { min: number; avg: number; max: number }> = {
  "SaaS": { min: 5, avg: 10, max: 15 },
  "E-commerce": { min: 1, avg: 2, max: 4 },
  "Fintech": { min: 4, avg: 8, max: 12 },
  "Healthcare": { min: 3, avg: 6, max: 9 },
  "Consumer": { min: 1.5, avg: 3, max: 5 },
  "Enterprise": { min: 3, avg: 7, max: 11 },
  "Marketplace": { min: 2, avg: 5, max: 8 }
};

const ValuationCalculator = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [valuationResults, setValuationResults] = useState<any | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ValuationFormData>({
    defaultValues: {
      annualRevenue: 1000000,
      growthRate: 30,
      profitMargin: 20,
      industry: "SaaS"
    }
  });

  const onSubmit = (data: ValuationFormData) => {
    const { annualRevenue, growthRate, profitMargin, industry } = data;
    
    // Get industry-specific multiples
    const multiples = revenueMultiples[industry] || revenueMultiples.SaaS;
    
    // Calculate valuations using different methods
    const revenueValuation = {
      conservative: annualRevenue * multiples.min,
      average: annualRevenue * multiples.avg,
      optimistic: annualRevenue * multiples.max
    };
    
    // Growth-adjusted revenue multiple
    const growthAdjustedMultiple = multiples.avg * (1 + (growthRate - 20) / 100);
    const growthAdjustedValuation = annualRevenue * growthAdjustedMultiple;
    
    // EBITDA valuation (simplified)
    const ebitda = annualRevenue * (profitMargin / 100);
    const ebitdaMultiple = Math.max(6, 10 + (growthRate - 20) / 5);
    const ebitdaValuation = ebitda * ebitdaMultiple;
    
    // Discounted Cash Flow (simplified)
    const projectionYears = 5;
    let dcfValuation = 0;
    let currentRevenue = annualRevenue;
    
    for (let year = 1; year <= projectionYears; year++) {
      // Assume growth rate decreases slightly each year
      const adjustedGrowthRate = growthRate * Math.pow(0.9, year - 1);
      currentRevenue = currentRevenue * (1 + adjustedGrowthRate / 100);
      
      // Assume profit margin increases slightly each year
      const adjustedProfitMargin = Math.min(35, profitMargin + (year - 1));
      const cashFlow = currentRevenue * (adjustedProfitMargin / 100);
      
      // Discount rate based on risk
      const discountRate = 20 - Math.min(5, profitMargin / 10);
      const discountFactor = Math.pow(1 + discountRate / 100, -year);
      
      dcfValuation += cashFlow * discountFactor;
    }
    
    // Terminal value (using Gordon Growth Model)
    const terminalGrowthRate = 3; // Long-term growth assumption
    const finalYearCashFlow = currentRevenue * (Math.min(35, profitMargin + 4) / 100);
    const discountRate = 20 - Math.min(5, profitMargin / 10);
    const terminalValue = (finalYearCashFlow * (1 + terminalGrowthRate / 100)) / 
                          (discountRate / 100 - terminalGrowthRate / 100);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, projectionYears);
    
    dcfValuation += discountedTerminalValue;
    
    setValuationResults({
      revenueValuation,
      growthAdjustedValuation,
      ebitdaValuation,
      dcfValuation,
      annualRevenue,
      industry
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
      maximumFractionDigits: 0
    })}`;
  };

  // Format currency for larger numbers (millions/billions)
  const formatLargeCurrency = (value: number): string => {
    const convertedValue = convertCurrency(value);
    
    if (convertedValue >= 1000000000) {
      return `${currencySymbols[currency]}${(convertedValue / 1000000000).toFixed(1)}B`;
    } else if (convertedValue >= 1000000) {
      return `${currencySymbols[currency]}${(convertedValue / 1000000).toFixed(1)}M`;
    } else {
      return formatCurrency(value);
    }
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
            <Label htmlFor="annualRevenue">Annual Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">{currencySymbols[currency]}</span>
              <Input
                id="annualRevenue"
                type="number"
                className="pl-8"
                {...register("annualRevenue", { required: true, min: 1 })}
              />
            </div>
            {errors.annualRevenue && (
              <p className="text-sm text-red-500">Valid annual revenue required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="growthRate">Annual Growth Rate (%)</Label>
            <div className="relative">
              <Input
                id="growthRate"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("growthRate", { required: true, min: -50, max: 200 })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.growthRate && (
              <p className="text-sm text-red-500">Valid growth rate required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profitMargin">Profit Margin (%)</Label>
            <div className="relative">
              <Input
                id="profitMargin"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("profitMargin", { required: true, min: -100, max: 100 })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.profitMargin && (
              <p className="text-sm text-red-500">Valid profit margin required</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select 
              onValueChange={(value) => {
                const form = document.getElementById("industry") as HTMLInputElement;
                if (form) form.value = value;
              }}
              defaultValue="SaaS"
            >
              <SelectTrigger id="industry-select">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Fintech">Fintech</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Consumer">Consumer</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
                <SelectItem value="Marketplace">Marketplace</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="industry"
              type="hidden"
              defaultValue="SaaS"
              {...register("industry", { required: true })}
            />
            {errors.industry && (
              <p className="text-sm text-red-500">Please select an industry</p>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Calculate Startup Valuation</Button>
      </form>

      {valuationResults && (
        <div className="space-y-6 mt-8">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Average Valuation</h3>
              <p className="text-2xl font-bold mt-1">
                {formatLargeCurrency((
                  valuationResults.revenueValuation.average + 
                  valuationResults.growthAdjustedValuation + 
                  valuationResults.ebitdaValuation + 
                  valuationResults.dcfValuation
                ) / 4)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Valuation Range</h3>
              <p className="text-2xl font-bold mt-1">
                {formatLargeCurrency(Math.min(
                  valuationResults.revenueValuation.conservative,
                  valuationResults.ebitdaValuation * 0.8,
                  valuationResults.dcfValuation * 0.8
                ))} - {formatLargeCurrency(Math.max(
                  valuationResults.revenueValuation.optimistic,
                  valuationResults.ebitdaValuation * 1.2,
                  valuationResults.dcfValuation * 1.2
                ))}
              </p>
            </div>
          </div>

          {/* Revenue Multiple Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3">Industry Multiple Information</h4>
            <p className="text-gray-600 mb-3">
              {valuationResults.industry} businesses typically sell for {revenueMultiples[valuationResults.industry].min}x-{revenueMultiples[valuationResults.industry].max}x annual revenue, 
              with the average being {revenueMultiples[valuationResults.industry].avg}x.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center">
                <div className="text-sm text-gray-500">Conservative</div>
                <div className="font-medium">{revenueMultiples[valuationResults.industry].min}x</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Average</div>
                <div className="font-medium">{revenueMultiples[valuationResults.industry].avg}x</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Optimistic</div>
                <div className="font-medium">{revenueMultiples[valuationResults.industry].max}x</div>
              </div>
            </div>
          </div>

          {/* Valuation Chart */}
          <div className="h-80 w-full mt-6">
            <ChartContainer
              config={{
                valuation: { label: "Valuation" },
              }}
            >
              <BarChart 
                data={[
                  {
                    name: "Revenue (Cons.)",
                    valuation: convertCurrency(valuationResults.revenueValuation.conservative)
                  },
                  {
                    name: "Revenue (Avg.)",
                    valuation: convertCurrency(valuationResults.revenueValuation.average)
                  },
                  {
                    name: "Revenue (Opt.)",
                    valuation: convertCurrency(valuationResults.revenueValuation.optimistic)
                  },
                  {
                    name: "Growth Adjusted",
                    valuation: convertCurrency(valuationResults.growthAdjustedValuation)
                  },
                  {
                    name: "EBITDA",
                    valuation: convertCurrency(valuationResults.ebitdaValuation)
                  },
                  {
                    name: "DCF",
                    valuation: convertCurrency(valuationResults.dcfValuation)
                  }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => {
                  if (value >= 1000000000) {
                    return `${(value / 1000000000).toFixed(1)}B`;
                  } else if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`;
                  }
                  return value;
                }} />
                <Tooltip formatter={(value) => [
                  `${currencySymbols[currency]}${Number(value).toLocaleString()}`,
                  "Valuation"
                ]} />
                <Legend />
                <Bar dataKey="valuation" fill="#3b82f6" name="Valuation" />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Valuation Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3">Valuation Breakdown</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium">Revenue Multiple Method</h5>
                <p className="text-sm text-gray-600 mt-1">
                  This method values your company based on your annual revenue multiplied by industry-specific multiples.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <div className="text-xs text-gray-500">Conservative ({revenueMultiples[valuationResults.industry].min}x)</div>
                    <div className="font-medium">{formatLargeCurrency(valuationResults.revenueValuation.conservative)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Average ({revenueMultiples[valuationResults.industry].avg}x)</div>
                    <div className="font-medium">{formatLargeCurrency(valuationResults.revenueValuation.average)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Optimistic ({revenueMultiples[valuationResults.industry].max}x)</div>
                    <div className="font-medium">{formatLargeCurrency(valuationResults.revenueValuation.optimistic)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium">Growth-Adjusted Revenue Multiple</h5>
                <p className="text-sm text-gray-600 mt-1">
                  This method adjusts the revenue multiple based on your growth rate compared to industry average.
                </p>
                <div className="font-medium mt-1">{formatLargeCurrency(valuationResults.growthAdjustedValuation)}</div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium">EBITDA Multiple Method</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Based on your profit margin and industry standards for EBITDA multiples.
                </p>
                <div className="font-medium mt-1">{formatLargeCurrency(valuationResults.ebitdaValuation)}</div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium">Discounted Cash Flow (DCF)</h5>
                <p className="text-sm text-gray-600 mt-1">
                  Projects future cash flows over 5 years plus terminal value, discounted to present value.
                </p>
                <div className="font-medium mt-1">{formatLargeCurrency(valuationResults.dcfValuation)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuationCalculator;
