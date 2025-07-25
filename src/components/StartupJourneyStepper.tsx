import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Lightbulb, Target, Rocket, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  substeps?: string[];
}

interface StartupJourneyStepperProps {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  className?: string;
}

const journeySteps: JourneyStep[] = [
  {
    id: "validate",
    title: "Validate Idea",
    description: "Test if there's real demand for your solution",
    icon: Lightbulb,
    substeps: [
      "Problem validation",
      "Customer interviews", 
      "Market research",
      "Competitive analysis"
    ]
  },
  {
    id: "build",
    title: "Build MVP",
    description: "Create your minimum viable product",
    icon: Target,
    substeps: [
      "Define core features",
      "Build prototype",
      "User testing",
      "Iterate based on feedback"
    ]
  },
  {
    id: "gtm",
    title: "GTM Strategy",
    description: "Plan how to reach your first customers",
    icon: Rocket,
    substeps: [
      "Customer segmentation",
      "Channel strategy",
      "Pricing model",
      "Launch plan"
    ]
  },
  {
    id: "fundraise",
    title: "Fundraising",
    description: "Prepare for investment rounds",
    icon: TrendingUp,
    substeps: [
      "Financial projections",
      "Pitch deck creation",
      "Investor research",
      "Due diligence prep"
    ]
  }
];

export const StartupJourneyStepper = ({ currentStepId, onStepChange, className }: StartupJourneyStepperProps) => {
  const currentStepIndex = journeySteps.findIndex(step => step.id === currentStepId);
  const progress = ((currentStepIndex + 1) / journeySteps.length) * 100;

  const getStepStatus = (index: number): "completed" | "current" | "upcoming" => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "upcoming";
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your Startup Journey</CardTitle>
            <CardDescription>Follow these steps to build a successful startup</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Step {currentStepIndex + 1} of {journeySteps.length}
          </Badge>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop View - Horizontal Stepper */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(currentStepIndex / (journeySteps.length - 1)) * 100}%` }}
              />
            </div>
            
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const status = getStepStatus(index);
              
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => onStepChange(step.id)}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 bg-background",
                      status === "completed" && "border-primary bg-primary text-primary-foreground",
                      status === "current" && "border-primary bg-primary/10 text-primary",
                      status === "upcoming" && "border-muted-foreground/30 text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </button>
                  <div className="mt-3 text-center max-w-32">
                    <h4 className={cn(
                      "text-sm font-medium",
                      status === "current" && "text-primary",
                      status === "upcoming" && "text-muted-foreground"
                    )}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View - Vertical Stepper */}
        <div className="md:hidden space-y-4">
          {journeySteps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(index);
            const isLast = index === journeySteps.length - 1;
            
            return (
              <div key={step.id} className="relative">
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-muted">
                    {status === "completed" && (
                      <div className="w-full bg-primary h-full" />
                    )}
                  </div>
                )}
                
                <button
                  onClick={() => onStepChange(step.id)}
                  className="flex items-start gap-4 w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    status === "completed" && "border-primary bg-primary text-primary-foreground",
                    status === "current" && "border-primary bg-primary/10 text-primary",
                    status === "upcoming" && "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-medium",
                      status === "current" && "text-primary",
                      status === "upcoming" && "text-muted-foreground"
                    )}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    
                    {status === "current" && step.substeps && (
                      <div className="mt-3 space-y-1">
                        {step.substeps.map((substep, substepIndex) => (
                          <div key={substepIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Circle className="w-3 h-3" />
                            {substep}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {status === "current" && (
                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Current Step Details */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {React.createElement(journeySteps[currentStepIndex].icon, { 
                className: "w-4 h-4 text-primary" 
              })}
            </div>
            <h3 className="font-semibold">Current Focus: {journeySteps[currentStepIndex].title}</h3>
          </div>
          
          {journeySteps[currentStepIndex].substeps && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {journeySteps[currentStepIndex].substeps.map((substep, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Circle className="w-3 h-3 text-muted-foreground" />
                  {substep}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => currentStepIndex > 0 && onStepChange(journeySteps[currentStepIndex - 1].id)}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            onClick={() => currentStepIndex < journeySteps.length - 1 && onStepChange(journeySteps[currentStepIndex + 1].id)}
            disabled={currentStepIndex === journeySteps.length - 1}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
