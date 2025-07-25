import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  CheckCircle,
  Lock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewAnalysisProps {
  pitch: string;
  onUpgrade: () => void;
  className?: string;
}

// Sample preview data to show value
const samplePreview = {
  overallScore: 7.2,
  keyStrengths: [
    "Clear problem identification that resonates with target market",
    "Strong value proposition with quantifiable benefits"
  ],
  topWeaknesses: [
    "Revenue model needs more specific numbers and unit economics",
    "Competitive analysis could be more detailed"
  ],
  quickWins: [
    "Add Customer Acquisition Cost (CAC) and lifetime value metrics",
    "Include 3-6 month milestone timeline with specific goals"
  ],
  investorAppeal: 6.8,
  marketOpportunity: 8.1,
  businessModel: 5.5
};

const fullAnalysisFeatures = [
  {
    icon: Target,
    title: "Detailed GTM Strategy",
    description: "Step-by-step customer acquisition plan with specific channels and tactics"
  },
  {
    icon: TrendingUp,
    title: "Financial Projections Review",
    description: "Analysis of your revenue model, unit economics, and growth assumptions"
  },
  {
    icon: Users,
    title: "Investor Readiness Score",
    description: "Comprehensive evaluation across 12 key metrics investors care about"
  },
  {
    icon: Sparkles,
    title: "Personalized Action Plan",
    description: "Custom 30-60-90 day roadmap based on your stage and industry"
  },
  {
    icon: DollarSign,
    title: "Competitive Analysis",
    description: "Deep dive into competitors and your unique positioning strategy"
  },
  {
    icon: CheckCircle,
    title: "Risk Assessment",
    description: "Identification of potential challenges and mitigation strategies"
  }
];

export const PreviewAnalysis = ({ pitch, onUpgrade, className }: PreviewAnalysisProps) => {
  const [isBlurred, setIsBlurred] = useState(true);

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Free Analysis Preview</CardTitle>
          <CardDescription>
            Here's a taste of what our AI analysis provides. Upgrade for the complete breakdown!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Overall Pitch Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-primary">
              {samplePreview.overallScore}/10
            </div>
            <Badge variant="secondary" className="text-sm">
              Above Average
            </Badge>
          </div>
          <Progress value={samplePreview.overallScore * 10} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Your pitch shows strong fundamentals with room for strategic improvements
          </p>
        </CardContent>
      </Card>

      {/* Quick Insights - Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Key Insights</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBlurred(!isBlurred)}
            >
              {isBlurred ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Strengths */}
          <div>
            <h4 className="font-medium text-green-600 mb-2">✅ Top Strengths</h4>
            <div className={cn("space-y-2", isBlurred && "blur-sm")}>
              {samplePreview.keyStrengths.map((strength, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  {strength}
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="font-medium text-orange-600 mb-2">⚠️ Areas to Improve</h4>
            <div className={cn("space-y-2", isBlurred && "blur-sm")}>
              {samplePreview.topWeaknesses.map((weakness, index) => (
                <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm">
                  {weakness}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Wins */}
          <div>
            <h4 className="font-medium text-blue-600 mb-2">🚀 Quick Wins</h4>
            <div className={cn("space-y-2", isBlurred && "blur-sm")}>
              {samplePreview.quickWins.map((win, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  {win}
                </div>
              ))}
            </div>
          </div>

          {isBlurred && (
            <Alert className="mt-4">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <strong>This is just a preview!</strong> Upgrade to see detailed, personalized insights 
                for your specific startup.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Metrics Breakdown - Locked */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-purple-50 z-10" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-6 border">
            <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Premium Analysis</h3>
            <p className="text-sm text-muted-foreground">Unlock detailed scoring breakdown</p>
          </div>
        </div>
        <CardHeader className="opacity-30">
          <CardTitle>Detailed Scoring Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="opacity-30 blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{samplePreview.investorAppeal}</div>
              <div className="text-sm text-muted-foreground">Investor Appeal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{samplePreview.marketOpportunity}</div>
              <div className="text-sm text-muted-foreground">Market Opportunity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{samplePreview.businessModel}</div>
              <div className="text-sm text-muted-foreground">Business Model</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What You Get With Full Analysis */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Unlock Complete Analysis
          </CardTitle>
          <CardDescription>
            Get the full power of our AI advisor with personalized insights and action plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {fullAnalysisFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="my-6" />

          <div className="text-center space-y-4">
            <div>
              <Badge variant="secondary" className="mb-2">Limited Time Offer</Badge>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold line-through text-muted-foreground">$49</span>
                <span className="text-3xl font-bold text-primary">$19</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <p className="text-sm text-muted-foreground">60% off for early users</p>
            </div>

            <Button size="lg" onClick={onUpgrade} className="w-full max-w-sm">
              Unlock Full Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-muted-foreground">
              30-day money-back guarantee • Instant access • No subscription
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
