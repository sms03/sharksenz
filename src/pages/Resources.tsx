import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calculator, Users, Download, ExternalLink, BookOpen, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const templates = [
    {
      title: "Pitch Deck Template",
      description: "Professional pitch deck template with investor-tested slides",
      icon: FileText,
      downloadUrl: "/templates/pitch-deck-template.pptx",
      category: "Pitch & Fundraising"
    },
    {
      title: "Financial Model Template",
      description: "3-year financial projection spreadsheet with built-in formulas",
      icon: Calculator,
      downloadUrl: "/templates/financial-model-template.xlsx",
      category: "Financial Planning"
    },
    {
      title: "Co-founder Agreement",
      description: "Legal template for defining roles and equity splits",
      icon: Users,
      downloadUrl: "/templates/cofounder-agreement-template.docx",
      category: "Legal Documents"
    },
    {
      title: "Market Research Template",
      description: "Comprehensive template for validating your market opportunity",
      icon: TrendingUp,
      downloadUrl: "/templates/market-research-template.docx",
      category: "Market Analysis"
    },
    {
      title: "Pricing Strategy Worksheet",
      description: "Calculate optimal pricing based on value and competition",
      icon: DollarSign,
      downloadUrl: "/templates/pricing-strategy-worksheet.xlsx",
      category: "Business Strategy"
    },
    {
      title: "Business Model Canvas",
      description: "Visual template for mapping out your business model",
      icon: BookOpen,
      downloadUrl: "/templates/business-model-canvas.pdf",
      category: "Business Planning"
    }
  ];

  const externalResources = [
    {
      title: "Startup Legal Guide",
      description: "Comprehensive guide to legal considerations for startups",
      url: "https://www.clerky.com/help/startup-legal-guide",
      icon: FileText
    },
    {
      title: "YC Startup School",
      description: "Free online course covering startup fundamentals",
      url: "https://www.startupschool.org/",
      icon: BookOpen
    },
    {
      title: "First Round Review",
      description: "In-depth articles on startup strategy and growth",
      url: "https://review.firstround.com/",
      icon: TrendingUp
    },
    {
      title: "AngelList Salary Data",
      description: "Market data for startup compensation and equity",
      url: "https://angel.co/salaries",
      icon: DollarSign
    }
  ];

  const categories = ["All", "Pitch & Fundraising", "Financial Planning", "Legal Documents", "Market Analysis", "Business Strategy", "Business Planning"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Founder Resources Hub
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Templates, tools, and resources to accelerate your startup journey. Everything you need to build, pitch, and scale your business.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="transition-all duration-200"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Templates & Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border border-blue-100">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mr-3">
                      <template.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full group"
                    asChild
                  >
                    <a href={template.downloadUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* External Resources Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Recommended Reading</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {externalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border border-blue-100">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center mr-3">
                      <resource.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline"
                    className="w-full group"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Resource
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Need More Guidance?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our AI coach provides personalized recommendations and connects these resources to your specific business metrics and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-900 hover:bg-blue-50"
              asChild
            >
              <Link to="/analytics">Try AI Coach</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/pricing">Upgrade for More Templates</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;
