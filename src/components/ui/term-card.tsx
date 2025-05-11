
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SlideUp } from "@/components/ui/motion";

interface TermCardProps {
  title: string;
  definition: string;
  icon: LucideIcon;
  href: string;
  category: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  className?: string;
}

export function TermCard({
  title,
  definition,
  icon: Icon,
  href,
  category,
  difficultyLevel,
  className,
}: TermCardProps) {
  const difficultyColor = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-amber-100 text-amber-700", 
    advanced: "bg-red-100 text-red-700"
  };

  return (
    <SlideUp>
      <Link
        to={href}
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md",
          className
        )}
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-shark-100 text-shark-500">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{definition}</p>
        <div className="mt-auto flex items-center gap-2">
          <span className="rounded-full bg-shark-100 px-2 py-0.5 text-xs font-medium text-shark-700">
            {category}
          </span>
          <span className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            difficultyColor[difficultyLevel]
          )}>
            {difficultyLevel}
          </span>
        </div>
      </Link>
    </SlideUp>
  );
}
