import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "@/components/VideoPlayer";
import { InteractiveWrapper } from "@/components/interactive/InteractiveWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  module_name: string;
  lesson_number: number;
  title: string;
  description: string;
  video_start_time: string;
  video_end_time: string;
  interactive_type: string;
  interactive_config: any;
  subtitle_en_url?: string;
  subtitle_nl_url?: string;
  subtitle_ru_url?: string;
}

interface LessonProgress {
  id: string;
  completed: boolean;
  video_progress: number;
  interactive_responses: any;
}

export default function SpiritualPillar() {
  const { lessonNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Map<string, LessonProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  const videoUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/masterclass-videos/mental-mastery/Masterclass%20Final%20-%20Aproved%20edit%20spiritual%20pilla%20_compressed.mp4`;

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    if (lessons.length > 0) {
      const lessonNum = lessonNumber ? parseInt(lessonNumber) : 1;
      const lesson = lessons.find(l => l.lesson_number === lessonNum);
      setCurrentLesson(lesson || lessons[0]);
    }
  }, [lessonNumber, lessons]);

  const loadLessons = async () => {
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("masterclass_lessons")
        .select("*")
        .eq("module_name", "spiritual")
        .order("lesson_number");

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from("user_lesson_progress")
          .select("*")
          .eq("user_id", user.id);

        if (!progressError && progressData) {
          const progressMap = new Map();
          progressData.forEach(p => {
            progressMap.set(p.lesson_id, p);
          });
          setProgress(progressMap);
        }
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load lessons. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (lessonId: string, updates: Partial<LessonProgress>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const existing = progress.get(lessonId);
    
    const { error } = await supabase
      .from("user_lesson_progress")
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        ...updates,
      }, {
        onConflict: 'user_id,lesson_id'
      });

    if (!error) {
      const newProgress = new Map(progress);
      newProgress.set(lessonId, { ...existing, ...updates } as LessonProgress);
      setProgress(newProgress);
    }
  };

  const handleVideoProgress = (progressPercent: number) => {
    if (currentLesson) {
      saveProgress(currentLesson.id, { video_progress: progressPercent });
    }
  };

  const handleVideoComplete = () => {
    if (currentLesson) {
      toast({
        title: "Video Complete!",
        description: "Now complete the interactive element below.",
      });
    }
  };

  const handleInteractiveComplete = (response: any) => {
    if (currentLesson) {
      saveProgress(currentLesson.id, {
        completed: true,
        interactive_responses: response,
        completed_at: new Date().toISOString(),
      } as any);

      toast({
        title: "Lesson Complete!",
        description: "Great work! Ready for the next lesson?",
      });
    }
  };

  const goToLesson = (lessonNum: number) => {
    navigate(`/spiritual-pillar/${lessonNum}`);
  };

  const completedCount = Array.from(progress.values()).filter(p => p.completed).length;
  const progressPercent = (completedCount / lessons.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading spiritual masterclass...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="fixed inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative z-10">
        <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>

              <div className="text-white">
                <span className="text-sm text-muted-foreground">Progress: </span>
                <span className="font-bold">{completedCount}/{lessons.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black gradient-text mb-2">Spiritual Pillar Masterclass</h1>
            <p className="text-xl text-gray-400">Master your spirit, master your destiny</p>
            
            <div className="max-w-2xl mx-auto mt-6">
              <Progress value={progressPercent} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progressPercent)}% Complete
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentLesson && (
                <>
                  <Card className="glass-effect">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl">
                            Lesson {currentLesson.lesson_number}: {currentLesson.title}
                          </CardTitle>
                          <CardDescription className="text-base mt-2">
                            {currentLesson.description}
                          </CardDescription>
                        </div>
                        {progress.get(currentLesson.id)?.completed && (
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <VideoPlayer
                        videoUrl={videoUrl}
                        startTime={currentLesson.video_start_time}
                        endTime={currentLesson.video_end_time}
                        subtitles={[
                          currentLesson.subtitle_en_url && { src: currentLesson.subtitle_en_url, lang: "en", label: "English" },
                          currentLesson.subtitle_nl_url && { src: currentLesson.subtitle_nl_url, lang: "nl", label: "Nederlands" },
                          currentLesson.subtitle_ru_url && { src: currentLesson.subtitle_ru_url, lang: "ru", label: "Русский" }
                        ].filter(Boolean) as any}
                        onProgress={handleVideoProgress}
                        onComplete={handleVideoComplete}
                      />
                    </CardContent>
                  </Card>

                  <InteractiveWrapper
                    type={currentLesson.interactive_type}
                    config={currentLesson.interactive_config}
                    onComplete={handleInteractiveComplete}
                    savedResponse={progress.get(currentLesson.id)?.interactive_responses}
                  />
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="glass-effect sticky top-24">
                <CardHeader>
                  <CardTitle>Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lessons.map((lesson) => {
                      const isCompleted = progress.get(lesson.id)?.completed;
                      const isCurrent = currentLesson?.id === lesson.id;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => goToLesson(lesson.lesson_number)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            isCurrent 
                              ? "bg-primary/20 border-2 border-primary" 
                              : "bg-card hover:bg-muted border-2 border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold line-clamp-2">
                                {lesson.lesson_number}. {lesson.title}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}