
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  },
  "Consumer": {
    marketSize: "$14.3 trillion (2022)",
    growthRate: "5.2% CAGR (2023-2030)",
    keyTrends: [
      "Direct-to-consumer brands growth",
      "Subscription model expansion",
      "Ethical and sustainable consumption",
      "Personalization at scale"
    ],
    segments: [
      { name: "Food & Beverage", value: 30, color: "#f59e0b" },
      { name: "Personal Care", value: 25, color: "#ec4899" },
      { name: "Apparel", value: 20, color: "#3b82f6" },
      { name: "Home Goods", value: 15, color: "#10b981" },
      { name: "Entertainment", value: 10, color: "#6366f1" }
    ],
    competitors: {
      major: ["P&G", "Unilever", "Nestlé", "Nike", "LVMH"],
      emerging: ["Glossier", "Allbirds", "Warby Parker", "Dollar Shave Club"]
    }
  }
};

const MarketAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("SaaS");
  
  const { register, handleSubmit, formState: { errors } } = useForm<MarketAnalysisFormData>({
    defaultValues: {
      industry: "SaaS",
      target: "Small to medium-sized businesses",
      competitors: "Major: Salesforce, HubSpot\nEmerging: Monday.com, Notion",
      productDescription: "A productivity SaaS platform that helps teams collaborate and manage projects more efficiently."
    }
  });

  const onSubmit = (data: MarketAnalysisFormData) => {
    try {
      setLoading(true);
      
      // In a real application, you would call an API here
      // For now, use the sample data based on selected industry
      setTimeout(() => {
        // Use industry from form data
        const industryData = sampleMarketData[data.industry as keyof typeof sampleMarketData] || sampleMarketData.SaaS;
        
        setAnalysis({
          formData: data,
          marketData: industryData,
          insights: [
            `The ${data.industry} market is growing at ${industryData.growthRate}, with a current size of ${industryData.marketSize}.`,
            `Your target audience of "${data.target}" represents a significant segment of this market.`,
            `Key competitors you mentioned (${data.competitors.split('\n')[0]}) hold substantial market share.`,
            `Your product positioning can leverage current trends like ${industryData.keyTrends[0]} and ${industryData.keyTrends[1]}.`,
            `Consider focusing on specific market segments like ${industryData.segments[0].name} and ${industryData.segments[1].name} for initial traction.`
          ],
          recommendations: [
            "Focus on clear differentiation from major competitors",
            "Leverage key industry trends in marketing messaging",
            `Target the ${industryData.segments[0].name} segment initially`,
            "Implement a product-led growth strategy",
            "Consider strategic partnerships with complementary services"
          ],
          threats: [
            "Market consolidation by major players",
            "Emerging competitors with innovative business models",
            "Changing regulatory landscape",
            "Customer acquisition cost inflation"
          ]
        });
        setSelectedIndustry(data.industry);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating market analysis:", error);
      setLoading(false);
    }
  };

  const refreshAnalysis = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select 
              defaultValue="SaaS"
              onValueChange={(value) => {
                const event = {
                  target: { name: "industry", value }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                register("industry").onChange(event);
              }}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="Fintech">Fintech</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Consumer">Consumer</SelectItem>
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-red-500">Please select an industry</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target">Target Market</Label>
            <Input
              id="target"
              placeholder="E.g. Small to medium businesses, 25-45 year-old professionals"
              {...register("target", { required: true })}
            />
            {errors.target && (
              <p className="text-sm text-red-500">Target market is required</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="competitors">Key Competitors</Label>
          <Textarea
            id="competitors"
            placeholder="Major: Competitor A, Competitor B&#10;Emerging: Startup X, Startup Y"
            className="min-h-[80px]"
            {...register("competitors", { required: true })}
          />
          {errors.competitors && (
            <p className="text-sm text-red-500">Competitors information is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productDescription">Your Product/Service Description</Label>
          <Textarea
            id="productDescription"
            placeholder="Briefly describe your product or service and its key value propositions"
            className="min-h-[120px]"
            {...register("productDescription", { required: true })}
          />
          {errors.productDescription && (
            <p className="text-sm text-red-500">Product description is required</p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Analysis...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate Market Analysis
            </>
          )}
        </Button>
      </form>

      {analysis && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Market Analysis: {analysis.formData.industry}</h2>
            <Button variant="outline" size="sm" onClick={refreshAnalysis}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Analysis
            </Button>
          </div>
          
          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Market Size</h3>
              <p className="text-lg font-bold">{analysis.marketData.marketSize}</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Growth Rate</h3>
              <p className="text-lg font-bold">{analysis.marketData.growthRate}</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Key Segments</h3>
              <p className="text-lg font-bold">{analysis.marketData.segments.length} Major Segments</p>
            </div>
          </div>
          
          {/* Market Segmentation Chart */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Market Segmentation</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysis.marketData.segments}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analysis.marketData.segments.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Key Insights */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-700 mb-3">Key Insights</h3>
            <ul className="space-y-2">
              {analysis.insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-xs mr-2 mt-0.5">•</span>
                  <span className="text-blue-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Trends */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Key Market Trends</h3>
              <ul className="space-y-2">
                {analysis.marketData.keyTrends.map((trend: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 text-purple-700 text-xs mr-2 mt-0.5">{index + 1}</span>
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Competitor Analysis */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Competitor Landscape</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Major Players</h4>
                  <p className="mt-1">{analysis.marketData.competitors.major.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Emerging Disruptors</h4>
                  <p className="mt-1">{analysis.marketData.competitors.emerging.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommendations */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-700 mb-3">Strategic Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-700 text-xs mr-2 mt-0.5">✓</span>
                    <span className="text-green-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Threats */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-red-700 mb-3">Market Threats</h3>
              <ul className="space-y-2">
                {analysis.threats.map((threat: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-700 text-xs mr-2 mt-0.5">!</span>
                    <span className="text-red-700">{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Product Fit Analysis */}
          <div className="bg-white border border-gray-200 p-5 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Product-Market Fit Analysis</h3>
            <p className="mb-4">Based on your product description:</p>
            <div className="bg-gray-50 p-3 rounded mb-4 italic">
              "{analysis.formData.productDescription}"
            </div>
            <p>
              Your solution is well-positioned for the {selectedIndustry} market, particularly for {analysis.formData.target}. 
              Focus on differentiating from {analysis.formData.competitors.split('\n')[0].replace('Major: ', '')} by emphasizing your unique approach.
              To gain market traction, consider leveraging trends like {analysis.marketData.keyTrends[0].toLowerCase()} and target the {analysis.marketData.segments[0].name} segment initially.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;
