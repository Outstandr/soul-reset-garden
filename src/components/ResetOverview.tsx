import { Leaf, Zap, Heart, Mountain, Flower } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export const ResetOverview = () => {
  const t = useTranslations();
  
  const resetSteps = [
    {
      letter: "R",
      title: t.landing.resetOverview.rhythm.title,
      subtitle: t.landing.resetOverview.rhythm.subtitle,
      description: t.landing.resetOverview.rhythm.description,
      icon: Leaf,
      symbolism: t.landing.resetOverview.rhythm.symbolism,
    },
    {
      letter: "E",
      title: t.landing.resetOverview.energy.title,
      subtitle: t.landing.resetOverview.energy.subtitle,
      description: t.landing.resetOverview.energy.description,
      icon: Zap,
      symbolism: t.landing.resetOverview.energy.symbolism,
    },
    {
      letter: "S",
      title: t.landing.resetOverview.systems.title,
      subtitle: t.landing.resetOverview.systems.subtitle,
      description: t.landing.resetOverview.systems.description,
      icon: Heart,
      symbolism: t.landing.resetOverview.systems.symbolism,
    },
    {
      letter: "E",
      title: t.landing.resetOverview.execution.title,
      subtitle: t.landing.resetOverview.execution.subtitle,
      description: t.landing.resetOverview.execution.description,
      icon: Mountain,
      symbolism: t.landing.resetOverview.execution.symbolism,
    },
    {
      letter: "T",
      title: t.landing.resetOverview.transformation.title,
      subtitle: t.landing.resetOverview.transformation.subtitle,
      description: t.landing.resetOverview.transformation.description,
      icon: Flower,
      symbolism: t.landing.resetOverview.transformation.symbolism,
    },
  ];
  
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="zen-container relative z-10">
        <div className="text-center mb-20 space-y-6 animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold">
            The <span className="text-primary">RESET</span> Blueprint®️
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.landing.resetOverview.subtitle}
            <br/>
            {t.landing.resetOverview.subtitleDesc}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {resetSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={`${step.letter}-${index}`}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-full p-8 rounded-2xl bg-card shadow-soft hover:shadow-medium transition-all duration-300 relative overflow-hidden animate-pulse-glow">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Letter badge */}
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl text-primary-foreground">
                    {step.letter}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-primary font-medium mb-4">
                    {step.subtitle}
                  </p>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Symbolism */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {step.symbolism}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Journey flow indicator */}
        <div className="mt-16 flex justify-center animate-fade-in-up animation-delay-500">
          <div className="inline-flex items-center gap-2 sm:gap-4 px-6 py-4 rounded-full bg-card border border-border shadow-soft">
            {resetSteps.map((step, index) => (
              <div key={`flow-${step.letter}-${index}`} className="flex items-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center font-bold text-sm sm:text-base text-primary-foreground shadow-medium">
                  {step.letter}
                </div>
                {index < resetSteps.length - 1 && (
                  <div className="w-4 sm:w-8 h-0.5 bg-primary/30 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};