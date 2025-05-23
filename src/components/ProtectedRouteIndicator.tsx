import { useState } from "react";
import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProtectedRouteIndicatorProps {
  children: React.ReactNode;
}

export const ProtectedRouteIndicator = ({
  children,
}: ProtectedRouteIndicatorProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-blue-500" />
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign in required to access this content</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
