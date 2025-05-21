
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

type LearningContent = {
  id: string;
  title: string;
  content: string;
  category: string;
  first_letter: string;
  created_at: string;
  updated_at: string;
};

interface ContentCardProps {
  content: LearningContent;
  onClick: () => void;
}

const ContentCard = ({ content, onClick }: ContentCardProps) => {
  // Create a preview by truncating the content
  const contentPreview = content.content.length > 120 
    ? content.content.substring(0, 120) + "..." 
    : content.content;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{content.title}</CardTitle>
        </div>
        <Badge variant="secondary" className="mt-2 self-start">
          {content.category}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{contentPreview}</p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline"
          className="w-full"
          onClick={onClick}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
