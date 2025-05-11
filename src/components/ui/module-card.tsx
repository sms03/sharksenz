
import { CheckCircle, Clock, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SlideUp } from "@/components/ui/motion";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  completed?: boolean;
  duration?: string;
  className?: string;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  href,
  completed = false,
  duration = "5 min",
  className,
}: ModuleCardProps) {
  return (
    <SlideUp>
      <Link
        to={href}
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md h-[220px]",
          completed ? "border-shark-200 bg-shark-50" : "border-border",
          className
        )}
      >
        {completed && (
          <div className="absolute right-3 top-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        )}
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-shark-100 text-shark-500">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-subheading-playfair mb-1 text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="font-body-merriweather mb-4 text-sm text-muted-foreground line-clamp-3">{description}</p>
        <div className="mt-auto flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{duration}</span>
        </div>
      </Link>
    </SlideUp>
  );
}
