import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface PassengerDriverProps {
  config: {
    statements: string[];
  };
  onComplete: (response: { selected: string[]; result: string }) => void;
  savedResponse?: { selected: string[]; result: string };
}

export const PassengerDriver = ({ config, onComplete, savedResponse }: PassengerDriverProps) => {
  const [selected, setSelected] = useState<string[]>(savedResponse?.selected || []);
  const [showResult, setShowResult] = useState(!!savedResponse);

  const toggleStatement = (statement: string) => {
    setSelected(prev => 
      prev.includes(statement) 
        ? prev.filter(s => s !== statement)
        : [...prev, statement]
    );
  };

  const calculateResult = () => {
    const driverStatements = ["I proactively plan my actions", "I make things happen", "I feel in control"];
    const driverCount = selected.filter(s => driverStatements.includes(s)).length;
    return driverCount >= 2 ? "Mostly Driver" : "Mostly Passenger";
  };

  const handleSubmit = () => {
    const result = calculateResult();
    setShowResult(true);
    onComplete({ selected, result });
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">Passenger vs. Driver Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg">Check all statements that apply to you:</p>
        
        <div className="space-y-3">
          {config.statements.map((statement) => (
            <div
              key={statement}
              className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => toggleStatement(statement)}
            >
              <Checkbox
                checked={selected.includes(statement)}
                onCheckedChange={() => toggleStatement(statement)}
              />
              <label className="text-sm cursor-pointer flex-1">{statement}</label>
            </div>
          ))}
        </div>

        {selected.length > 0 && !showResult && (
          <Button onClick={handleSubmit} className="w-full" size="lg">
            See Your Result
          </Button>
        )}

        {showResult && (
          <div className={`border-2 rounded-lg p-6 animate-fade-in ${
            calculateResult() === "Mostly Driver" 
              ? "bg-reset-execution/10 border-reset-execution" 
              : "bg-accent/10 border-accent"
          }`}>
            <h3 className="text-xl font-bold mb-2">You Are: {calculateResult()}</h3>
            <p className="text-muted-foreground">
              {calculateResult() === "Mostly Driver" 
                ? "Great! You are taking control of your life. Continue building on this foundation."
                : "Time to shift from reacting to creating. This course will help you become the driver of your life."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};