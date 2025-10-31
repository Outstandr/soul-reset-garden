import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SelfDiagnosticProps {
  config: {
    question: string;
    options: string[];
  };
  onComplete: (response: { focus: string; neglect: string }) => void;
  savedResponse?: { focus: string; neglect: string };
}

export const SelfDiagnostic = ({ config, onComplete, savedResponse }: SelfDiagnosticProps) => {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(savedResponse?.focus || null);
  const [selectedNeglect, setSelectedNeglect] = useState<string | null>(savedResponse?.neglect || null);
  const [showResult, setShowResult] = useState(!!savedResponse);

  const handleSubmit = () => {
    if (selectedFocus && selectedNeglect) {
      setShowResult(true);
      onComplete({ focus: selectedFocus, neglect: selectedNeglect });
    }
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">Self-Diagnostic Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-lg mb-4">{config.question}</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Which do you focus on most?</label>
              <div className="grid gap-2">
                {config.options.map((option) => (
                  <Button
                    key={`focus-${option}`}
                    variant={selectedFocus === option ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedFocus(option)}
                  >
                    {selectedFocus === option && <CheckCircle2 className="w-4 h-4 mr-2" />}
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Which do you neglect?</label>
              <div className="grid gap-2">
                {config.options.map((option) => (
                  <Button
                    key={`neglect-${option}`}
                    variant={selectedNeglect === option ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedNeglect(option)}
                  >
                    {selectedNeglect === option && <CheckCircle2 className="w-4 h-4 mr-2" />}
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {selectedFocus && selectedNeglect && !showResult && (
            <Button onClick={handleSubmit} className="w-full mt-6" size="lg">
              See Your Result
            </Button>
          )}
        </div>

        {showResult && (
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-2">Your Journey Starts Here</h3>
            <p className="text-muted-foreground">
              You focus most on <strong className="text-primary">{selectedFocus}</strong> and
              neglect <strong className="text-primary">{selectedNeglect}</strong>.
              Your journey starts with balancing all three worlds for complete transformation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};