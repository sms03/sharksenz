
import { Link } from "react-router-dom";
import { 
  CircleDollarSign, 
  TrendingUp, 
  Users, 
  Presentation 
} from "lucide-react";
import { ModuleCard } from "@/components/ui/module-card";
import { FadeIn } from "@/components/ui/motion";
import { useAuth } from "@/components/AuthProvider";
import { LucideIcon } from "lucide-react";

interface LearningModule {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  duration: string;
  completed: boolean;
}

// Featured learning modules
const featuredModules: LearningModule[] = [
  {
    title: "Valuation Fundamentals",
    description: "Learn how investors determine company value in Shark Tank pitches",
    icon: CircleDollarSign,
    href: "/learning/valuation",
    duration: "8 min",
    completed: false
  },
  {
    title: "Burn Rate Explained",
    description: "Understand what burn rate means and why it matters to investors",
    icon: TrendingUp,
    href: "/learning/burn-rate",
    duration: "5 min",
    completed: true
  },
  {
    title: "Customer Acquisition",
    description: "Master the concepts of CAC and how it influences investment decisions",
    icon: Users,
    href: "/learning/customer-acquisition",
    duration: "7 min",
    completed: false
  },
  {
    title: "Pitch Deck Essentials",
    description: "Create a compelling pitch that grabs shark attention in minutes",
    icon: Presentation,
    href: "/learning/pitch-deck",
    duration: "10 min",
    completed: false
  }
];

export function FeaturedModulesSection() {
  const { user } = useAuth();
  
  return (
    <FadeIn>
      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured Learning Modules</h2>
            <p className="text-muted-foreground">
              Bite-sized lessons to master business concepts
            </p>
          </div>
          <Link to="/learning" className="text-sm font-medium text-shark-500 hover:underline">
            View all modules
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredModules.map((module) => (
            <ModuleCard
              key={module.title}
              title={module.title}
              description={module.description}
              icon={module.icon}
              href={user ? module.href : "/auth"}
              duration={module.duration}
              completed={user ? module.completed : false}
            />
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
