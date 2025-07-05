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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <PresentationIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Pitch Simulator</h2>
              <p className="text-blue-100 mt-1">Perfect your startup pitch with AI-powered feedback</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Your Startup Pitch
            </label>
            <Textarea
              placeholder="Describe your startup here. Include your product, target market, problem you solve, and unique value proposition..."
              value={pitchText}
              onChange={(e) => setPitchText(e.target.value)}
              rows={5}
              className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              disabled={isSubmitting || !!feedback}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{pitchText.length} characters</span>
              <span>Minimum 50 characters required</span>
            </div>
          </div>
          
          {feedback && (
            <div className="space-y-6">
              {/* Main Feedback */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-5 border">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold flex items-center text-green-700 mb-2">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <p className="text-sm text-green-800">{feedback.strength}</p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold flex items-center text-red-700 mb-2">
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Areas to Improve
                    </h4>
                    <p className="text-sm text-red-800">{feedback.weakness}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Recommendation
                  </h4>
                  <p className="text-sm text-blue-800">{feedback.suggestion}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Overall Score</h4>
                    <span className="text-2xl font-bold text-blue-600">{feedback.rating}/10</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000" 
                      style={{ width: `${feedback.rating * 10}%` }}
                    ></div>
                  </div>
                </div>
            </div>

              {/* AI Investor Objections Digest */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h4 className="text-lg font-semibold flex items-center text-orange-800 mb-4">
                  <Brain className="h-5 w-5 mr-2" />
                  Potential Investor Objections
                </h4>
                <div className="space-y-4">
                  {feedback.investorObjections.map((objection, index) => (
                    <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-orange-900 flex items-center flex-1">
                          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{objection.objection}</span>
                        </h5>
                        <Badge 
                          variant="outline" 
                          className="text-xs border-orange-300 text-orange-700 ml-2"
                        >
                          {objection.likelihood}
                        </Badge>
                      </div>
                      <div className="bg-white rounded-lg p-3 border-l-4 border-l-green-500">
                        <p className="text-xs text-gray-700">
                          <span className="font-semibold text-green-700">💡 Suggested Response:</span><br />
                          {objection.preparedResponse}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Pro Tip:</strong> Practice these responses until they feel natural. Confident answers to tough questions can make or break your pitch.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center pt-4">
            {feedback ? (
              <Button 
                onClick={handleReset} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Analyze New Pitch
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={pitchText.trim().length < 50 || isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Your Pitch...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Get AI Feedback Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchSimulator;
