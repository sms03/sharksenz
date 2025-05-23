
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Book, User, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

type OnboardingStep = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

interface UserOnboardingProps {
  userId: string | null;
  onFinish: () => void;
}

export const UserOnboarding = ({ userId, onFinish }: UserOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const onboardingSteps: OnboardingStep[] = [
    {
      title: "Welcome to Alpha Founder Academy",
      description: "We're excited to have you here! This quick walkthrough will help you get started with our platform.",
      icon: <Book className="w-12 h-12 text-blue-600" />
    },
    {
      title: "Browse our Content Library",
      description: "Explore our extensive collection of resources tailored for founders at every stage of their journey.",
      icon: <Book className="w-12 h-12 text-blue-600" />
    },
    {
      title: "Complete your Profile",
      description: "Add more information about yourself to personalize your experience and connect with other founders.",
      icon: <User className="w-12 h-12 text-blue-600" />
    },
    {
      title: "Track your Progress",
      description: "Use our analytics tools to measure your learning progress and track key metrics important to your growth.",
      icon: <BarChart className="w-12 h-12 text-blue-600" />
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-lg border-blue-100 overflow-hidden">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-center text-2xl font-ancizar font-semibold">User Onboarding</CardTitle>
            <CardDescription className="text-center">
              Step {currentStep + 1} of {onboardingSteps.length}
            </CardDescription>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              ></div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
            <div className="mb-6">
              {currentStepData.icon}
            </div>
            <h3 className="text-xl font-ancizar font-semibold mb-2">{currentStepData.title}</h3>
            <p className="text-gray-600 max-w-lg">{currentStepData.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-100 p-6">
            <Button
              variant="outline"
              onClick={onFinish}
              className="font-ancizar"
            >
              Skip
            </Button>
            <Button 
              onClick={handleNext}
              disabled={isCompleting}
              className="font-ancizar flex items-center"
            >
              {isLastStep ? (
                isCompleting ? (
                  "Completing..."
                ) : (
                  <>Finish <CheckCircle2 className="ml-2 h-4 w-4" /></>
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
