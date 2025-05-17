import { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { useResponsive } from "@/hooks/use-mobile";

interface ResponsiveChartProps {
  children: ReactNode;
  height?: number | string;
  minHeight?: number;
  aspectRatio?: number;
}

/**
 * A responsive wrapper for charts to ensure proper sizing across devices
 */
export function ResponsiveChart({ 
  children, 
  height = "100%", 
  minHeight = 300, 
  aspectRatio = 16/9 
}: ResponsiveChartProps) {
  const { isMobile, isTablet } = useResponsive();
  
  // Calculate appropriate height based on screen size
  let chartHeight = height;
  
  // On mobile, use a more compact height
  if (isMobile) {
    chartHeight = minHeight;
  } else if (isTablet) {
    chartHeight = typeof height === 'number' ? height * 0.9 : height;
  }

  return (
    <div style={{ 
      width: '100%', 
      height: typeof chartHeight === 'number' ? `${chartHeight}px` : chartHeight,
      minHeight: `${minHeight}px`,
    }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
