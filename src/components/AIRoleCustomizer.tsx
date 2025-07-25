import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Building, Rocket, Users, Code, Briefcase } from "lucide-react";

export interface AIRole {
  startupType: string;
  stage: string;
  founderBackground: string;
  helpType: string;
  customInstructions: string;
}

interface AIRoleCustomizerProps {
  onRoleSet: (role: AIRole) => void;
  currentRole?: AIRole;
}

const startupTypes = [
  { value: "saas", label: "SaaS / Software", icon: Code },
  { value: "marketplace", label: "Marketplace", icon: Building },
  { value: "hardware", label: "Hardware / IoT", icon: Briefcase },
  { value: "fintech", label: "FinTech", icon: Briefcase },
  { value: "healthtech", label: "HealthTech", icon: Briefcase },
  { value: "edtech", label: "EdTech", icon: Briefcase },
  { value: "ecommerce", label: "E-commerce", icon: Building },
  { value: "other", label: "Other", icon: Briefcase }
];

const stages = [
  { value: "idea", label: "Idea Stage", description: "Just an idea, no product yet" },
  { value: "mvp", label: "MVP Development", description: "Building first version" },
  { value: "pre-seed", label: "Pre-Seed", description: "Early customers, seeking first funding" },
  { value: "seed", label: "Seed Stage", description: "Product-market fit, scaling team" },
  { value: "series-a", label: "Series A+", description: "Growth stage, proven business model" }
];

const founderBackgrounds = [
  { value: "tech", label: "Technical Founder", description: "Strong engineering/product background" },
  { value: "non-tech", label: "Non-Technical Founder", description: "Business/domain expertise" },
  { value: "solo", label: "Solo Founder", description: "Building alone for now" },
  { value: "first-time", label: "First-Time Founder", description: "New to entrepreneurship" },
  { value: "repeat", label: "Repeat Founder", description: "Previous startup experience" }
];

const helpTypes = [
  { value: "validate", label: "Validate Idea", description: "Test if there's real demand" },
  { value: "gtm", label: "Go-to-Market Strategy", description: "How to get first customers" },
  { value: "product", label: "Product Development", description: "Building the right features" },
  { value: "fundraising", label: "Fundraising Prep", description: "Investor-ready pitch & materials" },
  { value: "growth", label: "Growth Strategy", description: "Scale customer acquisition" }
];

export const AIRoleCustomizer = ({ onRoleSet, currentRole }: AIRoleCustomizerProps) => {
  const [role, setRole] = useState<AIRole>(currentRole || {
    startupType: "",
    stage: "",
    founderBackground: "",
    helpType: "",
    customInstructions: ""
  });

  const handleSubmit = () => {
    if (!role.startupType || !role.stage || !role.founderBackground || !role.helpType) {
      return;
    }
    onRoleSet(role);
  };

  const isComplete = role.startupType && role.stage && role.founderBackground && role.helpType;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Customize Your AI Advisor</CardTitle>
        <CardDescription>
          Help us tailor the AI's expertise and communication style to your specific needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Startup Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">What type of startup are you building?</Label>
          <div className="grid grid-cols-2 gap-2">
            {startupTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  variant={role.startupType === type.value ? "default" : "outline"}
                  className="h-auto p-3 justify-start"
                  onClick={() => setRole(prev => ({ ...prev, startupType: type.value }))}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {type.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Stage */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">What stage are you at?</Label>
          <Select value={role.stage} onValueChange={(value) => setRole(prev => ({ ...prev, stage: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your current stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  <div>
                    <div className="font-medium">{stage.label}</div>
                    <div className="text-sm text-muted-foreground">{stage.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Founder Background */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">What's your founder background?</Label>
          <Select value={role.founderBackground} onValueChange={(value) => setRole(prev => ({ ...prev, founderBackground: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your background" />
            </SelectTrigger>
            <SelectContent>
              {founderBackgrounds.map((bg) => (
                <SelectItem key={bg.value} value={bg.value}>
                  <div>
                    <div className="font-medium">{bg.label}</div>
                    <div className="text-sm text-muted-foreground">{bg.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Help Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">What kind of help do you need most?</Label>
          <div className="grid gap-2">
            {helpTypes.map((help) => (
              <Button
                key={help.value}
                variant={role.helpType === help.value ? "default" : "outline"}
                className="h-auto p-3 justify-start text-left"
                onClick={() => setRole(prev => ({ ...prev, helpType: help.value }))}
              >
                <div>
                  <div className="font-medium">{help.label}</div>
                  <div className="text-sm text-muted-foreground">{help.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Additional context (optional)</Label>
          <Textarea
            placeholder="Any specific details about your startup, goals, or the type of feedback you're looking for..."
            value={role.customInstructions}
            onChange={(e) => setRole(prev => ({ ...prev, customInstructions: e.target.value }))}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={!isComplete}
        >
          Set AI Role & Continue
        </Button>
      </CardContent>
    </Card>
  );
};
