import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookLessonProgress {
  lessonId: string;
  completed: boolean;
  videoProgress: number;
}

export const useBookProgress = (bookModule: string = "Book: Reset by Discipline") => {
  const [progress, setProgress] = useState<BookLessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProgress();
  }, [bookModule]);

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch all lessons for the book module
      const { data: lessons, error: lessonsError } = await supabase
        .from("masterclass_lessons")
        .select("id")
        .eq("module_name", bookModule)
        .order("lesson_number");

      if (lessonsError) throw lessonsError;

      // Fetch user's progress for these lessons
      const lessonIds = lessons?.map(l => l.id) || [];
      
      const { data: userProgress, error: progressError } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, completed, video_progress")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds);

      if (progressError) throw progressError;

      // Map progress
      const progressMap = (lessons || []).map((lesson) => {
        const progress = userProgress?.find(p => p.lesson_id === lesson.id);
        return {
          lessonId: lesson.id,
          completed: progress?.completed || false,
          videoProgress: Number(progress?.video_progress || 0),
        };
      });

      setProgress(progressMap);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching book progress:", error);
      toast({
        title: "Error loading progress",
        description: "Could not load your lesson progress. Please refresh the page.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getLessonStatus = (index: number): "locked" | "available" | "in-progress" | "completed" => {
    if (index >= progress.length) return "available"; // All lessons available by default
    
    const lessonProgress = progress[index];
    
    if (lessonProgress.completed) return "completed";
    if (lessonProgress.videoProgress > 0) return "in-progress";
    return "available";
  };

  const getCompletedCount = (): number => {
    return progress.filter(p => p.completed).length;
  };

  return {
    progress,
    isLoading,
    getLessonStatus,
    getCompletedCount,
    refetch: fetchProgress,
  };
};
