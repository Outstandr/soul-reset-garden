import { Leaf, Zap, Heart, Mountain, Flower } from "lucide-react";

const resetSteps = [
  {
    letter: "R",
    title: "Rhythm",
    subtitle: "The Reset in You",
    description: "Build a strong foundation through structure and rhythm.",
    icon: Leaf,
    color: "reset-rhythm",
    symbolism: "Bamboo - Structure, Flexibility, Growth",
  },
  {
    letter: "E",
    title: "Energy",
    subtitle: "Reset Your Addiction",
    description: "Break through blockages and reclaim your vital power.",
    icon: Zap,
    color: "reset-energy",
    symbolism: "Flowing Water - Life Force, Vitality",
  },
  {
    letter: "S",
    title: "Systems",
    subtitle: "Reset the Love in You",
    description: "Emotional growth and conscious connection.",
    icon: Heart,
    color: "reset-systems",
    symbolism: "Interconnected Roots - Relationships, Unity",
  },
  {
    letter: "E",
    title: "Execution",
    subtitle: "Reset by Discipline",
    description: "Put leadership and consistency into practice.",
    icon: Mountain,
    color: "reset-execution",
    symbolism: "Mountain Peak - Achievement, Focus",
  },
  {
    letter: "T",
    title: "Transformation",
    subtitle: "Reset the Trust in You",
    description: "Identity, mastery, and the embodiment of trust.",
    icon: Flower,
    color: "reset-transformation",
    symbolism: "Lotus Flower - Emerging from darkness into light",
  },
];

export const ResetOverview = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="zen-container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            The <span className="gradient-text">RESET</span> Blueprint®️
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A full-circle journey from doing to becoming. Each step builds upon the last, 
            creating a holistic transformation.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {resetSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.letter}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-full p-8 rounded-2xl bg-card border border-border hover:shadow-strong transition-all duration-300 hover:scale-105">
                  {/* Icon with color */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `hsl(var(--${step.color}) / 0.15)` }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: `hsl(var(--${step.color}))` }}
                    />
                  </div>

                  {/* Letter badge */}
                  <div
                    className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-2"
                    style={{
                      backgroundColor: `hsl(var(--${step.color}) / 0.1)`,
                      borderColor: `hsl(var(--${step.color}))`,
                      color: `hsl(var(--${step.color}))`,
                    }}
                  >
                    {step.letter}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p
                    className="text-sm font-medium mb-4"
                    style={{ color: `hsl(var(--${step.color}))` }}
                  >
                    {step.subtitle}
                  </p>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Symbolism */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      {step.symbolism}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Journey flow indicator */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border shadow-soft">
            <div className="flex items-center gap-3">
              {resetSteps.map((step, index) => (
                <div key={step.letter} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `hsl(var(--${step.color}) / 0.2)`,
                      borderColor: `hsl(var(--${step.color}))`,
                      color: `hsl(var(--${step.color}))`,
                    }}
                  >
                    {step.letter}
                  </div>
                  {index < resetSteps.length - 1 && (
                    <div className="w-8 h-0.5 bg-gradient-to-r from-current to-transparent opacity-30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
