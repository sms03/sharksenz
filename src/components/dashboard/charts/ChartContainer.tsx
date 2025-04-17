
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ReactNode } from "react";

interface ChartContainerProps {
  children: ReactNode;
}

export default function ChartContainer({ children }: ChartContainerProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {children}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </CardFooter>
    </Card>
  );
}
