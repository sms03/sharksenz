import { Link } from "react-router-dom";
import { 
  LineChart, 
  BarChartHorizontal, 
  Target, 
  PieChart 
} from "lucide-react";
import { SlideUpInView } from "@/components/ui/motion";
import { LucideIcon } from "lucide-react";

interface DashboardWidget {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

// Dashboard widgets
const dashboardWidgets: DashboardWidget[] = [
  {
    title: "Revenue Calculator",
    description: "Project your business revenue and growth",
    icon: LineChart,
    href: "/dashboard/revenue",
  },
  {
    title: "Valuation Estimator",
    description: "Calculate your company's potential value",
    icon: BarChartHorizontal,
    href: "/dashboard/valuation",
  },
  {
    title: "Market Analysis",
    description: "Understand your target market and opportunities",
    icon: Target,
    href: "/dashboard/market",
  },
  {
    title: "Profit Projection",
    description: "Visualize profitability across different scenarios",
    icon: PieChart,
    href: "/dashboard/profit",
  },
];

export function DashboardWidgetsSection() {
  return (
    <SlideUpInView>
      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">Metrics Dashboard</h2>
            <p className="font-subheading-libre text-muted-foreground">
              Tools to calculate and visualize business metrics
            </p>
          </div>
          <Link to="/dashboard" className="font-body-merriweather text-sm font-medium text-shark-500 hover: group relative">
            Open dashboard
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-shark-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardWidgets.map((widget) => (
            <div
              key={widget.title}
              className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md h-[200px]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-shark-100 text-shark-500">
                <widget.icon className="h-6 w-6" />
              </div>
              <h3 className="font-subheading-playfair mb-1 text-lg font-semibold line-clamp-1">{widget.title}</h3>
              <p className="font-body-lora mb-4 text-sm text-muted-foreground line-clamp-3">
                {widget.description}
              </p>
              <Link
                to={widget.href}
                className="font-body-merriweather mt-auto text-sm font-medium text-shark-500 hover:underline"
              >
                Try it now
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SlideUpInView>
  );
}
