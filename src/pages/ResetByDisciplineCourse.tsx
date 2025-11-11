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
  subtitle_en_url?: string;
  subtitle_nl_url?: string;
  subtitle_ru_url?: string;
}

export default function ResetByDisciplineCourse() {
  const { moduleNumber, lessonNumber } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [videoProgress, setVideoProgress] = useState<Map<string, number>>(new Map());
  const [showQuiz, setShowQuiz] = useState(false);
  const [interactiveResponse, setInteractiveResponse] = useState<any>(null);
  const [showInteractive, setShowInteractive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [newlyUnlockedLesson, setNewlyUnlockedLesson] = useState<string | null>(null);
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
      setVideoCompleted(false);
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

      // Load completed lessons and video progress from user_lesson_progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, video_progress, completed')
        .eq('user_id', user.id);

      if (progressError) throw progressError;
      
      // Build completed lessons set and progress map
      const completedSet = new Set<string>();
      const progressMap = new Map<string, number>();
      
      progressData?.forEach(p => {
        if (p.completed) {
          completedSet.add(p.lesson_id);
        }
        progressMap.set(p.lesson_id, p.video_progress || 0);
      });
      
      setCompletedLessons(completedSet);
      setVideoProgress(progressMap);
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
    setVideoCompleted(true);
  };

  const handleMarkComplete = () => {
    setVideoCompleted(false);
    // Show interactive element only if it exists and is not "none"
    if (currentLesson?.interactive_type && currentLesson.interactive_type !== "none" && !interactiveResponse) {
      setShowInteractive(true);
    } else {
      // Go straight to quiz
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
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Wait a bit to ensure database write from quiz completion has finished
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch fresh progress data directly from database with retry
      let progressData = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        const { data, error } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, video_progress, completed')
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Check if current lesson is marked as completed
        const currentLessonComplete = data?.find(p => p.lesson_id === currentLesson.id && p.completed);
        
        if (currentLessonComplete) {
          progressData = data;
          break;
        }
        
        // If not found, wait and retry
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (!progressData) {
        console.error('Failed to verify lesson completion after multiple attempts');
        return;
      }

      // Build fresh completed lessons set
      const freshCompletedSet = new Set<string>();
      const progressMap = new Map<string, number>();
      
      progressData.forEach(p => {
        if (p.completed) {
          freshCompletedSet.add(p.lesson_id);
        }
        progressMap.set(p.lesson_id, p.video_progress || 0);
      });
      
      console.log('Updated completed lessons:', Array.from(freshCompletedSet));
      console.log('Current lesson ID:', currentLesson.id);
      
      // Update state with fresh data
      setCompletedLessons(freshCompletedSet);
      setVideoProgress(progressMap);
      
      // Check if module is complete
      const allPassed = lessons.every(l => freshCompletedSet.has(l.id));

      if (allPassed) {
        await generateCertificate();
        return;
      }

      // Find and navigate to next lesson
      const nextLesson = lessons.find(l => l.lesson_number === currentLesson.lesson_number + 1);
      if (nextLesson) {
        console.log('Unlocking next lesson:', nextLesson.lesson_number);
        setNewlyUnlockedLesson(nextLesson.id);
        
        toast({
          title: "Lesson Unlocked!",
          description: `Lesson ${nextLesson.lesson_number} is now available`,
        });
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          setNewlyUnlockedLesson(null);
        }, 3000);
        
        // Navigate to next lesson
        setTimeout(() => {
          navigate(`/reset-discipline-course/${moduleNumber}/${nextLesson.lesson_number}`);
        }, 500);
      }
    } catch (error) {
      console.error('Error updating progress after quiz pass:', error);
      toast({
        title: "Error",
        description: "Failed to unlock next lesson. Please refresh the page.",
        variant: "destructive"
      });
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
        title: "Module Complete!",
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

  // Determine pillar type from module number
  const getPillarType = (): "physical" | "mental" | "spiritual" => {
    if (moduleNumber === "1") return "physical";
    if (moduleNumber === "2") return "mental";
    return "spiritual";
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
                    <CardContent className="space-y-4">
                      <VideoPlayer
                        videoUrl={getVideoUrl(parseInt(moduleNumber || "1"), currentLesson.lesson_number)}
                        startTime={currentLesson.video_start_time}
                        endTime={currentLesson.video_end_time}
                        subtitles={[
                          currentLesson.subtitle_en_url && { src: currentLesson.subtitle_en_url, lang: "en", label: "English" },
                          currentLesson.subtitle_nl_url && { src: currentLesson.subtitle_nl_url, lang: "nl", label: "Nederlands" },
                          currentLesson.subtitle_ru_url && { src: currentLesson.subtitle_ru_url, lang: "ru", label: "Русский" }
                        ].filter(Boolean) as any}
                        onProgress={async (progress) => {
                          // Update video progress in real-time
                          const { data: { user } } = await supabase.auth.getUser();
                          if (!user) return;
                          
                          await supabase
                            .from('user_lesson_progress')
                            .upsert({
                              user_id: user.id,
                              lesson_id: currentLesson.id,
                              video_progress: progress
                            });
                          
                          // Update local state
                          setVideoProgress(prev => new Map(prev).set(currentLesson.id, progress));
                        }}
                        onComplete={handleLessonComplete}
                      />
                      
                      {videoCompleted && !showInteractive && !showQuiz && (
                        <Button 
                          onClick={handleMarkComplete}
                          size="lg"
                          className="w-full"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Mark as Complete & Continue to Quiz
                        </Button>
                      )}
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
                    const isNewlyUnlocked = newlyUnlockedLesson === lesson.id;
                    const progress = videoProgress.get(lesson.id) || 0;

                    return (
                      <div key={lesson.id} className="relative">
                        <Button
                          variant={isCurrent ? "default" : isCompleted ? "outline" : "ghost"}
                          className={`w-full justify-start relative transition-all ${
                            isCompleted ? 'bg-primary/10 border-primary/30 hover:bg-primary/20' : ''
                          } ${
                            isCurrent ? 'ring-2 ring-primary shadow-lg' : ''
                          } ${
                            !isUnlocked ? 'opacity-50' : ''
                          } ${
                            isNewlyUnlocked ? 'animate-[pulse_1s_ease-in-out_3] ring-2 ring-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]' : ''
                          }`}
                          disabled={!isUnlocked}
                          onClick={() => navigate(`/reset-discipline-course/${moduleNumber}/${lesson.lesson_number}`)}
                        >
                          <span className={`mr-2 ${isCompleted ? 'text-primary' : ''}`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 fill-primary text-primary-foreground" />
                            ) : !isUnlocked ? (
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            ) : isCurrent ? (
                              <Play className="w-5 h-5" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                            )}
                          </span>
                          <span className={`flex-1 text-left truncate ${
                            isCompleted ? 'font-semibold' : ''
                          }`}>
                            Lesson {lesson.lesson_number}: {lesson.title}
                          </span>
                          {isCompleted ? (
                            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                              Done
                            </span>
                          ) : progress > 0 && (
                            <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                              {Math.round(progress)}%
                            </span>
                          )}
                        </Button>
                        {!isCompleted && progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-md overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                      </div>
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
