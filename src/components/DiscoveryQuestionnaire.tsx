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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Zap, Heart, Target, Mountain, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const STEPS = [
  {
    id: "energy",
    title: "Your Energy Level",
    description: "How would you rate your current daily energy level?",
    icon: Zap,
  },
  {
    id: "health",
    title: "Your Health",
    description: "How would you rate your overall physical health?",
    icon: Heart,
  },
  {
    id: "goal",
    title: "Your Primary Goal",
    description: "What do you most want to achieve with Leader Performance Academy?",
    icon: Target,
  },
  {
    id: "challenge",
    title: "Your Biggest Challenge",
    description: "What's the main obstacle standing in your way right now?",
    icon: Mountain,
  },
];

const GOALS = [
  { value: "discipline", label: "Build Unshakeable Discipline", description: "Master self-control and consistency" },
  { value: "energy", label: "Maximize Energy & Vitality", description: "Feel energized and focused every day" },
  { value: "mindset", label: "Develop a Winning Mindset", description: "Strengthen mental resilience" },
  { value: "performance", label: "Peak Performance", description: "Optimize all areas of life" },
  { value: "balance", label: "Life Balance", description: "Harmonize work, health, and relationships" },
];

interface DiscoveryQuestionnaireProps {
  onComplete: () => void;
}

export const DiscoveryQuestionnaire = ({ onComplete }: DiscoveryQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [healthLevel, setHealthLevel] = useState(5);
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true; // Slider always has a value
      case 1:
        return true; // Slider always has a value
      case 2:
        return primaryGoal !== "";
      case 3:
        return biggestChallenge.trim().length >= 10;
      default:
        return false;
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

      const { error } = await supabase
        .from("user_discovery")
        .insert({
          user_id: user.id,
          energy_level: energyLevel,
          health_level: healthLevel,
          primary_goal: primaryGoal,
          biggest_challenge: biggestChallenge,
        });

      if (error) throw error;

      toast.success("Welcome to Leader Performance Academy!");
      onComplete();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving discovery:", error);
      toast.error("Failed to save your responses. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnergyLabel = (value: number) => {
    if (value <= 3) return "Low - Feeling drained";
    if (value <= 6) return "Moderate - Some good days";
    if (value <= 8) return "Good - Mostly energized";
    return "Excellent - Peak energy";
  };

  const getHealthLabel = (value: number) => {
    if (value <= 3) return "Needs improvement";
    if (value <= 6) return "Moderate - Room to grow";
    if (value <= 8) return "Good - Generally healthy";
    return "Excellent - Optimal health";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative z-10 glass-effect border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <StepIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-base">{currentStepData.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px]"
            >
              {currentStep === 0 && (
                <div className="space-y-6 py-4">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-primary">{energyLevel}</span>
                    <span className="text-2xl text-muted-foreground">/10</span>
                  </div>
                  <Slider
                    value={[energyLevel]}
                    onValueChange={(value) => setEnergyLevel(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="py-4"
                  />
                  <p className="text-center text-muted-foreground">{getEnergyLabel(energyLevel)}</p>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6 py-4">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-primary">{healthLevel}</span>
                    <span className="text-2xl text-muted-foreground">/10</span>
                  </div>
                  <Slider
                    value={[healthLevel]}
                    onValueChange={(value) => setHealthLevel(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="py-4"
                  />
                  <p className="text-center text-muted-foreground">{getHealthLabel(healthLevel)}</p>
                </div>
              )}

              {currentStep === 2 && (
                <RadioGroup value={primaryGoal} onValueChange={setPrimaryGoal} className="space-y-3">
                  {GOALS.map((goal) => (
                    <div
                      key={goal.value}
                      className={`flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${
                        primaryGoal === goal.value ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setPrimaryGoal(goal.value)}
                    >
                      <RadioGroupItem value={goal.value} id={goal.value} className="mt-0.5" />
                      <Label htmlFor={goal.value} className="cursor-pointer flex-1">
                        <div className="font-medium">{goal.label}</div>
                        <div className="text-sm text-muted-foreground">{goal.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 py-4">
                  <Textarea
                    value={biggestChallenge}
                    onChange={(e) => setBiggestChallenge(e.target.value)}
                    placeholder="Describe the main obstacle you're facing right now..."
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {biggestChallenge.trim().length < 10 
                      ? `${10 - biggestChallenge.trim().length} more characters needed` 
                      : "✓ Ready to continue"}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="flex-1"
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Start Your Journey"}
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
