
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface AlphabetFilterProps {
  selectedLetter: string;
  onLetterClick: (letter: string) => void;
}

const AlphabetFilter = ({ selectedLetter, onLetterClick }: AlphabetFilterProps) => {
  const alphabet = ["all", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const filterRef = useRef<HTMLDivElement>(null);
  
  // GSAP animations
  useEffect(() => {
    const filterElement = filterRef.current;
    
    if (filterElement) {
      gsap.from(filterElement.querySelectorAll("button"), {
        scale: 0.95,
        opacity: 0,
        stagger: 0.01,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  }, []);
  
  return (
    <div className="flex flex-wrap gap-1 justify-center mb-6" ref={filterRef}>
      {alphabet.map((letter) => {
        const isSelected = letter.toLowerCase() === selectedLetter.toLowerCase();
        
        return (
          <Button
            key={letter}
            variant="outline"
            size="sm"
            className={cn(
              "min-w-[36px] h-8 transition-all duration-200",
              isSelected ? "bg-blue-100 border-blue-300 text-blue-700" : ""
            )}
            onClick={() => {
              // Animate the click
              if (isSelected) return;
              
              const button = document.activeElement as HTMLButtonElement;
              if (button) {
                gsap.fromTo(button, 
                  { scale: 0.9 }, 
                  { scale: 1, duration: 0.3, ease: "back.out" }
                );
              }
              
              onLetterClick(letter);
            }}
          >
            {letter === "all" ? "All" : letter}
          </Button>
        );
      })}
    </div>
  );
};

export default AlphabetFilter;
