import { useState } from "react";
import { 
  Search, 
  CircleDollarSign, 
  BarChart4, 
  Users, 
  TrendingUp, 
  Percent, 
  PieChart,
  Heart,
  Wallet,
  LineChart,
  RefreshCw,
  Building,
  Scale,
  Target
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { TermCard } from "@/components/ui/term-card";
import { FadeInStagger, SlideUpInView } from "@/components/ui/motion";
import { Input } from "@/components/ui/input";
import { businessTerms } from "@/data/businessTerms";

// Define the type for a business term
type BusinessTerm = {
  id: number;
  term: string;
  definition: string;
  category: string;
  difficultyLevel: string;
};

// Example entry
// {
//   id: 1,
//   term: "Net Profit",
//   definition: "Net profit is the amount of money left after all expenses are deducted from revenue.",
//   icon: BarChart4,
//   category: "Profitability",
//   difficultyLevel: "beginner"
// }

// Categories for filtering
const categories = [
  "All",
  "Valuation",
  "Revenue",
  "Growth",
  "Marketing",
  "Profitability",
  "Investment"
];

// Difficulty levels for filtering
const difficultyLevels = [
  "All",
  "beginner",
  "intermediate",
  "advanced"
];

// Main Encyclopedia Page Component
export default function EncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Filter terms based on search, category and difficulty
  const filteredTerms = businessTerms
    .map((item) => ({
      id: item.id,
      term: (item as any).term ?? (item as any).title, // Use 'term' if present, otherwise 'title'
      definition: item.definition,
      category: item.category,
      difficultyLevel: item.difficultyLevel,
    }))
    .filter((term: BusinessTerm) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "All" || term.category === selectedCategory;

      const matchesDifficulty = selectedDifficulty === "All" || term.difficultyLevel === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Business Terms Encyclopedia</h1>
          <p className="text-lg text-muted-foreground">
            Search and explore key business and investment concepts
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search terms or definitions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>
                  {level === "All" ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <SlideUpInView>
          {filteredTerms.length > 0 ? (
            <FadeInStagger>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-h-[70vh] overflow-auto scrollbar-shark pr-2">
                {filteredTerms.map((term) => {
                  // Map categories to icons
                  const categoryIcons: Record<string, LucideIcon> = {
                    Valuation: Scale,
                    Revenue: CircleDollarSign,
                    Growth: TrendingUp,
                    Marketing: PieChart,
                    Profitability: BarChart4,
                    Investment: Wallet,
                    All: Target,
                  };
                  const icon = categoryIcons[term.category] || Target;

                  return (
                    <TermCard
                      key={term.id}
                      title={term.term}
                      definition={term.definition}
                      icon={icon}
                      href={`/encyclopedia/${term.id}`}
                      category={term.category}
                      difficultyLevel={["beginner", "intermediate", "advanced"].includes(term.difficultyLevel)
                        ? (term.difficultyLevel as "beginner" | "intermediate" | "advanced")
                        : "beginner"}
                    />
                  );
                })}
              </div>
            </FadeInStagger>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
              <Search className="mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No terms found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </SlideUpInView>
      </div>
    </MainLayout>
  );
}
