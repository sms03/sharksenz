import React, { useState } from 'react';
import { Presentation, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { AIRoleCustomizer, AIRole } from '../components/AIRoleCustomizer';
import { StartupJourneyStepper } from '../components/StartupJourneyStepper';
import { GuidedPitchInput } from '../components/GuidedPitchInput';
import { PreviewAnalysis } from '../components/PreviewAnalysis';
import PitchSimulator from '../components/PitchSimulator';
import { useNavigate } from 'react-router-dom';

type PageStep = 'role' | 'journey' | 'pitch' | 'preview' | 'analysis';

const PitchSimulatorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PageStep>('role');
  const [aiRole, setAiRole] = useState<AIRole | undefined>();
  const [currentJourneyStep, setCurrentJourneyStep] = useState('validate');
  const [pitch, setPitch] = useState('');
  const navigate = useNavigate();

  const handleRoleSet = (role: AIRole) => {
    setAiRole(role);
    setCurrentStep('journey');
  };

  const handleJourneyStepChange = (stepId: string) => {
    setCurrentJourneyStep(stepId);
    setCurrentStep('pitch');
  };

  const handlePreview = (pitchText: string) => {
    setPitch(pitchText);
    setCurrentStep('preview');
  };

  const handleFullAnalysis = (pitchText: string) => {
    setPitch(pitchText);
    setCurrentStep('analysis');
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Presentation className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI-Powered Pitch Feedback</span>
            </div>
            
            {/* Main Heading - Improved Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Perfect Your
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Startup Pitch
              </span>
            </h1>
            
            {/* Clear Value Proposition */}
            <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, actionable feedback to transform your pitch from good to investor-ready. 
              Perfect for first-time founders who want to nail their presentation.
            </p>
            
            {/* Benefits - Not Features */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-12">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Save hours of preparation</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Identify weak points instantly</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Boost investor confidence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Step Content */}
            {currentStep === 'role' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Step 1: Customize Your AI Advisor</h2>
                  <p className="text-lg text-slate-600">
                    Help us tailor the feedback to your specific startup and needs
                  </p>
                </div>
                <AIRoleCustomizer onRoleSet={handleRoleSet} />
              </div>
            )}

            {currentStep === 'journey' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Step 2: Choose Your Focus</h2>
                  <p className="text-lg text-slate-600">
                    Select the stage that best matches where you are in your startup journey
                  </p>
                </div>
                <StartupJourneyStepper 
                  currentStepId={currentJourneyStep}
                  onStepChange={handleJourneyStepChange}
                />
              </div>
            )}

            {currentStep === 'pitch' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Step 3: Describe Your Startup</h2>
                  <p className="text-lg text-slate-600">
                    The more details you provide, the better and more personalized your feedback will be
                  </p>
                </div>
                <GuidedPitchInput 
                  onSubmit={handleFullAnalysis}
                  onPreview={handlePreview}
                  aiRole={aiRole}
                />
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Free Analysis Preview</h2>
                  <p className="text-lg text-slate-600">
                    Here's a sample of what our full AI analysis provides
                  </p>
                </div>
                <PreviewAnalysis 
                  pitch={pitch}
                  onUpgrade={handleUpgrade}
                />
              </div>
            )}

            {currentStep === 'analysis' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Complete AI Analysis</h2>
                  <p className="text-lg text-slate-600">
                    Detailed feedback and actionable recommendations for your startup
                  </p>
                </div>
                <PitchSimulator />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Helps Section - Only show on role step */}
      {currentStep === 'role' && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Why First-Time Founders Love This Tool
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Skip the guesswork. Get the same quality feedback that investors provide, 
                  but before you're in the room.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Spot Missing Elements
                  </h3>
                  <p className="text-slate-600">
                    Identify gaps in your revenue model, market analysis, or competitive positioning 
                    before investors do.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Strengthen Your Story
                  </h3>
                  <p className="text-slate-600">
                    Transform confusing jargon into clear, compelling narratives that 
                    resonate with any audience.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Build Confidence
                  </h3>
                  <p className="text-slate-600">
                    Practice and refine your pitch until you can deliver it with confidence 
                    to anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PitchSimulatorPage;
