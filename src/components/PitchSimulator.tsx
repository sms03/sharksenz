
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { PresentationIcon, ThumbsUp, ThumbsDown, RotateCw } from "lucide-react";

interface Feedback {
  strength: string;
  weakness: string;
  suggestion: string;
  rating: number;
}

const sampleFeedback: Feedback[] = [
  {
    strength: "Clear value proposition for your target market",
    weakness: "Missing specific revenue model details",
    suggestion: "Include concrete numbers about your market size and projected growth",
    rating: 7
  },
  {
    strength: "Strong team background and expertise",
    weakness: "Competitive analysis lacks depth",
    suggestion: "Explain your unique advantage over existing solutions more clearly",
    rating: 6
  },
  {
    strength: "Engaging problem statement that resonates with investors",
    weakness: "Timeline for achieving milestones seems unrealistic",
    suggestion: "Break down your roadmap into smaller, achievable phases",
    rating: 8
  },
  {
    strength: "Innovative solution with potential for scalability",
    weakness: "Not enough focus on go-to-market strategy",
    suggestion: "Detail your customer acquisition plan and initial target segments",
    rating: 7
  }
];

const PitchSimulator = () => {
  const [pitchText, setPitchText] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (pitchText.trim().length < 50) {
      toast.error("Your pitch is too short", { 
        description: "Please provide a more detailed pitch (at least 50 characters)" 
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      // For now, just select a random feedback from our sample data
      // In a real implementation, this would call an AI service
      const randomFeedback = sampleFeedback[Math.floor(Math.random() * sampleFeedback.length)];
      setFeedback(randomFeedback);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleReset = () => {
    setPitchText("");
    setFeedback(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PresentationIcon className="mr-2 h-5 w-5" />
          Pitch Simulator
        </CardTitle>
        <CardDescription>
          Practice your startup pitch and get instant feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter your elevator pitch here (e.g., 'My company [name] is developing [product/service] to help [target customers] solve [problem] by [solution]...')"
          value={pitchText}
          onChange={(e) => setPitchText(e.target.value)}
          rows={6}
          className="mb-4"
          disabled={isSubmitting || !!feedback}
        />
        
        {feedback && (
          <div className="mt-6 space-y-4 border rounded-lg p-4 bg-gray-50">
            <div>
              <h4 className="text-sm font-medium flex items-center text-green-600">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Strengths
              </h4>
              <p className="text-sm mt-1">{feedback.strength}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium flex items-center text-red-600">
                <ThumbsDown className="h-4 w-4 mr-2" />
                Areas to Improve
              </h4>
              <p className="text-sm mt-1">{feedback.weakness}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Suggestion</h4>
              <p className="text-sm mt-1">{feedback.suggestion}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Rating</h4>
              <div className="flex items-center mt-1">
                <div className="bg-blue-100 rounded-full h-2 w-full mr-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${feedback.rating * 10}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{feedback.rating}/10</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {feedback ? (
          <Button onClick={handleReset} className="w-full">
            <RotateCw className="mr-2 h-4 w-4" />
            Try Another Pitch
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={pitchText.trim().length < 20 || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Analyzing..." : "Get Pitch Feedback"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PitchSimulator;
