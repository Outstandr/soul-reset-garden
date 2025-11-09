import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface DecisionFilterProps {
  config: {
    title?: string;
    description?: string;
    scenario: string;
    options: { value: string; label: string }[];
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const DecisionFilter = ({ config, onComplete, savedResponse }: DecisionFilterProps) => {
  const [selectedOption, setSelectedOption] = useState(savedResponse?.decision || "");
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    if (!selectedOption) return;
    onComplete({ decision: selectedOption });
    setSubmitted(true);
  };

  // Handle missing or invalid config
  if (!config?.options || !Array.isArray(config.options)) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Interactive configuration not available for this lesson.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-reset-execution/20">
            <Filter className="w-6 h-6 text-reset-execution" />
          </div>
          <div>
            <CardTitle>{config.title || "Decision Filter"}</CardTitle>
            <CardDescription>
              {config.description || "Apply your decision-making framework"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium">{config.scenario}</p>
        </div>

        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          disabled={submitted}
          className="space-y-3"
        >
          {config.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value={option.value} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="text-sm font-medium cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {!submitted && selectedOption && (
          <Button onClick={handleSubmit} className="w-full">
            Submit Decision
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-reset-execution/10 border border-reset-execution/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Decision recorded</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
