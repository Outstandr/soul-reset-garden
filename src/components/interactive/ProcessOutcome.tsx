import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Target, TrendingUp } from "lucide-react";

interface ProcessOutcomeProps {
  config: {
    prompts: {
      goal: string;
      outcome: string;
      processes: string;
    };
  };
  onComplete: (response: { goal: string; outcome: string; processes: string[] }) => void;
  savedResponse?: { goal: string; outcome: string; processes: string[] };
}

export const ProcessOutcome = ({ config, onComplete, savedResponse }: ProcessOutcomeProps) => {
  const [goal, setGoal] = useState(savedResponse?.goal || "");
  const [outcome, setOutcome] = useState(savedResponse?.outcome || "");
  const [process1, setProcess1] = useState(savedResponse?.processes[0] || "");
  const [process2, setProcess2] = useState(savedResponse?.processes[1] || "");
  const [process3, setProcess3] = useState(savedResponse?.processes[2] || "");
  const [completed, setCompleted] = useState(!!savedResponse);

  const handleSubmit = () => {
    const processes = [process1, process2, process3].filter(p => p.trim() !== "");
    if (goal && outcome && processes.length === 3) {
      setCompleted(true);
      onComplete({ goal, outcome, processes });
    }
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text flex items-center gap-2">
          <Target className="w-6 h-6" />
          Process vs. Outcome Toggle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{config.prompts.goal}</label>
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Get promoted to Senior Manager"
            disabled={completed}
          />
        </div>

        <div className="border-l-4 border-accent pl-4">
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            {config.prompts.outcome}
          </label>
          <Textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="e.g., Get the promotion by end of year"
            disabled={completed}
            rows={2}
          />
        </div>

        <div className="border-l-4 border-primary pl-4 space-y-3">
          <label className="block text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            {config.prompts.processes}
          </label>
          
          <Input
            value={process1}
            onChange={(e) => setProcess1(e.target.value)}
            placeholder="Process 1: e.g., Prepare for 1 hour daily"
            disabled={completed}
          />
          <Input
            value={process2}
            onChange={(e) => setProcess2(e.target.value)}
            placeholder="Process 2: e.g., Ask for feedback weekly"
            disabled={completed}
          />
          <Input
            value={process3}
            onChange={(e) => setProcess3(e.target.value)}
            placeholder="Process 3: e.g., Communicate my value monthly"
            disabled={completed}
          />
        </div>

        {!completed && (
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            size="lg"
            disabled={!goal || !outcome || !process1 || !process2 || !process3}
          >
            Lock In Your Processes
          </Button>
        )}

        {completed && (
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-2">Outcome Independence Activated</h3>
            <p className="text-muted-foreground">
              Focus on your three processes. The outcome will take care of itself when you master the process.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};