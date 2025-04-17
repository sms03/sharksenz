import { useState } from "react";
import { 
  Play, 
  Pause, 
  StepForward, 
  StepBack, 
  Video, 
  Layers, 
  MessageSquare, 
  CheckCircle2,
  Clock,
  Award
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, FadeInStagger, SlideUp } from "@/components/ui/motion";

// Sample pitch structure
const pitchSteps = [
  {
    id: 1,
    title: "Introduction",
    description: "Who you are and what your business does",
    timeGuide: "30 seconds",
    tips: [
      "Start with a hook that grabs attention",
      "Clearly state your name and company name",
      "Describe your business in one sentence"
    ],
    completed: false
  },
  {
    id: 2,
    title: "Problem",
    description: "The pain point your business solves",
    timeGuide: "30 seconds",
    tips: [
      "Clearly articulate the problem",
      "Use statistics to show the scale",
      "Make it relatable with a story"
    ],
    completed: false
  },
  {
    id: 3,
    title: "Solution",
    description: "How your product/service solves the problem",
    timeGuide: "45 seconds",
    tips: [
      "Be concise and clear about your solution",
      "Demonstrate how it works if possible",
      "Explain why your approach is unique"
    ],
    completed: false
  },
  {
    id: 4,
    title: "Business Model",
    description: "How you make money",
    timeGuide: "30 seconds",
    tips: [
      "Explain your revenue model clearly",
      "Mention profit margins if applicable",
      "Discuss pricing strategy briefly"
    ],
    completed: false
  },
  {
    id: 5,
    title: "Market Size",
    description: "The total addressable market opportunity",
    timeGuide: "20 seconds",
    tips: [
      "Provide clear market size numbers",
      "Break down into TAM, SAM, and SOM",
      "Use credible sources for your data"
    ],
    completed: false
  },
  {
    id: 6,
    title: "Traction",
    description: "Progress you've made so far",
    timeGuide: "30 seconds",
    tips: [
      "Share key metrics and growth rate",
      "Mention notable customers or partnerships",
      "Highlight revenue or user growth"
    ],
    completed: false
  },
  {
    id: 7,
    title: "Competition",
    description: "Competitive landscape and your advantage",
    timeGuide: "30 seconds",
    tips: [
      "Acknowledge direct and indirect competitors",
      "Clearly articulate your competitive advantage",
      "Avoid saying 'we have no competition'"
    ],
    completed: false
  },
  {
    id: 8,
    title: "Team",
    description: "Why your team is qualified to succeed",
    timeGuide: "20 seconds",
    tips: [
      "Highlight relevant experience and expertise",
      "Mention notable achievements",
      "Show why your team is uniquely qualified"
    ],
    completed: false
  },
  {
    id: 9,
    title: "Financials",
    description: "Key metrics, projections, and funding needs",
    timeGuide: "45 seconds",
    tips: [
      "Share current revenue and growth rate",
      "Present realistic projections",
      "Clearly state how much you're asking for"
    ],
    completed: false
  },
  {
    id: 10,
    title: "Ask & Close",
    description: "What you're seeking and why",
    timeGuide: "30 seconds",
    tips: [
      "Clearly state your funding ask",
      "Explain how you'll use the funds",
      "End with a compelling call to action"
    ],
    completed: false
  }
];

// Common investor questions
const commonQuestions = [
  "What are your unit economics?",
  "How did you arrive at your valuation?",
  "What keeps you up at night about your business?",
  "Who is your ideal customer?",
  "What are your customer acquisition costs?",
  "How do you plan to scale the business?",
  "What is your unfair advantage?",
  "How will you use the investment?",
  "What's your exit strategy?",
  "Who are your competitors and how are you different?"
];

export default function PitchSimulator() {
  const [activeStep, setActiveStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pitchDraft, setPitchDraft] = useState("");

  // Get user plan from localStorage (default to free)
  const [plan] = useState(() => localStorage.getItem("user_plan") || "free");
  const isPaid = plan === "starter" || plan === "professional";

  const currentStep = pitchSteps.find(step => step.id === activeStep);

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleNextStep = () => {
    if (activeStep < pitchSteps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!isPaid) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-2xl py-24 text-center">
          <h1 className="mb-4 text-3xl font-bold">Pitch Simulator</h1>
          <p className="mb-6 text-lg text-muted-foreground">The Pitch Simulator is available for Starter and Professional users only.</p>
          <Button asChild variant="default">
            <a href="/pricing">Upgrade to Unlock</a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Pitch Simulator</h1>
          <p className="text-lg text-muted-foreground">
            Build and practice your perfect investor pitch
          </p>
        </div>
        
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder">
              <Layers className="mr-2 h-4 w-4" />
              Pitch Builder
            </TabsTrigger>
            <TabsTrigger value="practice">
              <Video className="mr-2 h-4 w-4" />
              Practice Room
            </TabsTrigger>
            <TabsTrigger value="questions">
              <MessageSquare className="mr-2 h-4 w-4" />
              Investor Questions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="rounded-lg border bg-card">
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold">Pitch Structure</h3>
                    <p className="text-sm text-muted-foreground">
                      Follow these steps to build your pitch
                    </p>
                  </div>
                  <div className="space-y-1 p-2">
                    {pitchSteps.map((step) => (
                      <button
                        key={step.id}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                          activeStep === step.id
                            ? "bg-shark-100 text-shark-900 font-medium"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setActiveStep(step.id)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium ${
                              step.completed
                                ? "bg-green-500 text-white"
                                : activeStep === step.id
                                ? "bg-shark-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              step.id
                            )}
                          </div>
                          <span>{step.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {step.timeGuide}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-xs text-muted-foreground">
                        {pitchSteps.filter((s) => s.completed).length} / {pitchSteps.length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (pitchSteps.filter((s) => s.completed).length /
                          pitchSteps.length) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <FadeInStagger>
                  <FadeIn>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>
                              {currentStep?.id}. {currentStep?.title}
                            </CardTitle>
                            <CardDescription>
                              {currentStep?.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center rounded-md bg-muted px-2 py-1">
                            <Clock className="mr-1 h-3 w-3" />
                            <span className="text-xs font-medium">
                              {currentStep?.timeGuide}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6 rounded-lg border bg-muted/50 p-4">
                          <h4 className="mb-2 text-sm font-medium">Pro Tips</h4>
                          <ul className="space-y-1 text-sm">
                            {currentStep?.tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2 mt-0.5 text-shark-500">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pitch-content">Your Pitch Content</Label>
                          <Textarea
                            id="pitch-content"
                            placeholder={`Write your ${currentStep?.title.toLowerCase()} here...`}
                            className="min-h-32"
                            value={pitchDraft}
                            onChange={(e) => setPitchDraft(e.target.value)}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <Button
                          variant="outline"
                          onClick={handlePrevStep}
                          disabled={activeStep === 1}
                        >
                          <StepBack className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          disabled={activeStep === pitchSteps.length}
                        >
                          Next
                          <StepForward className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </FadeIn>
                </FadeInStagger>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="practice" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted/50 flex items-center justify-center relative">
                    {isRecording ? (
                      <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white rounded-full px-3 py-1 text-sm animate-pulse">
                        <span className="mr-2 h-2 w-2 rounded-full bg-white"></span>
                        Recording
                      </div>
                    ) : null}
                    <div className="text-center">
                      <Video className="mx-auto h-16 w-16 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {isRecording
                          ? "You are currently recording..."
                          : "Start recording to practice your pitch"}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={toggleRecording}
                          variant={isRecording ? "destructive" : "default"}
                          size="sm"
                        >
                          {isRecording ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Start Recording
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="text-sm">
                        {Math.floor(timer / 60)
                          .toString()
                          .padStart(2, "0")}
                        :{(timer % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="md:col-span-1">
                <SlideUp>
                  <div className="rounded-lg border bg-card">
                    <div className="p-4">
                      <h3 className="font-semibold">Practice Tips</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Make your pitch compelling and effective
                      </p>
                    </div>
                    <div className="space-y-4 p-4 pt-0">
                      <div className="rounded-md bg-muted/50 p-3">
                        <h4 className="mb-1 font-medium text-sm">Time Management</h4>
                        <p className="text-xs text-muted-foreground">
                          Your entire pitch should be 2-3 minutes. Practice until you can
                          hit your timing consistently.
                        </p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-3">
                        <h4 className="mb-1 font-medium text-sm">Body Language</h4>
                        <p className="text-xs text-muted-foreground">
                          Stand confidently, make eye contact, and use hand gestures
                          purposefully.
                        </p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-3">
                        <h4 className="mb-1 font-medium text-sm">Vocal Delivery</h4>
                        <p className="text-xs text-muted-foreground">
                          Speak clearly, vary your pace and tone, and emphasize key points.
                        </p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-3">
                        <h4 className="mb-1 font-medium text-sm">Know Your Numbers</h4>
                        <p className="text-xs text-muted-foreground">
                          Be prepared to back up any claim with data and explain your
                          financial projections.
                        </p>
                      </div>
                    </div>
                  </div>
                </SlideUp>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Common Investor Questions</CardTitle>
                    <CardDescription>
                      Prepare answers to these frequently asked questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {commonQuestions.map((question, index) => (
                        <div
                          key={index}
                          className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <h4 className="mb-2 font-medium">{question}</h4>
                          <Textarea
                            placeholder="Prepare your answer here..."
                            className="min-h-20"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6 md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-amber-500" />
                      Achievement Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Pitch Builder</span>
                          <span className="text-xs text-muted-foreground">30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Practice Sessions</span>
                          <span className="text-xs text-muted-foreground">10%</span>
                        </div>
                        <Progress value={10} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Q&A Preparation</span>
                          <span className="text-xs text-muted-foreground">0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Ready for the Sharks?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-4">
                        The most successful pitches are those that are well-prepared,
                        concise, and backed by solid numbers.
                      </p>
                      <p>
                        Complete all sections of your pitch and practice answering the
                        tough questions to maximize your chances of success.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      <Video className="mr-2 h-4 w-4" />
                      Schedule Mock Pitch
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Add the Label component
function Label({ 
  htmlFor, 
  children 
}: { 
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}
