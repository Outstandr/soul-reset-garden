import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { 
  Target, Utensils, Dumbbell, BookOpen, Sparkles, ArrowRight, 
  CheckCircle2, AlertTriangle, Clock, Calendar, Droplets, X,
  ChevronRight, Loader2, Download, TrendingUp
} from "lucide-react";
import { ProgressTracker } from "./ProgressTracker";

interface PersonalizedPlan {
  summary: {
    title: string;
    overview: string;
    personality_insight: string;
    strength_areas: string[];
    growth_areas: string[];
  };
  recommended_lessons: Array<{
    lesson_id: string;
    title: string;
    reason: string;
    priority: number;
  }>;
  diet_plan: {
    approach: string;
    meal_timing: string;
    daily_structure: {
      morning: string;
      midday: string;
      evening: string;
      snacks: string;
    };
    hydration: string;
    avoid: string[];
    prioritize: string[];
    weekly_tips: string[];
  };
  training_plan: {
    approach: string;
    weekly_structure: {
      days_per_week: number;
      session_duration: string;
      schedule: Array<{
        day: string;
        focus: string;
        details: string;
      }>;
    };
    progression: string;
    recovery: string;
    warnings: string[];
  };
  first_week_actions: string[];
  motivational_message: string;
}

interface PersonalizedPlanViewProps {
  onClose?: () => void;
  embedded?: boolean;
}

export const PersonalizedPlanView = ({ onClose, embedded = false }: PersonalizedPlanViewProps) => {
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_discovery')
        .select('ai_report, recommended_lessons, personalized_diet_plan, personalized_training_plan, report_generated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.ai_report) {
        // Reconstruct the plan from stored data
        const reconstructedPlan: PersonalizedPlan = {
          summary: data.ai_report as PersonalizedPlan['summary'],
          recommended_lessons: [], // Will need to fetch lesson details
          diet_plan: data.personalized_diet_plan as PersonalizedPlan['diet_plan'],
          training_plan: data.personalized_training_plan as PersonalizedPlan['training_plan'],
          first_week_actions: (data.ai_report as any)?.first_week_actions || [],
          motivational_message: (data.ai_report as any)?.motivational_message || "",
        };
        setPlan(reconstructedPlan);
      }
    } catch (error) {
      console.error('Error loading plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    if (!plan) return;
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;
      const lineHeight = 7;
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;

      // Helper function to add text with word wrap
      const addWrappedText = (text: string, y: number, fontSize: number = 10): number => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
        return y;
      };

      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Your Personalized Plan", margin, yPos);
      yPos += 15;

      // Subtitle
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("Created by LionelX | LPA Academy", margin, yPos);
      doc.setTextColor(0);
      yPos += 15;

      // Summary Section
      if (plan.summary) {
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Overview", margin, yPos);
        yPos += 10;

        doc.setFont("helvetica", "normal");
        if (plan.summary.overview) {
          yPos = addWrappedText(plan.summary.overview, yPos);
          yPos += 5;
        }

        if (plan.summary.personality_insight) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Personality Insight:", yPos, 11);
          doc.setFont("helvetica", "normal");
          yPos = addWrappedText(plan.summary.personality_insight, yPos);
          yPos += 5;
        }

        if (plan.summary.strength_areas?.length) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Your Strengths:", yPos, 11);
          doc.setFont("helvetica", "normal");
          plan.summary.strength_areas.forEach((strength) => {
            yPos = addWrappedText(`• ${strength}`, yPos);
          });
          yPos += 5;
        }

        if (plan.summary.growth_areas?.length) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Growth Areas:", yPos, 11);
          doc.setFont("helvetica", "normal");
          plan.summary.growth_areas.forEach((area) => {
            yPos = addWrappedText(`• ${area}`, yPos);
          });
        }
      }

      // Diet Plan Section
      if (plan.diet_plan) {
        doc.addPage();
        yPos = 20;
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Diet Plan", margin, yPos);
        yPos += 10;

        if (plan.diet_plan.approach) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Approach:", yPos, 11);
          doc.setFont("helvetica", "normal");
          yPos = addWrappedText(plan.diet_plan.approach, yPos);
          yPos += 5;
        }

        if (plan.diet_plan.meal_timing) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Meal Timing:", yPos, 11);
          doc.setFont("helvetica", "normal");
          yPos = addWrappedText(plan.diet_plan.meal_timing, yPos);
          yPos += 5;
        }

        if (plan.diet_plan.daily_structure) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Daily Structure:", yPos, 11);
          doc.setFont("helvetica", "normal");
          if (plan.diet_plan.daily_structure.morning) yPos = addWrappedText(`Morning: ${plan.diet_plan.daily_structure.morning}`, yPos);
          if (plan.diet_plan.daily_structure.midday) yPos = addWrappedText(`Midday: ${plan.diet_plan.daily_structure.midday}`, yPos);
          if (plan.diet_plan.daily_structure.evening) yPos = addWrappedText(`Evening: ${plan.diet_plan.daily_structure.evening}`, yPos);
          if (plan.diet_plan.daily_structure.snacks) yPos = addWrappedText(`Snacks: ${plan.diet_plan.daily_structure.snacks}`, yPos);
          yPos += 5;
        }

        if (plan.diet_plan.prioritize?.length) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Foods to Prioritize:", yPos, 11);
          doc.setFont("helvetica", "normal");
          plan.diet_plan.prioritize.forEach((food) => {
            yPos = addWrappedText(`✓ ${food}`, yPos);
          });
          yPos += 5;
        }

        if (plan.diet_plan.avoid?.length) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Foods to Avoid:", yPos, 11);
          doc.setFont("helvetica", "normal");
          plan.diet_plan.avoid.forEach((food) => {
            yPos = addWrappedText(`✗ ${food}`, yPos);
          });
        }
      }

      // Training Plan Section
      if (plan.training_plan) {
        doc.addPage();
        yPos = 20;
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Training Plan", margin, yPos);
        yPos += 10;

        if (plan.training_plan.approach) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Approach:", yPos, 11);
          doc.setFont("helvetica", "normal");
          yPos = addWrappedText(plan.training_plan.approach, yPos);
          yPos += 5;
        }

        if (plan.training_plan.weekly_structure?.schedule?.length) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText(`Weekly Schedule (${plan.training_plan.weekly_structure.days_per_week} days, ${plan.training_plan.weekly_structure.session_duration}):`, yPos, 11);
          doc.setFont("helvetica", "normal");
          plan.training_plan.weekly_structure.schedule.forEach((day) => {
            yPos = addWrappedText(`${day.day}: ${day.focus} - ${day.details}`, yPos);
          });
          yPos += 5;
        }

        if (plan.training_plan.progression) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Progression:", yPos, 11);
          doc.setFont("helvetica", "normal");
          yPos = addWrappedText(plan.training_plan.progression, yPos);
          yPos += 5;
        }

        if (plan.training_plan.recovery) {
          doc.setFont("helvetica", "bold");
          yPos = addWrappedText("Recovery:", yPos, 11);
          doc.setFont("helvetica", "normal");
          yPos = addWrappedText(plan.training_plan.recovery, yPos);
        }
      }

      // First Week Actions
      if (plan.first_week_actions?.length) {
        doc.addPage();
        yPos = 20;
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("First Week Actions", margin, yPos);
        yPos += 10;

        doc.setFont("helvetica", "normal");
        plan.first_week_actions.forEach((action, i) => {
          yPos = addWrappedText(`${i + 1}. ${action}`, yPos);
        });
      }

      // Motivational Message
      if (plan.motivational_message) {
        yPos += 15;
        doc.setFont("helvetica", "italic");
        yPos = addWrappedText(`"${plan.motivational_message}"`, yPos, 11);
        doc.setFont("helvetica", "normal");
        yPos = addWrappedText("— LionelX", yPos, 10);
      }

      // Save the PDF
      doc.save("LPA-Personalized-Plan.pdf");
      toast.success("Plan exported successfully!");
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error("Failed to export plan");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Plan Generated Yet</h3>
          <p className="text-muted-foreground mb-4">Complete the discovery questionnaire to get your personalized plan.</p>
        </CardContent>
      </Card>
    );
  }

  const Wrapper = embedded ? 'div' : Card;

  return (
    <Wrapper className={embedded ? "" : "glass-effect"}>
      {!embedded && onClose && (
        <div className="flex justify-between items-center p-4 pb-0">
          <Button variant="outline" size="sm" onClick={exportToPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!embedded && !onClose && (
        <div className="flex justify-end p-4 pb-0">
          <Button variant="outline" size="sm" onClick={exportToPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      )}
      
      <CardHeader className={embedded ? "px-0 pt-0" : ""}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{plan.summary?.title || "Your Personalized Plan"}</CardTitle>
              <CardDescription>Created just for you by LionelX</CardDescription>
            </div>
          </div>
          {embedded && (
            <Button variant="outline" size="sm" onClick={exportToPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className={embedded ? "px-0" : ""}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <Target className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="text-xs sm:text-sm">
              <Utensils className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="text-xs sm:text-sm">
              <Dumbbell className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="text-xs sm:text-sm">
              <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Lessons</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview */}
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{plan.summary?.overview}</p>
              
              {plan.summary?.personality_insight && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Personality Insight
                  </h4>
                  <p className="text-sm text-muted-foreground">{plan.summary.personality_insight}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Your Strengths
                  </h4>
                  <ul className="space-y-2">
                    {plan.summary?.strength_areas?.map((strength, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-amber-600">
                    <Target className="w-4 h-4" />
                    Growth Areas
                  </h4>
                  <ul className="space-y-2">
                    {plan.summary?.growth_areas?.map((area, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {plan.first_week_actions && plan.first_week_actions.length > 0 && (
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Your First Week Actions
                  </h4>
                  <div className="space-y-3">
                    {plan.first_week_actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <Badge variant="outline" className="mt-0.5">{i + 1}</Badge>
                        <p className="text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plan.motivational_message && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border">
                  <p className="text-sm italic text-center">"{plan.motivational_message}"</p>
                  <p className="text-xs text-muted-foreground text-center mt-2">— Coach Lionel</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressTracker embedded />
          </TabsContent>

          <TabsContent value="diet" className="space-y-6">
            {plan.diet_plan && (
              <>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold mb-2">Your Nutrition Approach</h4>
                  <p className="text-sm text-muted-foreground">{plan.diet_plan.approach}</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Meal Timing
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">{plan.diet_plan.meal_timing}</p>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-1">🌅 Morning</h5>
                      <p className="text-sm text-muted-foreground">{plan.diet_plan.daily_structure?.morning}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-1">☀️ Midday</h5>
                      <p className="text-sm text-muted-foreground">{plan.diet_plan.daily_structure?.midday}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-1">🌙 Evening</h5>
                      <p className="text-sm text-muted-foreground">{plan.diet_plan.daily_structure?.evening}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <h5 className="font-medium text-sm mb-1">🍎 Snacks</h5>
                      <p className="text-sm text-muted-foreground">{plan.diet_plan.daily_structure?.snacks}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-600">
                    <Droplets className="w-4 h-4" />
                    Hydration
                  </h4>
                  <p className="text-sm">{plan.diet_plan.hydration}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                    <h4 className="font-semibold text-sm mb-3 text-green-600">✓ Prioritize</h4>
                    <ul className="space-y-1">
                      {plan.diet_plan.prioritize?.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 mt-1 text-green-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border bg-red-500/5 border-red-500/20">
                    <h4 className="font-semibold text-sm mb-3 text-red-600">✗ Avoid</h4>
                    <ul className="space-y-1">
                      {plan.diet_plan.avoid?.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <X className="w-3 h-3 mt-1 text-red-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {plan.diet_plan.weekly_tips && plan.diet_plan.weekly_tips.length > 0 && (
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3">💡 Weekly Tips</h4>
                    <ul className="space-y-2">
                      {plan.diet_plan.weekly_tips.map((tip, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5 flex-shrink-0">{i + 1}</Badge>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            {plan.training_plan && (
              <>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-semibold mb-2">Your Training Approach</h4>
                  <p className="text-sm text-muted-foreground">{plan.training_plan.approach}</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Weekly Schedule</h4>
                    <div className="flex gap-2">
                      <Badge>{plan.training_plan.weekly_structure?.days_per_week} days/week</Badge>
                      <Badge variant="outline">{plan.training_plan.weekly_structure?.session_duration}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {plan.training_plan.weekly_structure?.schedule?.map((day, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{day.day}</Badge>
                          <span className="font-medium text-sm">{day.focus}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{day.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Progression Plan
                  </h4>
                  <p className="text-sm text-muted-foreground">{plan.training_plan.progression}</p>
                </div>

                <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                  <h4 className="font-semibold mb-2 text-blue-600">🛌 Recovery</h4>
                  <p className="text-sm">{plan.training_plan.recovery}</p>
                </div>

                {plan.training_plan.warnings && plan.training_plan.warnings.length > 0 && (
                  <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="w-4 h-4" />
                      Important Notes
                    </h4>
                    <ul className="space-y-2">
                      {plan.training_plan.warnings.map((warning, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Based on your profile, we recommend focusing on these lessons first:
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full justify-between" 
                variant="outline"
                onClick={() => navigate('/reset-by-discipline')}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View All Course Lessons
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 mt-6">
              <p className="text-sm text-center text-muted-foreground">
                Your personalized lesson recommendations are integrated into the course. Start with Module 1 to begin your transformation journey.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Wrapper>
  );
};
