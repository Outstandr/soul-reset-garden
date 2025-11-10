import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle2, Sparkles } from "lucide-react";

interface LessonCompletionDialogProps {
  open: boolean;
  onContinue: () => void;
  pillarType: "physical" | "mental" | "spiritual";
  lessonTitle: string;
}

const pillarStyles = {
  physical: {
    gradient: "from-green-500 via-emerald-500 to-green-600",
    bg: "bg-green-500/10",
    border: "border-green-500/50",
    text: "text-green-500",
    shadow: "shadow-green-500/50"
  },
  mental: {
    gradient: "from-purple-500 via-violet-500 to-purple-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/50",
    text: "text-purple-500",
    shadow: "shadow-purple-500/50"
  },
  spiritual: {
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/50",
    text: "text-blue-500",
    shadow: "shadow-blue-500/50"
  }
};

export function LessonCompletionDialog({ open, onContinue, pillarType, lessonTitle }: LessonCompletionDialogProps) {
  const styles = pillarStyles[pillarType];

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className={`!bg-black border-2 ${styles.border} max-w-md shadow-2xl ${styles.shadow}`}>
        <AlertDialogHeader className="space-y-4">
          <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${styles.gradient} flex items-center justify-center animate-bounce-slow shadow-lg ${styles.shadow}`}>
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-black">
            <span className={`bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`}>
              Lesson Complete!
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base space-y-2">
            <p className="font-semibold text-white">
              Great work completing "{lessonTitle}"!
            </p>
            <p className="text-white/80">
              You're one step closer to mastering your {pillarType} pillar.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction 
            onClick={onContinue}
            className={`bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white px-8 py-6 text-lg font-bold shadow-lg ${styles.shadow} transition-all hover:scale-105`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
