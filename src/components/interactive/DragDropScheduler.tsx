import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DragDropSchedulerProps {
  config: {
    title: string;
    timeBlocks: Array<{ time: string; label: string; options: string[] }>;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const DragDropScheduler = ({ config, onComplete, savedResponse }: DragDropSchedulerProps) => {
  const [selections, setSelections] = useState<Record<string, string>>(
    savedResponse?.selections || {}
  );
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSelect = (time: string, value: string) => {
    setSelections({ ...selections, [time]: value });
  };

  const handleSubmit = () => {
    onComplete({ selections });
    setSubmitted(true);
  };

  const allSelected = config.timeBlocks.every(block => selections[block.time]);

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>Build your daily energy management system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {config.timeBlocks.map((block) => (
          <div key={block.time} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">{block.time}</span>
              <span className="text-sm text-muted-foreground">{block.label}</span>
            </div>
            <Select 
              value={selections[block.time]} 
              onValueChange={(val) => handleSelect(block.time, val)}
              disabled={submitted}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action..." />
              </SelectTrigger>
              <SelectContent>
                {block.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {allSelected && !submitted && (
          <Button onClick={handleSubmit} className="w-full">
            Save My System
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Daily system created</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};