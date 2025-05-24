import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "INR";

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
    try {
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
      const terminalGrowthRate = 0.03; // 3% long-term growth rate
      const terminalCashFlow = currentRevenue * (Math.min(35, profitMargin + 4) / 100) * (1 + terminalGrowthRate);
      const terminalDiscountRate = 20 - Math.min(5, profitMargin / 10);
      const terminalValue = terminalCashFlow / (terminalDiscountRate / 100 - terminalGrowthRate);
      const discountedTerminalValue = terminalValue / Math.pow(1 + terminalDiscountRate / 100, projectionYears);
      
      // Total DCF valuation
      dcfValuation += discountedTerminalValue;
      
      // Venture Capital method (simplified)
      const projectedAnnualRevenueInYear5 = annualRevenue * Math.pow(1 + (growthRate * 0.8) / 100, 5);
      const projectedExitMultiple = multiples.avg * 0.8; // Slightly more conservative
      const exitValue = projectedAnnualRevenueInYear5 * projectedExitMultiple;
      const requiredReturnRate = 40; // Expected IRR for VC
      const vcValuation = exitValue / Math.pow(1 + requiredReturnRate / 100, 5);
      
      setValuationResults({
        revenueValuation,
        growthAdjustedValuation,
        ebitdaValuation,
        dcfValuation,
        vcValuation,
        annualRevenue,
        industry,
        multiples
      });
    } catch (error) {
      console.error("Error calculating valuation:", error);
    }
  };

  // Convert value to selected currency
  const convertCurrency = (value: number): number => {
    return value / exchangeRates[currency];
  };

  // Format currency with symbol
  const formatCurrency = (value: number): string => {
    const convertedValue = convertCurrency(value);
    
    if (convertedValue >= 1000000000) {
      return `${currencySymbols[currency]}${(convertedValue / 1000000000).toFixed(1)}B`;
    } else if (convertedValue >= 1000000) {
      return `${currencySymbols[currency]}${(convertedValue / 1000000).toFixed(1)}M`;
    } else if (convertedValue >= 1000) {
      return `${currencySymbols[currency]}${(convertedValue / 1000).toFixed(1)}K`;
    } else {
      return `${currencySymbols[currency]}${convertedValue.toFixed(0)}`;
    }
  };

  // Chart data
  const getChartData = () => {
    if (!valuationResults) return [];
    
    return [
      { name: 'Conservative', value: convertCurrency(valuationResults.revenueValuation.conservative) },
      { name: 'Revenue-Based', value: convertCurrency(valuationResults.revenueValuation.average) },
      { name: 'Growth-Adjusted', value: convertCurrency(valuationResults.growthAdjustedValuation) },
      { name: 'EBITDA', value: convertCurrency(valuationResults.ebitdaValuation) },
      { name: 'DCF', value: convertCurrency(valuationResults.dcfValuation) },
      { name: 'VC Method', value: convertCurrency(valuationResults.vcValuation) },
      { name: 'Optimistic', value: convertCurrency(valuationResults.revenueValuation.optimistic) }
    ];
  };
  
  // Get recommended valuation range
  const getValuationRange = () => {
    if (!valuationResults) return { low: 0, mid: 0, high: 0 };
    
    const valuations = [
      valuationResults.revenueValuation.conservative,
      valuationResults.revenueValuation.average,
      valuationResults.growthAdjustedValuation,
      valuationResults.ebitdaValuation,
      valuationResults.dcfValuation,
      valuationResults.vcValuation
    ];
    
    // Sort valuations from low to high and remove outliers
    valuations.sort((a, b) => a - b);
    const trimmedValuations = valuations.slice(1, -1); // Remove lowest and highest
    
    return {
      low: trimmedValuations[0],
      mid: (trimmedValuations[0] + trimmedValuations[trimmedValuations.length - 1]) / 2,
      high: trimmedValuations[trimmedValuations.length - 1]
    };
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
              <p className="text-red-500 text-xs mt-1">Valid annual revenue required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="growthRate">Annual Growth Rate (%)</Label>
            <div className="relative">
              <Input
                id="growthRate"
                type="number"
                step="0.1"
                className="pr-8"
                {...register("growthRate", { required: true, min: 0 })}
              />
              <span className="absolute right-3 top-2.5">%</span>
            </div>
            {errors.growthRate && (
              <p className="text-red-500 text-xs mt-1">Valid growth rate required</p>
            )}
          </div>
          
          <div>
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
              <p className="text-red-500 text-xs mt-1">Valid profit margin required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select 
              onValueChange={(value) => {
                const event = {
                  target: { name: "industry", value }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                register("industry").onChange(event);
              }}
              defaultValue="SaaS"
            >
              <SelectTrigger id="industry">
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
            {errors.industry && (
              <p className="text-red-500 text-xs mt-1">Please select an industry</p>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Calculate Valuation</Button>
      </form>

      {valuationResults && (
        <div className="mt-8 space-y-6">
          {/* Valuation Range */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Recommended Valuation Range</h3>
            <div className="text-4xl font-bold mb-2">
              {formatCurrency(getValuationRange().mid)}
            </div>
            <p className="text-gray-500">
              Range: {formatCurrency(getValuationRange().low)} - {formatCurrency(getValuationRange().high)}
            </p>
          </div>
          
          {/* Valuation Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Valuation Methods Comparison</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      `${currencySymbols[currency]}${Number(value).toLocaleString()}`, 
                      "Valuation"
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Valuation Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Method Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Revenue-Based Valuation</h3>
              <p className="text-sm text-gray-500 mb-4">
                Based on typical {valuationResults.industry} industry multiples ({valuationResults.multiples.min}x-{valuationResults.multiples.max}x revenue)
              </p>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Conservative:</span>
                  <span className="float-right font-medium">{formatCurrency(valuationResults.revenueValuation.conservative)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Average:</span>
                  <span className="float-right font-medium">{formatCurrency(valuationResults.revenueValuation.average)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Optimistic:</span>
                  <span className="float-right font-medium">{formatCurrency(valuationResults.revenueValuation.optimistic)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Growth-Adjusted Valuation</h3>
              <p className="text-sm text-gray-500 mb-4">
                Adjusts multiple based on your growth rate compared to industry average
              </p>
              <div>
                <span className="text-gray-500">Valuation:</span>
                <span className="float-right font-medium">{formatCurrency(valuationResults.growthAdjustedValuation)}</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">EBITDA-Based Valuation</h3>
              <p className="text-sm text-gray-500 mb-4">
                Based on earnings before interest, taxes, depreciation and amortization
              </p>
              <div>
                <span className="text-gray-500">Valuation:</span>
                <span className="float-right font-medium">{formatCurrency(valuationResults.ebitdaValuation)}</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Discounted Cash Flow</h3>
              <p className="text-sm text-gray-500 mb-4">
                Based on projected future cash flows discounted to present value
              </p>
              <div>
                <span className="text-gray-500">Valuation:</span>
                <span className="float-right font-medium">{formatCurrency(valuationResults.dcfValuation)}</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
              <h3 className="text-lg font-medium mb-3">Venture Capital Method</h3>
              <p className="text-sm text-gray-500 mb-4">
                Based on expected exit value in 5 years with 40% annual return requirement
              </p>
              <div>
                <span className="text-gray-500">Valuation:</span>
                <span className="float-right font-medium">{formatCurrency(valuationResults.vcValuation)}</span>
              </div>
            </div>
          </div>
          
          {/* Analysis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-700 mb-3">Valuation Analysis</h3>
            <ul className="list-disc pl-5 space-y-2 text-blue-800">
              <li>
                The suggested valuation range is {formatCurrency(getValuationRange().low)} to {formatCurrency(getValuationRange().high)}, with a midpoint of {formatCurrency(getValuationRange().mid)}.
              </li>
              <li>
                For {valuationResults.industry} companies, typical revenue multiples range from {valuationResults.multiples.min}x to {valuationResults.multiples.max}x.
              </li>
              <li>
                {valuationResults.revenueValuation.average > valuationResults.vcValuation ? 
                  'The revenue-based valuation is higher than the VC method, suggesting strong current performance but possible investor concerns about future growth or exit potential.' :
                  'The VC method yields a higher valuation than revenue-based methods, indicating strong growth prospects and exit potential.'
                }
              </li>
              <li>
                These valuations are estimates based on simplified models and actual investor valuations may vary based on additional factors.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuationCalculator;
