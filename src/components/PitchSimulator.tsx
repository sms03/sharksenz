import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { RotateCw } from "lucide-react";

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
    <div className="space-y-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">
            Your Startup Pitch
          </label>
          <Textarea
            placeholder="Describe your startup here. Include your product, target market, problem you solve, and unique value proposition..."
            value={pitchText}
            onChange={(e) => setPitchText(e.target.value)}
            rows={8}
            className="w-full resize-none border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
            disabled={isSubmitting}
          />
          <div className="text-right text-sm text-gray-500 mt-2">
            {pitchText.length} characters (minimum 50)
          </div>
        </div>

        <Button 
          onClick={feedback ? handleReset : handleSubmit}
          disabled={!feedback && (pitchText.trim().length < 50 || isSubmitting)}
          className="w-full py-3 text-base"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : feedback ? (
            <>
              <RotateCw className="mr-2 h-4 w-4" />
              Try New Pitch
            </>
          ) : (
            "Get Feedback"
          )}
        </Button>
      </div>
      
      {/* Feedback Section */}
      {feedback && (
        <div className="space-y-6 pt-8 border-t border-gray-200">
          <div className="grid gap-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3 text-base">✓ Strengths</h4>
              <p className="text-green-700">{feedback.strength}</p>
            </div>
            
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3 text-base">✗ Areas to Improve</h4>
              <p className="text-red-700">{feedback.weakness}</p>
            </div>
            
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 text-base">→ Suggestion</h4>
              <p className="text-blue-700">{feedback.suggestion}</p>
            </div>
            
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700 text-base">Overall Score</h4>
                <span className="text-2xl font-bold text-gray-900">{feedback.rating}/10</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${feedback.rating * 10}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchSimulator;
