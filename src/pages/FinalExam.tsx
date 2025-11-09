import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Lock, CheckCircle2 } from "lucide-react";
import { QuizComponent } from "@/components/quiz/QuizComponent";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function FinalExam() {
  const navigate = useNavigate();
  const [finalLesson, setFinalLesson] = useState<any>(null);
  const [modulesCompleted, setModulesCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [canTakeExam, setCanTakeExam] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkProgress();
    loadFinalLesson();
  }, []);

  const loadFinalLesson = async () => {
    try {
      const { data, error } = await supabase
        .from('masterclass_lessons')
        .select('*')
        .eq('module_name', 'Final Assessment')
        .eq('lesson_number', 1)
        .single();

      if (error) throw error;
      setFinalLesson(data);
    } catch (error) {
      console.error('Error loading final lesson:', error);
    }
  };

  const checkProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check completion for all 3 modules
      const moduleChecks = await Promise.all([1, 2, 3].map(async (moduleNum) => {
        const moduleName = [
          "Module 1: Getting Fit",
          "Module 2: Knowing Who You Are",
          "Module 3: Become Your Own Boss"
        ][moduleNum - 1];

        const { data: lessons } = await supabase
          .from('masterclass_lessons')
          .select('id')
          .eq('module_name', moduleName);

        if (!lessons || lessons.length === 0) return { moduleNum, completed: false };

        const { data: attempts } = await supabase
          .from('user_quiz_attempts')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('passed', true)
          .in('lesson_id', lessons.map(l => l.id));

        const completed = attempts && attempts.length === lessons.length;
        return { moduleNum, completed };
      }));

      const completed = moduleChecks.filter(m => m.completed).map(m => m.moduleNum);
      setModulesCompleted(completed);
      setCanTakeExam(completed.length === 3);
    } catch (error) {
      console.error('Error checking progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamPass = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const certificateNumber = `RBD-MASTER-${Date.now()}`;

      const { error } = await supabase.from('user_certificates').insert({
        user_id: user.id,
        course_name: "Reset by Discipline - Master Certificate",
        certificate_number: certificateNumber,
        final_score: 100
      });

      if (error) throw error;

      toast({
        title: "Congratulations!",
        description: "You've completed the entire Reset by Discipline course!",
      });

      navigate(`/certificate/${certificateNumber}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="fixed inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative z-10">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="zen-container py-4">
            <Button variant="ghost" onClick={() => navigate("/reset-by-discipline")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Reset by Discipline
            </Button>
          </div>
        </header>

        <main className="zen-container py-12 max-w-4xl">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 text-primary mx-auto mb-4" />
            <h1 className="text-5xl font-black gradient-text mb-4">Final Certification Exam</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive assessment covering all three modules
            </p>
          </div>

          <Card className="glass-effect mb-8">
            <CardHeader>
              <CardTitle>Module Completion Status</CardTitle>
              <CardDescription>Complete all modules to unlock the final exam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { num: 1, name: "Module 1: Getting Fit" },
                { num: 2, name: "Module 2: Knowing Who You Are" },
                { num: 3, name: "Module 3: Become Your Own Boss" }
              ].map((module) => (
                <div key={module.num} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {modulesCompleted.includes(module.num) ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    )}
                    <span className="font-semibold">{module.name}</span>
                  </div>
                  {modulesCompleted.includes(module.num) ? (
                    <span className="text-sm text-primary font-semibold">Complete</span>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/reset-discipline-course/${module.num}/1`)}
                    >
                      Start Module
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="pt-4">
                <Progress value={(modulesCompleted.length / 3) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {modulesCompleted.length}/3 Modules Completed
                </p>
              </div>
            </CardContent>
          </Card>

          {canTakeExam && finalLesson ? (
            <QuizComponent
              lessonId={finalLesson.id}
              passingScore={80}
              onPass={handleExamPass}
            />
          ) : (
            <Card className="glass-effect">
              <CardContent className="p-12 text-center">
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Exam Locked</h3>
                <p className="text-muted-foreground mb-6">
                  Complete all three modules to unlock the final certification exam.
                </p>
                <p className="text-sm text-muted-foreground">
                  You must pass all lesson quizzes in each module with at least 70% to proceed.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
