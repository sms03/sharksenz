import { 
  Award, 
  BarChart3, 
  BookOpen, 
  CircleDollarSign, 
  Compass, 
  Lightbulb, 
  LineChart, 
  Percent, 
  Presentation, 
  Target, 
  TrendingUp, 
  Users, 
  Lock
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { ModuleCard } from "@/components/ui/module-card";
import { Progress } from "@/components/ui/progress";
import { 
  FadeInStagger, 
  FadeIn, 
  SlideUpInView 
} from "@/components/ui/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Learning path categories
const categories = [
  { id: "fundamentals", name: "Fundamentals" },
  { id: "valuation", name: "Valuation" },
  { id: "metrics", name: "Key Metrics" },
  { id: "pitching", name: "Pitching" },
];

// Learning modules by category
const learningModules = {
  fundamentals: [
    { title: "Business Model Basics", description: "Learn the core components of any successful business model", icon: Compass, href: "/learning/business-model", duration: "8 min", completed: false },
    { title: "Cash Flow", description: "Understand how money moves in and out of your business", icon: CircleDollarSign, href: "/learning/cash-flow", duration: "7 min", completed: false },
    { title: "Profit & Loss", description: "Analyze your business's profitability", icon: BarChart3, href: "/learning/profit-loss", duration: "6 min", completed: false },
    { title: "Balance Sheet", description: "Track assets, liabilities, and equity", icon: BookOpen, href: "/learning/balance-sheet", duration: "7 min", completed: false },
    { title: "Working Capital", description: "Manage your short-term assets and liabilities", icon: TrendingUp, href: "/learning/working-capital", duration: "5 min", completed: false },
    { title: "Inventory Management", description: "Optimize your stock levels and costs", icon: Users, href: "/learning/inventory-management", duration: "6 min", completed: false },
    { title: "Break-even Analysis", description: "Find out when your business becomes profitable", icon: Percent, href: "/learning/break-even", duration: "5 min", completed: false },
    { title: "EBITDA", description: "Measure your operating performance", icon: LineChart, href: "/learning/ebitda", duration: "6 min", completed: false },
    { title: "Depreciation", description: "Allocate the cost of assets over their useful life", icon: BarChart3, href: "/learning/depreciation", duration: "5 min", completed: false },
    { title: "Amortization", description: "Spread out intangible asset costs over time", icon: LineChart, href: "/learning/amortization", duration: "5 min", completed: false },
    { title: "Net Present Value (NPV)", description: "Calculate the value of future cash flows today", icon: CircleDollarSign, href: "/learning/npv", duration: "6 min", completed: false },
    { title: "Gross Margin", description: "Measure profitability after direct costs", icon: Percent, href: "/learning/gross-margin", duration: "5 min", completed: false },
    { title: "Operating Margin", description: "Profitability from core operations", icon: BarChart3, href: "/learning/operating-margin", duration: "5 min", completed: false },
    { title: "Debt-to-Equity Ratio", description: "Assess your company's leverage", icon: BookOpen, href: "/learning/debt-equity", duration: "5 min", completed: false },
    { title: "Accounts Receivable", description: "Track money owed to your business", icon: Users, href: "/learning/accounts-receivable", duration: "5 min", completed: false },
    { title: "Accounts Payable", description: "Track what your business owes others", icon: Users, href: "/learning/accounts-payable", duration: "5 min", completed: false },
    { title: "Churn Rate", description: "Measure customer loss over time", icon: TrendingUp, href: "/learning/churn-rate", duration: "5 min", completed: false },
    { title: "Retention Rate", description: "Track how many customers you keep", icon: Award, href: "/learning/retention-rate", duration: "5 min", completed: false },
    { title: "Contribution Margin", description: "Profit from each unit sold", icon: Percent, href: "/learning/contribution-margin", duration: "5 min", completed: false },
    { title: "Working Capital Ratio", description: "Liquidity indicator for your business", icon: TrendingUp, href: "/learning/working-capital-ratio", duration: "5 min", completed: false },
    { title: "Inventory Turnover", description: "How quickly inventory is sold", icon: BarChart3, href: "/learning/inventory-turnover", duration: "5 min", completed: false },
    { title: "Return on Equity (ROE)", description: "Profitability for shareholders", icon: LineChart, href: "/learning/roe", duration: "5 min", completed: false },
    { title: "Return on Assets (ROA)", description: "How efficiently assets generate profit", icon: LineChart, href: "/learning/roa", duration: "5 min", completed: false },
    { title: "Free Cash Flow", description: "Cash available after operations and capital expenses", icon: CircleDollarSign, href: "/learning/free-cash-flow", duration: "5 min", completed: false }
  ],
  valuation: [
    { title: "Valuation Fundamentals", description: "Learn how investors determine company value", icon: CircleDollarSign, href: "/learning/valuation-fundamentals", duration: "8 min", completed: false },
    { title: "Revenue Multiples", description: "Using revenue to determine business valuation", icon: LineChart, href: "/learning/revenue-multiples", duration: "5 min", completed: false },
    { title: "Discounted Cash Flow", description: "Projecting future value in today's dollars", icon: TrendingUp, href: "/learning/discounted-cash-flow", duration: "12 min", completed: false },
    { title: "Equity Dilution", description: "Understanding how investment affects ownership", icon: Percent, href: "/learning/equity-dilution", duration: "7 min", completed: false }
  ],
  metrics: [
    { title: "Burn Rate & Runway", description: "Calculate how long your cash will last", icon: TrendingUp, href: "/learning/burn-rate", duration: "5 min", completed: false },
    { title: "Customer Acquisition Cost", description: "Understanding what it costs to gain new customers", icon: Users, href: "/learning/cac", duration: "7 min", completed: false },
    { title: "Lifetime Value", description: "Calculate how much a customer is worth over time", icon: CircleDollarSign, href: "/learning/ltv", duration: "6 min", completed: false },
    { title: "Growth Metrics", description: "Key indicators that show real business growth", icon: BarChart3, href: "/learning/growth-metrics", duration: "9 min", completed: false }
  ],
  pitching: [
    { title: "Pitch Deck Structure", description: "The essential slides for a winning pitch deck", icon: Presentation, href: "/learning/pitch-deck", duration: "10 min", completed: false },
    { title: "Storytelling Techniques", description: "Craft a compelling narrative for your business", icon: Lightbulb, href: "/learning/storytelling", duration: "8 min", completed: false },
    { title: "Handling Questions", description: "Prepare for tough investor questions", icon: BookOpen, href: "/learning/handling-questions", duration: "6 min", completed: false },
    { title: "Negotiation Skills", description: "Master the art of deal-making with investors", icon: Award, href: "/learning/negotiation", duration: "11 min", completed: false }
  ]
};

// Helper: get initial progress for all modules
const getInitialProgress = () => {
  const all = Object.entries(learningModules).flatMap(([cat, mods]) =>
    mods.map((m) => ({ ...m, completed: false, category: cat }))
  );
  return all;
};

// Helper: get initial badges (all locked)
const getInitialBadges = () => [
  { id: 1, name: "Shark Apprentice", unlocked: false },
  { id: 2, name: "Valuation Expert", unlocked: false },
  { id: 3, name: "Metrics Master", unlocked: false },
  { id: 4, name: "Pitching Pro", unlocked: false },
  { id: 5, name: "Encyclopedia Scholar", unlocked: false },
  { id: 6, name: "Quiz Champion", unlocked: false },
  { id: 7, name: "Shark Tank Ready", unlocked: false },
  { id: 8, name: "Negotiation Ninja", unlocked: false },
];

export default function Learning() {
  const { user } = useAuth();
  // Get user plan from localStorage (default to free)
  const [plan] = useState(() => localStorage.getItem("user_plan") || "free");
  // Per-user progress and badges (localStorage for demo)
  const [userModules, setUserModules] = useState(() => {
    if (!user) return getInitialProgress();
    const saved = localStorage.getItem(`modules_${user.email}`);
    let parsed = saved ? JSON.parse(saved) : [];
    // If no modules or module count mismatch, re-initialize
    if (!parsed.length || parsed.length !== getInitialProgress().length) {
      parsed = getInitialProgress();
      localStorage.setItem(`modules_${user.email}`, JSON.stringify(parsed));
    }
    return parsed;
  });
  const [userBadges, setUserBadges] = useState(() => {
    if (!user) return getInitialBadges();
    const saved = localStorage.getItem(`badges_${user.email}`);
    return saved ? JSON.parse(saved) : getInitialBadges();
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`modules_${user.email}`, JSON.stringify(userModules));
      localStorage.setItem(`badges_${user.email}`, JSON.stringify(userBadges));
    }
  }, [user, userModules, userBadges]);

  // Track progress when a module is marked as completed (for logged in users)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`modules_${user.email}`, JSON.stringify(userModules));
      // Optionally, send progress to backend here
    }
  }, [userModules, user]);

  // Mark module as completed and unlock badge if needed
  const completeModule = (title: string) => {
    setUserModules((prev) => {
      const updated = prev.map((m) => (m.title === title ? { ...m, completed: true } : m));
      // Track progress in localStorage for logged in users
      if (user) {
        localStorage.setItem(`modules_${user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
    // Unlock "Shark Apprentice" for first module
    if (!userBadges.find((b) => b.id === 1)?.unlocked) {
      setUserBadges((prev) => prev.map((b) => b.id === 1 ? { ...b, unlocked: true } : b));
    }
    // Unlock "Shark Tank Ready" if all modules complete
    if (
      userModules.filter((m) => m.completed).length + 1 === userModules.length &&
      !userBadges.find((b) => b.id === 7)?.unlocked
    ) {
      setUserBadges((prev) => prev.map((b) => b.id === 7 ? { ...b, unlocked: true } : b));
    }
  };

  // Calculate total completed modules
  const completedModules = userModules.filter((m) => m.completed);
  const completionPercentage = (completedModules.length / userModules.length) * 100;

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Learning Hub</h1>
          <p className="text-lg text-muted-foreground">
            Master business concepts through bite-sized modules
          </p>
        </div>
        
        {user ? (
          <SlideUpInView>
            <div className="mb-8 rounded-xl border bg-card p-6">
              <div className="mb-4 grid gap-4 md:grid-cols-3">
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold">Your Learning Progress</h2>
                  <p className="text-muted-foreground">
                    Complete all modules to master the essentials
                  </p>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <div className="rounded-lg bg-shark-100 px-4 py-2 text-center">
                    <div className="text-3xl font-bold text-shark-700">
                      {completedModules.length}/{userModules.length}
                    </div>
                    <div className="text-sm text-shark-600">modules completed</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </div>
          </SlideUpInView>
        ) : null}
        
        <Tabs defaultValue="fundamentals" className="mb-8">
          <TabsList className="w-full grid grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => {
            const modules = userModules.filter((module) => module.category === category.id);
            const visibleModules = plan === "free" ? modules.slice(0, 5) : modules;
            return (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                {visibleModules.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <p>No modules available in this category.</p>
                    <Button asChild variant="default" className="mt-4">
                      <a href="#" onClick={() => { localStorage.removeItem(`modules_${user?.email}`); window.location.reload(); }}>
                        Reset Modules
                      </a>
                    </Button>
                  </div>
                ) : (
                  <FadeInStagger>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {visibleModules.map((module) => (
                        <FadeIn key={module.title}>
                          <ModuleCard
                            key={module.title}
                            title={module.title}
                            description={module.description}
                            icon={module.icon}
                            href={user ? module.href : "/auth"}
                            duration={module.duration}
                            completed={user ? module.completed : false}
                          />
                          {user && !module.completed && (
                            <Button
                              onClick={() => completeModule(module.title)}
                              className="mt-2 w-full"
                            >
                              Complete
                            </Button>
                          )}
                        </FadeIn>
                      ))}
                      {plan === "free" && modules.length > 5 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/50">
                          <p className="mb-2 font-semibold text-shark-700">Unlock more modules with Starter or Professional plan!</p>
                          <Button asChild variant="default">
                            <a href="/pricing">Upgrade Now</a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </FadeInStagger>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
        
        <div className="rounded-xl border bg-card p-6 md:p-8">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold">Ready to test your knowledge?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Take quizzes, earn badges, and track your progress on our leaderboard.
            </p>
          </div>
          <div className="flex justify-center">
            {user ? (
              <Link
                to="/achievements"
                className="rounded-lg bg-shark-500 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-shark-600"
              >
                View Achievement Center
              </Link>
            ) : (
              <Button asChild>
                <Link to="/auth">
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In to Access
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
