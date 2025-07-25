import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Lightbulb, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { AIRole } from "./AIRoleCustomizer";
import { cn } from "@/lib/utils";

interface GuidedPitchInputProps {
  onSubmit: (pitch: string) => void;
  onPreview: (pitch: string) => void;
  aiRole?: AIRole;
  isLoading?: boolean;
  className?: string;
}

const getExamplesForRole = (aiRole?: AIRole) => {
  const baseExamples = {
    validate: {
      title: "Idea Validation Focus",
      examples: [
        "I want to build a productivity app for remote teams. The problem is that teams waste 2+ hours daily switching between Slack, email, and project tools. My solution combines all communication in one AI-powered workspace that learns team patterns and suggests optimal workflows.",
        "Small restaurant owners spend 3+ hours weekly manually creating staff schedules. I'm building an AI scheduler that learns employee preferences, peak hours, and labor costs to auto-generate optimal schedules in under 5 minutes."
      ]
    },
    build: {
      title: "MVP Development Focus", 
      examples: [
        "We validated demand for our expense tracking app with 200+ interviews. Users said existing tools are too complex for freelancers. Our MVP will have 3 core features: photo receipt capture, automatic categorization, and simple tax reports. We need help prioritizing which advanced features to build next.",
        "Our team collaboration tool has 50 beta users giving feedback. The core video chat + whiteboard combo works well, but users want screen recording and better file sharing. We're deciding between adding these features vs improving performance first."
      ]
    },
    gtm: {
      title: "Go-to-Market Strategy Focus",
      examples: [
        "Our AI writing assistant for marketing teams is ready to launch. We've tested with 20 companies and have 5 paying beta customers. Now we need to scale from these early adopters to reach 100+ customers in 6 months. Our target is marketing managers at 50-500 person companies.",
        "We built a property management app that saves landlords 5 hours/week on tenant communications. We have a working product and 3 paying customers, but need a clear plan to reach 100 landlords in our city within 90 days."
      ]
    },
    fundraise: {
      title: "Fundraising Preparation Focus",
      examples: [
        "We're a fintech startup that's processed $2M in transactions with 150 active business customers. Our SaaS payment platform reduces chargeback rates by 40% vs competitors. We're raising a $1.5M seed round to expand our sales team and add fraud detection features.",
        "Our healthtech app has 10,000 users tracking mental wellness with 70% monthly retention. We're generating $15K MRR with a freemium model. Looking to raise $800K to add telehealth features and scale our content team."
      ]
    }
  };

  if (!aiRole?.helpType) return baseExamples.validate;
  return baseExamples[aiRole.helpType as keyof typeof baseExamples] || baseExamples.validate;
};

const getGuidanceForRole = (aiRole?: AIRole) => {
  const guidance = {
    validate: [
      "Clearly describe the problem you're solving and who has it",
      "Explain your solution and why it's better than alternatives", 
      "Include any early validation (interviews, surveys, pre-orders)",
      "Mention your target market size and customer types"
    ],
    build: [
      "Describe your current product status and key features",
      "Share user feedback and usage metrics if available",
      "Explain your technical approach and any unique advantages",
      "Include development timeline and resource needs"
    ],
    gtm: [
      "Define your target customer segments clearly",
      "Explain your customer acquisition strategy and channels", 
      "Include pricing model and unit economics",
      "Share early traction metrics and growth plans"
    ],
    fundraise: [
      "Include current revenue, users, and growth metrics",
      "Explain your business model and path to profitability",
      "Define funding amount needed and specific use of funds",
      "Highlight team credentials and competitive advantages"
    ]
  };

  if (!aiRole?.helpType) return guidance.validate;
  return guidance[aiRole.helpType as keyof typeof guidance] || guidance.validate;
};

export const GuidedPitchInput = ({ onSubmit, onPreview, aiRole, isLoading, className }: GuidedPitchInputProps) => {
  const [pitch, setPitch] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  
  const examples = getExamplesForRole(aiRole);
  const guidance = getGuidanceForRole(aiRole);
  const minLength = 100;
  const recommendedLength = 300;
  const currentLength = pitch.length;

  const handlePreview = () => {
    if (currentLength < minLength) return;
    onPreview(pitch);
  };

  const handleSubmit = () => {
    if (currentLength < minLength) return;
    onSubmit(pitch);
  };

  const getLengthStatus = () => {
    if (currentLength < minLength) return { color: "text-red-500", message: "Too short - add more details" };
    if (currentLength < recommendedLength) return { color: "text-yellow-500", message: "Good - consider adding more context" };
    return { color: "text-green-500", message: "Great length!" };
  };

  const lengthStatus = getLengthStatus();

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Describe Your Startup</CardTitle>
            <CardDescription>
              {aiRole?.helpType ? `Optimized for ${aiRole.helpType} advice` : "Get personalized feedback on your startup"}
            </CardDescription>
          </div>
          {aiRole && (
            <div className="flex gap-2">
              <Badge variant="outline">{aiRole.startupType}</Badge>
              <Badge variant="outline">{aiRole.stage}</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guidance">💡 Guidance</TabsTrigger>
            <TabsTrigger value="input">✍️ Write Pitch</TabsTrigger>
            <TabsTrigger value="examples">📖 Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="guidance" className="mt-4">
            <Alert className="mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>What to include in your pitch:</strong>
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              {guidance.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-blue-800">
                Be specific with numbers, metrics, and customer feedback. The more concrete details you provide, 
                the more actionable and personalized your AI feedback will be.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="input" className="mt-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Your startup pitch</label>
                <div className="flex items-center gap-2 text-xs">
                  <span className={lengthStatus.color}>{currentLength} characters</span>
                  <span className="text-muted-foreground">•</span>
                  <span className={lengthStatus.color}>{lengthStatus.message}</span>
                </div>
              </div>
              
              <Textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder={`Describe your startup here... 

Example start: "I'm building [product] for [target customer] because [problem]. The current solutions are [pain points], but my approach [unique solution]..."`}
                className="min-h-[200px] resize-none"
                disabled={isLoading}
              />
              
              {currentLength < minLength && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please provide at least {minLength} characters ({minLength - currentLength} more needed) 
                    for meaningful AI analysis.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handlePreview}
                disabled={currentLength < minLength || isLoading}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Free Preview
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={currentLength < minLength || isLoading}
                className="flex-1"
              >
                Get Full Analysis
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="mt-4">
            <div className="space-y-4">
              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{examples.title}:</strong> Examples tailored to your selected focus area
                </AlertDescription>
              </Alert>
              
              {examples.examples.map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Example {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPitch(example)}
                    >
                      Use This Example
                    </Button>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-sm leading-relaxed">
                    {example}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
