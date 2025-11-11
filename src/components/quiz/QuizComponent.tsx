import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  points: number;
  order_number: number;
}

interface QuizComponentProps {
  lessonId: string;
  passingScore: number;
  onPass: () => void;
}

export const QuizComponent = ({ lessonId, passingScore = 70, onPass }: QuizComponentProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
  }, [lessonId]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_number');

      if (error) throw error;
      const formattedQuestions = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : []
      }));
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    let totalScore = 0;
    let totalPoints = 0;

    questions.forEach((q, index) => {
      totalPoints += q.points;
      if (answers[index] === q.correct_answer) {
        totalScore += q.points;
      }
    });

    const percentage = Math.round((totalScore / totalPoints) * 100);
    const passed = percentage >= passingScore;

    setScore(percentage);
    setShowResults(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save quiz attempt
      const { error: quizError } = await supabase.from('user_quiz_attempts').insert({
        user_id: user.id,
        lesson_id: lessonId,
        score: totalScore,
        total_points: totalPoints,
        percentage,
        passed,
        answers
      });

      if (quizError) throw quizError;

      // If passed, mark lesson as completed in progress table
      if (passed) {
        console.log('📝 Quiz passed! Marking lesson as complete:', lessonId);
        
        const { error: progressError } = await supabase
          .from('user_lesson_progress')
          .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
            video_progress: 100
          }, {
            onConflict: 'user_id,lesson_id'
          });

        if (progressError) {
          console.error('❌ Error updating lesson progress:', progressError);
          throw progressError;
        }

        console.log('✅ Lesson marked as complete in database:', lessonId);
        
        // Verify it was saved
        const { data: verifyData } = await supabase
          .from('user_lesson_progress')
          .select('completed, video_progress')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .single();
        
        console.log('🔍 Verified database state:', verifyData);

        toast({
          title: "Congratulations!",
          description: `You passed with ${percentage}%`,
        });
        
        // Ensure database write is complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        onPass();
      } else {
        toast({
          title: "Keep Trying",
          description: `You scored ${percentage}%. You need ${passingScore}% to pass.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  if (loading) {
    return <Card className="glass-effect"><CardContent className="p-8 text-center">Loading quiz...</CardContent></Card>;
  }

  if (questions.length === 0) {
    return <Card className="glass-effect"><CardContent className="p-8 text-center">No quiz available for this lesson.</CardContent></Card>;
  }

  if (showResults) {
    const passed = score >= passingScore;
    return (
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            {passed ? (
              <Trophy className="w-16 h-16 text-primary" />
            ) : (
              <XCircle className="w-16 h-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-center text-3xl">
            {passed ? "Quiz Passed!" : "Quiz Failed"}
          </CardTitle>
          <CardDescription className="text-center text-xl">
            Your Score: {score}% (Required: {passingScore}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={score} className="h-3" />
          {!passed && (
            <Button 
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="w-full"
            >
              Retry Quiz
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardDescription>Question {currentQuestion + 1} of {questions.length}</CardDescription>
          <CardDescription>{currentQ.points} points</CardDescription>
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="text-xl">{currentQ.question_text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={answers[currentQuestion] || ""} 
          onValueChange={handleAnswer}
        >
          {currentQ.options.map((option, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 border-2 border-transparent hover:border-primary/20 transition-all"
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label 
                htmlFor={`option-${index}`} 
                className="flex-1 cursor-pointer text-base"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
