import { CheckCircle, Clock, LucideIcon, AlertTriangle } from "lucide-react"; // Added AlertTriangle for error case
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { SlideUp } from "./motion"; // SlideUp was previously commented out for debugging

interface ModuleCardProps {
  title: string;
  description: string;
  // Allow for LucideIcon or a general React ComponentType for robustness
  icon: LucideIcon | React.ComponentType<any>; 
  href: string;
  completed?: boolean;
  duration?: string;
  className?: string;
}

export function ModuleCard({
  title,
  description,
  icon: Icon, // Use 'Icon' directly as the prop name, received from Learning.tsx module.icon
  href,
  completed = false,
  duration = "5 min",
  className,
}: ModuleCardProps) {
  // Log the received icon prop for debugging
  console.log(`[ModuleCard] Module: "${title}", Icon prop type: ${typeof Icon}, Icon prop value:`, Icon);

  // Check if Icon is a valid React component
  // Valid components are functions or objects with a $$typeof property (e.g., from React.forwardRef, React.memo)
  const isValidComponent = 
    typeof Icon === 'function' || 
    (typeof Icon === 'object' && Icon !== null && (Icon as any).$$typeof);

  if (!isValidComponent) {
    console.error(`[ModuleCard] Invalid icon prop for module "${title}". Received type: ${typeof Icon}, value:`, Icon);
    // Render a card with an error state if the icon is not a valid component
    return (
      <div // Using a div for the error state card
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl border border-destructive bg-card p-5 shadow-sm h-[220px]",
          className
        )}
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
          <AlertTriangle className="h-6 w-6" /> {/* Placeholder error icon */}
        </div>
        <h3 className="font-subheading-playfair mb-1 text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="font-body-merriweather mb-4 text-sm text-muted-foreground line-clamp-3">
          Error: Icon for this module could not be loaded.
        </p>
        <div className="mt-auto flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{duration}</span>
        </div>
      </div>
    );
  }

  // If the icon is valid, render the normal card
  return (
    // <SlideUp> // This component was previously commented out for debugging
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
          {/* Render the Icon directly, now that it's validated */}
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-subheading-playfair mb-1 text-lg font-semibold line-clamp-1">{title}</h3>
        <p className="font-body-merriweather mb-4 text-sm text-muted-foreground line-clamp-3">{description}</p>
        <div className="mt-auto flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{duration}</span>
        </div>
      </Link>
    // </SlideUp>
  );
}
