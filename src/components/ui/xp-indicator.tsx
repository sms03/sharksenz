import React from "react";
import { CircleDollarSign, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface XPIndicatorProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function XPIndicator({ 
  value, 
  size = "md", 
  showLabel = true,
  className 
}: XPIndicatorProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(
        "flex items-center bg-gradient-to-r from-shark-100 to-shark-200 text-shark-800 rounded-full font-medium px-2 py-0.5",
        sizeClasses[size]
      )}>
        <span className="mr-1 flex items-center">
          <CircleDollarSign className={cn(
            "inline-block",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          )} />
        </span>
        {showLabel && "XP: "}
        {value > 0 ? `+${value}` : value}
      </div>
    </div>
  );
}

export function XPInfoTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-shark-500">
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" side="bottom">
          <div>            <h4 className="font-medium mb-2">How to Earn XP</h4>
            <ul className="text-xs space-y-1 list-disc pl-4">
              <li>Complete a learning module: <span className="font-medium">+25 XP</span></li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
