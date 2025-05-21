
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import gsap from "gsap";

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
  index?: number;
}

const ContentCard = ({ content, onClick, index = 0 }: ContentCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Create a preview by truncating the content
  const contentPreview = content.content.length > 120 
    ? content.content.substring(0, 120) + "..." 
    : content.content;
  
  // GSAP animations
  useEffect(() => {
    // Only animate cards that are visible in viewport
    const card = cardRef.current;
    
    if (card) {
      gsap.fromTo(card, 
        { 
          y: 30, 
          opacity: 0,
        },
        { 
          y: 0, 
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          delay: index * 0.1, // Stagger effect based on index
        }
      );

      // Hover animation setup
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -5,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
    
    return () => {
      if (card) {
        card.removeEventListener("mouseenter", () => {});
        card.removeEventListener("mouseleave", () => {});
      }
    };
  }, [index]);
  
  return (
    <Card className="h-full flex flex-col" ref={cardRef}>
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
