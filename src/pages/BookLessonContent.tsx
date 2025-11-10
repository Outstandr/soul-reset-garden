import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, MessageSquare, Lightbulb, Star, Sparkles, Target, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { LionelReflectionDialog } from "@/components/LionelReflectionDialog";
import { supabase } from "@/integrations/supabase/client";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  category: string;
  readingTime: string;
  xp: number;
  content: string;
  keyTakeaways: string[];
  actionStep: string;
  reflectionPrompt: string;
}

export default function BookLessonContent() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [checkpoints, setCheckpoints] = useState<number[]>([]);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const [showLionelDialog, setShowLionelDialog] = useState(false);
  const [hasShownLionelDialog, setHasShownLionelDialog] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch lesson data, highlights, and reflections
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!lessonId) {
          setIsLoading(false);
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase
          .from("masterclass_lessons")
          .select("*")
          .eq("id", lessonId)
          .single();

        if (error) throw error;
        
        // Load saved highlights
        if (user) {
          const { data: savedHighlights } = await supabase
            .from("user_highlights")
            .select("highlight_text")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId);
          
          if (savedHighlights) {
            setHighlights(savedHighlights.map(h => h.highlight_text));
          }
          
          // Load saved reflection
          const { data: savedReflection } = await supabase
            .from("user_reflections")
            .select("reflection_text")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .single();
          
          if (savedReflection) {
            setReflectionText(savedReflection.reflection_text);
          }
        }

        if (data) {
          // Calculate reading time from word count (average reading speed: 200 words/min)
          const lessonData = data as any; // Type cast until Supabase types are regenerated
          const readingTime = lessonData.word_count 
            ? `${Math.ceil(lessonData.word_count / 200)} min`
            : "8 min";
          
          setLesson({
            id: lessonData.id,
            lessonNumber: lessonData.lesson_number,
            title: lessonData.title,
            category: "concept",
            readingTime,
            xp: 25,
            content: lessonData.content || "Content not yet available. Please check back soon.",
            keyTakeaways: lessonData.key_takeaways || [],
            actionStep: lessonData.action_step || "",
            reflectionPrompt: lessonData.reflection_prompt || ""
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast({
          title: "Error",
          description: "Failed to load lesson. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, toast]);

  // Unlock checkpoints as user reads
  useEffect(() => {
    if (readingProgress >= 25 && !checkpoints.includes(25)) {
      setCheckpoints([...checkpoints, 25]);
      toast({
        title: "Checkpoint Reached!",
        description: "+5 bonus XP - You're making great progress!",
      });
    }
    if (readingProgress >= 50 && !checkpoints.includes(50)) {
      setCheckpoints([...checkpoints, 50]);
      toast({
        title: "Halfway There!",
        description: "+10 bonus XP - Keep going!",
      });
    }
    if (readingProgress >= 75 && !checkpoints.includes(75)) {
      setCheckpoints([...checkpoints, 75]);
      toast({
        title: "Almost Done!",
        description: "+15 bonus XP - Final stretch!",
      });
    }
    // Show Lionel dialog when reader hits 90%
    if (readingProgress >= 90 && !hasShownLionelDialog) {
      setShowLionelDialog(true);
      setHasShownLionelDialog(true);
    }
  }, [readingProgress, checkpoints, toast, hasShownLionelDialog]);

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && lesson?.id) {
        // Save completion to database
        const { error } = await supabase
          .from('user_lesson_progress')
          .upsert({
            user_id: user.id,
            lesson_id: lesson.id,
            completed: true,
            video_progress: 100,
            completed_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,lesson_id'
          });

        if (error) {
          console.error('Error saving completion:', error);
          toast({
            title: "Error",
            description: "Failed to save progress. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Update streak tracking
        const today = new Date().toISOString().split('T')[0];
        const { data: existingStreak } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .eq('streak_date', today)
          .single();

        if (existingStreak) {
          // Increment lessons completed for today
          await supabase
            .from('user_streaks')
            .update({ lessons_completed: existingStreak.lessons_completed + 1 })
            .eq('id', existingStreak.id);
        } else {
          // Create new streak entry for today
          await supabase
            .from('user_streaks')
            .insert({
              user_id: user.id,
              streak_date: today,
              lessons_completed: 1,
            });
        }
      }

      setIsCompleted(true);
      toast({
        title: "Lesson Complete!",
        description: `+${lesson.xp} XP earned!`,
      });
      
      setTimeout(() => {
        navigate("/book/reset-by-discipline");
      }, 2000);
    } catch (error) {
      console.error('Completion error:', error);
      toast({
        title: "Error",
        description: "Failed to complete lesson. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleHighlight = async (text: string) => {
    if (!highlights.includes(text)) {
      const newHighlights = [...highlights, text];
      setHighlights(newHighlights);
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user && lessonId) {
        await supabase.from("user_highlights").insert({
          user_id: user.id,
          lesson_id: lessonId,
          highlight_text: text,
        });
      }
      
      toast({
        title: "Highlighted!",
        description: "Saved to your highlights",
      });
    }
  };

  const handleRemoveHighlight = async (text: string) => {
    setHighlights(highlights.filter(h => h !== text));
    
    // Remove from database
    const { data: { user } } = await supabase.auth.getUser();
    if (user && lessonId) {
      await supabase
        .from("user_highlights")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .eq("highlight_text", text);
    }
    
    toast({
      title: "Highlight Removed",
      description: "Removed from your highlights",
    });
  };

  const handleActionComplete = () => {
    setActionCompleted(true);
    toast({
      title: "Action Completed!",
      description: "+10 bonus XP for taking action!",
    });
  };

  const handleReflectionSave = async () => {
    if (reflectionText.trim()) {
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user && lessonId) {
        await supabase.from("user_reflections").upsert({
          user_id: user.id,
          lesson_id: lessonId,
          reflection_text: reflectionText,
        }, {
          onConflict: 'user_id,lesson_id'
        });
      }
      
      toast({
        title: "Reflection Saved!",
        description: "Your insights have been saved to your journal",
      });
      setShowReflection(false);
    }
  };

  const handleLionelReflections = (responses: string[]) => {
    console.log("Lionel reflections:", responses);
    toast({
      title: "Reflections Saved!",
      description: "Your insights have been saved. +15 bonus XP!",
    });
  };

  const reflectionQuestions = [
    "What was the most powerful insight you gained from this lesson?",
    "How does this change your perspective on discipline versus motivation?",
    "What's one specific action you'll take in the next 48 hours based on what you learned?"
  ];

  // Simulate reading progress on scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setReadingProgress(Math.min(Math.round(scrollPercentage), 100));
  };

  if (isLoading || !lesson) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/book/reset-discipline")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Book
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="font-black text-amber-700">{lesson.xp} XP</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black mb-2">
              Lesson {lesson.lessonNumber}: {lesson.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="capitalize px-3 py-1 rounded-full bg-primary/20 text-primary font-bold border-2 border-primary/40">
                {lesson.category}
              </span>
              <span>{lesson.readingTime}</span>
              <span className="font-bold text-reset-rhythm">{readingProgress}% Complete</span>
            </div>
          </div>
          <Progress value={readingProgress} className="h-2 mt-3" />
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto"
        onScroll={handleScroll}
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {/* Interactive Lesson Content */}
        <div className="prose prose-lg max-w-none mb-12" ref={contentRef}>
          <MarkdownRenderer content={lesson.content} />
        </div>

        {/* Highlights Section */}
        {highlights.length > 0 && (
          <Card className="mb-8 p-6 bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-400 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-600" />
              <h3 className="text-2xl font-black text-yellow-700">Your Highlights ({highlights.length})</h3>
            </div>
            <div className="space-y-3">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="p-3 bg-yellow-50 border-l-2 border-yellow-500 rounded-r text-foreground flex justify-between items-start group">
                  <span className="flex-1">{highlight}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHighlight(highlight)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Key Takeaways */}
        <Card className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-primary">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-black text-primary">Key Takeaways</h3>
          </div>
          <ul className="space-y-3">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground font-semibold">{takeaway}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Interactive Action Step */}
        <Card className={`mb-8 p-6 transition-all duration-300 ${
          actionCompleted 
            ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-accent' 
            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-accent/50'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-accent" />
            <h3 className="text-2xl font-black text-accent">Your Action Step</h3>
          </div>
          <p className="text-foreground font-semibold leading-relaxed mb-4">{lesson.actionStep}</p>
          {!actionCompleted ? (
            <Button
              variant="hero"
              onClick={handleActionComplete}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Action Complete
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-accent font-bold animate-scale-in">
              <CheckCircle className="w-5 h-5" />
              <span>Action Completed! +10 XP</span>
            </div>
          )}
        </Card>

        {/* Interactive Reflection Prompt */}
        <Card className="mb-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-secondary">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-secondary" />
            <h3 className="text-2xl font-black text-secondary">Reflection Question</h3>
          </div>
          <p className="text-foreground font-semibold leading-relaxed mb-4">{lesson.reflectionPrompt}</p>
          
          {!showReflection ? (
            <Button
              variant="hero"
              onClick={() => setShowReflection(true)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Write Your Reflection
            </Button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <Textarea
                placeholder="Write your thoughts here..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="min-h-[120px] bg-card border-secondary/50 text-foreground"
              />
              <div className="flex gap-3">
                <Button
                  variant="hero"
                  onClick={handleReflectionSave}
                  disabled={!reflectionText.trim()}
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Reflection
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowReflection(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Complete Button */}
        {!isCompleted && readingProgress >= 80 && (
          <div className="text-center animate-scale-in">
            <Button
              variant="hero"
              size="lg"
              onClick={handleComplete}
              className="px-12 py-6 text-xl font-black shadow-neon"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Mark Lesson Complete
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="text-center animate-scale-in">
            <Card className="inline-flex flex-col items-center gap-4 px-12 py-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h3 className="text-3xl font-black text-green-500">Lesson Complete!</h3>
              <p className="text-gray-400">+{lesson.xp} XP earned</p>
            </Card>
          </div>
        )}
      </div>

      <LionelReflectionDialog
        open={showLionelDialog}
        onOpenChange={setShowLionelDialog}
        questions={reflectionQuestions}
        onSubmit={handleLionelReflections}
        lessonTitle={lesson.title}
      />
    </div>
  );
}
