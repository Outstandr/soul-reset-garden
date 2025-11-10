import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Flame, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface StreakDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StreakDialog({ open, onOpenChange }: StreakDialogProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [activeDates, setActiveDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchStreakData();
    }
  }, [open]);

  const fetchStreakData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all streak records for the user
      const { data: streaks, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .order("streak_date", { ascending: false });

      if (error) throw error;

      if (streaks && streaks.length > 0) {
        // Calculate current streak
        let current = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sortedDates = streaks
          .map(s => new Date(s.streak_date))
          .sort((a, b) => b.getTime() - a.getTime());

        // Check if user has activity today or yesterday
        const daysDiff = Math.floor((today.getTime() - sortedDates[0].getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) {
          for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
              current = 1;
            } else {
              const diff = Math.floor((sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24));
              if (diff === 1) {
                current++;
              } else {
                break;
              }
            }
          }
        }

        // Calculate longest streak
        let longest = 1;
        let tempStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
          const diff = Math.floor((sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            tempStreak++;
            longest = Math.max(longest, tempStreak);
          } else {
            tempStreak = 1;
          }
        }

        setCurrentStreak(current);
        setLongestStreak(Math.max(longest, current));
        setActiveDates(sortedDates);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching streak data:", error);
      toast({
        title: "Error",
        description: "Failed to load streak data.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            Your Discipline Streak
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Streak Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-500">
                <div className="flex flex-col items-center gap-2">
                  <Flame className="w-8 h-8 text-orange-600" />
                  <div className="text-4xl font-black text-orange-700">{currentStreak}</div>
                  <div className="text-sm font-bold text-orange-600">Current Streak</div>
                  <div className="text-xs text-muted-foreground">days in a row</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-secondary">
                <div className="flex flex-col items-center gap-2">
                  <Award className="w-8 h-8 text-secondary" />
                  <div className="text-4xl font-black text-secondary">{longestStreak}</div>
                  <div className="text-sm font-bold text-secondary">Longest Streak</div>
                  <div className="text-xs text-muted-foreground">personal record</div>
                </div>
              </Card>
            </div>

            {/* Calendar View */}
            <Card className="p-6">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Activity Calendar
              </h3>
              <div className="flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={activeDates}
                  className="rounded-md border"
                  modifiers={{
                    active: activeDates,
                  }}
                  modifiersStyles={{
                    active: {
                      backgroundColor: "hsl(var(--accent))",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                {activeDates.length === 0
                  ? "Start your journey today! Complete a lesson to begin your streak."
                  : `You've been active on ${activeDates.length} day${activeDates.length === 1 ? "" : "s"}!`}
              </p>
            </Card>

            {/* Motivational Message */}
            <Card className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-primary">
              <p className="text-center font-bold text-foreground">
                {currentStreak === 0 ? (
                  "🎯 Complete a lesson today to start your streak!"
                ) : currentStreak < 7 ? (
                  `💪 Keep it up! ${7 - currentStreak} more day${7 - currentStreak === 1 ? "" : "s"} to reach a week!`
                ) : currentStreak < 30 ? (
                  `🔥 Amazing! You're ${currentStreak} days strong!`
                ) : (
                  `🏆 Legendary! ${currentStreak} days of pure discipline!`
                )}
              </p>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
