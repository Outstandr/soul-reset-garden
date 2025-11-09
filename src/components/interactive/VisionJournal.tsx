import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";

interface VisionJournalProps {
  config: {
    title?: string;
    description?: string;
    prompts: string[];
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const VisionJournal = ({ config, onComplete, savedResponse }: VisionJournalProps) => {
  const [responses, setResponses] = useState<Record<string, string>>(
    savedResponse?.responses || {}
  );
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleResponseChange = (prompt: string, value: string) => {
    setResponses(prev => ({ ...prev, [prompt]: value }));
  };

  const handleSubmit = () => {
    onComplete({ responses });
    setSubmitted(true);
  };

  const allFilled = (config.prompts || []).every(prompt => responses[prompt]?.trim());

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-reset-mind/20">
            <Eye className="w-6 h-6 text-reset-mind" />
          </div>
          <div>
            <CardTitle>{config.title || "Vision Journal"}</CardTitle>
            <CardDescription>
              {config.description || "Clarify your vision for the future"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {(config.prompts || []).map((prompt, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`prompt-${index}`} className="text-sm font-medium">
              {prompt}
            </Label>
            <Textarea
              id={`prompt-${index}`}
              value={responses[prompt] || ""}
              onChange={(e) => handleResponseChange(prompt, e.target.value)}
              disabled={submitted}
              placeholder="Write your vision..."
              className="min-h-[120px]"
            />
          </div>
        ))}

        {!submitted && allFilled && (
          <Button onClick={handleSubmit} className="w-full">
            Save Vision
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-reset-mind/10 border border-reset-mind/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Vision captured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
