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
    { title: "Accounts Payable", description: "Track what your business owes others", icon: Users, href: "/learning/accounts-payable", duration: "5 min", completed: false },
    { title: "Accounts Receivable", description: "Track money owed to your business", icon: Users, href: "/learning/accounts-receivable", duration: "5 min", completed: false },
    { title: "Amortization", description: "Spread out intangible asset costs over time", icon: LineChart, href: "/learning/amortization", duration: "5 min", completed: false },
    { title: "Balance Sheet", description: "Track assets, liabilities, and equity", icon: BookOpen, href: "/learning/balance-sheet", duration: "7 min", completed: false },
    { title: "Break-even Analysis", description: "Find out when your business becomes profitable", icon: Percent, href: "/learning/break-even", duration: "5 min", completed: false },
    { title: "Business Model Basics", description: "Learn the core components of any successful business model", icon: Compass, href: "/learning/business-model", duration: "8 min", completed: false },
    { title: "Cash Flow", description: "Understand how money moves in and out of your business", icon: CircleDollarSign, href: "/learning/cash-flow", duration: "7 min", completed: false },
    { title: "Churn Rate", description: "Measure customer loss over time", icon: TrendingUp, href: "/learning/churn-rate", duration: "5 min", completed: false },
    { title: "Contribution Margin", description: "Profit from each unit sold", icon: Percent, href: "/learning/contribution-margin", duration: "5 min", completed: false },
    { title: "Debt-to-Equity Ratio", description: "Assess your company's leverage", icon: BookOpen, href: "/learning/debt-equity", duration: "5 min", completed: false },
    { title: "Depreciation", description: "Allocate the cost of assets over their useful life", icon: BarChart3, href: "/learning/depreciation", duration: "5 min", completed: false },
    { title: "EBITDA", description: "Measure your operating performance", icon: LineChart, href: "/learning/ebitda", duration: "6 min", completed: false },
    { title: "Gross Margin", description: "Measure profitability after direct costs", icon: Percent, href: "/learning/gross-margin", duration: "5 min", completed: false },
    { title: "Inventory Management", description: "Optimize your stock levels and costs", icon: Users, href: "/learning/inventory-management", duration: "6 min", completed: false },
    { title: "Inventory Turnover", description: "How quickly inventory is sold", icon: BarChart3, href: "/learning/inventory-turnover", duration: "5 min", completed: false },
    { title: "Market Research", description: "Learn how to research and validate your market opportunity", icon: Target, href: "/learning/market-research", duration: "8 min", completed: false },
    { title: "Net Present Value (NPV)", description: "Calculate the value of future cash flows today", icon: CircleDollarSign, href: "/learning/npv", duration: "6 min", completed: false },
    { title: "Operating Margin", description: "Profitability from core operations", icon: BarChart3, href: "/learning/operating-margin", duration: "5 min", completed: false },
    { title: "Pitch Basics", description: "Master the art of pitching your business to investors", icon: Presentation, href: "/learning/pitch-basics", duration: "7 min", completed: false },
    { title: "Product-Market Fit", description: "Learn how to validate and achieve product-market fit", icon: Target, href: "/learning/product-market-fit", duration: "6 min", completed: false },
    { title: "Profit & Loss", description: "Analyze your business's profitability", icon: BarChart3, href: "/learning/profit-loss", duration: "6 min", completed: false },
    { title: "Retention Rate", description: "Track how many customers you keep", icon: Award, href: "/learning/retention-rate", duration: "5 min", completed: false },
    { title: "Return on Equity (ROE)", description: "Profitability for shareholders", icon: LineChart, href: "/learning/roe", duration: "5 min", completed: false },
    { title: "Working Capital", description: "Manage your short-term assets and liabilities", icon: TrendingUp, href: "/learning/working-capital", duration: "5 min", completed: false },
    { title: "Working Capital Ratio", description: "Liquidity indicator for your business", icon: TrendingUp, href: "/learning/working-capital-ratio", duration: "5 min", completed: false },
  ],
  valuation: [
    { title: "Cap Table & Equity", description: "Understanding equity structure and ownership", icon: Percent, href: "/learning/cap-table", duration: "7 min", completed: false },
    { title: "Discounted Cash Flow", description: "Projecting future value in today's dollars", icon: TrendingUp, href: "/learning/discounted-cash-flow", duration: "8 min", completed: false },
    { title: "Equity Dilution", description: "Understanding how investment affects ownership", icon: Percent, href: "/learning/equity-dilution", duration: "7 min", completed: false },
    { title: "Financial Modeling", description: "Learn how to create financial models for your startup", icon: BarChart3, href: "/learning/financial-modeling", duration: "9 min", completed: false },
    { title: "Funding Rounds", description: "Understanding different stages of startup funding", icon: LineChart, href: "/learning/funding-rounds", duration: "8 min", completed: false },
    { title: "Revenue Multiples", description: "Using revenue to determine business valuation", icon: LineChart, href: "/learning/revenue-multiples", duration: "5 min", completed: false },
    { title: "Valuation Fundamentals", description: "Learn how investors determine company value", icon: CircleDollarSign, href: "/learning/valuation-fundamentals", duration: "8 min", completed: false },
  ],
  metrics: [
    { title: "Burn Rate & Runway", description: "Calculate how long your cash will last", icon: TrendingUp, href: "/learning/burn-rate", duration: "5 min", completed: false },
    { title: "Cohort Analysis", description: "Analyze user behavior over time", icon: Users, href: "/learning/cohort-analysis", duration: "8 min", completed: false },
    { title: "Conversion Rates", description: "Tracking how prospects become customers", icon: Percent, href: "/learning/conversion-rates", duration: "5 min", completed: false },
    { title: "Customer Acquisition Cost", description: "Understanding what it costs to gain new customers", icon: Users, href: "/learning/customer-acquisition-cost", duration: "7 min", completed: false },
    { title: "Growth Metrics", description: "Key indicators that show real business growth", icon: BarChart3, href: "/learning/growth-metrics", duration: "9 min", completed: false },
    { title: "Lifetime Value", description: "Calculate how much a customer is worth over time", icon: CircleDollarSign, href: "/learning/ltv", duration: "6 min", completed: false },
    { title: "NPS & Customer Satisfaction", description: "Measuring customer loyalty and satisfaction", icon: Award, href: "/learning/nps", duration: "5 min", completed: false },
    { title: "Unit Economics", description: "Understanding cost and revenue per unit", icon: BarChart3, href: "/learning/unit-economics", duration: "6 min", completed: false },
  ],
  pitching: [
    { title: "Demo Day Preparation", description: "Get ready for your big pitch event", icon: Presentation, href: "/learning/demo-day", duration: "9 min", completed: false },
    { title: "Handling Questions", description: "Prepare for tough investor questions", icon: BookOpen, href: "/learning/handling-questions", duration: "6 min", completed: false },
    { title: "Investor Meeting Etiquette", description: "Navigate investor meetings successfully", icon: Users, href: "/learning/investor-meetings", duration: "5 min", completed: false },
    { title: "Negotiation Skills", description: "Master the art of deal-making with investors", icon: Award, href: "/learning/negotiation", duration: "11 min", completed: false },
    { title: "Pitch Deck Structure", description: "The essential slides for a winning pitch deck", icon: Presentation, href: "/learning/pitch-deck", duration: "10 min", completed: false },
    { title: "Presentation Skills", description: "Deliver your pitch with confidence", icon: Presentation, href: "/learning/presentation-skills", duration: "7 min", completed: false },
    { title: "Storytelling Techniques", description: "Craft a compelling narrative for your business", icon: Lightbulb, href: "/learning/storytelling", duration: "8 min", completed: false },
    { title: "Visual Design", description: "Create compelling visuals for your presentations", icon: Lightbulb, href: "/learning/visual-design", duration: "6 min", completed: false },
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
  const [plan, setPlan] = useState(() => { // setPlan is available if needed
    try {
      return localStorage.getItem("user_plan") || "free";
    } catch (e) {
      console.error("Failed to access localStorage for user_plan:", e);
      return "free"; // Default if localStorage is inaccessible
    }
  });

  const [userModules, setUserModules] = useState(() => getInitialProgress());
  const [userBadges, setUserBadges] = useState(() => getInitialBadges());
  const [loading, setLoading] = useState(true); // Start with loading true

  // Effect to load user-specific data or reset to defaults when user changes
  useEffect(() => {
    setLoading(true);
    try {
      if (user && user.email) {
        const userEmail = user.email;
        const freshModulesWithIcons = getInitialProgress(); // Always start with fresh modules that have correct icons

        // Load Modules Progress
        const savedProgressString = localStorage.getItem(`module_progress_${userEmail}`);
        let modulesToSet = freshModulesWithIcons;

        if (savedProgressString) {
          try {
            const parsedProgressArray = JSON.parse(savedProgressString);
            // Expect parsedProgressArray to be [{title, category, completed}, ...]
            if (Array.isArray(parsedProgressArray) &&
                parsedProgressArray.every(p => 
                  typeof p.title === 'string' && 
                  typeof p.category === 'string' && 
                  typeof p.completed === 'boolean'
                )) {
              
              modulesToSet = freshModulesWithIcons.map(freshModule => {
                const savedItem = parsedProgressArray.find(
                  p => p.title === freshModule.title && p.category === freshModule.category
                );
                return savedItem ? { ...freshModule, completed: savedItem.completed } : freshModule;
              });
            } else {
              console.warn("Invalid module progress data in localStorage for key `module_progress_${userEmail}`. Using default progress.");
              // Optionally, remove the invalid item: localStorage.removeItem(`module_progress_${userEmail}`);
            }
          } catch (e) {
            console.error("Failed to parse user module progress from localStorage for key `module_progress_${userEmail}`. Using default progress.", e);
            // Optionally, remove the corrupt item: localStorage.removeItem(`module_progress_${userEmail}`);
          }
        }
        setUserModules(modulesToSet);

        // Load Badges
        const savedBadgesString = localStorage.getItem(`badges_${userEmail}`);
        let loadedBadges = getInitialBadges();
        if (savedBadgesString) {
          try {
            const parsedBadges = JSON.parse(savedBadgesString);
            if (Array.isArray(parsedBadges) && parsedBadges.length === getInitialBadges().length && parsedBadges.every(b => typeof b.unlocked === 'boolean' && 'id' in b)) {
              loadedBadges = parsedBadges;
            } else {
              console.warn("Stale or corrupt badge data in localStorage. Re-initializing.");
              localStorage.setItem(`badges_${userEmail}`, JSON.stringify(loadedBadges)); 
            }
          } catch (e) {
            console.error("Failed to parse user badges from localStorage. Re-initializing.", e);
            localStorage.setItem(`badges_${userEmail}`, JSON.stringify(loadedBadges)); 
          }
        } else {
          localStorage.setItem(`badges_${userEmail}`, JSON.stringify(loadedBadges));
        }
        setUserBadges(loadedBadges);

      } else { // No user
        setUserModules(getInitialProgress());
        setUserBadges(getInitialBadges());
      }
    } catch (error) {
      console.error("Error during user data loading/initialization from localStorage:", error);
      setUserModules(getInitialProgress());
      setUserBadges(getInitialBadges());
    } finally {
      setLoading(false); 
    }
  }, [user]); 

  // Effect to save progress to localStorage
  useEffect(() => {
    if (user && user.email && !loading) {
      try {
        if (Array.isArray(userModules)) {
            const progressToSave = userModules.map(m => ({
              title: m.title,
              category: m.category,
              completed: m.completed
            }));
            localStorage.setItem(`module_progress_${user.email}`, JSON.stringify(progressToSave));
        }

        if (Array.isArray(userBadges)) {
            localStorage.setItem(`badges_${user.email}`, JSON.stringify(userBadges));
        }
      } catch (error) {
        console.error("Failed to save progress to localStorage:", error);
      }
    }
  }, [user, userModules, userBadges, loading]);

  // Effect to update badges based on module completion
  useEffect(() => {
    if (!user || loading || !Array.isArray(userModules) || userModules.length === 0) {
      return;
    }

    const anyModuleCompleted = userModules.some(m => m.completed);
    const allModulesCompleted = userModules.every(m => m.completed);

    setUserBadges(prevBadges => {
      const safePrevBadges = Array.isArray(prevBadges) ? prevBadges : getInitialBadges();
      let changed = false;
      const newBadges = safePrevBadges.map(badge => {
        let newBadgeState = { ...badge };
        if (badge.id === 1 && anyModuleCompleted && !badge.unlocked) {
          newBadgeState.unlocked = true;
          changed = true;
        }
        if (badge.id === 7 && allModulesCompleted && !badge.unlocked) {
          newBadgeState.unlocked = true;
          changed = true;
        }
        return newBadgeState;
      });
      return changed ? newBadges : safePrevBadges;
    });
  }, [user, userModules, loading]);


  const completeModule = (title: string) => {
    if (!user || loading) return;
    setUserModules((prevModules) => {
      const safePrevModules = Array.isArray(prevModules) ? prevModules : getInitialProgress();
      return safePrevModules.map((m) => (m.title === title ? { ...m, completed: true } : m));
    });
  };

  const handleResetModules = () => {
    if (!user || !user.email || loading) return;
    setLoading(true); 
    const initialModules = getInitialProgress();
    const initialBadges = getInitialBadges();
    setUserModules(initialModules);
    setUserBadges(initialBadges);
    try {
      const progressToSave = initialModules.map(m => ({
        title: m.title,
        category: m.category,
        completed: m.completed
      }));
      localStorage.setItem(`module_progress_${user.email}`, JSON.stringify(progressToSave));
      localStorage.setItem(`badges_${user.email}`, JSON.stringify(initialBadges));
    } catch (error) {
      console.error("Failed to save reset progress to localStorage:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safeguard state variables for rendering
  const safeUserModules = Array.isArray(userModules) ? userModules : getInitialProgress();

  const completedModules = safeUserModules.filter((m) => m.completed);
  const completionPercentage = safeUserModules.length > 0 ? (completedModules.length / safeUserModules.length) * 100 : 0;

  // DEBUG LOGS START
  useEffect(() => {
    console.log('[Learning.tsx] State Update - Loading:', loading);
    console.log('[Learning.tsx] State Update - User:', user ? user.email : 'No User');
    console.log('[Learning.tsx] State Update - SafeUserModules Length:', safeUserModules.length);
    console.log('[Learning.tsx] State Update - UserModules (raw) Length:', userModules.length);
    console.log('[Learning.tsx] State Update - UserBadges (raw) Length:', userBadges.length);
  }, [loading, user, safeUserModules, userModules, userBadges]);
  // DEBUG LOGS END

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl relative"> 
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Learning Hub</h1>
          <p className="text-lg text-muted-foreground">
            Master business concepts through bite-sized modules
          </p>
        </div>
        
        {user && !loading ? (
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
                      {completedModules.length}/{safeUserModules.length}
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
        ) : user && loading ? (
          <div className="mb-8 rounded-xl border bg-card p-6 animate-pulse">
            <div className="h-8 rounded bg-muted w-3/4 mb-3"></div>
            <div className="h-4 rounded bg-muted w-1/2 mb-4"></div>
            <div className="h-6 rounded bg-muted w-full mb-2"></div>
            <div className="h-2 rounded bg-muted w-full"></div>
          </div>
        ) : null}
        
        <Tabs defaultValue="fundamentals" className="mb-8">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4"> 
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => {
            const modulesInCategory = safeUserModules.filter((module) => module.category === category.id);
            const visibleModules = plan === "free" ? modulesInCategory.slice(0, 5) : modulesInCategory;

            return (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                {loading && visibleModules.length === 0 && safeUserModules.length > 0 ? ( 
                  <div className="text-center text-muted-foreground py-12">
                    <p>Loading modules for {category.name}...</p>
                  </div>
                ) : visibleModules.length === 0 && !loading ? (
                  <div className="text-center text-muted-foreground py-12">
                    <p>No modules available in this category.</p>
                    {user && (
                      <Button
                        variant="default"
                        className="mt-4"
                        onClick={handleResetModules}
                        disabled={!user || loading} // Disable if no user or global loading
                      >
                        Reset All Progress
                      </Button>
                    )}
                  </div>
                ) : (
                  <FadeInStagger>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {visibleModules.map((module) => (
                        <FadeIn key={module.title}>
                          <ModuleCard
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
                              disabled={loading} // Disable if global loading
                            >
                              Complete
                            </Button>
                          )}
                        </FadeIn>
                      ))}
                      {plan === "free" && modulesInCategory.length > 5 && (
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
        
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-shark-500 border-t-transparent mb-4"></div>
              <div className="text-lg font-semibold text-shark-700 dark:text-white">Loading Learning Hub...</div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}