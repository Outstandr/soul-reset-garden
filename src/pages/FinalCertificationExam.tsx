import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Award, Lock } from "lucide-react";
import { QuizComponent } from "@/components/quiz/QuizComponent";
import { useToast } from "@/hooks/use-toast";

export default function FinalCertificationExam() {
  const navigate = useNavigate();
  const [finalExamId, setFinalExamId] = useState<string | null>(null);
  const [canTakeExam, setCanTakeExam] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkEligibility();
    loadFinalExam();
  }, []);

  const loadFinalExam = async () => {
    try {
      const { data, error } = await supabase
        .from('masterclass_lessons')
        .select('id')
        .eq('module_name', 'Final Assessment')
        .eq('lesson_number', 1)
        .single();

      if (error) throw error;
      setFinalExamId(data.id);
    } catch (error) {
      console.error('Error loading final exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if all 18 lessons have been passed
      const { data: lessons } = await supabase
        .from('masterclass_lessons')
        .select('id')
        .in('module_name', ['Module 1: Getting Fit', 'Module 2: Knowing Who You Are', 'Module 3: Become Your Own Boss']);

      if (!lessons || lessons.length !== 18) {
        setCanTakeExam(false);
        return;
      }

      const { data: attempts } = await supabase
        .from('user_quiz_attempts')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('passed', true);

      // User must have passed all 18 lessons
      setCanTakeExam(attempts?.length === 18);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const handleExamPass = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate overall score from all attempts
      const { data: allAttempts } = await supabase
        .from('user_quiz_attempts')
        .select('percentage')
        .eq('user_id', user.id)
        .eq('passed', true);

      const avgScore = allAttempts?.reduce((sum, a) => sum + a.percentage, 0) / (allAttempts?.length || 1);
      const certificateNumber = `RBD-MASTER-${Date.now()}`;

      const { error } = await supabase.from('user_certificates').insert({
        user_id: user.id,
        course_name: "Reset by Discipline - Elite Self-Discipline Masterclass",
        module_name: "Complete Course Certification",
        certificate_number: certificateNumber,
        final_score: Math.round(avgScore)
      });

      if (error) throw error;

      toast({
        title: "Congratulations! 🏆",
        description: "You've completed the entire Reset by Discipline program!",
      });

      navigate(`/certificate/${certificateNumber}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!canTakeExam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="fixed inset-0 bg-grid-pattern opacity-20" />
        
        <div className="relative z-10">
          <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="zen-container py-4">
              <Button variant="ghost" onClick={() => navigate("/reset-by-discipline")}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Course
              </Button>
            </div>
          </header>

          <main className="zen-container py-12 max-w-2xl">
            <Card className="glass-effect border-2 border-destructive/30">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Lock className="w-16 h-16 text-destructive" />
                </div>
                <CardTitle className="text-center text-3xl">Final Exam Locked</CardTitle>
                <CardDescription className="text-center text-lg">
                  You must complete and pass all 18 lessons across the three modules before taking the final certification exam.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Keep working through the modules. You're building elite self-discipline!
                </p>
                <Button onClick={() => navigate("/reset-by-discipline")}>
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="fixed inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative z-10">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="zen-container py-4">
            <Button variant="ghost" onClick={() => navigate("/reset-by-discipline")}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Course
            </Button>
          </div>
        </header>

        <main className="zen-container py-12 max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Award className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-5xl font-black gradient-text mb-4">Final Certification Exam</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              This comprehensive test covers all three modules. You must score <strong>80% or higher</strong> to receive your final Reset by Discipline certification.
            </p>
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg inline-block">
              <p className="text-sm font-semibold">
                20 Questions • 100 Points Total • 80% Required to Pass
              </p>
            </div>
          </div>

          {finalExamId && (
            <QuizComponent
              lessonId={finalExamId}
              passingScore={80}
              onPass={handleExamPass}
            />
          )}
        </main>
      </div>
    </div>
  );
}
