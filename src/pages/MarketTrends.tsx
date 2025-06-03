import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Globe, 
  Search, 
  RefreshCw, 
  Zap, 
  BarChart3,
  LineChart,
  DollarSign,
  Target,
  Clock,
  Star,
  AlertTriangle
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Sample real-time market data
const generateTrendData = () => {
  const baseValue = 100;
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: baseValue + Math.random() * 50 - 25 + Math.sin(i / 5) * 20,
    sentiment: Math.random() > 0.5 ? 'positive' : 'negative'
  }));
};

const aiNewsData = [
  {
    id: 1,
    title: "AI Startup Funding Reaches Record High in Q4 2024",
    summary: "Venture capital investments in AI startups surged 127% compared to last year, with a focus on enterprise solutions and autonomous systems.",
    source: "TechCrunch",
    sentiment: "positive",
    impact: "high",
    timestamp: "2 hours ago",
    relevance: 95
  },
  {
    id: 2,
    title: "New European Data Privacy Regulations Impact SaaS Companies",
    summary: "The latest GDPR updates require additional compliance measures for SaaS platforms operating in the EU market.",
    source: "Venture Beat",
    sentiment: "neutral",
    impact: "medium",
    timestamp: "4 hours ago",
    relevance: 78
  },
  {
    id: 3,
    title: "Remote Work Tools Market Expected to Decline 15%",
    summary: "As companies return to office, demand for remote collaboration tools shows signs of plateauing.",
    source: "Bloomberg",
    sentiment: "negative",
    impact: "medium",
    timestamp: "6 hours ago",
    relevance: 82
  },
  {
    id: 4,
    title: "Sustainable Tech Startups Attract $2.3B in New Funding",
    summary: "Green technology and climate tech startups are becoming increasingly attractive to investors seeking ESG-compliant portfolios.",
    source: "Forbes",
    sentiment: "positive",
    impact: "high",
    timestamp: "8 hours ago",
    relevance: 91
  },
  {
    id: 5,
    title: "Cybersecurity Market Shows Unprecedented Growth",
    summary: "With increasing digital threats, cybersecurity solutions market is projected to grow 12% annually through 2027.",
    source: "CyberNews",
    sentiment: "positive",
    impact: "high",
    timestamp: "12 hours ago",
    relevance: 88
  }
];

const marketSegments = [
  { name: "SaaS", value: 35, color: "#3b82f6", growth: "+12%" },
  { name: "Fintech", value: 25, color: "#10b981", growth: "+8%" },
  { name: "AI/ML", value: 20, color: "#f59e0b", growth: "+25%" },
  { name: "E-commerce", value: 15, color: "#ef4444", growth: "+5%" },
  { name: "Others", value: 5, color: "#8b5cf6", growth: "+3%" }
];

const trendingTopics = [
  { topic: "Artificial Intelligence", mentions: 15420, change: "+23%" },
  { topic: "Sustainable Tech", mentions: 8930, change: "+45%" },
  { topic: "Remote Work", mentions: 6750, change: "-8%" },
  { topic: "Cryptocurrency", mentions: 12340, change: "+12%" },
  { topic: "Cybersecurity", mentions: 9870, change: "+18%" },
  { topic: "Healthcare Tech", mentions: 5460, change: "+31%" }
];

const MarketTrends = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trendData, setTrendData] = useState(generateTrendData());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTrendData(generateTrendData());
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 2000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };
  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-start sm:items-center">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-purple-600 flex-shrink-0" />
              <span className="truncate">AI Market Intelligence</span>
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
              Real-time market trends and AI-powered insights for startup founders
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Live Data</span>
              <span className="sm:hidden">Live</span>
            </Badge>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>      </div>

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="inline-flex h-auto w-auto p-1 bg-muted rounded-md">
          <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground">
            <Brain className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="hidden xs:inline">Insights</span>
          </TabsTrigger>
        </TabsList><TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Market Cap</p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">$2.4T</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" /> 
                      <span className="truncate">+12.3% this month</span>
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">New Startups</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-600">8,247</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" /> 
                      <span className="truncate">+5.7% this week</span>
                    </p>
                  </div>
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Funding Rounds</p>
                    <p className="text-lg sm:text-2xl font-bold text-purple-600">1,034</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1 flex-shrink-0" /> 
                      <span className="truncate">-2.1% this week</span>
                    </p>
                  </div>
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">AI Score</p>
                    <p className="text-lg sm:text-2xl font-bold text-orange-600">87.5</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" /> 
                      <span className="truncate">+4.2% confidence</span>
                    </p>
                  </div>
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <LineChart className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">Market Sentiment Trend</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  30-day sentiment analysis of startup ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsLineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">Market Segments</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Current market distribution by sector
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={marketSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={false}
                    >
                      {marketSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 sm:mt-4 space-y-2">
                  {marketSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div 
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="truncate">{segment.name}</span>
                      </div>
                      <Badge variant="outline" className={`ml-2 text-xs ${
                        segment.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {segment.growth}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>        <TabsContent value="news" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search market news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="ai">AI/ML</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {aiNewsData.map((news) => (
              <Card key={news.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">{news.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm line-clamp-3">
                        {news.summary}
                      </CardDescription>
                    </div>
                    <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 flex-shrink-0">
                      <Badge className={`text-xs ${getSentimentColor(news.sentiment)}`}>
                        {news.sentiment}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getImpactIcon(news.impact)}
                        <span className="text-xs text-gray-500 whitespace-nowrap">{news.impact} impact</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="truncate">Source: {news.source}</span>
                      <span className="whitespace-nowrap">{news.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="whitespace-nowrap">{news.relevance}% relevant</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>        <TabsContent value="trends" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Trending Topics</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Real-time analysis of trending topics in the startup ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid gap-3 sm:gap-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-gray-50/50">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs sm:text-sm font-medium text-blue-600 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{topic.topic}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{topic.mentions.toLocaleString()} mentions</p>
                      </div>
                    </div>
                    <Badge 
                      variant={topic.change.startsWith('+') ? 'default' : 'destructive'}
                      className="ml-2 text-xs flex-shrink-0"
                    >
                      {topic.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>        <TabsContent value="insights" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                  <span className="truncate">AI-Generated Market Insights</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Personalized recommendations based on current market trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2 text-sm sm:text-base">🚀 Opportunity Alert</h4>
                  <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                    AI/ML startups are experiencing unprecedented growth. Consider pivoting towards AI-enhanced solutions 
                    or exploring partnerships with AI companies to stay competitive.
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">💡 Strategic Insight</h4>
                  <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                    Sustainable tech funding has increased 45% this quarter. Environmental sustainability 
                    could be a key differentiator for your startup in 2025.
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2 text-sm sm:text-base">⚠️ Market Warning</h4>
                  <p className="text-xs sm:text-sm text-yellow-700 leading-relaxed">
                    Remote work tools market is showing signs of saturation. If your startup operates in this space, 
                    consider diversifying or finding new market segments.
                  </p>
                </div>
                
                <div className="p-3 sm:p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2 text-sm sm:text-base">🎯 Recommendation</h4>
                  <p className="text-xs sm:text-sm text-purple-700 leading-relaxed">
                    Based on current trends, cybersecurity and healthcare tech present the highest growth potential. 
                    Consider these sectors for your next funding round or product development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketTrends;
