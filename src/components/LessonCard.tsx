import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen, Dumbbell, CheckCircle, Lock, Star } from "lucide-react";
import { ReactNode } from "react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  status: "locked" | "available" | "in-progress" | "completed";
  type: "video" | "reading" | "exercise" | "quiz";
}

interface LessonCardProps {
  lesson: Lesson;
  lessonNumber: number;
  onStart: () => void;
}

const typeIcons: Record<string, ReactNode> = {
  video: <PlayCircle className="w-5 h-5" />,
  reading: <BookOpen className="w-5 h-5" />,
  exercise: <Dumbbell className="w-5 h-5" />,
  quiz: <Star className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  video: "reset-energy",
  reading: "reset-rhythm",
  exercise: "reset-execution",
  quiz: "gold",
};

export const LessonCard = ({ lesson, lessonNumber, onStart }: LessonCardProps) => {
  const isLocked = lesson.status === "locked";
  const isCompleted = lesson.status === "completed";
  const isInProgress = lesson.status === "in-progress";
  const color = typeColors[lesson.type];

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover-lift border-2 ${
        isCompleted
          ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30"
          : isInProgress
          ? "bg-gradient-to-br from-reset-rhythm/10 to-purple-500/10 border-reset-rhythm/50 animate-glow-border"
          : isLocked
          ? "bg-slate-900/30 border-slate-700/30 opacity-60 grayscale"
          : "bg-slate-900/50 border-slate-700/50 hover:border-reset-rhythm/50"
      }`}
    >
      {/* Lesson Number Badge */}
      <div
        className={`absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-xl font-black border-4 ${
          isCompleted
            ? "bg-green-500 border-green-400 text-white"
            : isInProgress
            ? "bg-reset-rhythm border-purple-500 text-white animate-scale-pulse"
            : isLocked
            ? "bg-slate-700 border-slate-600 text-slate-500"
            : "bg-slate-800 border-slate-700 text-white"
        }`}
      >
        {isCompleted ? "" : lessonNumber}
      </div>

      {/* XP Badge */}
      <div
        className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-black ${
          isLocked
            ? "bg-slate-700/50 text-slate-500"
            : "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30"
        }`}
      >
        <Star className="w-4 h-4" />
        {lesson.xp} XP
      </div>

      {/* Shimmer effect for in-progress */}
      {isInProgress && (
        <div
          className="absolute inset-0 opacity-30 animate-gradient"
          style={{
            background: `linear-gradient(135deg, hsl(var(--${color})) 0%, transparent 100%)`,
          }}
        />
      )}

      <div className="p-6 pt-10 relative">
        {/* Type Icon */}
        <div
          className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-sm font-bold ${
            isLocked
              ? "bg-slate-700/50 text-slate-400"
              : `bg-gradient-to-r from-${color}/20 to-${color}/10 border border-${color}/30`
          }`}
          style={
            !isLocked
              ? {
                  backgroundColor: `hsl(var(--${color}) / 0.2)`,
                  borderColor: `hsl(var(--${color}) / 0.3)`,
                  color: `hsl(var(--${color}))`,
                }
              : undefined
          }
        >
          {typeIcons[lesson.type]}
          <span className="capitalize">{lesson.type}</span>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-reset-rhythm transition-colors">
          {lesson.title}
        </h3>
        <p className="text-gray-400 mb-4 leading-relaxed">{lesson.description}</p>

        {/* Duration */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500 font-semibold">{lesson.duration}</span>
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-500 font-bold">
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
            Review Lesson
          </Button>
        )}

        {isInProgress && (
          <Button
            variant="hero"
            className="w-full text-base py-5 font-black shadow-neon animate-scale-pulse"
            onClick={onStart}
          >
            Continue Learning
          </Button>
        )}

        {lesson.status === "available" && (
          <Button
            variant="journey"
            className="w-full text-base py-5 font-black"
            onClick={onStart}
          >
            Start Lesson
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
