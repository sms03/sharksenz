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
  Users
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeInStagger, FadeIn, SlideUpInView } from "@/components/ui/motion";
import { useAuth } from "@/components/AuthProvider";

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

// Helper: get initial quizzes (all not started)
const getInitialQuizzes = () => [
  { id: 1, title: "Business Model Basics", completed: false, score: 0 },
  { id: 2, title: "Valuation Methods", completed: false, score: 0 },
  { id: 3, title: "Key Metrics Quiz", completed: false, score: 0 },
  { id: 4, title: "Pitch Structure", completed: false, score: 0 }
];


export default function Achievements() {
  const { user } = useAuth();
  const [userBadges, setUserBadges] = useState(() => {
    if (!user) return getInitialBadges();
    const saved = localStorage.getItem(`badges_${user.email}`);
    return saved ? JSON.parse(saved) : getInitialBadges();
  });
  // Per-user quiz progress
  const [userQuizzes, setUserQuizzes] = useState(() => {
    if (!user) return getInitialQuizzes();
    const saved = localStorage.getItem(`quizzes_${user.email}`);
    return saved ? JSON.parse(saved) : getInitialQuizzes();
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`badges_${user.email}`, JSON.stringify(userBadges));
      localStorage.setItem(`quizzes_${user.email}`, JSON.stringify(userQuizzes));
    }
  }, [user, userBadges, userQuizzes]);

  const totalPoints = 540;
  const nextLevelPoints = 750;
  const pointsProgress = (totalPoints / nextLevelPoints) * 100;
  
  const unlockedBadges = userBadges.filter(b => b.unlocked);
  const lockedBadges = userBadges.filter(b => !b.unlocked);
  
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Achievement Center</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and compete with other learners
          </p>
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
                    <span className="text-sm font-medium">Level Progress</span>
                    <span className="text-sm font-medium">
                      {totalPoints} / {nextLevelPoints} XP
                    </span>
                  </div>
                  <Progress value={pointsProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(nextLevelPoints - totalPoints)} points until Level 3: Shark Investor
                  </p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{unlockedBadges.length}/{userBadges.length}</div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">
                    {userQuizzes.filter(q => q.completed).length}/{userQuizzes.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Quizzes Completed</p>
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
                      <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-shark-100">
                          <BookOpen className="h-7 w-7 text-shark-700" />
                        </div>
                        <h3 className="mb-1 font-semibold">{badge.name}</h3>
                        <p className="mb-2 text-xs text-muted-foreground">
                          Badge unlocked
                        </p>
                        <div className="mt-auto flex items-center text-xs text-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          <span>Unlocked</span>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-medium">Badges to Unlock</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {lockedBadges.map((badge) => (
                    <FadeIn key={badge.id}>
                      <div className="flex flex-col items-center rounded-lg border bg-card p-4 text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted/80">
                          <BookOpen className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <h3 className="mb-1 font-semibold">{badge.name}</h3>
                        <p className="mb-2 text-xs text-muted-foreground">
                          Badge locked
                        </p>
                      </div>
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
