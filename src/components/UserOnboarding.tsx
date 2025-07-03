import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, Book, User, BarChart, Target, Lightbulb, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { ScrollProgressIndicator, ScrollToTopButton } from "@/components/ScrollProgress";

type OnboardingStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
  userType?: "beginner" | "expert" | "both";
};

type UserPersona = "bootstrap" | "raise-fast" | "explore" | null;

interface UserOnboardingProps {
  userId: string | null;
  onFinish: () => void;
}

export const UserOnboarding = ({ userId, onFinish }: UserOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [userPersona, setUserPersona] = useState<UserPersona>(null);
  const [showExpertMode, setShowExpertMode] = useState(false);
  
  const onboardingSteps: OnboardingStep[] = [
    {
      title: "Welcome to SharkSenz",
      description: "Your complete founder journey starts here. This quick walkthrough will help you navigate our platform efficiently.",
      icon: <Book className="w-12 h-12 text-blue-600" />,
      details: [
        "Access 50+ learning modules",
        "Interactive analytics dashboard", 
        "AI-powered pitch simulator",
        "Community of 1000+ founders"
      ],
      userType: "both"
    },
    {
      title: "Choose Your Path",
      description: "Tell us about your startup journey so we can personalize your experience.",
      icon: <Target className="w-12 h-12 text-blue-600" />,
      userType: "both"
    },
    {
      title: "Understanding Your Analytics",
      description: "We prioritize LTV:CAC ratio because it's the #1 metric investors examine. This tells the story of your unit economics.",
      icon: <BarChart className="w-12 h-12 text-blue-600" />,
      details: [
        "LTV:CAC Benchmark: 3:1 minimum, 5:1+ excellent",
        "Revenue sensitivity analysis",
        "Burn rate optimization",
        "Market opportunity sizing"
      ],
      userType: "both"
    },
    {
      title: "Master Your Pitch",
      description: "Our AI-powered pitch simulator helps you practice responses to investor objections and build confidence.",
      icon: <User className="w-12 h-12 text-blue-600" />,
      details: [
        "Practice common investor questions",
        "AI feedback on your responses", 
        "Track improvement over time",
        "Industry-specific scenarios"
      ],
      userType: "both"
    },
    {
      title: "Integrated Workflow",
      description: "Navigate seamlessly between analytics, market insights, and pitch practice. Everything works together.",
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      details: [
        "Unified dashboard view",
        "Contextual help system",
        "Progress tracking across modules",
        "Export-ready reports"
      ],
      userType: "both"
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = async () => {
    setIsCompleting(true);
    
    try {
      // If we have a userId, we can update their profile to mark onboarding as complete
      if (userId) {
        await supabase
          .from('profiles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', userId);
      }
      
      toast.success("You're all set!", {
        description: "Welcome to Alpha Founder Academy!"
      });
      
      onFinish();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Couldn't complete the onboarding process");
      onFinish(); // Still proceed to finish
    } finally {
      setIsCompleting(false);
    }
  };
  
  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Scroll Progress Components */}
      <ScrollProgressIndicator 
        showOnlyWhenScrolling={false}
        className="z-50"
      />
      <ScrollToTopButton 
        showThreshold={0.2}
        hideOnPages={[]} // Don't hide on this page
      />
      
      <div className="w-full max-w-5xl">
        <Card className="shadow-2xl border-blue-100 overflow-hidden backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to SharkSenz
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Step {currentStep + 1} of {onboardingSteps.length}
              </Badge>
            </div>
            <CardDescription className="text-lg text-gray-600">
              Your personalized founder journey begins here
            </CardDescription>
            <div className="w-full bg-gray-200 h-3 rounded-full mt-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm" 
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              ></div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-8 pb-6">
            {currentStep === 1 ? (
              // Persona Selection Step
              <div className="text-center">
                <div className="mb-8">
                  <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Choose Your Founder Path</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    Help us personalize your experience by selecting your current startup focus
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      userPersona === 'bootstrap' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setUserPersona('bootstrap')}
                  >
                    <CardHeader className="pb-4">
                      <Lightbulb className="w-12 h-12 text-orange-500 mx-auto" />
                      <CardTitle className="text-lg">Bootstrap & Build</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Focus on lean startup methodology, customer validation, and organic growth
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      userPersona === 'raise-fast' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setUserPersona('raise-fast')}
                  >
                    <CardHeader className="pb-4">
                      <TrendingUp className="w-12 h-12 text-green-500 mx-auto" />
                      <CardTitle className="text-lg">Raise & Scale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Optimize for investor readiness, rapid scaling, and fundraising success
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      userPersona === 'explore' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setUserPersona('explore')}
                  >
                    <CardHeader className="pb-4">
                      <Users className="w-12 h-12 text-purple-500 mx-auto" />
                      <CardTitle className="text-lg">Explore & Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Discover opportunities, learn fundamentals, and explore different startup paths
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              // Regular Steps
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                <div className="lg:w-1/3 text-center lg:text-left">
                  <div className="mb-6 flex justify-center lg:justify-start">
                    {currentStepData.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{currentStepData.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{currentStepData.description}</p>
                </div>
                
                {currentStepData.details && (
                  <div className="lg:w-2/3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-800">Key Features</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExpertMode(!showExpertMode)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {showExpertMode ? 'Beginner View' : 'Expert Details'}
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {currentStepData.details.map((detail, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className={`text-gray-700 ${showExpertMode ? 'text-sm' : 'text-base'}`}>
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {showExpertMode && currentStep === 2 && (
                      <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-gray-800 mb-2">Advanced Metrics</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• CAC Payback Period: Target &lt; 12 months</p>
                          <p>• Monthly Recurring Revenue Growth: 15-20%</p>
                          <p>• Net Revenue Retention: &gt; 100%</p>
                          <p>• Gross Margin: Target 70%+ for SaaS</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t border-gray-100 p-6 bg-gray-50">
            <Button
              variant="outline"
              onClick={onFinish}
              className="font-medium hover:bg-gray-100"
            >
              Skip Setup
            </Button>
            <Button 
              onClick={handleNext}
              disabled={isCompleting || (currentStep === 1 && !userPersona)}
              className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center min-w-[120px]"
            >
              {isLastStep ? (
                isCompleting ? (
                  "Completing..."
                ) : (
                  <>Get Started <CheckCircle2 className="ml-2 h-4 w-4" /></>
                )
              ) : (
                <>Continue <ChevronRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
