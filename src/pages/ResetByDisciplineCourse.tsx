import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Lock, CheckCircle2, Play } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { QuizComponent } from "@/components/quiz/QuizComponent";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { InteractiveWrapper } from "@/components/interactive/InteractiveWrapper";

interface Lesson {
  id: string;
  lesson_number: number;
  title: string;
  description: string;
  video_start_time: string;
  video_end_time: string;
  module_name: string;
  interactive_type?: string;
  interactive_config?: any;
}

export default function ResetByDisciplineCourse() {
  const { moduleNumber, lessonNumber } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [interactiveResponse, setInteractiveResponse] = useState<any>(null);
  const [showInteractive, setShowInteractive] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const moduleNames = [
    "Module 1: Getting Fit",
    "Module 2: Knowing Who You Are", 
    "Module 3: Become Your Own Boss"
  ];

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  
  // Video file mapping for Module 1: Getting Fit
  const module1VideoMapping: Record<number, string> = {
    1: 'module1-lesson5.mp4', // Introduction to Getting Fit
    2: 'module1-lesson4.mp4', // Fitness Assessment & Safe Progression
    3: 'module1-lesson2.mp4', // Goal Setting with SMARTER Framework
    4: 'module1-lesson6.mp4', // Training Fundamentals
    5: 'module1-lesson1.mp4', // Sleep & Recovery Systems
    6: 'module1-lesson3.mp4', // Nutrition & Energy Management
  };
  
  const getVideoUrl = (moduleNum: number, lessonNum: number): string => {
    const basePath = `${SUPABASE_URL}/storage/v1/object/public/reset-discipline-course/`;
    
    if (moduleNum === 1 && module1VideoMapping[lessonNum]) {
      return basePath + module1VideoMapping[lessonNum];
    }
    
    // Default mapping for other modules
    return `${basePath}module${moduleNum}-lesson${lessonNum}.mp4`;
  };

  useEffect(() => {
    loadLessons();
    loadProgress();
  }, [moduleNumber]);

  useEffect(() => {
    if (lessons.length > 0 && lessonNumber) {
      const lesson = lessons.find(l => l.lesson_number === parseInt(lessonNumber));
      setCurrentLesson(lesson || lessons[0]);
      setShowQuiz(false);
      setShowInteractive(false);
      setInteractiveResponse(null);
      loadInteractiveProgress(lesson || lessons[0]);
    } else if (lessons.length > 0) {
      setCurrentLesson(lessons[0]);
      loadInteractiveProgress(lessons[0]);
    }
  }, [lessons, lessonNumber]);

  const loadLessons = async () => {
    try {
      const moduleName = moduleNames[parseInt(moduleNumber || "1") - 1];
      const { data, error } = await supabase
        .from('masterclass_lessons')
        .select('*')
        .eq('module_name', moduleName)
        .order('lesson_number');

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_quiz_attempts')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('passed', true);

      if (error) throw error;
      setCompletedLessons(new Set(data?.map(d => d.lesson_id) || []));
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadInteractiveProgress = async (lesson: Lesson | null) => {
    if (!lesson || !lesson.interactive_type) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('interactive_responses')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
        .maybeSingle();

      if (error) throw error;
      if (data?.interactive_responses) {
        setInteractiveResponse(data.interactive_responses);
      }
    } catch (error) {
      console.error('Error loading interactive progress:', error);
    }
  };

  const handleLessonComplete = () => {
    if (currentLesson?.interactive_type && !interactiveResponse) {
      setShowInteractive(true);
    } else {
      setShowQuiz(true);
    }
  };

  const handleInteractiveComplete = async (response: any) => {
    if (!currentLesson) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: currentLesson.id,
          interactive_responses: response,
          video_progress: 100
        });

      if (error) throw error;

      setInteractiveResponse(response);
      setShowInteractive(false);
      setShowQuiz(true);
    } catch (error) {
      console.error('Error saving interactive response:', error);
    }
  };

  const handleQuizPass = async () => {
    if (!currentLesson) return;
    
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
    
    // Check if module is complete
    const allPassed = lessons.every(l => 
      completedLessons.has(l.id) || l.id === currentLesson.id
    );

    if (allPassed) {
      await generateCertificate();
    }

    // Move to next lesson
    const nextLesson = lessons.find(l => l.lesson_number === currentLesson.lesson_number + 1);
    if (nextLesson) {
      navigate(`/reset-discipline-course/${moduleNumber}/${nextLesson.lesson_number}`);
    }
  };

  const generateCertificate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const moduleName = moduleNames[parseInt(moduleNumber || "1") - 1];
      const certificateNumber = `RBD-${moduleNumber}-${Date.now()}`;

      const { error } = await supabase.from('user_certificates').insert({
        user_id: user.id,
        course_name: "Reset by Discipline",
        module_name: moduleName,
        certificate_number: certificateNumber,
        final_score: 100
      });

      if (error) throw error;

      toast({
        title: "Module Complete! 🎉",
        description: "You've earned your certificate!",
      });

      navigate(`/certificate/${certificateNumber}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const isLessonUnlocked = (lesson: Lesson) => {
    if (lesson.lesson_number === 1) return true;
    const prevLesson = lessons.find(l => l.lesson_number === lesson.lesson_number - 1);
    return prevLesson ? completedLessons.has(prevLesson.id) : false;
  };

  const moduleProgress = (completedLessons.size / lessons.length) * 100;

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

        <main className="zen-container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-black gradient-text mb-2">
              {moduleNames[parseInt(moduleNumber || "1") - 1]}
            </h1>
            <div className="flex items-center gap-4">
              <Progress value={moduleProgress} className="flex-1 h-3" />
              <span className="text-sm font-semibold">{completedLessons.size}/{lessons.length} Complete</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentLesson && (
                <>
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>{currentLesson.title}</CardTitle>
                      <CardDescription>{currentLesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VideoPlayer
                        videoUrl={getVideoUrl(parseInt(moduleNumber || "1"), currentLesson.lesson_number)}
                        startTime={currentLesson.video_start_time}
                        endTime={currentLesson.video_end_time}
                        onComplete={handleLessonComplete}
                      />
                    </CardContent>
                  </Card>

                  {showInteractive && currentLesson.interactive_type && (
                    <InteractiveWrapper
                      type={currentLesson.interactive_type}
                      config={currentLesson.interactive_config}
                      onComplete={handleInteractiveComplete}
                      savedResponse={interactiveResponse}
                    />
                  )}

                  {showQuiz && (
                    <QuizComponent
                      lessonId={currentLesson.id}
                      passingScore={70}
                      onPass={handleQuizPass}
                    />
                  )}
                </>
              )}
            </div>

            <div>
              <Card className="glass-effect sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lessons.map((lesson) => {
                    const isUnlocked = isLessonUnlocked(lesson);
                    const isCompleted = completedLessons.has(lesson.id);
                    const isCurrent = currentLesson?.id === lesson.id;

                    return (
                      <Button
                        key={lesson.id}
                        variant={isCurrent ? "default" : "ghost"}
                        className="w-full justify-start"
                        disabled={!isUnlocked}
                        onClick={() => navigate(`/reset-discipline-course/${moduleNumber}/${lesson.lesson_number}`)}
                      >
                        <span className="mr-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          ) : !isUnlocked ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </span>
                        <span className="flex-1 text-left truncate">
                          {lesson.lesson_number}. {lesson.title}
                        </span>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
