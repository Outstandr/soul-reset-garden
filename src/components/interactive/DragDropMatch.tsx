import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DragDropMatchProps {
  config: {
    title: string;
    activities: string[];
    fuelTypes: string[];
    correctMatches: Record<string, string>;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const DragDropMatch = ({ config, onComplete, savedResponse }: DragDropMatchProps) => {
  const [matches, setMatches] = useState<Record<string, string>>(
    savedResponse?.matches || {}
  );
  const [submitted, setSubmitted] = useState(!!savedResponse);
  const [showResults, setShowResults] = useState(false);

  const handleMatch = (activity: string, fuel: string) => {
    setMatches({ ...matches, [activity]: fuel });
  };

  const handleSubmit = () => {
    onComplete({ matches });
    setSubmitted(true);
    setShowResults(true);
  };

  const allMatched = config.activities.every(activity => matches[activity]);
  const correctCount = config.activities.filter(
    activity => matches[activity] === config.correctMatches[activity]
  ).length;

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>Match the correct fuel type to each activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {config.activities.map((activity) => (
          <div key={activity} className="space-y-2">
            <label className="font-medium">{activity}</label>
            <Select 
              value={matches[activity]} 
              onValueChange={(val) => handleMatch(activity, val)}
              disabled={submitted}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type..." />
              </SelectTrigger>
              <SelectContent>
                {config.fuelTypes.map((fuel) => (
                  <SelectItem key={fuel} value={fuel}>
                    {fuel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showResults && (
              <p className={`text-sm ${matches[activity] === config.correctMatches[activity] ? 'text-primary' : 'text-destructive'}`}>
                {matches[activity] === config.correctMatches[activity] ? '✓ Correct!' : `✗ Correct answer: ${config.correctMatches[activity]}`}
              </p>
            )}
          </div>
        ))}

        {allMatched && !submitted && (
          <Button onClick={handleSubmit} className="w-full">
            Check My Answers
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium mb-1">
              Score: {correctCount}/{config.activities.length}
            </p>
            <p className="text-sm text-muted-foreground">✓ Quiz completed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};