import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface CommitmentCheckboxProps {
  config: {
    title: string;
    commitment: string;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const CommitmentCheckbox = ({ config, onComplete, savedResponse }: CommitmentCheckboxProps) => {
  const [checked, setChecked] = useState(savedResponse?.checked || false);
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    onComplete({ checked, timestamp: new Date().toISOString() });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
          <Checkbox
            id="commitment"
            checked={checked}
            onCheckedChange={(val) => !submitted && setChecked(val as boolean)}
            disabled={submitted}
            className="mt-1"
          />
          <label htmlFor="commitment" className="flex-1 text-sm leading-relaxed cursor-pointer">
            {config.commitment}
          </label>
        </div>

        {checked && !submitted && (
          <Button onClick={handleSubmit} className="w-full">
            Make This Pledge
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm font-semibold text-primary">✓ Commitment Made!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};