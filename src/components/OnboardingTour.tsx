import { useEffect, useCallback } from "react";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingTourProps {
  onComplete: () => void;
}

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
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

  useEffect(() => {
    const steps: DriveStep[] = [
      {
        element: "#hero-section",
        popover: {
          title: "Welcome to Your Journey",
          description: "This is your personalized dashboard. Everything you need for your transformation journey is right here.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "#first-module-card",
        popover: {
          title: "Your Learning Modules",
          description: "Start with 'Reset by Discipline' - your first step to mastering self-discipline. Complete modules to unlock the next ones.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#next-steps-card",
        popover: {
          title: "Daily Reflection",
          description: "Build the habit of reflection. Click here to access your journal and track your growth.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#lionel-coach",
        popover: {
          title: "Meet Lionel X",
          description: "Your personal AI coach is here 24/7. Ask questions, get personalized advice based on your progress.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#chat-input",
        popover: {
          title: "Start a Conversation",
          description: "Type your question here or switch to Voice mode for a real-time spoken conversation.",
          side: "top",
          align: "center",
        },
      },
      {
        element: "#quick-access",
        popover: {
          title: "Quick Access Resources",
          description: "Access the Masterclass Library, download the e-book, or jump to your journal anytime.",
          side: "top",
          align: "center",
        },
      },
      {
        popover: {
          title: "You're Ready!",
          description: "Start your journey by clicking on the first module. Lionel X is always here if you need guidance. Let's go!",
        },
      },
    ];

    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      steps,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Let's Go!",
      progressText: "{{current}} of {{total}}",
      onDestroyStarted: () => {
        markOnboardingComplete();
        driverObj.destroy();
      },
    });

    // Small delay to ensure DOM elements are ready
    const timer = setTimeout(() => {
      driverObj.drive();
    }, 500);

    return () => {
      clearTimeout(timer);
      driverObj.destroy();
    };
  }, [markOnboardingComplete]);

  return null;
};
