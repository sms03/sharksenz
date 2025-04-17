
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueMultipleChart from "@/components/dashboard/charts/valuation/RevenueMultipleChart";
import DiscountedCashFlowChart from "@/components/dashboard/charts/valuation/DiscountedCashFlowChart";

interface ValuationTabContentProps {
  selectedCurrency?: { code: string; symbol: string; name: string };
}

export default function ValuationTabContent({ selectedCurrency = { code: "USD", symbol: "$", name: "US Dollar" } }: ValuationTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Valuation</CardTitle>
        <CardDescription>
          Different methods to estimate your company's value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <RevenueMultipleChart currency={selectedCurrency} />
          <DiscountedCashFlowChart currency={selectedCurrency} />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Note: These are simplified models. Real valuations are complex and consider
          many additional factors.
        </p>
      </CardFooter>
    </Card>
  );
}
