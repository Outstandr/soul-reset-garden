import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Zap, Heart, Target, Mountain, ArrowRight, ArrowLeft, Sparkles, 
  Brain, Moon, Utensils, Dumbbell, Clock, Users, Briefcase, Star,
  Loader2
} from "lucide-react";

const STEPS = [
  { id: "energy", title: "Your Energy Level", description: "How would you rate your current daily energy level?", icon: Zap },
  { id: "health", title: "Your Health", description: "How would you rate your overall physical health?", icon: Heart },
  { id: "stress", title: "Your Stress Level", description: "How stressed do you feel on a daily basis?", icon: Brain },
  { id: "discipline", title: "Your Discipline", description: "How disciplined are you currently?", icon: Target },
  { id: "personality", title: "Your Personality", description: "Which best describes your personality?", icon: Users },
  { id: "motivation", title: "What Motivates You", description: "What drives you to take action?", icon: Star },
  { id: "career", title: "Your Career", description: "Tell us about your current job", icon: Briefcase },
  { id: "sleep", title: "Your Sleep", description: "Tell us about your sleep patterns", icon: Moon },
  { id: "eating", title: "Your Eating Patterns", description: "How do you currently eat?", icon: Utensils },
  { id: "nutrition_challenge", title: "Nutrition Challenges", description: "What's your biggest nutrition struggle?", icon: Utensils },
  { id: "fitness", title: "Your Fitness", description: "What's your current fitness situation?", icon: Dumbbell },
  { id: "goals", title: "Your Goals", description: "What do you want to achieve?", icon: Target },
  { id: "lifestyle", title: "Your Lifestyle", description: "Tell us about your daily life", icon: Briefcase },
  { id: "time", title: "Your Time", description: "How much time can you dedicate?", icon: Clock },
  { id: "about_you", title: "About You", description: "Tell us more about yourself", icon: Users },
  { id: "vision", title: "Your Vision", description: "Where do you want to be?", icon: Mountain },
  { id: "commitment", title: "Your Commitment", description: "How committed are you to this transformation?", icon: Sparkles },
];

const PERSONALITY_OPTIONS = [
  { value: "introvert", label: "Introvert", description: "I prefer solitude and deep focus" },
  { value: "extrovert", label: "Extrovert", description: "I thrive around others and social energy" },
  { value: "ambivert", label: "Ambivert", description: "I adapt based on the situation" },
];

const MOTIVATION_OPTIONS = [
  { value: "reward_driven", label: "Reward Driven", description: "I'm motivated by achievements and recognition" },
  { value: "fear_driven", label: "Pain Avoidance", description: "I'm motivated by avoiding negative outcomes" },
  { value: "purpose_driven", label: "Purpose Driven", description: "I'm motivated by meaning and impact" },
  { value: "competition_driven", label: "Competition Driven", description: "I'm motivated by outperforming others" },
];

const DECISION_OPTIONS = [
  { value: "quick_intuitive", label: "Quick & Intuitive", description: "I trust my gut and decide fast" },
  { value: "slow_analytical", label: "Slow & Analytical", description: "I research thoroughly before deciding" },
  { value: "emotional", label: "Emotionally Led", description: "My feelings guide my decisions" },
];

const WAKE_OPTIONS = [
  { value: "before_5am", label: "Before 5 AM", description: "Early riser" },
  { value: "5am_7am", label: "5-7 AM", description: "Morning person" },
  { value: "7am_9am", label: "7-9 AM", description: "Standard wake" },
  { value: "after_9am", label: "After 9 AM", description: "Late riser" },
];

const EATING_STYLE_OPTIONS = [
  { value: "healthy_balanced", label: "Healthy & Balanced", description: "I eat nutritious meals regularly" },
  { value: "convenience", label: "Convenience First", description: "I eat whatever is easy and available" },
  { value: "emotional_eating", label: "Emotional Eating", description: "I eat based on how I feel" },
  { value: "skip_meals", label: "Skip Meals", description: "I often forget or skip meals" },
  { value: "fast_food", label: "Fast Food Heavy", description: "I rely on takeout and fast food" },
];

const DIET_OPTIONS = [
  { value: "none", label: "No Restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
];

const WORKOUT_FREQUENCY_OPTIONS = [
  { value: "never", label: "Never", description: "I don't exercise currently" },
  { value: "1-2_weekly", label: "1-2x per week", description: "Occasional activity" },
  { value: "3-4_weekly", label: "3-4x per week", description: "Regular exercise" },
  { value: "5+_weekly", label: "5+ per week", description: "Very active" },
];

const WORKOUT_TYPE_OPTIONS = [
  { value: "gym", label: "Gym Training", description: "Weights and machines" },
  { value: "home", label: "Home Workouts", description: "Bodyweight and minimal equipment" },
  { value: "outdoors", label: "Outdoor Activities", description: "Running, hiking, cycling" },
  { value: "sports", label: "Sports", description: "Team or individual sports" },
  { value: "none", label: "Nothing Yet", description: "Looking to start" },
];

const FITNESS_GOAL_OPTIONS = [
  { value: "lose_weight", label: "Lose Weight", description: "Reduce body fat" },
  { value: "build_muscle", label: "Build Muscle", description: "Gain strength and size" },
  { value: "endurance", label: "Build Endurance", description: "Improve stamina" },
  { value: "flexibility", label: "Improve Flexibility", description: "Better mobility" },
  { value: "general_health", label: "General Health", description: "Overall wellness" },
];

const PRIMARY_GOAL_OPTIONS = [
  { value: "discipline", label: "Build Unshakeable Discipline", description: "Master self-control and consistency" },
  { value: "energy", label: "Maximize Energy & Vitality", description: "Feel energized and focused every day" },
  { value: "mindset", label: "Develop a Winning Mindset", description: "Strengthen mental resilience" },
  { value: "performance", label: "Peak Performance", description: "Optimize all areas of life" },
  { value: "balance", label: "Life Balance", description: "Harmonize work, health, and relationships" },
  { value: "transformation", label: "Complete Transformation", description: "Reinvent myself entirely" },
];

const OCCUPATION_OPTIONS = [
  { value: "desk_job", label: "Desk Job", description: "Office/computer work" },
  { value: "active_job", label: "Active Job", description: "Physical work" },
  { value: "student", label: "Student", description: "Studying" },
  { value: "entrepreneur", label: "Entrepreneur", description: "Running my own business" },
  { value: "remote", label: "Remote Worker", description: "Work from home" },
  { value: "other", label: "Other", description: "Different situation" },
];

const FAMILY_OPTIONS = [
  { value: "single", label: "Single", description: "Living alone" },
  { value: "relationship", label: "In a Relationship", description: "No kids" },
  { value: "married_no_kids", label: "Married, No Kids", description: "Partner, no children" },
  { value: "married_with_kids", label: "Parent", description: "Have children" },
  { value: "single_parent", label: "Single Parent", description: "Raising kids alone" },
];

const PRIORITY_OPTIONS = [
  { value: "career", label: "Career & Success" },
  { value: "family", label: "Family & Relationships" },
  { value: "health", label: "Health & Fitness" },
  { value: "personal_growth", label: "Personal Growth" },
  { value: "financial", label: "Financial Freedom" },
];

const TIME_OPTIONS = [
  { value: "15min", label: "15-30 minutes", description: "Very limited time" },
  { value: "30min", label: "30-45 minutes", description: "Short sessions" },
  { value: "1hour", label: "45-60 minutes", description: "Moderate time" },
  { value: "1.5hours", label: "60-90 minutes", description: "Good availability" },
  { value: "flexible", label: "Flexible", description: "I can make time" },
];

const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology / IT" },
  { value: "healthcare", label: "Healthcare / Medical" },
  { value: "finance", label: "Finance / Banking" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail / E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "construction", label: "Construction" },
  { value: "hospitality", label: "Hospitality / Food Service" },
  { value: "creative", label: "Creative / Media" },
  { value: "consulting", label: "Consulting / Professional Services" },
  { value: "government", label: "Government / Public Sector" },
  { value: "sports_fitness", label: "Sports / Fitness" },
  { value: "other", label: "Other" },
];

interface DiscoveryQuestionnaireProps {
  onComplete: () => void;
}

export const DiscoveryQuestionnaire = ({ onComplete }: DiscoveryQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    energy_level: 5,
    health_level: 5,
    stress_level: 5,
    discipline_level: 5,
    commitment_level: 5,
    personality_type: "",
    motivation_style: "",
    decision_making: "",
    job_title: "",
    job_industry: "",
    sleep_hours: 7,
    sleep_quality: 5,
    wake_up_time: "",
    meals_per_day: 3,
    eating_style: "",
    hydration_level: 5,
    dietary_restrictions: "",
    biggest_nutrition_challenge: "",
    workout_frequency: "",
    preferred_workout: "",
    fitness_goal: "",
    primary_goal: "",
    secondary_goals: [] as string[],
    biggest_challenge: "",
    time_available: "",
    occupation_type: "",
    family_situation: "",
    biggest_life_priority: "",
    describe_yourself: "",
    where_you_want_to_be: "",
    what_holds_you_back: "",
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSecondaryGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      secondary_goals: prev.secondary_goals.includes(goal)
        ? prev.secondary_goals.filter(g => g !== goal)
        : [...prev.secondary_goals, goal]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: case 1: case 2: case 3: case 16: return true; // Sliders
      case 4: return formData.personality_type !== "";
      case 5: return formData.motivation_style !== "" && formData.decision_making !== "";
      case 6: return formData.job_industry !== "";
      case 7: return formData.wake_up_time !== "";
      case 8: return formData.eating_style !== "";
      case 9: return formData.biggest_nutrition_challenge.trim().length >= 5;
      case 10: return formData.workout_frequency !== "" && formData.preferred_workout !== "" && formData.fitness_goal !== "";
      case 11: return formData.primary_goal !== "";
      case 12: return formData.occupation_type !== "" && formData.family_situation !== "";
      case 13: return formData.time_available !== "";
      case 14: return formData.describe_yourself.trim().length >= 20;
      case 15: return formData.where_you_want_to_be.trim().length >= 20 && formData.what_holds_you_back.trim().length >= 10;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Save discovery data
      const { error } = await supabase
        .from("user_discovery")
        .upsert({
          user_id: user.id,
          ...formData,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Generate AI plan
      setIsGeneratingPlan(true);
      const { data: planData, error: planError } = await supabase.functions.invoke('generate-personalized-plan', {
        body: { discoveryData: formData }
      });

      if (planError) {
        console.error('Plan generation error:', planError);
        toast.error("Couldn't generate your plan, but your responses are saved. You can view your plan later.");
      } else if (planData?.plan) {
        toast.success("Your personalized plan is ready!");
      }

      onComplete();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving discovery:", error);
      toast.error("Failed to save your responses. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsGeneratingPlan(false);
    }
  };

  const getSliderLabel = (value: number, type: string) => {
    const labels: Record<string, string[]> = {
      energy: ["Exhausted", "Very Low", "Low", "Below Average", "Average", "Above Average", "Good", "Very Good", "Excellent", "Peak Energy"],
      health: ["Poor", "Very Low", "Low", "Below Average", "Average", "Above Average", "Good", "Very Good", "Excellent", "Optimal"],
      stress: ["Zen Master", "Very Calm", "Calm", "Mostly Relaxed", "Moderate", "Somewhat Stressed", "Stressed", "Very Stressed", "Overwhelmed", "Burnout"],
      discipline: ["None", "Very Low", "Low", "Developing", "Moderate", "Growing", "Good", "Strong", "Very Strong", "Unshakeable"],
      commitment: ["Unsure", "Curious", "Interested", "Motivated", "Committed", "Very Committed", "Dedicated", "Determined", "Unstoppable", "All In"],
      sleep: ["Very Poor", "Poor", "Below Average", "Fair", "Average", "Good", "Very Good", "Great", "Excellent", "Perfect"],
      hydration: ["Dehydrated", "Very Low", "Low", "Below Average", "Average", "Good", "Very Good", "Great", "Excellent", "Optimal"],
    };
    return labels[type]?.[value - 1] || value.toString();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Energy
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{formData.energy_level}</span>
              <span className="text-2xl text-muted-foreground">/10</span>
            </div>
            <Slider value={[formData.energy_level]} onValueChange={(v) => updateField('energy_level', v[0])} min={1} max={10} step={1} className="py-4" />
            <p className="text-center text-muted-foreground">{getSliderLabel(formData.energy_level, 'energy')}</p>
          </div>
        );

      case 1: // Health
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{formData.health_level}</span>
              <span className="text-2xl text-muted-foreground">/10</span>
            </div>
            <Slider value={[formData.health_level]} onValueChange={(v) => updateField('health_level', v[0])} min={1} max={10} step={1} className="py-4" />
            <p className="text-center text-muted-foreground">{getSliderLabel(formData.health_level, 'health')}</p>
          </div>
        );

      case 2: // Stress
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{formData.stress_level}</span>
              <span className="text-2xl text-muted-foreground">/10</span>
            </div>
            <Slider value={[formData.stress_level]} onValueChange={(v) => updateField('stress_level', v[0])} min={1} max={10} step={1} className="py-4" />
            <p className="text-center text-muted-foreground">{getSliderLabel(formData.stress_level, 'stress')}</p>
          </div>
        );

      case 3: // Discipline
        return (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{formData.discipline_level}</span>
              <span className="text-2xl text-muted-foreground">/10</span>
            </div>
            <Slider value={[formData.discipline_level]} onValueChange={(v) => updateField('discipline_level', v[0])} min={1} max={10} step={1} className="py-4" />
            <p className="text-center text-muted-foreground">{getSliderLabel(formData.discipline_level, 'discipline')}</p>
          </div>
        );

      case 4: // Personality
        return (
          <RadioGroup value={formData.personality_type} onValueChange={(v) => updateField('personality_type', v)} className="space-y-3">
            {PERSONALITY_OPTIONS.map((opt) => (
              <div key={opt.value} className={`flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.personality_type === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('personality_type', opt.value)}>
                <RadioGroupItem value={opt.value} id={opt.value} className="mt-0.5" />
                <Label htmlFor={opt.value} className="cursor-pointer flex-1">
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-muted-foreground">{opt.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 5: // Motivation & Decision Making
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">What motivates you?</h4>
              <RadioGroup value={formData.motivation_style} onValueChange={(v) => updateField('motivation_style', v)} className="space-y-2">
                {MOTIVATION_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.motivation_style === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('motivation_style', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`mot-${opt.value}`} className="mt-0.5" />
                    <Label htmlFor={`mot-${opt.value}`} className="cursor-pointer flex-1">
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-3">How do you make decisions?</h4>
              <RadioGroup value={formData.decision_making} onValueChange={(v) => updateField('decision_making', v)} className="space-y-2">
                {DECISION_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.decision_making === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('decision_making', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`dec-${opt.value}`} className="mt-0.5" />
                    <Label htmlFor={`dec-${opt.value}`} className="cursor-pointer flex-1">
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 6: // Career
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">What is your current job title/role?</h4>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => updateField('job_title', e.target.value)}
                placeholder="e.g., Software Engineer, Sales Manager, Teacher..."
                className="w-full p-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
              <p className="text-sm text-muted-foreground text-right mt-1">
                {formData.job_title.trim().length < 2 ? `${2 - formData.job_title.trim().length} more characters` : "✓"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">What industry do you work in?</h4>
              <RadioGroup value={formData.job_industry} onValueChange={(v) => updateField('job_industry', v)} className="grid grid-cols-2 gap-2">
                {INDUSTRY_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-2 rounded-lg border transition-all cursor-pointer hover:border-primary/50 text-center ${formData.job_industry === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('job_industry', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`ind-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`ind-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 7: // Sleep
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Hours of sleep per night</h4>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-primary">{formData.sleep_hours}</span>
                <span className="text-xl text-muted-foreground"> hours</span>
              </div>
              <Slider value={[formData.sleep_hours]} onValueChange={(v) => updateField('sleep_hours', v[0])} min={3} max={12} step={1} className="py-2" />
            </div>
            <div>
              <h4 className="font-medium mb-3">Sleep quality</h4>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-primary">{formData.sleep_quality}</span>
                <span className="text-lg text-muted-foreground">/10</span>
              </div>
              <Slider value={[formData.sleep_quality]} onValueChange={(v) => updateField('sleep_quality', v[0])} min={1} max={10} step={1} className="py-2" />
              <p className="text-center text-sm text-muted-foreground">{getSliderLabel(formData.sleep_quality, 'sleep')}</p>
            </div>
            <div>
              <h4 className="font-medium mb-3">When do you wake up?</h4>
              <RadioGroup value={formData.wake_up_time} onValueChange={(v) => updateField('wake_up_time', v)} className="grid grid-cols-2 gap-2">
                {WAKE_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 text-center ${formData.wake_up_time === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('wake_up_time', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`wake-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`wake-${opt.value}`} className="cursor-pointer">
                      <div className="font-medium text-sm">{opt.label}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 8: // Eating patterns
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Meals per day</h4>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-primary">{formData.meals_per_day}</span>
                <span className="text-xl text-muted-foreground"> meals</span>
              </div>
              <Slider value={[formData.meals_per_day]} onValueChange={(v) => updateField('meals_per_day', v[0])} min={1} max={6} step={1} className="py-2" />
            </div>
            <div>
              <h4 className="font-medium mb-3">Eating style</h4>
              <RadioGroup value={formData.eating_style} onValueChange={(v) => updateField('eating_style', v)} className="space-y-2">
                {EATING_STYLE_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.eating_style === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('eating_style', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`eat-${opt.value}`} className="mt-0.5" />
                    <Label htmlFor={`eat-${opt.value}`} className="cursor-pointer flex-1">
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-3">Hydration level</h4>
              <div className="text-center mb-2">
                <span className="text-3xl font-bold text-primary">{formData.hydration_level}</span>
                <span className="text-lg text-muted-foreground">/10</span>
              </div>
              <Slider value={[formData.hydration_level]} onValueChange={(v) => updateField('hydration_level', v[0])} min={1} max={10} step={1} className="py-2" />
              <p className="text-center text-sm text-muted-foreground">{getSliderLabel(formData.hydration_level, 'hydration')}</p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Dietary restrictions</h4>
              <RadioGroup value={formData.dietary_restrictions} onValueChange={(v) => updateField('dietary_restrictions', v)} className="grid grid-cols-2 gap-2">
                {DIET_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-2 rounded-lg border transition-all cursor-pointer hover:border-primary/50 text-center ${formData.dietary_restrictions === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('dietary_restrictions', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`diet-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`diet-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 9: // Nutrition challenge
        return (
          <div className="space-y-4 py-4">
            <Textarea
              value={formData.biggest_nutrition_challenge}
              onChange={(e) => updateField('biggest_nutrition_challenge', e.target.value)}
              placeholder="e.g., I snack too much at night, I don't drink enough water, I eat out of boredom..."
              className="min-h-[150px] resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {formData.biggest_nutrition_challenge.trim().length < 5 ? `${5 - formData.biggest_nutrition_challenge.trim().length} more characters needed` : "✓ Ready"}
            </p>
          </div>
        );

      case 10: // Fitness
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">How often do you exercise?</h4>
              <RadioGroup value={formData.workout_frequency} onValueChange={(v) => updateField('workout_frequency', v)} className="grid grid-cols-2 gap-2">
                {WORKOUT_FREQUENCY_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.workout_frequency === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('workout_frequency', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`freq-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`freq-${opt.value}`} className="cursor-pointer">
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-3">Preferred workout type</h4>
              <RadioGroup value={formData.preferred_workout} onValueChange={(v) => updateField('preferred_workout', v)} className="space-y-2">
                {WORKOUT_TYPE_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.preferred_workout === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('preferred_workout', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`type-${opt.value}`} className="mt-0.5" />
                    <Label htmlFor={`type-${opt.value}`} className="cursor-pointer flex-1">
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-3">Primary fitness goal</h4>
              <RadioGroup value={formData.fitness_goal} onValueChange={(v) => updateField('fitness_goal', v)} className="grid grid-cols-2 gap-2">
                {FITNESS_GOAL_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.fitness_goal === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('fitness_goal', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`fit-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`fit-${opt.value}`} className="cursor-pointer">
                      <div className="font-medium text-sm">{opt.label}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 11: // Goals
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Primary goal</h4>
              <RadioGroup value={formData.primary_goal} onValueChange={(v) => updateField('primary_goal', v)} className="space-y-2">
                {PRIMARY_GOAL_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.primary_goal === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('primary_goal', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`goal-${opt.value}`} className="mt-0.5" />
                    <Label htmlFor={`goal-${opt.value}`} className="cursor-pointer flex-1">
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-3">Secondary goals (select any that apply)</h4>
              <div className="space-y-2">
                {PRIMARY_GOAL_OPTIONS.filter(g => g.value !== formData.primary_goal).map((opt) => (
                  <div key={opt.value} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.secondary_goals.includes(opt.value) ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => toggleSecondaryGoal(opt.value)}>
                    <Checkbox checked={formData.secondary_goals.includes(opt.value)} id={`sec-${opt.value}`} />
                    <Label htmlFor={`sec-${opt.value}`} className="cursor-pointer flex-1 text-sm">{opt.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 12: // Lifestyle
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Occupation</h4>
              <RadioGroup value={formData.occupation_type} onValueChange={(v) => updateField('occupation_type', v)} className="grid grid-cols-2 gap-2">
                {OCCUPATION_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.occupation_type === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('occupation_type', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`occ-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`occ-${opt.value}`} className="cursor-pointer">
                      <div className="font-medium text-sm">{opt.label}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-3">Family situation</h4>
              <RadioGroup value={formData.family_situation} onValueChange={(v) => updateField('family_situation', v)} className="grid grid-cols-2 gap-2">
                {FAMILY_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.family_situation === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('family_situation', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`fam-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`fam-${opt.value}`} className="cursor-pointer">
                      <div className="font-medium text-sm">{opt.label}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h4 className="font-medium mb-3">Biggest life priority right now</h4>
              <RadioGroup value={formData.biggest_life_priority} onValueChange={(v) => updateField('biggest_life_priority', v)} className="grid grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map((opt) => (
                  <div key={opt.value} className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.biggest_life_priority === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('biggest_life_priority', opt.value)}>
                    <RadioGroupItem value={opt.value} id={`pri-${opt.value}`} className="sr-only" />
                    <Label htmlFor={`pri-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 13: // Time
        return (
          <RadioGroup value={formData.time_available} onValueChange={(v) => updateField('time_available', v)} className="space-y-3">
            {TIME_OPTIONS.map((opt) => (
              <div key={opt.value} className={`flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${formData.time_available === opt.value ? "border-primary bg-primary/5" : "border-border"}`} onClick={() => updateField('time_available', opt.value)}>
                <RadioGroupItem value={opt.value} id={`time-${opt.value}`} className="mt-0.5" />
                <Label htmlFor={`time-${opt.value}`} className="cursor-pointer flex-1">
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm text-muted-foreground">{opt.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 14: // About you
        return (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Describe yourself - your strengths, weaknesses, what makes you who you are...</p>
            <Textarea
              value={formData.describe_yourself}
              onChange={(e) => updateField('describe_yourself', e.target.value)}
              placeholder="I am someone who... My strengths are... I struggle with..."
              className="min-h-[200px] resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {formData.describe_yourself.trim().length < 20 ? `${20 - formData.describe_yourself.trim().length} more characters needed` : "✓ Ready"}
            </p>
          </div>
        );

      case 15: // Vision
        return (
          <div className="space-y-6 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Where do you want to be in 1 year?</p>
              <Textarea
                value={formData.where_you_want_to_be}
                onChange={(e) => updateField('where_you_want_to_be', e.target.value)}
                placeholder="In one year, I see myself..."
                className="min-h-[120px] resize-none"
              />
              <p className="text-sm text-muted-foreground text-right mt-1">
                {formData.where_you_want_to_be.trim().length < 20 ? `${20 - formData.where_you_want_to_be.trim().length} more characters` : "✓"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">What's been holding you back?</p>
              <Textarea
                value={formData.what_holds_you_back}
                onChange={(e) => updateField('what_holds_you_back', e.target.value)}
                placeholder="The main thing stopping me is..."
                className="min-h-[100px] resize-none"
              />
              <p className="text-sm text-muted-foreground text-right mt-1">
                {formData.what_holds_you_back.trim().length < 10 ? `${10 - formData.what_holds_you_back.trim().length} more characters` : "✓"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">What's your biggest challenge right now?</p>
              <Textarea
                value={formData.biggest_challenge}
                onChange={(e) => updateField('biggest_challenge', e.target.value)}
                placeholder="My biggest challenge is..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
        );

      case 16: // Commitment
        return (
          <div className="space-y-6 py-4">
            <p className="text-center text-muted-foreground">On a scale of 1-10, how committed are you to transforming your life?</p>
            <div className="text-center">
              <span className="text-6xl font-bold text-primary">{formData.commitment_level}</span>
              <span className="text-3xl text-muted-foreground">/10</span>
            </div>
            <Slider value={[formData.commitment_level]} onValueChange={(v) => updateField('commitment_level', v[0])} min={1} max={10} step={1} className="py-4" />
            <p className="text-center text-xl font-medium text-primary">{getSliderLabel(formData.commitment_level, 'commitment')}</p>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Based on your answers, we'll create a personalized report with your recommended lessons, diet plan, and training program.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGeneratingPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center p-8">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Creating Your Personalized Plan</h2>
              <p className="text-muted-foreground">Our AI coach is analyzing your responses to create a custom diet, training, and lesson plan just for you...</p>
            </div>
            <Progress value={66} className="h-2" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative z-10 glass-effect border-border/50 max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="text-center pb-2 flex-shrink-0">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <StepIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-base">{currentStepData.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px]"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canProceed() || isSubmitting} className="flex-1">
              {currentStep === STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Creating Plan..." : "Generate My Plan"}
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
