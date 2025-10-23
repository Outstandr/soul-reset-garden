import { Circle } from "lucide-react";

interface JourneyStep {
  id: string;
  letter: string;
  title: string;
  color: string;
  icon: string;
  completed: boolean;
  active: boolean;
}

interface JourneyCircleProps {
  steps: JourneyStep[];
  currentStep: number;
}

export const JourneyCircle = ({ steps, currentStep }: JourneyCircleProps) => {
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const totalSteps = steps.length;

  const getPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / totalSteps - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  return (
    <div className="relative w-[300px] h-[300px] mx-auto">
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Progress arc */}
        {currentStep > 0 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="url(#journeyGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(currentStep / totalSteps) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
            transform={`rotate(-90 ${centerX} ${centerY})`}
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--reset-rhythm))" />
            <stop offset="25%" stopColor="hsl(var(--reset-energy))" />
            <stop offset="50%" stopColor="hsl(var(--reset-systems))" />
            <stop offset="75%" stopColor="hsl(var(--reset-execution))" />
            <stop offset="100%" stopColor="hsl(var(--reset-transformation))" />
          </linearGradient>
        </defs>

        {/* Journey steps */}
        {steps.map((step, index) => {
          const pos = getPosition(index);
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <g key={step.id}>
              {/* Step circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 20 : 16}
                fill={
                  isActive
                    ? `hsl(var(--${step.color}))`
                    : isCompleted
                    ? `hsl(var(--${step.color}))`
                    : "hsl(var(--background))"
                }
                stroke={`hsl(var(--${step.color}))`}
                strokeWidth={isActive ? 3 : 2}
                className={isActive ? "journey-pulse" : "transition-all duration-300"}
              />

              {/* Step letter */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold"
                fontSize={isActive ? 16 : 14}
                fill={
                  isActive || isCompleted
                    ? "hsl(var(--primary-foreground))"
                    : `hsl(var(--${step.color}))`
                }
              >
                {step.letter}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold gradient-text">RESET</div>
        <p className="text-sm text-muted-foreground mt-2">Your Journey</p>
      </div>
    </div>
  );
};
