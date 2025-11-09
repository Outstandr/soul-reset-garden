import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

interface AlreadyGoodProps {
  config: {
    title?: string;
    description?: string;
    prompt: string;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const AlreadyGood = ({ config, onComplete, savedResponse }: AlreadyGoodProps) => {
  const [reflection, setReflection] = useState(savedResponse?.reflection || "");
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    if (!reflection.trim()) return;
    onComplete({ reflection });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <CardTitle>{config.title || "Already Good"}</CardTitle>
            <CardDescription>
              {config.description || "Acknowledge what's working"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium">{config.prompt}</p>
        </div>

        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          disabled={submitted}
          placeholder="Write your reflection here..."
          className="min-h-[150px]"
        />

        {!submitted && reflection.trim() && (
          <Button onClick={handleSubmit} className="w-full">
            Save Reflection
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Reflection saved</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
