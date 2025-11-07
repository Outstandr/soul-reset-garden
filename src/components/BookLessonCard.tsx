import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Lock, Star, Lightbulb } from "lucide-react";

interface BookLesson {
  id: string;
  lessonNumber: number;
  title: string;
  description: string;
  readingTime: string;
  xp: number;
  status: "locked" | "available" | "in-progress" | "completed";
  category: "concept" | "practice" | "reflection" | "exercise";
  keyTakeaway: string;
}

interface BookLessonCardProps {
  lesson: BookLesson;
  onStart: () => void;
}

const categoryColors = {
  concept: { bg: "from-blue-100 to-cyan-100", border: "border-primary", text: "text-primary", icon: "bg-primary/20" },
  practice: { bg: "from-green-100 to-emerald-100", border: "border-accent", text: "text-accent", icon: "bg-accent/20" },
  reflection: { bg: "from-purple-100 to-pink-100", border: "border-secondary", text: "text-secondary", icon: "bg-secondary/20" },
  exercise: { bg: "from-orange-100 to-red-100", border: "border-orange-500", text: "text-orange-600", icon: "bg-orange-500/20" },
};

export const BookLessonCard = ({ lesson, onStart }: BookLessonCardProps) => {
  const isLocked = lesson.status === "locked";
  const isCompleted = lesson.status === "completed";
  const isInProgress = lesson.status === "in-progress";
  const colors = categoryColors[lesson.category];

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover-lift border-2 ${
        isCompleted
          ? "bg-gradient-to-br from-green-100 to-emerald-100 border-accent"
          : isInProgress
          ? `bg-gradient-to-br ${colors.bg} ${colors.border} animate-glow-border`
          : isLocked
          ? "bg-muted/50 border-border opacity-60 grayscale"
          : `bg-card border-border hover:${colors.border}`
      }`}
    >
      {/* Lesson Number Badge */}
      <div
        className={`absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-4 ${
          isCompleted
            ? "bg-accent border-accent/70 text-white"
            : isInProgress
            ? `bg-gradient-to-br ${colors.bg} ${colors.border} ${colors.text} animate-scale-pulse`
            : isLocked
            ? "bg-muted border-border text-muted-foreground"
            : "bg-card border-border text-foreground"
        }`}
      >
        {isCompleted ? "✓" : lesson.lessonNumber}
      </div>

      {/* XP Badge */}
      <div
        className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black ${
          isLocked
            ? "bg-muted/50 text-muted-foreground"
            : "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-2 border-amber-400"
        }`}
      >
        <Star className="w-4 h-4" />
        {lesson.xp} XP
      </div>

      <div className="p-6 pt-10 relative">
        {/* Category Badge */}
        <div
          className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-sm font-bold ${
            isLocked
              ? "bg-muted text-muted-foreground"
              : `${colors.icon} ${colors.text} border-2 ${colors.border}`
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="capitalize">{lesson.category}</span>
        </div>

        {/* Title & Description */}
        <h3 className={`text-xl font-black mb-3 transition-colors ${
          isLocked ? "text-muted-foreground" : "text-foreground group-hover:text-accent"
        }`}>
          {lesson.title}
        </h3>
        <p className={`mb-4 leading-relaxed ${isLocked ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
          {lesson.description}
        </p>

        {/* Key Takeaway */}
        {!isLocked && (
          <div className={`mb-4 p-3 rounded-lg ${colors.icon} border-2 ${colors.border}`}>
            <div className="flex items-start gap-2">
              <Lightbulb className={`w-4 h-4 mt-0.5 ${colors.text}`} />
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">KEY TAKEAWAY</p>
                <p className={`text-sm font-semibold ${colors.text}`}>
                  {lesson.keyTakeaway}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reading Time */}
        <div className="flex items-center justify-between mb-6">
          <span className={`text-sm font-semibold ${isLocked ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
            ⏱️ {lesson.readingTime}
          </span>
          {isCompleted && (
            <div className="flex items-center gap-2 text-accent font-bold">
              <CheckCircle className="w-5 h-5" />
              Completed
            </div>
          )}
        </div>

        {/* Action Button */}
        {isCompleted && (
          <Button
            variant="zen"
            className="w-full text-base py-5 font-black"
            onClick={onStart}
          >
            ♻️ Review Lesson
          </Button>
        )}

        {isInProgress && (
          <Button
            variant="hero"
            className="w-full text-base py-5 font-black shadow-neon animate-scale-pulse"
            onClick={onStart}
          >
            ▶️ Continue Reading
          </Button>
        )}

        {lesson.status === "available" && (
          <Button
            variant="journey"
            className="w-full text-base py-5 font-black"
            onClick={onStart}
          >
            📖 Start Lesson
          </Button>
        )}

        {isLocked && (
          <Button variant="ghost" className="w-full text-base py-5 font-bold" disabled>
            <Lock className="w-4 h-4 mr-2" />
            Complete Previous Lessons
          </Button>
        )}
      </div>
    </Card>
  );
};
