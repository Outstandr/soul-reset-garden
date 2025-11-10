import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, Star, Flame, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BookLessonCard } from "@/components/BookLessonCard";
import { useBookProgress } from "@/hooks/useBookProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

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

  // Fallback static lessons
  const fallbackLessons = [
    { id: "1", lessonNumber: 1, title: "Understanding Discipline vs. Motivation", description: "Discover why discipline beats motivation every time.", readingTime: "8 min", xp: 25, category: "concept" as const, keyTakeaway: "Motivation is fleeting, discipline is forever" },
    { id: "2", lessonNumber: 2, title: "The Science of Habit Formation", description: "Learn the neuroscience behind building unbreakable habits.", readingTime: "10 min", xp: 30, category: "concept" as const, keyTakeaway: "Habits form neural pathways" },
    { id: "3", lessonNumber: 3, title: "Your Discipline Identity", description: "Define who you want to become and align your actions.", readingTime: "12 min", xp: 35, category: "reflection" as const, keyTakeaway: "You become what you consistently do" },
    { id: "4", lessonNumber: 4, title: "The 5 AM Advantage", description: "Why the world's most disciplined people start before sunrise.", readingTime: "9 min", xp: 30, category: "practice" as const, keyTakeaway: "Win the morning, win the day" },
    { id: "5", lessonNumber: 5, title: "Creating Your Non-Negotiables", description: "Establish the core daily actions that are non-negotiable.", readingTime: "11 min", xp: 35, category: "exercise" as const, keyTakeaway: "Structure creates freedom" },
  ];

  // Map database lessons to display format
  const lessons: BookLesson[] = useMemo(() => {
    if (dbLessons.length > 0) {
      return dbLessons.map((dbLesson, index) => ({
        id: dbLesson.id,
        lessonNumber: dbLesson.lesson_number,
        title: dbLesson.title,
        description: dbLesson.description || "",
        readingTime: `${Math.ceil((Number(dbLesson.video_end_time?.split(':')[0]) * 60 + Number(dbLesson.video_end_time?.split(':')[1])) / 60)} min`,
        xp: 25 + (index * 5),
        status: getLessonStatus(index),
        category: (dbLesson.interactive_type === "none" ? "concept" : dbLesson.interactive_type) as any,
        keyTakeaway: dbLesson.description || "Key lesson insights",
      }));
    }
    
    // Use fallback lessons with dynamic status
    return fallbackLessons.map((lesson, index) => ({
      ...lesson,
      status: getLessonStatus(index),
    }));
  }, [dbLessons, getLessonStatus]);

  const completedLessons = getCompletedCount();
  const progressPercent = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

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
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-500">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="font-black text-orange-700">Track your streak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-500">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="font-black text-amber-700">{completedLessons * 25} XP</span>
              </div>
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
            Master the art of self-discipline through 20 transformative lessons. Each lesson is a building block in your journey to becoming unstoppable.
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
    </div>
  );
}
