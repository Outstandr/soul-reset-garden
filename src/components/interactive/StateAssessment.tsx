import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StateAssessmentProps {
  config: {
    question: string;
    states: string[];
    followUp: string;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const StateAssessment = ({ config, onComplete, savedResponse }: StateAssessmentProps) => {
  const [selectedState, setSelectedState] = useState(savedResponse?.selectedState || "");
  const [reason, setReason] = useState(savedResponse?.reason || "");
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    onComplete({ selectedState, reason });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Physiological State Assessment</CardTitle>
        <CardDescription>{config.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {config.states.map((state) => (
            <Button
              key={state}
              variant={selectedState === state ? "default" : "outline"}
              onClick={() => !submitted && setSelectedState(state)}
              disabled={submitted}
              className="h-auto py-4"
            >
              {state}
            </Button>
          ))}
        </div>

        {selectedState && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{config.followUp}</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitted}
              placeholder="Your answer..."
              className="min-h-[100px]"
            />
          </div>
        )}

        {selectedState && reason && !submitted && (
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Assessment completed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};