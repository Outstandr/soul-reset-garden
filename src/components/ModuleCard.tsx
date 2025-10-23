import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { ReactNode } from "react";

interface ModuleCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  color: string;
  status: "locked" | "active" | "completed";
  progress?: number;
  onStart?: () => void;
}

export const ModuleCard = ({
  title,
  subtitle,
  description,
  icon,
  color,
  status,
  progress = 0,
  onStart,
}: ModuleCardProps) => {
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-strong ${
        status === "active" ? "ring-2 ring-primary shadow-glow" : ""
      } ${status === "locked" ? "opacity-60" : ""}`}
    >
      {/* Color accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-${color}`}
        style={{ backgroundColor: `hsl(var(--${color}))` }}
      />

      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between">
          <div
            className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `hsl(var(--${color}) / 0.1)` }}
          >
            {icon}
          </div>
          {status === "completed" && (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          )}
          {status === "locked" && (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div>
          <CardTitle className="text-2xl mb-1">{title}</CardTitle>
          <CardDescription className="text-base font-medium" style={{ color: `hsl(var(--${color}))` }}>
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">{description}</p>

        {status !== "locked" && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: `hsl(var(--${color}))`,
                }}
              />
            </div>
          </div>
        )}

        {status === "active" && (
          <Button
            variant="hero"
            className="w-full group/btn"
            onClick={onStart}
          >
            {progress > 0 ? "Continue" : "Start Journey"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        )}

        {status === "completed" && (
          <Button
            variant="zen"
            className="w-full"
            onClick={onStart}
          >
            Review Module
          </Button>
        )}

        {status === "locked" && (
          <Button variant="ghost" className="w-full" disabled>
            Complete Previous Modules
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
