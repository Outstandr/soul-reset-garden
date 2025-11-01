import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface EnergyAuditProps {
  config: {
    question: string;
    energyTypes: string[];
    message: string;
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const EnergyAudit = ({ config, onComplete, savedResponse }: EnergyAuditProps) => {
  const [selected, setSelected] = useState(savedResponse?.selected || "");
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const handleSubmit = () => {
    onComplete({ selected });
    setSubmitted(true);
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle>Energy Drain Audit</CardTitle>
        <CardDescription>{config.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selected} onValueChange={setSelected} disabled={submitted}>
          {config.energyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value={type} id={type} />
              <Label htmlFor={type} className="flex-1 cursor-pointer">{type}</Label>
            </div>
          ))}
        </RadioGroup>

        {selected && !submitted && (
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium mb-2">✓ Audit completed</p>
            <p className="text-sm text-muted-foreground">{config.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};