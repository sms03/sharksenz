import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LevelUpProps {
  open: boolean;
  onClose: () => void;
  level: number;
  levelName: string;
}

export function LevelUpAnimation({ open, onClose, level, levelName }: LevelUpProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Automatically complete animation after 5 seconds
  useEffect(() => {
    if (!open) {
      setAnimationComplete(false);
      return;
    }    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [open]);
  return (
    <>      {/* Render confetti outside of dialog to cover the entire screen */}
      {open && !animationComplete && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={300}
            recycle={true}
            gravity={0.25}
            tweenDuration={8000}
            colors={["#FFD700", "#38bdf8", "#34d399", "#f87171", "#c084fc", "#f97316", "#06b6d4"]}
          />
        </div>
      )}
      <Dialog open={open} onOpenChange={() => animationComplete && onClose()}>
        <DialogContent className="sm:max-w-md text-center">
        
        <DialogHeader className="flex flex-col items-center gap-1">
          <div className="animate-bounce rounded-full bg-yellow-50 p-4 mb-2">
            <Trophy className="h-10 w-10 text-yellow-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Level Up!
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-4xl font-bold text-shark-600">Level {level}</div>
          <div className="bg-gradient-to-r from-shark-500 to-shark-600 text-white px-4 py-2 rounded-md">
            {levelName}
          </div>
          <p className="text-muted-foreground text-center">
            Congratulations on reaching Level {level}! Keep learning to unlock more achievements.
          </p>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="w-32">
            Continue
          </Button>
        </div>      </DialogContent>
    </Dialog>
  </>
  );
}
