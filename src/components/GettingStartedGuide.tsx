import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, Lightbulb, Target, BookOpen, TrendingUp, X } from "lucide-react";
import { Link } from "react-router-dom";

interface GettingStartedGuideProps {
  variant?: "hero" | "sidebar" | "modal";
  onClose?: () => void;
}

export const GettingStartedGuide = ({ variant = "sidebar", onClose }: GettingStartedGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const steps = [
    {
      title: "Start With Your Pitch",
      description: "Test your startup idea and get instant feedback",
      icon: <Lightbulb className="h-5 w-5 text-blue-600" />,
      action: "Try Pitch Analyzer",
      link: "/pitch",
      time: "2 minutes",
      benefit: "Identify weak spots before talking to investors"
    },
    {
      title: "Learn the Fundamentals",
      description: "Understand what makes startups succeed or fail",
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
      action: "Browse Learning Hub",
      link: "/content",
      time: "10-15 minutes",
      benefit: "Avoid common mistakes that sink 90% of startups"
    },
    {
      title: "Run the Numbers",
      description: "Calculate if your business model actually makes money",
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      action: "Use Analytics Tools",
      link: "/analytics",
      time: "5 minutes",
      benefit: "Know if you're building something profitable"
    },
    {
      title: "Track Your Progress",
      description: "Set milestones and measure your startup journey",
      icon: <Target className="h-5 w-5 text-orange-600" />,
      action: "View Dashboard",
      link: "/analytics",
      time: "Ongoing",
      benefit: "Stay focused on what actually moves the needle"
    }
  ];

  if (variant === "hero") {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              👋 New to building startups?
            </h3>
            <p className="text-gray-600 text-sm">
              Follow our 4-step guide to get the most out of SharkSenz
            </p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.slice(0, 4).map((step, index) => (
            <Link
              key={index}
              to={step.link}
              className="group block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.time}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                Welcome to SharkSenz!
              </CardTitle>
              <CardDescription>
                Let's get you started with a quick 4-step tour
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                index === currentStep
                  ? 'border-blue-300 bg-blue-50'
                  : index < currentStep
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {step.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {step.description}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    💡 {step.benefit}
                  </p>
                  {index === currentStep && (
                    <div className="flex gap-2 mt-3">
                      <Button asChild size="sm">
                        <Link to={step.link}>{step.action}</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Skip
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Default sidebar variant
  if (isMinimized) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMinimized(false)}
            className="w-full"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Show Getting Started Guide
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Getting Started
            </CardTitle>
            <CardDescription className="text-sm">
              Complete these steps to maximize your success
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isCurrent
                  ? 'border-blue-300 bg-blue-50'
                  : isCompleted
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1">
                    {step.description}
                  </p>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {step.time}
                  </Badge>
                  {isCurrent && (
                    <Link to={step.link}>
                      <Button size="sm" className="w-full mt-2">
                        {step.action}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {currentStep} of {steps.length} steps completed
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GettingStartedGuide;
