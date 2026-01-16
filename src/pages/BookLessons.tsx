import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, Star, Flame, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BookLessonCard } from "@/components/BookLessonCard";
import { useBookProgress } from "@/hooks/useBookProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { StreakDialog } from "@/components/StreakDialog";
import { XPDetailsDialog } from "@/components/XPDetailsDialog";

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

export default function BookLessons() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { progress, isLoading, getLessonStatus, getCompletedCount } = useBookProgress("Book: Reset by Discipline");
  const [dbLessons, setDbLessons] = useState<any[]>([]);
  const [showStreakDialog, setShowStreakDialog] = useState(false);
  const [showXPDialog, setShowXPDialog] = useState(false);

  useEffect(() => {
    fetchLessonsFromDB();
  }, []);

  const fetchLessonsFromDB = async () => {
    const { data, error } = await supabase
      .from("masterclass_lessons")
      .select("*")
      .eq("module_name", "Book: Reset by Discipline")
      .order("lesson_number");

    if (error) {
      console.error("Error fetching lessons:", error);
      return;
    }

    setDbLessons(data || []);
  };

  // Fallback static lessons (all 20)
  const fallbackLessons = [
    { id: "1", lessonNumber: 1, title: "Understanding Discipline vs. Motivation", description: "Discover why discipline beats motivation every time and how to build it from scratch.", readingTime: "8 min", xp: 25, category: "concept" as const, keyTakeaway: "Motivation is fleeting, discipline is forever" },
    { id: "2", lessonNumber: 2, title: "The Science of Habit Formation", description: "Learn the neuroscience behind building unbreakable habits and routines.", readingTime: "10 min", xp: 30, category: "concept" as const, keyTakeaway: "Habits form neural pathways that become automatic" },
    { id: "3", lessonNumber: 3, title: "Your Discipline Identity", description: "Define who you want to become and align your actions with that identity.", readingTime: "12 min", xp: 35, category: "reflection" as const, keyTakeaway: "You become what you consistently do" },
    { id: "4", lessonNumber: 4, title: "The 5 AM Advantage", description: "Why the world's most disciplined people start their day before sunrise.", readingTime: "9 min", xp: 30, category: "practice" as const, keyTakeaway: "Win the morning, win the day" },
    { id: "5", lessonNumber: 5, title: "Creating Your Non-Negotiables", description: "Establish the core daily actions that are absolutely non-negotiable.", readingTime: "11 min", xp: 35, category: "exercise" as const, keyTakeaway: "Non-negotiables create unshakeable structure" },
    { id: "6", lessonNumber: 6, title: "The Power of Micro-Commitments", description: "Start impossibly small and build momentum through tiny wins.", readingTime: "8 min", xp: 25, category: "concept" as const, keyTakeaway: "2 minutes is better than 0 minutes" },
    { id: "7", lessonNumber: 7, title: "Tracking Your Transformation", description: "Measure what matters and watch your discipline compound over time.", readingTime: "10 min", xp: 30, category: "practice" as const, keyTakeaway: "What gets measured gets improved" },
    { id: "8", lessonNumber: 8, title: "The Accountability System", description: "Build an external system that keeps you honest when willpower fails.", readingTime: "12 min", xp: 35, category: "exercise" as const, keyTakeaway: "Accountability turns intentions into actions" },
    { id: "9", lessonNumber: 9, title: "Overcoming Resistance", description: "Recognize and defeat the internal voice that stops you from showing up.", readingTime: "13 min", xp: 40, category: "concept" as const, keyTakeaway: "Resistance is strongest before breakthroughs" },
    { id: "10", lessonNumber: 10, title: "The 21-Day Reset Challenge", description: "Commit to 21 days of perfect execution to rewire your brain.", readingTime: "15 min", xp: 50, category: "practice" as const, keyTakeaway: "21 days creates the foundation, 90 days makes it permanent" },
    { id: "11", lessonNumber: 11, title: "Energy Management 101", description: "Protect your energy like it's your most valuable resource—because it is.", readingTime: "11 min", xp: 35, category: "concept" as const, keyTakeaway: "Discipline requires energy, manage it wisely" },
    { id: "12", lessonNumber: 12, title: "The Environment Advantage", description: "Design your physical space to make discipline effortless.", readingTime: "9 min", xp: 30, category: "exercise" as const, keyTakeaway: "Your environment shapes your behavior" },
    { id: "13", lessonNumber: 13, title: "Saying No With Power", description: "Master the art of selective focus by eliminating distractions.", readingTime: "10 min", xp: 30, category: "practice" as const, keyTakeaway: "Every yes to something is a no to something else" },
    { id: "14", lessonNumber: 14, title: "The Discipline Stack", description: "Layer multiple habits together to create unstoppable momentum.", readingTime: "12 min", xp: 35, category: "concept" as const, keyTakeaway: "Stacked habits create compounding results" },
    { id: "15", lessonNumber: 15, title: "Recovery & Sustainability", description: "Build discipline that lasts decades, not just days.", readingTime: "14 min", xp: 40, category: "reflection" as const, keyTakeaway: "Rest is part of the discipline process" },
    { id: "16", lessonNumber: 16, title: "The Identity Shift Protocol", description: "Permanently transform how you see yourself and what you believe is possible.", readingTime: "13 min", xp: 40, category: "exercise" as const, keyTakeaway: "Change your identity, change your life" },
    { id: "17", lessonNumber: 17, title: "Discipline in Chaos", description: "Maintain your standards when life throws curveballs.", readingTime: "11 min", xp: 35, category: "practice" as const, keyTakeaway: "True discipline shows up in adversity" },
    { id: "18", lessonNumber: 18, title: "The Performance Review", description: "Weekly self-assessment to course-correct and stay aligned.", readingTime: "10 min", xp: 30, category: "reflection" as const, keyTakeaway: "Reflection prevents regression" },
    { id: "19", lessonNumber: 19, title: "Leveling Up Your Standards", description: "Raise the bar on what you consider acceptable behavior.", readingTime: "12 min", xp: 35, category: "concept" as const, keyTakeaway: "Your standards determine your reality" },
    { id: "20", lessonNumber: 20, title: "The Discipline Mindset Forever", description: "Integrate everything and commit to lifelong mastery.", readingTime: "16 min", xp: 50, category: "reflection" as const, keyTakeaway: "Discipline is not a destination, it's a way of life" },
  ];

  const completedLessons = getCompletedCount();

  // Map database lessons to display format
  const lessons: BookLesson[] = useMemo(() => {
    if (dbLessons.length > 0) {
      return dbLessons.map((dbLesson, index) => {
        const fallback = fallbackLessons[index];
        const lessonProgress = progress[index];
        
        // Determine status based on progress
        let status: BookLesson["status"] = "locked";
        if (lessonProgress?.completed) {
          status = "completed";
        } else if (lessonProgress && lessonProgress.videoProgress > 0) {
          status = "in-progress";
        } else if (completedLessons >= index) {
          status = "available";
        }
        
        return {
          id: dbLesson.id,
          lessonNumber: dbLesson.lesson_number,
          title: dbLesson.title,
          description: dbLesson.description || "",
          readingTime: fallback?.readingTime || "10 min",
          xp: fallback?.xp || (25 + (index * 5)),
          status,
          category: (dbLesson.interactive_type === "none" ? "concept" : dbLesson.interactive_type) as any,
          keyTakeaway: fallback?.keyTakeaway || "Master this lesson to progress",
        };
      });
    }
    
    // Use fallback lessons with dynamic status based on user progress
    return fallbackLessons.map((lesson, index) => ({
      ...lesson,
      status: getLessonStatus(index),
    }));
  }, [dbLessons, progress, completedLessons, getLessonStatus]);

  const progressPercent = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
  
  // Calculate actual total XP from completed lessons
  const totalXP = useMemo(() => {
    return lessons
      .filter(lesson => lesson.status === "completed")
      .reduce((sum, lesson) => sum + lesson.xp, 0);
  }, [lessons]);

  const handleStartLesson = (lessonId: string) => {
    navigate(`/book-lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-reset-energy/10 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-reset-systems/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <div className="relative z-10 border-b border-border bg-card/95 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => setShowStreakDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-500 hover:from-orange-200 hover:to-red-200 transition-all"
              >
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="font-black text-orange-700">Track your streak</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowXPDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-500 hover:from-amber-200 hover:to-yellow-200 transition-all"
              >
                <Star className="w-5 h-5 text-amber-600" />
                <span className="font-black text-amber-700">{totalXP} XP</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Book Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-primary">
            <Book className="w-6 h-6 text-primary" />
            <span className="font-black text-primary">BOOK</span>
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            The Reset by Discipline
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Master the art of self-discipline through {lessons.length} transformative lessons. Each lesson is a building block in your journey to becoming unstoppable.
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-muted-foreground">
                    {completedLessons} of {lessons.length} Lessons Complete
                  </span>
                  <span className="text-sm font-black text-accent">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </>
            )}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))
          ) : lessons.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground text-lg">No lessons found. Please check back later.</p>
            </div>
          ) : (
            lessons.map((lesson) => (
              <BookLessonCard
                key={lesson.id}
                lesson={lesson}
                onStart={() => handleStartLesson(lesson.id)}
              />
            ))
          )}
        </div>

        {/* Completion Badge (if all done) */}
        {completedLessons === lessons.length && lessons.length > 0 && (
          <div className="mt-16 text-center animate-scale-in">
            <div className="inline-flex flex-col items-center gap-4 px-12 py-8 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-accent">
              <Trophy className="w-16 h-16 text-accent" />
              <h3 className="text-3xl font-black text-accent">Book Complete!</h3>
              <p className="text-muted-foreground">You've mastered all 20 lessons. Ready for the Masterclass?</p>
              <Button
                variant="hero"
                onClick={() => navigate("/journey/reset-discipline")}
                className="mt-4"
              >
                Start Elite Masterclass →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <StreakDialog open={showStreakDialog} onOpenChange={setShowStreakDialog} />
      <XPDetailsDialog open={showXPDialog} onOpenChange={setShowXPDialog} />
    </div>
  );
}
