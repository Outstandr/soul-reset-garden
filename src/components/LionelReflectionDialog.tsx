import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import lionelAvatar from "@/assets/lionel-x-avatar.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LionelReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: string[];
  onSubmit: (responses: string[]) => void;
  lessonTitle?: string;
}

export const LionelReflectionDialog = ({ 
  open, 
  onOpenChange, 
  questions,
  onSubmit,
  lessonTitle = "this lesson"
}: LionelReflectionDialogProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>(new Array(questions.length).fill(""));
  const [currentResponse, setCurrentResponse] = useState("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [lionelFeedback, setLionelFeedback] = useState("");

  const handleNext = async () => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = currentResponse;
    setResponses(newResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentResponse(newResponses[currentQuestionIndex + 1] || "");
    } else {
      // Get Lionel's feedback
      setIsLoadingFeedback(true);
      try {
        const { data, error } = await supabase.functions.invoke('lionel-reflection-feedback', {
          body: { 
            questions, 
            responses: newResponses,
            lessonTitle 
          }
        });

        if (error) throw error;
        
        setLionelFeedback(data.feedback);
        onSubmit(newResponses);
      } catch (error) {
        console.error('Error getting feedback:', error);
        toast({
          title: "Couldn't get feedback",
          description: "Your reflections were saved, but Lionel's feedback is unavailable.",
          variant: "destructive"
        });
        onOpenChange(false);
        resetDialog();
      } finally {
        setIsLoadingFeedback(false);
      }
    }
  };

  const resetDialog = () => {
    setCurrentQuestionIndex(0);
    setResponses(new Array(questions.length).fill(""));
    setCurrentResponse("");
    setLionelFeedback("");
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  const handleSkip = () => {
    handleClose();
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

        {isLoadingFeedback ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Lionel is reviewing your reflections...</p>
          </div>
        ) : lionelFeedback ? (
          <div className="space-y-6 py-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <p className="font-semibold text-foreground">Lionel's Feedback</p>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{lionelFeedback}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        ) : (
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
                    Get Lionel's Feedback
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
        )}
      </DialogContent>
    </Dialog>
  );
};
