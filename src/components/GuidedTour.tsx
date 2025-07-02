import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, Target, BarChart, TrendingUp, Presentation, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'analytics-intro',
    title: 'Analytics Dashboard',
    description: 'Start here to understand your key metrics. We surface LTV:CAC ratio first as it\'s the most critical metric investors examine.',
    icon: <BarChart className="w-5 h-5" />,
    target: '[data-tour="analytics"]',
    position: 'bottom'
  },
  {
    id: 'metrics-priority',
    title: 'Metrics Priority',
    description: 'LTV:CAC ratio should be 3:1 minimum. CAC payback under 12 months is ideal. These benchmarks matter most to investors.',
    icon: <Target className="w-5 h-5" />,
    target: '[data-tour="metrics-calculator"]',
    position: 'right'
  },
  {
    id: 'market-insights',
    title: 'Market Insights',
    description: 'Check real-time market trends and investor sentiment. This helps you adapt your pitch to current market conditions.',
    icon: <TrendingUp className="w-5 h-5" />,
    target: '[data-tour="market-trends"]',
    position: 'bottom'
  },
  {
    id: 'pitch-simulator',
    title: 'Pitch Simulator',
    description: 'Practice your pitch and get AI feedback on common investor objections. Perfect for overcoming pitch paralysis.',
    icon: <Presentation className="w-5 h-5" />,
    target: '[data-tour="pitch-simulator"]',
    position: 'bottom'
  },
  {
    id: 'content-library',
    title: 'Content Library',
    description: 'Access curated resources, founder stories, and pricing strategy guides to accelerate your learning.',
    icon: <BookOpen className="w-5 h-5" />,
    target: '[data-tour="content"]',
    position: 'bottom'
  }
];

interface GuidedTourProps {
  isActive: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GuidedTour = ({ isActive, onClose, onComplete }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourPosition, setTourPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      const currentStepData = tourSteps[currentStep];
      const target = document.querySelector(currentStepData.target);
      
      if (target) {
        const rect = target.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        let x = rect.left + scrollX;
        let y = rect.top + scrollY;
        
        // Adjust position based on preferred placement
        switch (currentStepData.position) {
          case 'bottom':
            x += rect.width / 2 - 200; // Center horizontally (400px card width / 2)
            y += rect.height + 20;
            break;
          case 'top':
            x += rect.width / 2 - 200;
            y -= 220; // Card height + margin
            break;
          case 'right':
            x += rect.width + 20;
            y += rect.height / 2 - 100; // Center vertically
            break;
          case 'left':
            x -= 420; // Card width + margin
            y += rect.height / 2 - 100;
            break;
        }
        
        // Ensure tour stays within viewport
        const maxX = window.innerWidth - 400 - 20;
        const maxY = window.innerHeight - 200 - 20;
        x = Math.max(20, Math.min(x, maxX));
        y = Math.max(20, Math.min(y, maxY));
        
        setTourPosition({ x, y });
        
        // Highlight target element
        target.classList.add('tour-highlight');
        
        // Scroll to element if needed
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      // Remove highlights from all elements
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStep]);

  if (!isActive) return null;

  const currentStepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast.success("Tour complete!", {
      description: "You're ready to master your founder workflow!"
    });
    onComplete();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      
      {/* Tour Card */}
      <Card 
        className="fixed z-50 w-96 shadow-2xl border-2 border-blue-200 bg-white"
        style={{
          left: `${tourPosition.x}px`,
          top: `${tourPosition.y}px`,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentStepData.icon}
              <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="text-sm leading-relaxed mb-4">
            {currentStepData.description}
          </CardDescription>
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevious}
              disabled={isFirstStep}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Skip Tour
              </Button>
              <Button size="sm" onClick={handleNext}>
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tour styles */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 30;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .tour-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 197, 253, 0.2));
          border-radius: 12px;
          z-index: -1;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
};
