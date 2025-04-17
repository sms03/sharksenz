
import { ArrowDownRight, ArrowUpRight, CircleDollarSign, Clock, TrendingDown, Users } from "lucide-react";
import MetricsCard from "./MetricsCard";
import { formatCurrency } from "@/utils/currency";

interface MetricsDisplayProps {
  metrics: {
    valuation: number;
    monthlyBurnRate: number;
    runway: number;
    ltv: number;
    ltvCacRatio: number;
  };
  selectedCurrency: { code: string; symbol: string; name: string };
}

export default function MetricsDisplay({ metrics, selectedCurrency }: MetricsDisplayProps) {
  const { valuation, monthlyBurnRate, runway, ltv, ltvCacRatio } = metrics;
  
  return (
    <div className="space-y-6">
      <MetricsCard 
        title="Company Valuation" 
        icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">
          {formatCurrency(valuation, selectedCurrency)}
        </div>
        <p className="text-xs text-muted-foreground">
          Based on revenue multiple of 5x
        </p>
      </MetricsCard>
      
      <MetricsCard 
        title="Monthly Burn Rate" 
        icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">
          {formatCurrency(monthlyBurnRate, selectedCurrency)}
        </div>
        <div className="flex items-center pt-1">
          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {runway} months runway
          </span>
        </div>
      </MetricsCard>
      
      <MetricsCard 
        title="Customer Metrics" 
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">
              {formatCurrency(ltv, selectedCurrency)}
            </div>
            <div className="text-xs text-muted-foreground">
              Customer Lifetime Value
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {ltvCacRatio.toFixed(1)}x
            </div>
            <div className="text-xs text-muted-foreground">
              LTV:CAC Ratio
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          {ltvCacRatio >= 3 ? (
            <>
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">
                Healthy acquisition economics
              </span>
            </>
          ) : (
            <>
              <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
              <span className="text-xs text-red-500">
                Improve customer acquisition
              </span>
            </>
          )}
        </div>
      </MetricsCard>
    </div>
  );
}
