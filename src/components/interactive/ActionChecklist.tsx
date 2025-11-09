import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ActionChecklistProps {
  config: {
    title: string;
    description: string;
    items: string[];
    finalButton: string;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const ActionChecklist = ({ config, onComplete, savedResponse }: ActionChecklistProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    savedResponse?.checkedItems || {}
  );
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleCheck = (item: string, checked: boolean) => {
    setCheckedItems({ ...checkedItems, [item]: checked });
  };

  const handleSubmit = () => {
    onComplete({ checkedItems, timestamp: new Date().toISOString() });
    setSubmitted(true);
  };

  // Handle missing or invalid config
  if (!config?.items || !Array.isArray(config.items)) {
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

  const allChecked = config.items.every(item => checkedItems[item]);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {config.items.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50">
              <Checkbox
                id={`item-${index}`}
                checked={checkedItems[item] || false}
                onCheckedChange={(val) => !submitted && handleCheck(item, val as boolean)}
                disabled={submitted}
                className="mt-1"
              />
              <label htmlFor={`item-${index}`} className="flex-1 text-sm leading-relaxed cursor-pointer">
                {item}
              </label>
            </div>
          ))}
        </div>

        {allChecked && !submitted && (
          <Button onClick={handleSubmit} className="w-full" size="lg">
            {config.finalButton}
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-lg font-semibold text-primary">✓ Challenge Accepted! 🚀</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};