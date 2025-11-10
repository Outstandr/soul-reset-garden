import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Trophy, TrendingUp, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface XPDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  lesson_title: string;
  lesson_number: number;
  completed_at: string | null;
  xp: number;
}

export function XPDetailsDialog({ open, onOpenChange }: XPDetailsDialogProps) {
  const [totalXP, setTotalXP] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchXPData();
    }
  }, [open]);

  const fetchXPData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch completed lessons with their details
      const { data: progress, error } = await supabase
        .from("user_lesson_progress")
        .select(`
          lesson_id,
          completed,
          completed_at,
          masterclass_lessons (
            title,
            lesson_number,
            module_name
          )
        `)
        .eq("user_id", user.id)
        .eq("completed", true)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      const lessonsData = (progress || []).map((p: any, index: number) => {
        // Calculate XP based on lesson number (25 + (lesson_number - 1) * 5)
        const lessonNumber = p.masterclass_lessons?.lesson_number || 0;
        const xpValue = 25 + ((lessonNumber - 1) * 5);
        
        return {
          lesson_id: p.lesson_id,
          completed: p.completed,
          lesson_title: p.masterclass_lessons?.title || "Unknown Lesson",
          lesson_number: lessonNumber,
          completed_at: p.completed_at,
          xp: xpValue,
        };
      });

      setCompletedLessons(lessonsData);
      
      // Calculate total XP from actual lesson XP values
      const total = lessonsData.reduce((sum, lesson) => sum + lesson.xp, 0);
      setTotalXP(total);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching XP data:", error);
      toast({
        title: "Error",
        description: "Failed to load XP data.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const nextMilestone = Math.ceil(totalXP / 100) * 100;
  const progressToNextMilestone = ((totalXP % 100) / 100) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black flex items-center gap-3">
            <Star className="w-8 h-8 text-amber-500" />
            Your XP Breakdown
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total XP Card */}
            <Card className="p-8 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-500">
              <div className="flex flex-col items-center gap-2">
                <Star className="w-12 h-12 text-amber-600" />
                <div className="text-5xl font-black text-amber-700">{totalXP}</div>
                <div className="text-lg font-bold text-amber-600">Total Experience Points</div>
                <div className="text-sm text-muted-foreground">
                  From {completedLessons.length} completed lesson{completedLessons.length !== 1 ? "s" : ""}
                </div>
              </div>
            </Card>

            {/* Next Milestone */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-black">Next Milestone</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{totalXP} XP</span>
                  <span className="font-bold text-primary">{nextMilestone} XP</span>
                </div>
                <Progress value={progressToNextMilestone} className="h-3" />
                <p className="text-sm text-muted-foreground text-center">
                  {nextMilestone - totalXP} XP until next milestone
                </p>
              </div>
            </Card>

            {/* XP Breakdown */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-black">Recent Completions</h3>
              </div>
              
              {completedLessons.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Complete your first lesson to start earning XP!
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {completedLessons.map((lesson) => (
                    <div
                      key={lesson.lesson_id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-accent/30"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        <div>
                          <div className="font-bold text-foreground">
                            Lesson {lesson.lesson_number}: {lesson.lesson_title}
                          </div>
                          {lesson.completed_at && (
                            <div className="text-xs text-muted-foreground">
                              Completed {new Date(lesson.completed_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 border border-amber-400">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="font-black text-amber-700">+{lesson.xp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* XP Per Lesson Info */}
            <Card className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-primary">
              <p className="text-center font-bold text-foreground">
                💡 XP increases with each lesson: 25, 30, 35, 40...
              </p>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
