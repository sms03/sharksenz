import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { businessTerms } from "../data/businessTerms";

export default function TermDetail() {
  const { termId } = useParams();
  const navigate = useNavigate();
  const term = businessTerms.find(t => t.id === Number(termId));
  if (!term) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-2xl py-24 text-center">
          <h1 className="font-heading mb-4 text-3xl font-bold">Term Not Found</h1>
          <Button onClick={() => navigate(-1)} className="font-body-merriweather">Go Back</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>      <div className="mx-auto max-w-2xl py-12">        <Card className="min-h-[500px]">
          <CardHeader className="h-[80px]">
            <CardTitle className="font-heading text-2xl mb-2 flex items-center gap-2">
              <term.icon className="h-7 w-7 text-shark-500" />
              {term.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="font-body-lora mb-4 text-lg text-muted-foreground line-clamp-3">{term.definition}</div>
            <div className="mb-4">
              <span className="font-subheading-libre font-semibold">Category:</span> <span className="font-body-merriweather">{term.category}</span>
            </div>
            <div className="mb-4">
              <span className="font-subheading-libre font-semibold">Difficulty:</span> <span className="font-body-merriweather">{term.difficultyLevel.charAt(0).toUpperCase() + term.difficultyLevel.slice(1)}</span>
            </div>
            {/* Example usage and use case sections */}
            <div className="mb-4">
              <span className="font-subheading-libre font-semibold">Usage:</span>
              <p className="font-body-merriweather mt-1 text-sm text-muted-foreground">
                {/* Placeholder usage example, can be customized per term */}
                {term.title} is commonly used in business analysis and financial reporting to assess company performance.
              </p>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Use Case:</span>
              <p className="mt-1 text-sm text-muted-foreground">
                {/* Placeholder use case, can be customized per term */}
                For example, a startup may calculate its {term.title.toLowerCase()} to present to investors during a funding round.
              </p>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Real World Example:</span>
              <p className="mt-1 text-sm text-muted-foreground">
                {term.realWorldExample}
              </p>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Other Information:</span>
              <p className="mt-1 text-sm text-muted-foreground">
                {term.otherInfo}
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>Back to Encyclopedia</Button>
        </div>
      </div>
    </MainLayout>
  );
}
