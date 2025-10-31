import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, X, Sparkles } from "lucide-react";

interface CognitiveSovereigntyProps {
  config: {
    steps: string[];
  };
  onComplete: (response: { negative: string; challenged: boolean; replacement: string }) => void;
  savedResponse?: { negative: string; challenged: boolean; replacement: string };
}

export const CognitiveSovereignty = ({ config, onComplete, savedResponse }: CognitiveSovereigntyProps) => {
  const [step, setStep] = useState(savedResponse ? 3 : 1);
  const [negative, setNegative] = useState(savedResponse?.negative || "");
  const [challenged, setChallenged] = useState(savedResponse?.challenged || false);
  const [replacement, setReplacement] = useState(savedResponse?.replacement || "");

  const handleNext = () => {
    if (step === 3 && negative && challenged && replacement) {
      onComplete({ negative, challenged, replacement });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Cognitive Sovereignty Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step >= 1 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-accent">
              <X className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Step 1: Catch</h3>
            </div>
            <p className="text-sm text-muted-foreground">{config.steps[0]}</p>
            <Textarea
              value={negative}
              onChange={(e) => setNegative(e.target.value)}
              placeholder="e.g., I'm not good enough for this role"
              disabled={step > 1}
              rows={3}
            />
          </div>
        )}

        {step >= 2 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-destructive">
              <X className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Step 2: Challenge</h3>
            </div>
            <p className="text-sm text-muted-foreground">{config.steps[1]}</p>
            <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-destructive bg-destructive/10">
              <Checkbox
                checked={challenged}
                onCheckedChange={(checked) => setChallenged(checked as boolean)}
                disabled={step > 2}
              />
              <label className="text-sm font-medium">
                I said "That's not true" out loud
              </label>
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Step 3: Replace</h3>
            </div>
            <p className="text-sm text-muted-foreground">{config.steps[2]}</p>
            <Textarea
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="e.g., I am capable and continuously growing"
              rows={3}
            />
          </div>
        )}

        {step < 3 && (
          <Button 
            onClick={handleNext} 
            className="w-full" 
            size="lg"
            disabled={step === 1 && !negative || step === 2 && !challenged}
          >
            Continue to Step {step + 1}
          </Button>
        )}

        {step === 3 && negative && challenged && replacement && (
          <Button onClick={handleNext} className="w-full" size="lg">
            Complete Tool
          </Button>
        )}

        {savedResponse && (
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-2">Sovereignty Claimed</h3>
            <p className="text-muted-foreground">
              You now have the power to catch, challenge, and replace any thought. This is your cognitive sovereignty.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};