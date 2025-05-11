import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  BarChart4, 
  PieChart, 
  TrendingUp, 
  Users, 
  Search,
  Target,
  Layers,
  LineChart,
  ArrowUpRight,
  BarChart,
  ArrowDownRight,
  Star,
  Globe,
  Building2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Demo data - In a real implementation, this would come from an API
const marketSizeData = [
  { year: 2022, size: 5.2 },
  { year: 2023, size: 6.8 },
  { year: 2024, size: 8.7 },
  { year: 2025, size: 11.3 },
  { year: 2026, size: 14.6 },
  { year: 2027, size: 18.9 },
];

const competitorsData = [
  { 
    name: "Market Leader Inc.", 
    marketShare: 28, 
    growth: 12, 
    fundingRound: "Series D", 
    fundingAmount: "$125M",
    strengths: ["Brand recognition", "Enterprise clients", "Mature product"],
    weaknesses: ["High prices", "Legacy tech stack", "Slow innovation"]
  },
  { 
    name: "FastGrowth Co.", 
    marketShare: 15, 
    growth: 42, 
    fundingRound: "Series B", 
    fundingAmount: "$45M",
    strengths: ["Innovative features", "Modern UX", "Developer-friendly"],
    weaknesses: ["Limited enterprise support", "Scaling issues", "Young team"]
  },
  { 
    name: "Stable Solutions", 
    marketShare: 22, 
    growth: 8, 
    fundingRound: "Public", 
    fundingAmount: "Market cap $2.1B",
    strengths: ["Reliable", "Strong sales team", "Global presence"],
    weaknesses: ["Outdated UI", "Poor API", "Complex pricing"]
  },
  { 
    name: "Budget Option", 
    marketShare: 17, 
    growth: 15, 
    fundingRound: "Series C", 
    fundingAmount: "$78M",
    strengths: ["Affordable", "Simple onboarding", "SMB focus"],
    weaknesses: ["Limited features", "Weak analytics", "Poor customer support"]
  },
  { 
    name: "Niche Player", 
    marketShare: 8, 
    growth: 25, 
    fundingRound: "Series A", 
    fundingAmount: "$12M",
    strengths: ["Industry expertise", "Specialized features", "Loyal customer base"],
    weaknesses: ["Small team", "Limited market reach", "Narrow use-cases"]
  },
  { 
    name: "Other competitors", 
    marketShare: 10, 
    growth: 18, 
    fundingRound: "Various", 
    fundingAmount: "N/A",
    strengths: ["Various"], 
    weaknesses: ["Various"]
  }
];

const industryTrends = [
  {
    name: "AI Integration",
    impact: "High",
    description: "Integration of artificial intelligence and machine learning features has become a key differentiator in the market.",
    relevance: 95,
    direction: "Growing"
  },
  {
    name: "API-first Approach",
    impact: "Medium",
    description: "Companies are increasingly adopting API-first approaches to enable better integration and extensibility.",
    relevance: 80,
    direction: "Stable"
  },
  {
    name: "Vertical Specialization",
    impact: "Medium",
    description: "Growing trend of solutions tailored for specific industry verticals with specialized features and compliance.",
    relevance: 75,
    direction: "Growing"
  },
  {
    name: "Pricing Pressure",
    impact: "High",
    description: "Increased competition is leading to pricing pressure, particularly in commoditized segments.",
    relevance: 70,
    direction: "Growing"
  },
  {
    name: "User Experience Focus",
    impact: "High",
    description: "Companies are investing heavily in UX improvements to reduce friction and improve adoption rates.",
    relevance: 90,
    direction: "Growing"
  },
];

const marketSegments = [
  { 
    name: "Enterprise", 
    share: 35, 
    growth: 8, 
    avgDealSize: "$85,000",
    salesCycle: "6-12 months",
    key: "Security, compliance, and scalability"
  },
  { 
    name: "Mid-market", 
    share: 40, 
    growth: 15, 
    avgDealSize: "$25,000",
    salesCycle: "2-4 months",
    key: "Value, features, and implementation support"
  },
  { 
    name: "SMB", 
    share: 25, 
    growth: 22, 
    avgDealSize: "$5,000",
    salesCycle: "2-6 weeks",
    key: "Affordability, simplicity, and quick ROI"
  }
];

export default function MarketAnalysis() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(() => localStorage.getItem("user_plan") || "free");
  const [activeTab, setActiveTab] = useState("market-size");
  const [selectedIndustry, setSelectedIndustry] = useState("Software");
  const [selectedSegment, setSelectedSegment] = useState("B2B SaaS");
  const [companySize, setCompanySize] = useState(1000);
  const [growthRate, setGrowthRate] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtered competitors based on search
  const filteredCompetitors = competitorsData.filter(competitor => 
    competitor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    setPlan(localStorage.getItem("user_plan") || "free");
  }, [user]);
  
  const formatNumber = (value: number, suffix = "") => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B${suffix}`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${suffix}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${suffix}`;
    }
    return `${value}${suffix}`;
  };
  
  // Calculate the total addressable market based on inputs
  const calculateTAM = () => {
    // This is a simplified model for demo purposes
    const baseMarketSize = marketSizeData[2].size; // Current year market size in billions
    const industryFactor = selectedIndustry === "Software" ? 1.0 : 
      selectedIndustry === "Healthcare" ? 0.8 : 
      selectedIndustry === "Fintech" ? 1.2 : 0.9;
    
    const segmentFactor = selectedSegment === "B2B SaaS" ? 1.0 : 
      selectedSegment === "Consumer Apps" ? 1.3 : 
      selectedSegment === "Enterprise Solutions" ? 0.7 : 1.1;
    
    return baseMarketSize * industryFactor * segmentFactor * 1000000000; // Convert to actual dollars
  };
  
  const calculateSAM = () => {
    return calculateTAM() * 0.35; // Simplification - SAM is a subset of TAM
  };
  
  const calculateSOM = () => {
    return calculateSAM() * (companySize / 10000) * (growthRate / 100);
  };

  return (
    <div className="mx-auto max-w-5xl py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Market Analysis</h1>
          <p className="text-muted-foreground max-w-2xl">
            Gain insights into your market size, competition, and industry trends to position your startup for success.
          </p>
        </div>
      </div>

      {plan === "professional" ? (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">              <TabsTrigger value="market-size" className="flex items-center gap-2 h-10">
                <BarChart4 className="h-4 w-4" />
                <span className="hidden md:inline">Market Size</span>
              </TabsTrigger>
              <TabsTrigger value="competitors" className="flex items-center gap-2 h-10">
                <Building2 className="h-4 w-4" />
                <span className="hidden md:inline">Competitors</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2 h-10">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden md:inline">Industry Trends</span>
              </TabsTrigger>
              <TabsTrigger value="segments" className="flex items-center gap-2 h-10">
                <PieChart className="h-4 w-4" />
                <span className="hidden md:inline">Market Segments</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {/* Market Size Tab Content */}
              <TabsContent value="market-size">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Market Size Analysis
                    </CardTitle>
                    <CardDescription>
                      Understand your total addressable market (TAM), serviceable addressable market (SAM), and
                      serviceable obtainable market (SOM)
                    </CardDescription>
                  </CardHeader>                  <CardContent className="h-[600px]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-4 lg:col-span-1">
                        <h3 className="text-lg font-medium">Market Parameters</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>                          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                            <SelectTrigger id="industry" className="h-10">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Software">Software & Technology</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Fintech">Financial Technology</SelectItem>
                              <SelectItem value="Ecommerce">E-commerce</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="segment">Market Segment</Label>                          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                            <SelectTrigger id="segment" className="h-10">
                              <SelectValue placeholder="Select segment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="B2B SaaS">B2B SaaS</SelectItem>
                              <SelectItem value="Consumer Apps">Consumer Applications</SelectItem>
                              <SelectItem value="Enterprise Solutions">Enterprise Solutions</SelectItem>
                              <SelectItem value="Dev Tools">Developer Tools</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="company-size">Target Company Size</Label>
                            <span className="text-sm text-muted-foreground">{formatNumber(companySize, " employees")}</span>
                          </div>
                          <Slider
                            id="company-size"
                            min={50}
                            max={5000}
                            step={50}
                            value={[companySize]}
                            onValueChange={(values) => setCompanySize(values[0])}
                            className="py-2"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="growth-rate">Annual Growth Rate</Label>
                            <span className="text-sm text-muted-foreground">{growthRate}%</span>
                          </div>
                          <Slider
                            id="growth-rate"
                            min={5}
                            max={100}
                            step={1}
                            value={[growthRate]}
                            onValueChange={(values) => setGrowthRate(values[0])}
                            className="py-2"
                          />
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-blue-500" />
                                  TAM
                                </CardTitle>
                                <CardDescription>
                                  Total Addressable Market
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-blue-500">
                                  {formatNumber(calculateTAM(), "")}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  The total market opportunity for your product category
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-purple-500" />
                                  SAM
                                </CardTitle>
                                <CardDescription>
                                  Serviceable Addressable Market
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-purple-500">
                                  {formatNumber(calculateSAM(), "")}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  The portion of TAM targeted by your products and services
                                </p>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Target className="h-4 w-4 text-green-500" />
                                  SOM
                                </CardTitle>
                                <CardDescription>
                                  Serviceable Obtainable Market
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="text-2xl font-bold text-green-500">
                                  {formatNumber(calculateSOM(), "")}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  The portion of SAM you can realistically capture
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">Market Growth Trend</CardTitle>
                              <CardDescription>
                                Historical and projected market size (in billions)
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-60 flex items-center">
                                <div className="w-full">
                                  <div className="flex justify-between mb-2">
                                    <div className="text-sm text-muted-foreground">2022</div>
                                    <div className="text-sm text-muted-foreground">2027</div>
                                  </div>
                                  <div className="relative h-10 bg-muted rounded-md overflow-hidden">
                                    <div className="absolute inset-0 flex items-center">
                                      {marketSizeData.map((data, index) => (
                                        <div 
                                          key={index} 
                                          className="h-full flex-1 flex flex-col items-center justify-end group"
                                        >
                                          <div 
                                            className="bg-primary/80 group-hover:bg-primary transition-all w-[80%]"
                                            style={{ height: `${(data.size / 20) * 100}%` }}
                                          />
                                          <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                            ${data.size}B
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-8 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                                        <ArrowUpRight className="h-3 w-3" />
                                      </div>
                                      <span>
                                        CAGR of {((Math.pow((marketSizeData[marketSizeData.length - 1].size / marketSizeData[0].size), 1/5) - 1) * 100).toFixed(1)}% over 5 years
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 rounded-full bg-green-100 text-green-600">
                                        <TrendingUp className="h-3 w-3" />
                                      </div>
                                      <span>
                                        Market more than triples from ${marketSizeData[0].size}B to ${marketSizeData[marketSizeData.length - 1].size}B
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Competitors Tab Content */}
              <TabsContent value="competitors">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Competitive Analysis
                    </CardTitle>
                    <CardDescription>
                      Analyze key competitors, their market share, and growth rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>                    <div className="space-y-6">
                      <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
                        <Input 
                          type="text" 
                          placeholder="Search competitors..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 h-10"
                        />
                        <Button type="submit" variant="ghost" size="icon">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Card>
                        <CardContent className="p-0">
                          <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs uppercase bg-muted/50">
                                <tr>
                                  <th scope="col" className="px-6 py-3">Competitor</th>
                                  <th scope="col" className="px-6 py-3">Market Share</th>
                                  <th scope="col" className="px-6 py-3">YoY Growth</th>
                                  <th scope="col" className="px-6 py-3">Funding</th>
                                  <th scope="col" className="px-6 py-3">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredCompetitors.map((competitor, index) => (
                                  <tr key={index} className="bg-card border-b">
                                    <td className="px-6 py-4 font-medium">
                                      {competitor.name}
                                    </td>
                                    <td className="px-6 py-4">
                                      {competitor.marketShare}%
                                    </td>
                                    <td className="px-6 py-4">
                                      <span 
                                        className={cn(
                                          "inline-flex items-center gap-1",
                                          competitor.growth > 20 ? "text-green-500" : 
                                          competitor.growth > 10 ? "text-blue-500" : 
                                          "text-amber-500"
                                        )}
                                      >
                                        {competitor.growth > 20 ? (
                                          <ArrowUpRight className="h-3 w-3" />
                                        ) : competitor.growth > 10 ? (
                                          <TrendingUp className="h-3 w-3" />
                                        ) : (
                                          <ArrowDownRight className="h-3 w-3" />
                                        )}
                                        {competitor.growth}%
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div>
                                        <div className="font-medium">{competitor.fundingRound}</div>
                                        <div className="text-xs text-muted-foreground">{competitor.fundingAmount}</div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-muted/30">
                          <CardHeader>
                            <CardTitle className="text-lg">Market Share Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[200px] flex flex-col justify-center">
                              <div className="w-full h-10 flex rounded-md overflow-hidden">
                                {competitorsData.map((competitor, index) => (
                                  <div 
                                    key={index}
                                    className="h-full flex items-center justify-center text-xs text-white"
                                    style={{ 
                                      width: `${competitor.marketShare}%`,
                                      backgroundColor: getCompetitorColor(index)
                                    }}
                                  >
                                    {competitor.marketShare}%
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 grid grid-cols-3 gap-2">
                                {competitorsData.slice(0, 6).map((competitor, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: getCompetitorColor(index) }}
                                    />
                                    <span className="truncate">{competitor.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Competitive Strengths & Weaknesses</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <Select defaultValue="1">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select competitor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {competitorsData.slice(0, 5).map((competitor, index) => (
                                    <SelectItem key={index} value={index.toString()}>
                                      {competitor.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600">
                                      <Star className="h-3 w-3" />
                                    </div>
                                    Strengths
                                  </h4>
                                  <ul className="space-y-1 text-xs">
                                    {competitorsData[0].strengths.map((strength, idx) => (
                                      <li key={idx} className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-green-500" />
                                        {strength}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                    <div className="p-1 rounded-full bg-red-100 text-red-600">
                                      <TrendingDown className="h-3 w-3" />
                                    </div>
                                    Weaknesses
                                  </h4>
                                  <ul className="space-y-1 text-xs">
                                    {competitorsData[0].weaknesses.map((weakness, idx) => (
                                      <li key={idx} className="flex items-center gap-1.5">
                                        <div className="h-1 w-1 rounded-full bg-red-500" />
                                        {weakness}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Industry Trends Tab Content */}
              <TabsContent value="trends">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Industry Trends Analysis
                    </CardTitle>
                    <CardDescription>
                      Stay ahead of the curve with key industry trends and their potential impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        {industryTrends.map((trend, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                <div className="p-6 flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold">{trend.name}</h3>
                                    <div className={cn(
                                      "px-2 py-0.5 text-xs rounded-full",
                                      trend.impact === "High" ? "bg-red-100 text-red-700" : 
                                      trend.impact === "Medium" ? "bg-amber-100 text-amber-700" : 
                                      "bg-blue-100 text-blue-700"
                                    )}>
                                      {trend.impact} Impact
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {trend.description}
                                  </p>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1">
                                      <span>Relevance:</span>
                                      <span className="font-medium">{trend.relevance}%</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span>Trend:</span>
                                      <span className={cn(
                                        "font-medium",
                                        trend.direction === "Growing" ? "text-green-500" : 
                                        trend.direction === "Stable" ? "text-blue-500" : 
                                        "text-red-500"
                                      )}>
                                        {trend.direction}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-muted p-6 w-full md:w-1/4 flex flex-col justify-center items-center">
                                  <div 
                                    className="radial-progress text-primary" 
                                    style={{ 
                                      "--value": trend.relevance, 
                                      "--size": "4rem",
                                      "--thickness": "0.5rem" 
                                    } as React.CSSProperties}
                                  >
                                    <span className="text-sm font-bold">{trend.relevance}%</span>
                                  </div>
                                  <div className="mt-2 text-xs text-center">Relevance to your industry</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">Strategic Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-green-100 text-green-700 mt-0.5">
                                <LineChart className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Invest in AI capabilities</h4>
                                <p className="text-sm text-muted-foreground">
                                  Given the high impact and growing trajectory of AI integration, allocate resources to either build or partner for AI capabilities in your product.
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-blue-100 text-blue-700 mt-0.5">
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Enhance user experience</h4>
                                <p className="text-sm text-muted-foreground">
                                  UX improvements have a high impact and are growing in importance. Invest in usability testing and UI refinements to stay competitive.
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-amber-100 text-amber-700 mt-0.5">
                                <Layers className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Consider vertical specialization</h4>
                                <p className="text-sm text-muted-foreground">
                                  The trend toward industry-specific solutions suggests opportunities to create specialized features for high-value verticals.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Market Segments Tab Content */}
              <TabsContent value="segments">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Market Segmentation
                    </CardTitle>
                    <CardDescription>
                      Analyze different market segments to identify the most attractive opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {marketSegments.map((segment, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{segment.name}</CardTitle>
                              <CardDescription>
                                {segment.share}% of total market
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground text-xs">Growth</span>
                                    <span className="font-medium">{segment.growth}%</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground text-xs">Avg Deal</span>
                                    <span className="font-medium">{segment.avgDealSize}</span>
                                  </div>
                                </div>
                                
                                <div className="text-sm">
                                  <div className="text-muted-foreground text-xs">Sales Cycle</div>
                                  <div className="font-medium">{segment.salesCycle}</div>
                                </div>
                                
                                <div className="text-sm">
                                  <div className="text-muted-foreground text-xs">Key Decision Factors</div>
                                  <div className="font-medium">{segment.key}</div>
                                </div>
                              </div>
                            </CardContent>
                            <div className="h-1.5 w-full bg-muted-foreground/20">
                              <div 
                                className={cn(
                                  "h-full",
                                  index === 0 ? "bg-blue-500" : 
                                  index === 1 ? "bg-purple-500" : 
                                  "bg-green-500"
                                )}
                                style={{ width: `${segment.growth * 2}%` }}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Segment Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="text-xs uppercase bg-muted/50">
                                <tr>
                                  <th scope="col" className="px-6 py-3">Segment</th>
                                  <th scope="col" className="px-6 py-3">Market Share</th>
                                  <th scope="col" className="px-6 py-3">Growth Rate</th>
                                  <th scope="col" className="px-6 py-3">Competition</th>
                                  <th scope="col" className="px-6 py-3">Entry Barrier</th>
                                  <th scope="col" className="px-6 py-3">Opportunity</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-card border-b">
                                  <td className="px-6 py-4 font-medium">Enterprise</td>
                                  <td className="px-6 py-4">35%</td>
                                  <td className="px-6 py-4">8%</td>
                                  <td className="px-6 py-4">High</td>
                                  <td className="px-6 py-4">High</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-muted" />
                                      <Star className="h-3 w-3 text-muted" />
                                    </div>
                                  </td>
                                </tr>
                                <tr className="bg-card border-b">
                                  <td className="px-6 py-4 font-medium">Mid-market</td>
                                  <td className="px-6 py-4">40%</td>
                                  <td className="px-6 py-4">15%</td>
                                  <td className="px-6 py-4">Medium</td>
                                  <td className="px-6 py-4">Medium</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-muted" />
                                    </div>
                                  </td>
                                </tr>
                                <tr className="bg-card">
                                  <td className="px-6 py-4 font-medium">SMB</td>
                                  <td className="px-6 py-4">25%</td>
                                  <td className="px-6 py-4">22%</td>
                                  <td className="px-6 py-4">High</td>
                                  <td className="px-6 py-4">Low</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                            <h3 className="text-lg font-medium mb-2">Targeting Recommendation</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Based on your company size, growth targets, and competitive landscape, we recommend initially focusing on the <strong>Mid-market</strong> segment, with a gradual expansion to SMB as you build traction.
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <div className="p-1 rounded-full bg-green-100 text-green-700 mt-0.5">
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                                <span>
                                  Mid-market offers the best balance of growth potential (15%) and attainable deals with reasonable sales cycles.
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="p-1 rounded-full bg-green-100 text-green-700 mt-0.5">
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                                <span>
                                  SMB has the highest growth rate but requires a very efficient acquisition model due to lower deal sizes.
                                </span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className="p-1 rounded-full bg-green-100 text-green-700 mt-0.5">
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                                <span>
                                  Enterprise segment presents strong opportunities for later-stage expansion once you have established credibility.
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      ) : (
        <div className="p-8 border rounded-lg bg-muted/30 text-center">
          <BarChart4 className="h-12 w-12 mx-auto mb-4 text-primary/70" />
          <h3 className="text-xl font-semibold mb-2">Pro Feature</h3>
          <p className="mb-6 text-muted-foreground max-w-md mx-auto">
            Access our advanced market analysis tools with competitive intelligence, industry trends, and market sizing capabilities.
          </p>
          <Button asChild variant="default" size="lg" className="animate-pulse">
            <a href="/pricing">Upgrade to Pro</a>
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to get colors for the market share chart
function getCompetitorColor(index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#10b981', // green 
    '#f59e0b', // amber
    '#ef4444', // red
    '#6b7280', // gray
  ];
  
  return colors[index % colors.length];
}

// Helper for TypeScript types
function TrendingDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m23 18-9.5-9.5-5 5L1 6" />
      <path d="M17 18h6v-6" />
    </svg>
  );
}