
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AlphabetFilterProps {
  selectedLetter: string;
  onLetterClick: (letter: string) => void;
}

const AlphabetFilter = ({ selectedLetter, onLetterClick }: AlphabetFilterProps) => {
  const alphabet = ["all", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  
  return (
    <div className="flex flex-wrap gap-1 justify-center mb-6">
      {alphabet.map((letter) => (
        <Button
          key={letter}
          variant="outline"
          size="sm"
          className={cn(
            "min-w-[36px] h-8",
            letter.toLowerCase() === selectedLetter.toLowerCase() ? "bg-blue-100 border-blue-300 text-blue-700" : ""
          )}
          onClick={() => onLetterClick(letter)}
        >
          {letter === "all" ? "All" : letter}
        </Button>
      ))}
    </div>
  );
};

export default AlphabetFilter;
