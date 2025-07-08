import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { RotateCw, Lightbulb, AlertTriangle, TrendingUp, Star, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Feedback {
  strength: string;
  weakness: string;
  suggestion: string;
  rating: number;
  keyMetrics: {
    problemClarity: number;
    solutionClarity: number;
    marketSize: number;
    revenueModel: number;
    teamCredibility: number;
  };
  jargonIssues: string[];
}

const sampleFeedback: Feedback[] = [
  {
    strength: "You clearly identify a real problem that many people face daily",
    weakness: "Your revenue model needs more specific numbers and customer acquisition costs",
    suggestion: "Include your Customer Acquisition Cost (CAC - how much you spend to get one customer) and show how you'll make more money from each customer than it costs to acquire them",
    rating: 7,
    keyMetrics: {
      problemClarity: 9,
      solutionClarity: 7,
      marketSize: 6,
      revenueModel: 4,
      teamCredibility: 8
    },
    jargonIssues: ["Consider explaining 'CAC' as 'Customer Acquisition Cost'", "Define 'LTV' as 'Customer Lifetime Value'"]
  },
  {
    strength: "Strong team background with relevant industry experience",
    weakness: "Your competitive analysis doesn't clearly show why customers would choose you over existing solutions",
    suggestion: "Create a simple comparison showing what makes you 10x better than alternatives. Focus on one key advantage that competitors can't easily copy",
    rating: 6,
    keyMetrics: {
      problemClarity: 8,
      solutionClarity: 6,
      marketSize: 7,
      revenueModel: 5,
      teamCredibility: 9
    },
    jargonIssues: ["Avoid startup buzzwords like 'disruptive' without explaining how", "Consider simplifying technical terms for broader understanding"]
  },
  {
    strength: "Compelling problem statement that investors can relate to personally",
    weakness: "Your timeline for reaching milestones seems overly optimistic",
    suggestion: "Break your 3-year plan into smaller 6-month milestones. Show specific metrics you'll hit (like '100 paying customers by month 6') rather than vague goals",
    rating: 8,
    keyMetrics: {
      problemClarity: 10,
      solutionClarity: 8,
      marketSize: 8,
      revenueModel: 7,
      teamCredibility: 7
    },
    jargonIssues: ["Replace 'MVP' with 'first working version'", "Explain what specific metrics matter to your business"]
  },
  {
    strength: "Innovative solution with clear potential for growth and scaling",
    weakness: "Missing details about how you'll actually reach and convince your first customers",
    suggestion: "Describe your Go-To-Market strategy in simple terms: Where will you find customers? How will you convince them to try your product? What's your plan for the first 100 customers?",
    rating: 7,
    keyMetrics: {
      problemClarity: 7,
      solutionClarity: 9,
      marketSize: 8,
      revenueModel: 6,
      teamCredibility: 6
    },
    jargonIssues: ["Explain 'Go-To-Market' as your customer acquisition plan", "Simplify any technical architecture discussions"]
  }
];

// Helper component for metric explanations
const MetricTooltip = ({ metric, value }: { metric: string, value: number }) => {
  const getExplanation = (metric: string) => {
    switch (metric) {
      case 'problemClarity':
        return 'How clearly you explain the problem your startup solves';
      case 'solutionClarity':
        return 'How well you describe your solution and why it works';
      case 'marketSize':
        return 'How convincingly you show there are enough customers willing to pay';
      case 'revenueModel':
        return 'How clearly you explain how your business will make money';
      case 'teamCredibility':
        return 'How well you demonstrate your team can execute this plan';
      default:
        return '';
    }
  };

  const getColor = (value: number) => {
    if (value >= 8) return 'text-green-600 bg-green-100';
    if (value >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="group relative">
      <div className={`flex items-center justify-between p-3 rounded-lg ${getColor(value)}`}>
        <div className="flex items-center gap-2">
          <span className="font-medium capitalize">
            {metric.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <HelpCircle className="h-4 w-4 opacity-60" />
        </div>
        <span className="font-bold">{value}/10</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {getExplanation(metric)}
      </div>
    </div>
  );
};

const PitchSimulator = () => {
  const [pitchText, setPitchText] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const handleSubmit = () => {
    if (pitchText.trim().length < 100) {
      toast.error("Your pitch needs more detail", { 
        description: "Please provide at least 100 characters. Include your problem, solution, and target market." 
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate AI analysis with realistic delay
    setTimeout(() => {
      const randomFeedback = sampleFeedback[Math.floor(Math.random() * sampleFeedback.length)];
      setFeedback(randomFeedback);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleReset = () => {
    setPitchText("");
    setFeedback(null);
    setShowTips(false);
  };

  const pitchTips = [
    "Include the problem you're solving in the first sentence",
    "Mention your target customer (who specifically will pay for this?)",
    "Explain your solution in simple terms anyone can understand",
    "Include at least one specific number (market size, customers, revenue, etc.)",
    "Mention your background or why you're the right person to solve this"
  ];

  return (
    <div className="space-y-8">
      {/* Guided Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            Your Startup Pitch
          </CardTitle>
          <CardDescription>
            Describe your startup as if you're explaining it to a friend. Include the problem, 
            your solution, who will pay for it, and why you're the right team to build it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: 'Most small restaurants lose money because they can't predict how much food to order each week. Our app uses simple data from their point-of-sale system to predict exactly how much of each ingredient they'll need, reducing food waste by 40%. Restaurant owners save $2,000+ per month. We make money by charging $99/month per restaurant. I've been a restaurant manager for 5 years and my co-founder built inventory systems at Google...'"
            value={pitchText}
            onChange={(e) => setPitchText(e.target.value)}
            rows={8}
            className="w-full resize-none text-base leading-relaxed"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span className={`${pitchText.length >= 100 ? 'text-green-600' : 'text-red-500'}`}>
                {pitchText.length}/100+ characters
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTips(!showTips)}
                className="text-blue-600 hover:text-blue-700"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                {showTips ? 'Hide Tips' : 'Show Tips'}
              </Button>
            </div>
          </div>
          
          {showTips && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-900">
                  💡 What Makes a Great Pitch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-800">
                  {pitchTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">{index + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={feedback ? handleReset : handleSubmit}
            disabled={!feedback && (pitchText.trim().length < 100 || isSubmitting)}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing your pitch...
              </>
            ) : feedback ? (
              <>
                <RotateCw className="mr-2 h-5 w-5" />
                Try Another Pitch
              </>
            ) : (
              <>
                <Star className="mr-2 h-5 w-5" />
                Get My Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Enhanced Feedback Section */}
      {feedback && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {feedback.rating}/10
                </div>
                <p className="text-lg text-blue-800 font-medium">Overall Pitch Score</p>
                <div className="w-full bg-blue-200 rounded-full h-3 mt-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${feedback.rating * 10}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Detailed Breakdown
              </CardTitle>
              <CardDescription>
                Hover over each metric to understand what it measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {Object.entries(feedback.keyMetrics).map(([key, value]) => (
                  <MetricTooltip key={key} metric={key} value={value} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Cards */}
          <div className="grid gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  What's Working Well
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 leading-relaxed">{feedback.strength}</p>
              </CardContent>
            </Card>
            
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Biggest Opportunity for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 leading-relaxed">{feedback.weakness}</p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Specific Action to Take
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 leading-relaxed">{feedback.suggestion}</p>
              </CardContent>
            </Card>

            {/* Jargon Issues */}
            {feedback.jargonIssues.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Clarity Improvements
                  </CardTitle>
                  <CardDescription className="text-yellow-700">
                    Make your pitch accessible to anyone, not just startup insiders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feedback.jargonIssues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2 text-yellow-700">
                        <span className="text-yellow-600 font-medium">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Next Steps */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">
                🚀 Ready for the Next Level?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 mb-4">
                Great start! To take your pitch further, consider exploring our full analytics dashboard 
                to dive deeper into market analysis, financial projections, and competitive positioning.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100" asChild>
                  <Link to="/analytics">
                    Explore Analytics Tools
                  </Link>
                </Button>
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-100" asChild>
                  <Link to="/content">
                    Browse Learning Resources
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PitchSimulator;
