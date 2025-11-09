import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

interface ScenarioQuizProps {
  config: {
    title?: string;
    description?: string;
    scenarios: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }[];
  };
  onComplete: (response: any) => void;
  savedResponse?: any;
}

export const ScenarioQuiz = ({ config, onComplete, savedResponse }: ScenarioQuizProps) => {
  const [currentScenario, setCurrentScenario] = useState(savedResponse?.currentScenario || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    savedResponse?.answers || []
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(!!savedResponse);

  const scenario = config.scenarios[currentScenario];
  const isLastScenario = currentScenario === config.scenarios.length - 1;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentScenario] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastScenario) {
      onComplete({ answers: selectedAnswers, currentScenario });
      setSubmitted(true);
    } else {
      setCurrentScenario(prev => prev + 1);
      setShowFeedback(false);
    }
  };

  const isCorrect = selectedAnswers[currentScenario] === scenario.correctAnswer;

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-reset-mind/20">
            <Brain className="w-6 h-6 text-reset-mind" />
          </div>
          <div className="flex-1">
            <CardTitle>{config.title || "Scenario Quiz"}</CardTitle>
            <CardDescription>
              {config.description || "Test your understanding"}
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentScenario + 1} / {config.scenarios.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium">{scenario.question}</p>
        </div>

        <RadioGroup
          value={selectedAnswers[currentScenario]?.toString()}
          onValueChange={(val) => handleAnswer(parseInt(val))}
          disabled={showFeedback || submitted}
          className="space-y-3"
        >
          {scenario.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="text-sm font-medium cursor-pointer flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showFeedback && (
          <div className={`p-4 rounded-lg border ${
            isCorrect 
              ? "bg-green-500/10 border-green-500/20" 
              : "bg-red-500/10 border-red-500/20"
          }`}>
            <p className="text-sm font-medium mb-2">
              {isCorrect ? "Correct!" : "Not quite"}
            </p>
            {scenario.explanation && (
              <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
            )}
          </div>
        )}

        {showFeedback && !submitted && (
          <Button onClick={handleNext} className="w-full">
            {isLastScenario ? "Complete Quiz" : "Next Scenario"}
          </Button>
        )}

        {submitted && (
          <div className="p-4 bg-reset-mind/10 border border-reset-mind/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Quiz completed - {selectedAnswers.filter((ans, idx) => ans === config.scenarios[idx].correctAnswer).length} / {config.scenarios.length} correct
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
