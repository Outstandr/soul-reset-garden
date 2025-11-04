import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";

interface ActionCommitmentProps {
  config: {
    title?: string;
    description?: string;
    prompts?: string[];
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const ActionCommitment = ({ config, onComplete, savedResponse }: ActionCommitmentProps) => {
  const [action, setAction] = useState(savedResponse?.action || "");
  const [deadline, setDeadline] = useState(savedResponse?.deadline || "");
  const [accountability, setAccountability] = useState(savedResponse?.accountability || "");
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    if (!action || !deadline) return;
    onComplete({ action, deadline, accountability });
    setSubmitted(true);
  };

  const isValid = action.trim() && deadline.trim();

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-reset-execution/20">
            <Target className="w-6 h-6 text-reset-execution" />
          </div>
          <div>
            <CardTitle>{config.title || "Action Commitment"}</CardTitle>
            <CardDescription>
              {config.description || "Commit to your next action"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action">What specific action will you take?</Label>
            <Textarea
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              disabled={submitted}
              placeholder="Be specific and measurable..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">By when will you complete this?</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={submitted}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountability">Who will hold you accountable?</Label>
            <Input
              id="accountability"
              value={accountability}
              onChange={(e) => setAccountability(e.target.value)}
              disabled={submitted}
              placeholder="Name or email..."
            />
          </div>
        </div>

        {!submitted && isValid && (
          <Button onClick={handleSubmit} className="w-full">
            Lock In Commitment
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-reset-execution/10 border border-reset-execution/20 rounded-lg">
            <p className="text-sm text-muted-foreground">✓ Commitment locked in</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
