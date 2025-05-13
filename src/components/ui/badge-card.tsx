import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BADGE_REQUIREMENTS } from "@/utils/userProgress";

interface BadgeCardProps {
  title: string;
  difficulty: "bronze" | "silver" | "gold" | "platinum";
  unlocked: boolean;
  icon: ReactNode;
  className?: string;
}

// Trophy background colors based on difficulty
const difficultyBgColors = {
  bronze: "bg-amber-50",
  silver: "bg-slate-50",
  gold: "bg-yellow-50",
  platinum: "bg-cyan-50",
};

// Trophy text colors based on difficulty
const difficultyTextColors = {
  bronze: "text-amber-600 drop-shadow-sm",
  silver: "text-slate-400 drop-shadow-sm",
  gold: "text-yellow-500 drop-shadow-md",
  platinum: "text-cyan-400 drop-shadow-md",
};

export function BadgeCard({ 
  title, 
  difficulty, 
  unlocked, 
  icon,
  className 
}: BadgeCardProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center rounded-lg border bg-card p-4 text-center transition-all duration-200",
        unlocked && "border-shark-200 shadow-sm hover:shadow-md",
        className
      )}
    >
      <div 
        className={cn(
          "mb-3 flex h-14 w-14 items-center justify-center rounded-full relative group",
          unlocked ? difficultyBgColors[difficulty] : "bg-muted/80"
        )}
      >
        <div className={cn(
          "h-7 w-7 transition-transform duration-300",
          unlocked ? 
            `${difficultyTextColors[difficulty]} group-hover:scale-110` : 
            "text-muted-foreground"
        )}>
          {icon}
        </div>
        
        <span 
          className={cn(
            "absolute -bottom-1 -right-1 text-xs capitalize px-2 py-0.5 rounded-full font-medium",
            unlocked ? 
              "bg-shark-200 text-shark-800" : 
              "bg-muted text-muted-foreground"
          )}
        >
          {difficulty}
        </span>
      </div>
      
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="mb-2 text-xs text-muted-foreground">
        {unlocked ? "Badge unlocked" : BADGE_REQUIREMENTS[title as keyof typeof BADGE_REQUIREMENTS] || "Complete requirements"}
      </p>
      
      {unlocked && (
        <div className="mt-auto flex items-center text-xs text-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          <span>Unlocked</span>
        </div>
      )}
    </div>
  );
}
