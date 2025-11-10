import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ModuleProgress {
  moduleName: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export const useModuleProgress = () => {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchModuleProgress();
  }, []);

  const fetchModuleProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch all lessons grouped by module
      const { data: lessons, error: lessonsError } = await supabase
        .from("masterclass_lessons")
        .select("id, module_name");

      if (lessonsError) throw lessonsError;

      // Fetch user's completed lessons
      const { data: userProgress, error: progressError } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (progressError) throw progressError;

      // Calculate progress for each module
      const moduleMap = new Map<string, { total: number; completed: number }>();

      lessons?.forEach((lesson) => {
        const current = moduleMap.get(lesson.module_name) || { total: 0, completed: 0 };
        current.total += 1;
        
        const isCompleted = userProgress?.some(
          (p) => p.lesson_id === lesson.id && p.completed
        );
        if (isCompleted) {
          current.completed += 1;
        }
        
        moduleMap.set(lesson.module_name, current);
      });

      // Convert to array
      const progressArray = Array.from(moduleMap.entries()).map(([moduleName, stats]) => ({
        moduleName,
        completedLessons: stats.completed,
        totalLessons: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      }));

      setProgress(progressArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching module progress:", error);
      toast({
        title: "Error loading progress",
        description: "Could not load your module progress. Please refresh the page.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getModuleProgress = (moduleName: string): number => {
    const moduleProgress = progress.find((p) => p.moduleName === moduleName);
    return moduleProgress?.percentage || 0;
  };

  return {
    progress,
    isLoading,
    getModuleProgress,
    refetch: fetchModuleProgress,
  };
};
