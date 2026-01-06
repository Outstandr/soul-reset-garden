import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingTourProps {
  onComplete: () => void;
}

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "#hero-section",
    title: "Welcome to Your Journey",
    description: "This is your personalized dashboard. Everything you need for your transformation journey is right here.",
    position: "bottom",
  },
  {
    target: "#first-module-card",
    title: "Your Learning Modules",
    description: "Start with 'Reset by Discipline' - your first step to mastering self-discipline. Complete modules to unlock the next ones.",
    position: "bottom",
  },
  {
    target: "#next-steps-card",
    title: "Daily Reflection",
    description: "Build the habit of reflection. Click here to access your journal and track your growth.",
    position: "top",
  },
  {
    target: "#lionel-coach",
    title: "Meet Lionel X",
    description: "Your personal AI coach is here 24/7. Ask questions, get personalized advice based on your progress.",
    position: "top",
  },
  {
    target: "#chat-input",
    title: "Start a Conversation",
    description: "Type your question here or switch to Voice mode for a real-time spoken conversation.",
    position: "top",
  },
  {
    target: "#quick-access",
    title: "Quick Access Resources",
    description: "Access the Masterclass Library, download the e-book, or jump to your journal anytime.",
    position: "top",
  },
];

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const markOnboardingComplete = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ has_completed_onboarding: true })
          .eq("id", user.id);
      }
    } catch (error) {
      console.error("Error marking onboarding complete:", error);
    }
    onComplete();
  }, [onComplete]);

  const updateTargetPosition = useCallback(() => {
    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      updateTargetPosition();
    }, 500);

    return () => clearTimeout(timer);
  }, [updateTargetPosition]);

  useEffect(() => {
    updateTargetPosition();
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition);
    return () => {
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition);
    };
  }, [currentStep, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      markOnboardingComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    markOnboardingComplete();
  };

  if (!isVisible || !targetRect) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  // Calculate popover position
  const getPopoverStyle = (): React.CSSProperties => {
    const padding = 16;
    const popoverWidth = 320;
    const popoverHeight = 180;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case "bottom":
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
        break;
      case "top":
        top = targetRect.top - popoverHeight - padding;
        left = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - popoverHeight / 2;
        left = targetRect.left - popoverWidth - padding;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - popoverHeight / 2;
        left = targetRect.right + padding;
        break;
    }

    // Keep within viewport
    left = Math.max(padding, Math.min(left, window.innerWidth - popoverWidth - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - popoverHeight - padding));

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`,
      zIndex: 10001,
    };
  };

  return (
    <>
      {/* Overlay with spotlight effect */}
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>

        {/* Spotlight border glow */}
        <div
          className="absolute rounded-xl border-2 border-primary shadow-glow animate-pulse"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      </div>

      {/* Popover */}
      <Card
        className="pointer-events-auto shadow-strong border-2 border-primary/30 bg-card"
        style={getPopoverStyle()}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-2"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {tourSteps.length}
            </span>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrev}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {isLastStep ? "Let's Go!" : "Next"}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
