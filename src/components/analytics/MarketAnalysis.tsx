
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer } from "@/components/ui/chart";
import { Loader2, RefreshCw, Zap } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MarketAnalysisFormData {
  industry: string;
  target: string;
  competitors: string;
  productDescription: string;
}

// Sample data for market analysis
const sampleMarketData = {
  "SaaS": {
    marketSize: "$146 billion (2022)",
    growthRate: "11.7% CAGR (2023-2030)",
    keyTrends: [
      "Shift to vertical SaaS solutions",
      "AI integration becoming standard",
      "Product-led growth gaining popularity",
      "Increased focus on security and compliance"
    ],
    segments: [
      { name: "Enterprise", value: 45, color: "#3b82f6" },
      { name: "SMB", value: 35, color: "#10b981" },
      { name: "Consumer", value: 20, color: "#f59e0b" }
    ],
    competitors: {
      major: ["Salesforce", "Microsoft", "Oracle", "SAP"],
      emerging: ["Monday.com", "Notion", "Airtable", "Coda"]
    }
  },
  "E-commerce": {
    marketSize: "$5.7 trillion (2022)",
    growthRate: "14.7% CAGR (2023-2030)",
    keyTrends: [
      "Mobile commerce dominance",
      "Social commerce integration",
      "Sustainability focus",
      "AR/VR shopping experiences"
    ],
    segments: [
      { name: "Electronics", value: 30, color: "#3b82f6" },
      { name: "Fashion", value: 25, color: "#ec4899" },
      { name: "Home & Garden", value: 15, color: "#10b981" },
      { name: "Food & Beverage", value: 15, color: "#f59e0b" },
      { name: "Others", value: 15, color: "#6366f1" }
    ],
    competitors: {
      major: ["Amazon", "Walmart", "Alibaba", "eBay"],
      emerging: ["Shopify merchants", "Instagram Shopping", "TikTok Shop"]
    }
  },
  "Fintech": {
    marketSize: "$332 billion (2022)",
    growthRate: "19.8% CAGR (2023-2030)",
    keyTrends: [
      "Embedded finance integration",
      "Decentralized finance (DeFi) growth",
      "Banking-as-a-Service expansion",
      "Regulatory technology innovation"
    ],
    segments: [
      { name: "Digital Payments", value: 30, color: "#3b82f6" },
      { name: "Lending", value: 20, color: "#10b981" },
      { name: "Banking", value: 15, color: "#f59e0b" },
      { name: "Wealth Management", value: 15, color: "#6366f1" },
      { name: "Insurance", value: 20, color: "#ec4899" }
    ],
    competitors: {
      major: ["Stripe", "PayPal", "Square", "Robinhood", "Klarna"],
      emerging: ["Plaid", "Revolut", "Chime", "SoFi"]
    }
  },
  "Healthcare": {
    marketSize: "$10.5 trillion (2022)",
    growthRate: "8.9% CAGR (2023-2030)",
    keyTrends: [
      "Telehealth expansion",
      "AI for diagnostics and personalized medicine",
      "Digital therapeutics",
      "Value-based care models"
    ],
    segments: [
      { name: "Telehealth", value: 25, color: "#3b82f6" },
      { name: "Medical Devices", value: 30, color: "#10b981" },
      { name: "Healthcare IT", value: 15, color: "#f59e0b" },
      { name: "Pharmaceuticals", value: 30, color: "#ec4899" }
    ],
    competitors: {
      major: ["UnitedHealth", "Johnson & Johnson", "Pfizer", "Medtronic"],
      emerging: ["Teladoc", "One Medical", "Noom", "Hims & Hers"]
    }
  }
};

const MarketAnalysis = () => {
  const [industry, setIndustry] = useState<keyof typeof sampleMarketData | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<MarketAnalysisFormData>({
    defaultValues: {
      industry: "",
      target: "",
      competitors: "",
      productDescription: ""
    }
  });

  const onSubmit = async (data: MarketAnalysisFormData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (data.industry in sampleMarketData) {
        setAnalysisData(sampleMarketData[data.industry as keyof typeof sampleMarketData]);
        setIndustry(data.industry as keyof typeof sampleMarketData);
      } else {
        // Default to SaaS if selected industry not found in sample data
        setAnalysisData(sampleMarketData.SaaS);
        setIndustry("SaaS");
      }
      setIsLoading(false);
    }, 1500);
  };

  const refreshAnalysis = () => {
    if (industry) {
      setIsLoading(true);
      setTimeout(() => {
        setAnalysisData(sampleMarketData[industry]);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select 
              onValueChange={(value) => {
                const form = document.getElementById("industry") as HTMLInputElement;
                if (form) form.value = value;
              }}
            >
              <SelectTrigger id="industry-select">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Fintech">Fintech</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="industry"
              type="hidden"
              {...register("industry", { required: true })}
            />
            {errors.industry && (
              <p className="text-sm text-red-500">Please select an industry</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target">Target Market</Label>
            <Input
              id="target"
              placeholder="e.g., Small businesses in the US"
              {...register("target")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="competitors">Key Competitors</Label>
            <Input
              id="competitors"
              placeholder="e.g., Competitor A, Competitor B"
              {...register("competitors")}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="productDescription">Product Description</Label>
            <Textarea
              id="productDescription"
              placeholder="Briefly describe your product or service"
              rows={3}
              {...register("productDescription")}
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Market...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate Market Analysis
            </>
          )}
        </Button>
      </form>

      {analysisData && (
        <div className="space-y-6 mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{industry} Market Analysis</h3>
            <Button variant="outline" size="sm" onClick={refreshAnalysis} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Market Size</h4>
              <p className="text-xl font-bold mt-1">{analysisData.marketSize}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Growth Rate</h4>
              <p className="text-xl font-bold mt-1">{analysisData.growthRate}</p>
            </div>
          </div>

          {/* Key Trends */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3">Key Market Trends</h4>
            <ul className="space-y-2">
              {analysisData.keyTrends.map((trend: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 h-5 w-5 text-xs mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Market Segmentation Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3">Market Segmentation</h4>
            <div className="h-64">
              <ChartContainer
                config={{
                  segment: { label: "Market Segment" },
                }}
              >
                <PieChart>
                  <Pie
                    data={analysisData.segments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                  >
                    {analysisData.segments.map((segment: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={segment.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium mb-3">Competitor Landscape</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-2">Major Players</h5>
                <ul className="space-y-1">
                  {analysisData.competitors.major.map((competitor: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {competitor}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-2">Emerging Competitors</h5>
                <ul className="space-y-1">
                  {analysisData.competitors.emerging.map((competitor: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {competitor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-medium text-blue-700 mb-3">AI-Generated Recommendations</h4>
            <p className="text-blue-800 mb-3">
              Based on current market trends and your product profile, here are key recommendations:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-200 text-blue-700 h-5 w-5 text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>Focus on {industry === "SaaS" ? "vertical-specific solutions" : 
                               industry === "E-commerce" ? "mobile-first experiences" :
                               industry === "Fintech" ? "embedded finance options" :
                               "telehealth integration"} to differentiate from competitors.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-200 text-blue-700 h-5 w-5 text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>Leverage AI for {industry === "SaaS" ? "personalization and automation" : 
                                       industry === "E-commerce" ? "customer recommendations" :
                                       industry === "Fintech" ? "risk assessment" :
                                       "diagnostic assistance"} to gain competitive advantage.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-200 text-blue-700 h-5 w-5 text-xs mr-2 mt-0.5">
                  3
                </span>
                <span>Consider strategic partnerships with {industry === "SaaS" ? "complementary tools" : 
                                                           industry === "E-commerce" ? "logistics providers" :
                                                           industry === "Fintech" ? "traditional financial institutions" :
                                                           "insurance companies"} to expand your market reach.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;
