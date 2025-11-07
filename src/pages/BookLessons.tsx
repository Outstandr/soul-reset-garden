import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, Star, Flame, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BookLessonCard } from "@/components/BookLessonCard";

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
  const [currentStreak, setCurrentStreak] = useState(5);
  const [totalXP, setTotalXP] = useState(450);

  // Mock data - 20 lessons for "The Reset by Discipline" book
  const lessons: BookLesson[] = [
    {
      id: "lesson-1",
      lessonNumber: 1,
      title: "Understanding Discipline vs. Motivation",
      description: "Discover why discipline beats motivation every time and how to build it from scratch.",
      readingTime: "8 min",
      xp: 25,
      status: "completed",
      category: "concept",
      keyTakeaway: "Motivation is fleeting, discipline is forever"
    },
    {
      id: "lesson-2",
      lessonNumber: 2,
      title: "The Science of Habit Formation",
      description: "Learn the neuroscience behind building unbreakable habits and routines.",
      readingTime: "10 min",
      xp: 30,
      status: "completed",
      category: "concept",
      keyTakeaway: "Habits form neural pathways that become automatic"
    },
    {
      id: "lesson-3",
      lessonNumber: 3,
      title: "Your Discipline Identity",
      description: "Define who you want to become and align your actions with that identity.",
      readingTime: "12 min",
      xp: 35,
      status: "in-progress",
      category: "reflection",
      keyTakeaway: "You become what you consistently do"
    },
    {
      id: "lesson-4",
      lessonNumber: 4,
      title: "The 5 AM Advantage",
      description: "Why the world's most disciplined people start their day before sunrise.",
      readingTime: "9 min",
      xp: 30,
      status: "available",
      category: "practice",
      keyTakeaway: "Win the morning, win the day"
    },
    {
      id: "lesson-5",
      lessonNumber: 5,
      title: "Creating Your Non-Negotiables",
      description: "Establish the core daily actions that are absolutely non-negotiable.",
      readingTime: "11 min",
      xp: 35,
      status: "available",
      category: "exercise",
      keyTakeaway: "Non-negotiables create unshakeable structure"
    },
    {
      id: "lesson-6",
      lessonNumber: 6,
      title: "The Power of Micro-Commitments",
      description: "Start impossibly small and build momentum through tiny wins.",
      readingTime: "8 min",
      xp: 25,
      status: "locked",
      category: "concept",
      keyTakeaway: "2 minutes is better than 0 minutes"
    },
    {
      id: "lesson-7",
      lessonNumber: 7,
      title: "Tracking Your Transformation",
      description: "Measure what matters and watch your discipline compound over time.",
      readingTime: "10 min",
      xp: 30,
      status: "locked",
      category: "practice",
      keyTakeaway: "What gets measured gets improved"
    },
    {
      id: "lesson-8",
      lessonNumber: 8,
      title: "The Accountability System",
      description: "Build an external system that keeps you honest when willpower fails.",
      readingTime: "12 min",
      xp: 35,
      status: "locked",
      category: "exercise",
      keyTakeaway: "Accountability turns intentions into actions"
    },
    {
      id: "lesson-9",
      lessonNumber: 9,
      title: "Overcoming Resistance",
      description: "Recognize and defeat the internal voice that stops you from showing up.",
      readingTime: "13 min",
      xp: 40,
      status: "locked",
      category: "concept",
      keyTakeaway: "Resistance is strongest before breakthroughs"
    },
    {
      id: "lesson-10",
      lessonNumber: 10,
      title: "The 21-Day Reset Challenge",
      description: "Commit to 21 days of perfect execution to rewire your brain.",
      readingTime: "15 min",
      xp: 50,
      status: "locked",
      category: "practice",
      keyTakeaway: "21 days creates the foundation, 90 days makes it permanent"
    },
    {
      id: "lesson-11",
      lessonNumber: 11,
      title: "Energy Management 101",
      description: "Protect your energy like it's your most valuable resource—because it is.",
      readingTime: "11 min",
      xp: 35,
      status: "locked",
      category: "concept",
      keyTakeaway: "Discipline requires energy, manage it wisely"
    },
    {
      id: "lesson-12",
      lessonNumber: 12,
      title: "The Environment Advantage",
      description: "Design your physical space to make discipline effortless.",
      readingTime: "9 min",
      xp: 30,
      status: "locked",
      category: "exercise",
      keyTakeaway: "Your environment shapes your behavior"
    },
    {
      id: "lesson-13",
      lessonNumber: 13,
      title: "Saying No With Power",
      description: "Master the art of selective focus by eliminating distractions.",
      readingTime: "10 min",
      xp: 30,
      status: "locked",
      category: "practice",
      keyTakeaway: "Every yes to something is a no to something else"
    },
    {
      id: "lesson-14",
      lessonNumber: 14,
      title: "The Discipline Stack",
      description: "Layer multiple habits together to create unstoppable momentum.",
      readingTime: "12 min",
      xp: 35,
      status: "locked",
      category: "concept",
      keyTakeaway: "Stacked habits create compounding results"
    },
    {
      id: "lesson-15",
      lessonNumber: 15,
      title: "Recovery & Sustainability",
      description: "Build discipline that lasts decades, not just days.",
      readingTime: "14 min",
      xp: 40,
      status: "locked",
      category: "reflection",
      keyTakeaway: "Rest is part of the discipline process"
    },
    {
      id: "lesson-16",
      lessonNumber: 16,
      title: "The Identity Shift Protocol",
      description: "Permanently transform how you see yourself and what you believe is possible.",
      readingTime: "13 min",
      xp: 40,
      status: "locked",
      category: "exercise",
      keyTakeaway: "Change your identity, change your life"
    },
    {
      id: "lesson-17",
      lessonNumber: 17,
      title: "Discipline in Chaos",
      description: "Maintain your standards when life throws curveballs.",
      readingTime: "11 min",
      xp: 35,
      status: "locked",
      category: "practice",
      keyTakeaway: "True discipline shows up in adversity"
    },
    {
      id: "lesson-18",
      lessonNumber: 18,
      title: "The Performance Review",
      description: "Weekly self-assessment to course-correct and stay aligned.",
      readingTime: "10 min",
      xp: 30,
      status: "locked",
      category: "reflection",
      keyTakeaway: "Reflection prevents regression"
    },
    {
      id: "lesson-19",
      lessonNumber: 19,
      title: "Leveling Up Your Standards",
      description: "Raise the bar on what you consider acceptable behavior.",
      readingTime: "12 min",
      xp: 35,
      status: "locked",
      category: "concept",
      keyTakeaway: "Your standards determine your reality"
    },
    {
      id: "lesson-20",
      lessonNumber: 20,
      title: "The Discipline Mindset Forever",
      description: "Integrate everything and commit to lifelong mastery.",
      readingTime: "16 min",
      xp: 50,
      status: "locked",
      category: "reflection",
      keyTakeaway: "Discipline is not a destination, it's a way of life"
    }
  ];

  const completedLessons = lessons.filter(l => l.status === "completed").length;
  const progressPercent = (completedLessons / lessons.length) * 100;

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
                <span className="font-black text-orange-700">{currentStreak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-500">
                <Star className="w-5 h-5 text-amber-600" />
                <span className="font-black text-amber-700">{totalXP} XP</span>
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
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-muted-foreground">
                {completedLessons} of {lessons.length} Lessons Complete
              </span>
              <span className="text-sm font-black text-accent">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <BookLessonCard
              key={lesson.id}
              lesson={lesson}
              onStart={() => handleStartLesson(lesson.id)}
            />
          ))}
        </div>

        {/* Completion Badge (if all done) */}
        {completedLessons === lessons.length && (
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
