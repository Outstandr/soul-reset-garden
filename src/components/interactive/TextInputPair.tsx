import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextInputPairProps {
  config: {
    title: string;
    description: string;
    label1: string;
    label2: string;
    placeholder1?: string;
    placeholder2?: string;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const TextInputPair = ({ config, onComplete, savedResponse }: TextInputPairProps) => {
  const [input1, setInput1] = useState(savedResponse?.input1 || "");
  const [input2, setInput2] = useState(savedResponse?.input2 || "");
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    onComplete({ input1, input2 });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="input1">{config.label1}</Label>
          <Input
            id="input1"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            disabled={submitted}
            placeholder={config.placeholder1 || "Type here..."}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="input2">{config.label2}</Label>
          <Input
            id="input2"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            disabled={submitted}
            placeholder={config.placeholder2 || "Type here..."}
          />
        </div>

        {input1 && input2 && !submitted && (
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Formula completed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};