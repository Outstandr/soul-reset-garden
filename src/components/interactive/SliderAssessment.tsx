import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SliderAssessmentProps {
  config: {
    question: string;
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const SliderAssessment = ({ config, onComplete, savedResponse }: SliderAssessmentProps) => {
  const [value, setValue] = useState(savedResponse?.value || 5);
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    onComplete({ value });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Self-Assessment</CardTitle>
        <CardDescription>{config.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{config.minLabel}</span>
            <span className="text-2xl font-bold text-primary">{value}</span>
            <span>{config.maxLabel}</span>
          </div>
          <Slider
            value={[value]}
            onValueChange={(vals) => setValue(vals[0])}
            min={config.min}
            max={config.max}
            step={1}
            disabled={submitted}
            className="w-full"
          />
        </div>

        {!submitted && (
          <Button onClick={handleSubmit} className="w-full">
            Submit Assessment
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">✓ Assessment completed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};