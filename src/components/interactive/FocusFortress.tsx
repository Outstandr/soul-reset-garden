import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";

interface FocusFortressProps {
  config: {
    title?: string;
    description?: string;
    distractions: string[];
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const FocusFortress = ({ config, onComplete, savedResponse }: FocusFortressProps) => {
  const [selectedDistractions, setSelectedDistractions] = useState<string[]>(
    savedResponse?.distractions || []
  );
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleToggle = (distraction: string) => {
    if (submitted) return;
    setSelectedDistractions(prev =>
      prev.includes(distraction)
        ? prev.filter(d => d !== distraction)
        : [...prev, distraction]
    );
  };

  const handleSubmit = () => {
    onComplete({ distractions: selectedDistractions });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-reset-energy/20">
            <Shield className="w-6 h-6 text-reset-energy" />
          </div>
          <div>
            <CardTitle>{config.title || "Focus Fortress"}</CardTitle>
            <CardDescription>
              {config.description || "Identify and eliminate your biggest distractions"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {config.distractions.map((distraction, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={`distraction-${index}`}
                checked={selectedDistractions.includes(distraction)}
                onCheckedChange={() => handleToggle(distraction)}
                disabled={submitted}
              />
              <label
                htmlFor={`distraction-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {distraction}
              </label>
            </div>
          ))}
        </div>

        {!submitted && selectedDistractions.length > 0 && (
          <Button onClick={handleSubmit} className="w-full">
            Build My Focus Fortress
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-reset-energy/10 border border-reset-energy/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ✓ You've identified {selectedDistractions.length} distraction(s) to eliminate
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
