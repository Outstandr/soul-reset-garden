import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingTourProps {
  onComplete: () => void;
}

export const OnboardingTour = ({ onComplete }: OnboardingTourProps) => {
  const [isReady, setIsReady] = useState(false);

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

  // Load driver.js dynamically to avoid React context conflicts
  useEffect(() => {
    let driverObj: any = null;
    let isMounted = true;

    const initDriver = async () => {
      try {
        // Dynamic import to ensure React is fully initialized
        const [driverModule] = await Promise.all([
          import("driver.js"),
          import("driver.js/dist/driver.css"),
        ]);

        if (!isMounted) return;

        const { driver } = driverModule;

        const steps = [
          {
            element: "#hero-section",
            popover: {
              title: "Welcome to Your Journey",
              description: "This is your personalized dashboard. Everything you need for your transformation journey is right here.",
              side: "bottom" as const,
              align: "center" as const,
            },
          },
          {
            element: "#first-module-card",
            popover: {
              title: "Your Learning Modules",
              description: "Start with 'Reset by Discipline' - your first step to mastering self-discipline. Complete modules to unlock the next ones.",
              side: "bottom" as const,
              align: "start" as const,
            },
          },
          {
            element: "#next-steps-card",
            popover: {
              title: "Daily Reflection",
              description: "Build the habit of reflection. Click here to access your journal and track your growth.",
              side: "top" as const,
              align: "center" as const,
            },
          },
          {
            element: "#lionel-coach",
            popover: {
              title: "Meet Lionel X",
              description: "Your personal AI coach is here 24/7. Ask questions, get personalized advice based on your progress.",
              side: "top" as const,
              align: "center" as const,
            },
          },
          {
            element: "#chat-input",
            popover: {
              title: "Start a Conversation",
              description: "Type your question here or switch to Voice mode for a real-time spoken conversation.",
              side: "top" as const,
              align: "center" as const,
            },
          },
          {
            element: "#quick-access",
            popover: {
              title: "Quick Access Resources",
              description: "Access the Masterclass Library, download the e-book, or jump to your journal anytime.",
              side: "top" as const,
              align: "center" as const,
            },
          },
          {
            popover: {
              title: "You're Ready!",
              description: "Start your journey by clicking on the first module. Lionel X is always here if you need guidance. Let's go!",
            },
          },
        ];

        driverObj = driver({
          showProgress: true,
          showButtons: ["next", "previous", "close"],
          steps,
          nextBtnText: "Next →",
          prevBtnText: "← Back",
          doneBtnText: "Let's Go!",
          progressText: "{{current}} of {{total}}",
          onDestroyStarted: () => {
            markOnboardingComplete();
            if (driverObj) driverObj.destroy();
          },
        });

        setIsReady(true);

        // Small delay to ensure DOM elements are ready
        setTimeout(() => {
          if (isMounted && driverObj) {
            driverObj.drive();
          }
        }, 300);
      } catch (error) {
        console.error("Error initializing driver.js:", error);
      }
    };

    // Delay initialization to ensure React is fully ready
    const timer = setTimeout(initDriver, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (driverObj) {
        try {
          driverObj.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [markOnboardingComplete]);

  return null;
};
