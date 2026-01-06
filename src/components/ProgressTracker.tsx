import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle2, Circle, Trophy, Flame, Target, 
  TrendingUp, Calendar, Dumbbell, Utensils, BookOpen
} from "lucide-react";
import { motion } from "framer-motion";

interface WeeklyProgress {
  week: number;
  dietCompleted: number;
  dietTotal: number;
  trainingCompleted: number;
  trainingTotal: number;
  lessonsCompleted: number;
  lessonsTotal: number;
}

interface ProgressTrackerProps {
  embedded?: boolean;
}

export const ProgressTracker = ({ embedded = false }: ProgressTrackerProps) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get lessons completed
      const { data: progressData } = await supabase
        .from('user_lesson_progress')
        .select('completed, completed_at')
        .eq('user_id', user.id);

      const completed = progressData?.filter(p => p.completed).length || 0;
      setLessonsCompleted(completed);

      // Get total lessons
      const { count } = await supabase
        .from('masterclass_lessons')
        .select('*', { count: 'exact', head: true });
      
      setTotalLessons(count || 0);

      // Get current streak
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('streak_date, lessons_completed')
        .eq('user_id', user.id)
        .order('streak_date', { ascending: false })
        .limit(30);

      if (streakData && streakData.length > 0) {
        // Calculate streak
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < streakData.length; i++) {
          const streakDate = new Date(streakData[i].streak_date);
          streakDate.setHours(0, 0, 0, 0);
          
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          
          if (streakDate.getTime() === expectedDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }
        setCurrentStreak(streak);
      }

      // Build weekly progress (simulated based on completed lessons)
      const weeks: WeeklyProgress[] = [];
      for (let w = 1; w <= 4; w++) {
        weeks.push({
          week: w,
          dietCompleted: Math.min(7, Math.floor(completed / 4) + (w <= Math.ceil(completed / 7) ? 7 : 0)),
          dietTotal: 7,
          trainingCompleted: Math.min(w <= 2 ? completed : Math.floor(completed * 0.8), 5),
          trainingTotal: 5,
          lessonsCompleted: Math.min(Math.floor(completed / 4) + (w === 1 ? completed % 4 : 0), 4),
          lessonsTotal: 4,
        });
      }
      setWeeklyProgress(weeks.slice(0, 4));

    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const overallProgress = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <Card className={embedded ? "border-0 shadow-none" : "glass-effect"}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-20 bg-muted rounded w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={embedded ? "" : "space-y-4"}>
      {/* Main Progress Card */}
      <Card className={embedded ? "border-0 shadow-none bg-transparent" : "glass-effect"}>
        <CardHeader className={embedded ? "px-0 pt-0" : ""}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Progress
            </CardTitle>
            {currentStreak > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                {currentStreak} day streak
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className={embedded ? "px-0" : ""}>
          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Course Progress</span>
              <span className="font-semibold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {lessonsCompleted} of {totalLessons} lessons completed
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div 
              className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20"
              whileHover={{ scale: 1.02 }}
            >
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{lessonsCompleted}</div>
              <div className="text-xs text-muted-foreground">Lessons</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 rounded-lg bg-green-500/5 border border-green-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <Trophy className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 rounded-lg bg-amber-500/5 border border-amber-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <Target className="w-6 h-6 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </motion.div>
          </div>

          {/* Weekly Milestones */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Weekly Milestones
            </h4>
            <div className="space-y-2">
              {weeklyProgress.map((week, index) => {
                const weekComplete = week.lessonsCompleted >= week.lessonsTotal;
                return (
                  <motion.div 
                    key={week.week}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${weekComplete ? 'bg-green-500/5 border-green-500/30' : 'bg-muted/30 border-border'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {weekComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="font-medium text-sm">Week {week.week}</span>
                      </div>
                      {weekComplete && (
                        <Badge variant="outline" className="text-green-600 border-green-500/30 text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Utensils className="w-3 h-3" />
                        <span>{week.dietCompleted}/{week.dietTotal}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Dumbbell className="w-3 h-3" />
                        <span>{week.trainingCompleted}/{week.trainingTotal}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="w-3 h-3" />
                        <span>{week.lessonsCompleted}/{week.lessonsTotal}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
