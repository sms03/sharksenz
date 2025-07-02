import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { PresentationIcon, ThumbsUp, ThumbsDown, RotateCw, Brain, Target, AlertTriangle } from "lucide-react";

interface Feedback {
  strength: string;
  weakness: string;
  suggestion: string;
  rating: number;
  investorObjections: Array<{
    objection: string;
    likelihood: string;
    preparedResponse: string;
  }>;
}

const sampleFeedback: Feedback[] = [
  {
    strength: "Clear value proposition for your target market",
    weakness: "Missing specific revenue model details",
    suggestion: "Include concrete numbers about your market size and projected growth",
    rating: 7,
    investorObjections: [
      {
        objection: "How will you monetize this?",
        likelihood: "High (78%)",
        preparedResponse: "We have 3 revenue streams: subscription ($29/mo), transaction fees (2.5%), and enterprise licensing"
      },
      {
        objection: "What's your customer acquisition cost?",
        likelihood: "Medium (65%)",
        preparedResponse: "Current CAC is $85 with 6-month payback period, trending down as we optimize channels"
      }
    ]
  },
  {
    strength: "Strong team background and expertise",
    weakness: "Competitive analysis lacks depth",
    suggestion: "Explain your unique advantage over existing solutions more clearly",
    rating: 6,
    investorObjections: [
      {
        objection: "How do you differentiate from [Competitor X]?",
        likelihood: "High (82%)",
        preparedResponse: "Unlike competitors who focus on features, we solve the core workflow problem with 40% faster user completion"
      },
      {
        objection: "What prevents big tech from copying you?",
        likelihood: "Medium (71%)",
        preparedResponse: "Our proprietary algorithm and 2-year head start create switching costs; plus we're targeting a niche they ignore"
      }
    ]
  },
  {
    strength: "Engaging problem statement that resonates with investors",
    weakness: "Timeline for achieving milestones seems unrealistic",
    suggestion: "Break down your roadmap into smaller, achievable phases",
    rating: 8,
    investorObjections: [
      {
        objection: "This timeline looks too aggressive",
        likelihood: "Medium (58%)",
        preparedResponse: "We've built in 20% buffers and based projections on our proven velocity from the last 6 months"
      },
      {
        objection: "What happens if you miss these milestones?",
        likelihood: "Low (34%)",
        preparedResponse: "We have contingency plans and our core metrics remain strong even with 3-month delays"
      }
    ]
  },
  {
    strength: "Innovative solution with potential for scalability",
    weakness: "Not enough focus on go-to-market strategy",
    suggestion: "Detail your customer acquisition plan and initial target segments",
    rating: 7,
    investorObjections: [
      {
        objection: "How will you acquire customers profitably?",
        likelihood: "High (87%)",
        preparedResponse: "Content marketing generates 60% of leads at $12 CAC, with referrals providing 25% at near-zero cost"
      },
      {
        objection: "Who is your ideal customer?",
        likelihood: "Medium (69%)",
        preparedResponse: "Series A startups with 10-50 employees who struggle with [specific problem] - we have 40 paying customers fitting this profile"
      }
    ]
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
          <div className="mt-6 space-y-6">
            {/* Main Feedback */}
            <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
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

            {/* AI Investor Objections Digest */}
            <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
              <h4 className="text-sm font-medium flex items-center text-orange-800 mb-3">
                <Brain className="h-4 w-4 mr-2" />
                AI Digest: Likely Investor Objections
              </h4>
              <div className="space-y-3">
                {feedback.investorObjections.map((objection, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-orange-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-orange-900 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {objection.objection}
                      </h5>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-orange-300 text-orange-700"
                      >
                        {objection.likelihood}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                      <strong>Prepared Response:</strong> {objection.preparedResponse}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-orange-600">
                💡 Practice these responses to overcome common investor objections and build confidence
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
