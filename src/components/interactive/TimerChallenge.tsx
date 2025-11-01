import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimerChallengeProps {
  config: {
    title: string;
    instructions: string;
    duration: number; // in seconds
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const TimerChallenge = ({ config, onComplete, savedResponse }: TimerChallengeProps) => {
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(!!savedResponse);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const markComplete = () => {
    onComplete({ completed: true, timestamp: new Date().toISOString() });
    setCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.instructions}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Clock className="w-16 h-16 text-primary mb-4" />
          <div className="text-6xl font-bold gradient-text">
            {formatTime(timeLeft)}
          </div>
        </div>

        {!isRunning && timeLeft === config.duration && !completed && (
          <Button onClick={startTimer} className="w-full" size="lg">
            Start {config.duration / 60} Minute Timer
          </Button>
        )}

        {isRunning && (
          <div className="text-center text-muted-foreground">
            Challenge in progress... Hold your pose!
          </div>
        )}

        {!isRunning && timeLeft === 0 && !completed && (
          <Button onClick={markComplete} className="w-full" size="lg">
            I Did It! ✓
          </Button>
        )}

        {completed && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-lg font-semibold text-primary">Challenge Complete! 🎉</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};