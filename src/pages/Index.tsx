
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, GraduationCap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
          Alpha Founder Academy
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          The essential knowledge hub for startup founders to learn, grow, and succeed.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/content">
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Comprehensive Content</CardTitle>
              <CardDescription>
                Access our A-Z library of founder knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Explore topics from fundraising to product-market fit, all organized in an easy-to-navigate format.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/content">Browse Library</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <GraduationCap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Track Your Progress</CardTitle>
              <CardDescription>
                Mark lessons as complete and take notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Keep track of what you've learned and maintain personal notes alongside each lesson.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Visualize your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                See your progress across different categories and identify areas for further improvement.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">View Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
