
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ReactNode } from "react";
import { ResponsiveChart } from "@/components/ui/responsive-chart";
import { useResponsive } from "@/hooks/use-mobile";

interface ChartContainerProps {
  children: ReactNode;
}

export default function ChartContainer({ children }: ChartContainerProps) {
  const { isMobile } = useResponsive();
  
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <ResponsiveChart height={isMobile ? 250 : 350} minHeight={200}>
          {children}
        </ResponsiveChart>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10"
        >
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Export Report
        </Button>
      </CardFooter>
    </Card>
  );
}
