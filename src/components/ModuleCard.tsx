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
      className={`group relative overflow-hidden transition-all duration-500 hover-lift ${
        status === "active" ? "ring-4 ring-primary shadow-neon border-4 border-primary animate-glow-border" : "border-3"
      } ${status === "locked" ? "opacity-50 grayscale" : ""}`}
      style={{
        borderColor: status !== "locked" ? `hsl(var(--${color}))` : undefined,
      }}
    >
      {/* Animated gradient overlay */}
      {status === "active" && (
        <div 
          className="absolute inset-0 opacity-20 animate-gradient"
          style={{ 
            background: `linear-gradient(135deg, hsl(var(--${color})) 0%, transparent 100%)`,
          }}
        />
      )}

      {/* Color accent bar - thicker and animated */}
      <div
        className={`absolute top-0 left-0 right-0 h-2 ${status === "active" ? "animate-shimmer" : ""}`}
        style={{ backgroundColor: `hsl(var(--${color}))` }}
      />

      <CardHeader className="space-y-4 pb-4 relative">
        <div className="flex items-start justify-between">
          <div
            className="p-4 rounded-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg relative animate-scale-pulse"
            style={{ 
              backgroundColor: `hsl(var(--${color}) / 0.2)`,
              boxShadow: `0 4px 20px hsl(var(--${color}) / 0.3)`,
            }}
          >
            <div style={{ color: `hsl(var(--${color}))` }}>
              {icon}
            </div>
          </div>
          {status === "completed" && (
            <CheckCircle2 className="w-8 h-8 text-primary animate-scale-pulse" />
          )}
          {status === "locked" && (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <div>
          <CardTitle className="text-3xl font-black mb-2">{title}</CardTitle>
          <CardDescription 
            className="text-lg font-bold" 
            style={{ color: `hsl(var(--${color}))` }}
          >
            {subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative">
        <p className="text-foreground/70 font-medium leading-relaxed text-base">{description}</p>

        {status !== "locked" && progress > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span className="text-foreground/70 font-semibold">Progress</span>
              <span className="font-black text-lg" style={{ color: `hsl(var(--${color}))` }}>
                {progress}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden border-2" style={{ borderColor: `hsl(var(--${color}) / 0.3)` }}>
              <div
                className="h-full transition-all duration-1000 rounded-full relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  backgroundColor: `hsl(var(--${color}))`,
                  boxShadow: `0 0 10px hsl(var(--${color}) / 0.5)`,
                }}
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </div>
          </div>
        )}

        {status === "active" && (
          <Button
            variant="hero"
            className="w-full group/btn text-lg py-6 shadow-neon font-black hover-lift"
            onClick={onStart}
          >
            {progress > 0 ? "Continue Journey" : "Start Journey"}
            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
          </Button>
        )}

        {status === "completed" && (
          <Button
            variant="zen"
            className="w-full text-lg py-6 font-black hover-lift"
            onClick={onStart}
          >
            Review Module
          </Button>
        )}

        {status === "locked" && (
          <Button variant="ghost" className="w-full text-base py-6 font-bold" disabled>
            Complete Previous Modules
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
