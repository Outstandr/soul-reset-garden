import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";

interface DiscomfortBreathProps {
  config: {
    title?: string;
    description?: string;
    breathCycles?: number;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const DiscomfortBreath = ({ config, onComplete, savedResponse }: DiscomfortBreathProps) => {
  const [currentCycle, setCurrentCycle] = useState(savedResponse?.completedCycles || 0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [submitted, setSubmitted] = useState(!!savedResponse);
  
  const totalCycles = config.breathCycles || 5;

  const startBreathing = () => {
    if (submitted) return;
    setIsActive(true);
    performBreathCycle();
  };

  const performBreathCycle = () => {
    setPhase("inhale");
    setTimeout(() => {
      setPhase("hold");
      setTimeout(() => {
        setPhase("exhale");
        setTimeout(() => {
          setCurrentCycle(prev => {
            const newCycle = prev + 1;
            if (newCycle >= totalCycles) {
              setIsActive(false);
              handleComplete(newCycle);
            } else {
              performBreathCycle();
            }
            return newCycle;
          });
        }, 4000);
      }, 4000);
    }, 4000);
  };

  const handleComplete = (cycles: number) => {
    onComplete({ completedCycles: cycles });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-reset-mind/20">
            <Wind className="w-6 h-6 text-reset-mind" />
          </div>
          <div>
            <CardTitle>{config.title || "Discomfort Breathing"}</CardTitle>
            <CardDescription>
              {config.description || "Practice breathing through discomfort"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-primary">
            {currentCycle}/{totalCycles}
          </div>
          <p className="text-lg text-muted-foreground">Breath Cycles Completed</p>

          {isActive && (
            <div className="py-8">
              <div className={`text-3xl font-bold transition-all duration-1000 ${
                phase === "inhale" ? "text-reset-mind scale-110" :
                phase === "hold" ? "text-reset-energy scale-100" :
                "text-reset-execution scale-90"
              }`}>
                {phase === "inhale" ? "INHALE" :
                 phase === "hold" ? "HOLD" :
                 "EXHALE"}
              </div>
            </div>
          )}
        </div>

        {!submitted && !isActive && currentCycle < totalCycles && (
          <Button onClick={startBreathing} className="w-full">
            {currentCycle === 0 ? "Start Breathing Exercise" : "Continue"}
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-reset-mind/10 border border-reset-mind/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ✓ Breathing exercise completed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
