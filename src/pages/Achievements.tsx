import { useState, useEffect } from "react";
import { 
  Award, 
  BarChart4, 
  BookOpen, 
  CheckCircle2, 
  CircleDollarSign, 
  Lock, 
  Sparkles, 
  Star, 
  Trophy,
  Users,
  Info
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeInStagger, FadeIn, SlideUpInView } from "@/components/ui/motion";
import { useAuth } from "@/components/AuthProvider";
import { BadgeCard } from "@/components/ui/badge-card";
import { LevelUpAnimation } from "@/components/ui/level-up-animation";
import { XPInfoTooltip } from "@/components/ui/xp-indicator";
import { toast } from "@/components/ui/sonner";
import { 
  getUserXP, 
  calculateLevel, 
  xpForNextLevel, 
  levelProgressPercentage,
  getLevelName,
  addXP,
  checkAndUpdateBadges
} from "@/utils/userProgress";

// Helper: get initial badges (all locked)
const getInitialBadges = () => [
  { id: 1, name: "Shark Apprentice", unlocked: false, difficulty: "bronze" },
  { id: 2, name: "Valuation Expert", unlocked: false, difficulty: "silver" },
  { id: 3, name: "Metrics Master", unlocked: false, difficulty: "silver" },
  { id: 4, name: "Pitching Pro", unlocked: false, difficulty: "gold" },
  { id: 5, name: "Encyclopedia Scholar", unlocked: false, difficulty: "silver" },
  { id: 6, name: "Quiz Champion", unlocked: false, difficulty: "gold" },
  { id: 7, name: "Shark Tank Ready", unlocked: false, difficulty: "platinum" },
  { id: 8, name: "Negotiation Ninja", unlocked: false, difficulty: "platinum" },
];

// Helper: get trophy color based on badge difficulty
const getTrophyColor = (difficulty: string) => {
  switch (difficulty) {
    case "bronze":
      return "text-amber-600 drop-shadow-sm"; // Bronze
    case "silver":
      return "text-slate-400 drop-shadow-sm"; // Silver
    case "gold":
      return "text-yellow-500 drop-shadow-md"; // Gold
    case "platinum":
      return "text-cyan-400 drop-shadow-md"; // Platinum
    default:
      return "text-shark-700"; // Default
  }
};

// Helper: get trophy background color based on badge difficulty
const getTrophyBgColor = (difficulty: string) => {
  switch (difficulty) {
    case "bronze":
      return "bg-amber-50"; 
    case "silver":
      return "bg-slate-50";
    case "gold":
      return "bg-yellow-50";
    case "platinum":
      return "bg-cyan-50";
    default:
      return "bg-shark-100"; 
  }
};

// Helper: get initial quizzes (all not started)
const getInitialQuizzes = () => [
  { id: 1, title: "Business Model Basics", completed: false, score: 0 },
  { id: 2, title: "Valuation Methods", completed: false, score: 0 },
  { id: 3, title: "Key Metrics Quiz", completed: false, score: 0 },
  { id: 4, title: "Pitch Structure", completed: false, score: 0 }
];

export default function Achievements() {
  const { user } = useAuth();
  
  // Level-up animation state
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  // XP and level state
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(250);
  const [levelProgress, setLevelProgress] = useState(0);
  const [levelName, setLevelName] = useState("Shark Novice");

  const [userBadges, setUserBadges] = useState(() => {
    if (!user) return getInitialBadges();
    const saved = localStorage.getItem(`badges_${user.email}`);
    return saved ? JSON.parse(saved) : getInitialBadges();
  });
  // User-specific quiz progress
  const [userQuizzes, setUserQuizzes] = useState(() => {
    if (!user) return getInitialQuizzes();
    const saved = localStorage.getItem(`quizzes_${user.email}`);
    return saved ? JSON.parse(saved) : getInitialQuizzes();
  });
  
  // User-specific module progress
  const [userModules, setUserModules] = useState(() => {
    if (!user || !user.email) return [];
    const savedProgressString = localStorage.getItem(`module_progress_${user.email}`);
    return savedProgressString ? JSON.parse(savedProgressString) : [];
  });
  
  // Keep badges in sync with module and quiz progress
  useEffect(() => {
    if (!user || !user.email || !Array.isArray(userModules) || userModules.length === 0) return;
    
    // Use the checkAndUpdateBadges function to get updated badge status
    const updatedBadges = checkAndUpdateBadges(userModules, userBadges, userQuizzes);
    
    // Check if badge state has changed
    const badgesChanged = updatedBadges.some((newBadge, index) => 
      newBadge.unlocked !== userBadges[index].unlocked
    );
    
    if (badgesChanged) {
      setUserBadges(updatedBadges);
      localStorage.setItem(`badges_${user.email}`, JSON.stringify(updatedBadges));
      
      // Notify about newly unlocked badges (but not about revoked ones to avoid duplicate notifications)
      const newlyUnlocked = updatedBadges.filter((newBadge, index) => 
        newBadge.unlocked && !userBadges[index].unlocked
      );
      
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach(badge => {
          toast.success(
            <div className="flex items-center gap-2">
              <span>Badge unlocked!</span>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>, 
            {
              description: `You've earned the "${badge.name}" achievement.`,
              duration: 3000
            }
          );
        });
      }
    }
  }, [user, userModules, userQuizzes, userBadges]);
  
  // Load module progress updates when they change in localStorage
  useEffect(() => {
    if (!user || !user.email) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `module_progress_${user.email}` && e.newValue) {
        try {
          const updatedModules = JSON.parse(e.newValue);
          setUserModules(updatedModules);
        } catch (error) {
          console.error("Failed to parse updated module progress:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Periodically check for updates (for changes within the same tab)
    const checkInterval = setInterval(() => {
      const savedProgressString = localStorage.getItem(`module_progress_${user.email}`);
      if (savedProgressString) {
        try {
          const currentModules = JSON.parse(savedProgressString);
          if (JSON.stringify(currentModules) !== JSON.stringify(userModules)) {
            setUserModules(currentModules);
          }
        } catch (error) {
          console.error("Failed to parse module progress during interval check:", error);
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [user, userModules]);
  
  // Load user XP and calculate level on mount and when user changes
  useEffect(() => {
    if (user && user.email) {
      const xp = getUserXP(user.email);
      const level = calculateLevel(xp);
      const nextLevel = xpForNextLevel(xp);
      const progress = levelProgressPercentage(xp);
      const name = getLevelName(level);
      
      // Check if user leveled up (if the current level is higher than the state)
      if (level > userLevel && userLevel > 1) {
        setNewLevel(level);
        setShowLevelUpAnimation(true);
      }
      
      setUserXP(xp);
      setUserLevel(level);
      setNextLevelXP(nextLevel);
      setLevelProgress(progress);
      setLevelName(name);
    } else {
      // Default values for logged out users
      setUserXP(0);
      setUserLevel(1);
      setNextLevelXP(250);
      setLevelProgress(0);
      setLevelName("Shark Novice");
    }
  }, [user, userLevel]);

  // Effect to periodically refresh XP in case it's updated in another tab
  useEffect(() => {
    if (!user || !user.email) return;
    
    const refreshInterval = setInterval(() => {
      const xp = getUserXP(user.email as string);
      if (xp !== userXP) {
        const newLevelValue = calculateLevel(xp);
        
        // Check if user leveled up
        if (newLevelValue > userLevel) {
          setNewLevel(newLevelValue);
          setShowLevelUpAnimation(true);
        }
        
        setUserXP(xp);
        setUserLevel(newLevelValue);
        setNextLevelXP(xpForNextLevel(xp));
        setLevelProgress(levelProgressPercentage(xp));
        setLevelName(getLevelName(newLevelValue));
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(refreshInterval);
  }, [user, userXP, userLevel]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`badges_${user.email}`, JSON.stringify(userBadges));
      localStorage.setItem(`quizzes_${user.email}`, JSON.stringify(userQuizzes));
    }
  }, [user, userBadges, userQuizzes]);

  const unlockBadge = (badgeId: number) => {
    if (!user || !user.email) return;
    
    const updatedBadges = userBadges.map(badge => {
      if (badge.id === badgeId) {
        return { ...badge, unlocked: true };
      }
      return badge;
    });
    
    setUserBadges(updatedBadges);
    localStorage.setItem(`badges_${user.email}`, JSON.stringify(updatedBadges));
    
    toast.success(
      <div className="flex items-center gap-2">
        <span>Badge unlocked!</span>
        <Trophy className="h-4 w-4 text-yellow-500" />
      </div>, 
      {
        description: "You've earned a new achievement badge.",
        duration: 3000
      }
    );
  };

  // Reset progress function (for testing)
  const resetProgress = () => {
    if (!user || !user.email) return;
    
    // Reset XP
    localStorage.setItem(`user_xp_${user.email}`, "0");
    
    // Reset badges to locked state
    const resetBadges = getInitialBadges();
    localStorage.setItem(`badges_${user.email}`, JSON.stringify(resetBadges));
    
    // Reset quiz progress
    const resetQuizzes = getInitialQuizzes();
    localStorage.setItem(`quizzes_${user.email}`, JSON.stringify(resetQuizzes));
    
    // Reset module completions
    localStorage.setItem(`module_progress_${user.email}`, JSON.stringify([]));
    
    // Update state
    setUserBadges(resetBadges);
    setUserQuizzes(resetQuizzes);
    setUserXP(0);
    setUserLevel(1);
    setNextLevelXP(250);
    setLevelProgress(0);
    setLevelName("Shark Novice");
    
    toast.success("Progress reset", {
      description: "All progress has been reset for testing purposes.",
    });
  };

  const unlockedBadges = userBadges.filter(b => b.unlocked);
  const lockedBadges = userBadges.filter(b => !b.unlocked);
  
  return (
    <MainLayout>
      {/* Level up animation */}
      <LevelUpAnimation
        open={showLevelUpAnimation}
        onClose={() => setShowLevelUpAnimation(false)}
        level={newLevel}
        levelName={getLevelName(newLevel)}
      />
      
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Achievement Center</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and compete with other learners
          </p>
          
          {/* Reset button (for testing) */}
          {user && user.email && (
            <button
              className="mt-2 text-xs text-muted-foreground hover:text-shark-500"
              onClick={resetProgress}
            >
              Reset all progress (test)
            </button>
          )}
        </div>
        
        <SlideUpInView>
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Track your learning journey and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center">
                      Level Progress
                      <XPInfoTooltip />
                    </span>
                    <span className="text-sm font-medium">
                      {userXP} / {nextLevelXP} XP
                    </span>
                  </div>
                  <Progress value={levelProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {nextLevelXP - userXP} points until Level {userLevel + 1}: {getLevelName(userLevel + 1)}
                  </p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold flex items-center">
                    <span className="mr-2">Level {userLevel}</span>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">{levelName}</p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">
                    {userQuizzes.filter(q => q.completed).length}/{userQuizzes.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                  
                  {/* Hidden admin button for testing level-up functionality */}
                  {user && user.email && (
                    <button 
                      className="mt-4 text-xs text-gray-400 hover:text-shark-500"
                      onClick={() => {
                        if (!user.email) return;
                        const newXP = addXP(user.email, 250); // Add 250 XP
                        setUserXP(newXP);
                      }}
                    >
                      + Test XP
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUpInView>
        
        <Tabs defaultValue="badges" className="mb-8">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="badges">
              <Award className="mr-2 h-4 w-4" />
              Badges
            </TabsTrigger>

            <TabsTrigger value="quizzes">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Quizzes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="mt-6">
            <FadeInStagger>
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium">Unlocked Badges</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {unlockedBadges.map((badge) => (
                    <FadeIn key={badge.id}>
                      <BadgeCard
                        title={badge.name}
                        difficulty={badge.difficulty as "bronze" | "silver" | "gold" | "platinum"}
                        unlocked={true}
                        icon={<Trophy />}
                      />
                    </FadeIn>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-medium">Badges to Unlock</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {lockedBadges.map((badge) => (
                    <FadeIn key={badge.id}>
                      <BadgeCard
                        title={badge.name}
                        difficulty={badge.difficulty as "bronze" | "silver" | "gold" | "platinum"}
                        unlocked={false}
                        icon={<Trophy />}
                      />
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeInStagger>
          </TabsContent>
          
          <TabsContent value="quizzes" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {userQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">
                          {quiz.questionCount} questions
                        </span>
                        {quiz.completed ? (
                          <span className="flex items-center text-sm font-medium text-green-600">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="flex items-center text-sm text-muted-foreground">
                            <Lock className="mr-1 h-3 w-3" />
                            Not started
                          </span>
                        )}
                      </div>
                      {quiz.completed && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xl font-bold">{quiz.score}%</div>
                          <Progress
                            value={quiz.score}
                            className="h-2 flex-1"
                          />
                        </div>
                      )}
                    </div>
                    <button className="w-full rounded-md bg-shark-500 py-2 font-medium text-white hover:bg-shark-600">
                      {quiz.completed ? "Review Quiz" : "Start Quiz"}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
