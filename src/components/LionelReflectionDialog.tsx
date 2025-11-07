import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import lionelAvatar from "@/assets/lionel-x-avatar.png";

interface LionelReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: string[];
  onSubmit: (responses: string[]) => void;
}

export const LionelReflectionDialog = ({ 
  open, 
  onOpenChange, 
  questions,
  onSubmit 
}: LionelReflectionDialogProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>(new Array(questions.length).fill(""));
  const [currentResponse, setCurrentResponse] = useState("");

  const handleNext = () => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = currentResponse;
    setResponses(newResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentResponse(newResponses[currentQuestionIndex + 1] || "");
    } else {
      onSubmit(newResponses);
      onOpenChange(false);
      // Reset for next time
      setCurrentQuestionIndex(0);
      setResponses(new Array(questions.length).fill(""));
      setCurrentResponse("");
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    setCurrentQuestionIndex(0);
    setResponses(new Array(questions.length).fill(""));
    setCurrentResponse("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-2 border-primary/30">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={lionelAvatar} alt="Lionel X" />
              <AvatarFallback>LX</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-black">Lionel X</DialogTitle>
              <p className="text-sm text-muted-foreground">Your Personal Coach</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <p className="font-semibold text-foreground leading-relaxed">
                  {questions[currentQuestionIndex]}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              className="min-h-[150px] bg-background border-input"
              autoFocus
            />
          </div>

          <div className="flex gap-3 justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentResponse.trim()}
              className="gap-2"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>Next Question</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Reflections
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-1 justify-center">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-colors ${
                  idx === currentQuestionIndex
                    ? "bg-primary"
                    : idx < currentQuestionIndex
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
