import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface AchievementBadgeProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  earned: boolean;
  color: string;
}

export const AchievementBadge = ({
  title,
  description,
  icon,
  earned,
  color,
}: AchievementBadgeProps) => {
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 p-6 text-center ${
        earned
          ? "bg-gradient-to-br from-slate-800 to-slate-900 border-2 hover-lift hover:scale-105"
          : "bg-slate-900/30 border border-slate-700/30 opacity-50 grayscale"
      }`}
      style={
        earned
          ? {
              borderColor: `hsl(var(--${color}))`,
              boxShadow: `0 0 20px hsl(var(--${color}) / 0.3)`,
            }
          : undefined
      }
    >
      {/* Shine effect for earned badges */}
      {earned && (
        <div
          className="absolute inset-0 opacity-20 animate-gradient"
          style={{
            background: `linear-gradient(135deg, hsl(var(--${color})) 0%, transparent 100%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 transition-all duration-500 ${
            earned
              ? "group-hover:scale-125 group-hover:rotate-12 animate-scale-pulse"
              : ""
          }`}
          style={
            earned
              ? {
                  backgroundColor: `hsl(var(--${color}) / 0.2)`,
                  boxShadow: `0 4px 20px hsl(var(--${color}) / 0.4)`,
                  color: `hsl(var(--${color}))`,
                }
              : {
                  backgroundColor: "hsl(var(--slate-700) / 0.3)",
                  color: "hsl(var(--slate-500))",
                }
          }
        >
          {icon}
        </div>

        {/* Title */}
        <h4 className={`text-lg font-black mb-1 ${earned ? "text-white" : "text-slate-600"}`}>
          {title}
        </h4>

        {/* Description */}
        <p className={`text-sm ${earned ? "text-gray-400" : "text-slate-600"}`}>
          {description}
        </p>

        {/* Earned indicator */}
        {earned && (
          <div className="mt-3 inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-bold text-green-400">
            ✓ Earned
          </div>
        )}
      </div>
    </Card>
  );
};
