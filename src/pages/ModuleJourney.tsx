import { useState } from "react";
import { ArrowLeft, Star, Trophy, Flame, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonCard } from "@/components/LessonCard";
import { ProgressPath } from "@/components/ProgressPath";
import { AchievementBadge } from "@/components/AchievementBadge";
import { useNavigate } from "react-router-dom";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  status: "locked" | "available" | "in-progress" | "completed";
  type: "video" | "reading" | "exercise" | "quiz";
}

export default function ModuleJourney() {
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalXP, setTotalXP] = useState(450);
  const [level, setLevel] = useState(3);

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Welcome to Your Reset",
      description: "Understand the foundation of rhythm and why structure creates freedom",
      duration: "12 min",
      xp: 50,
      status: "completed",
      type: "video",
    },
    {
      id: "2",
      title: "Building Your Daily Rhythm",
      description: "Design your perfect morning routine that sets you up for success",
      duration: "15 min",
      xp: 75,
      status: "completed",
      type: "exercise",
    },
    {
      id: "3",
      title: "The Power of Structure",
      description: "Learn how intentional structure amplifies your natural energy",
      duration: "10 min",
      xp: 50,
      status: "in-progress",
      type: "reading",
    },
    {
      id: "4",
      title: "Time Blocking Mastery",
      description: "Transform your calendar into a tool for deep work and recovery",
      duration: "20 min",
      xp: 100,
      status: "available",
      type: "exercise",
    },
    {
      id: "5",
      title: "Rhythm Assessment",
      description: "Test your understanding and earn your Rhythm Master badge",
      duration: "8 min",
      xp: 150,
      status: "locked",
      type: "quiz",
    },
    {
      id: "6",
      title: "Your 30-Day Rhythm Challenge",
      description: "Put everything together with your personalized action plan",
      duration: "5 min",
      xp: 200,
      status: "locked",
      type: "exercise",
    },
  ];

  const achievements = [
    {
      id: "1",
      title: "First Step",
      description: "Complete your first lesson",
      icon: <Star className="w-6 h-6" />,
      earned: true,
      color: "reset-rhythm",
    },
    {
      id: "2",
      title: "Streak Starter",
      description: "7 days in a row",
      icon: <Flame className="w-6 h-6" />,
      earned: true,
      color: "reset-energy",
    },
    {
      id: "3",
      title: "Rhythm Builder",
      description: "Complete 50% of module",
      icon: <Target className="w-6 h-6" />,
      earned: false,
      color: "reset-systems",
    },
    {
      id: "4",
      title: "Rhythm Master",
      description: "Complete all lessons",
      icon: <Trophy className="w-6 h-6" />,
      earned: false,
      color: "gold",
    },
  ];

  const completedLessons = lessons.filter((l) => l.status === "completed").length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-20" />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Zap className="w-4 h-4 text-reset-rhythm/30" />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:text-reset-rhythm"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>

              <div className="flex items-center gap-6">
                {/* Streak Counter */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                  <Flame className="w-5 h-5 text-orange-500 animate-scale-pulse" />
                  <div>
                    <p className="text-xs text-gray-400">Daily Streak</p>
                    <p className="text-lg font-black text-white">{currentStreak} days</p>
                  </div>
                </div>

                {/* XP Counter */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-reset-rhythm/20 to-purple-500/20 px-4 py-2 rounded-full border border-reset-rhythm/30">
                  <Star className="w-5 h-5 text-reset-rhythm animate-scale-pulse" />
                  <div>
                    <p className="text-xs text-gray-400">Level {level}</p>
                    <p className="text-lg font-black text-white">{totalXP} XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Module Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-reset-rhythm/20 to-purple-500/20 rounded-full border border-reset-rhythm/30">
              <div className="text-4xl"></div>
              <span className="text-2xl font-black text-white">R - The Reset in You</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-4 gradient-text">
              Rhythm & Structure
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Build a foundation of daily rhythms that create freedom and momentum
            </p>

            {/* Progress Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 font-semibold">Your Progress</span>
                <span className="text-reset-rhythm font-black text-xl">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-4 bg-slate-800/50 rounded-full overflow-hidden border-2 border-reset-rhythm/30">
                <div
                  className="h-full bg-gradient-to-r from-reset-rhythm to-purple-500 transition-all duration-1000 relative overflow-hidden"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 animate-shimmer" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {completedLessons} of {lessons.length} lessons completed
              </p>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-gold animate-scale-pulse" />
              Your Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge key={achievement.id} {...achievement} />
              ))}
            </div>
          </div>

          {/* Visual Progress Path */}
          <div className="mb-12">
            <ProgressPath lessons={lessons} currentLesson={3} />
          </div>

          {/* Lessons Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6">Your Learning Path</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  lessonNumber={index + 1}
                  onStart={() => {
                    console.log("Starting lesson:", lesson.id);
                    // Navigate to lesson content
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
