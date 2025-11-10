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
    <section className="py-24 bg-gradient-to-b from-muted via-background to-muted relative overflow-hidden">
      {/* Animated background elements with neon glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-accent to-reset-transformation rounded-full blur-3xl opacity-25 animate-float" style={{ animationDelay: "3s" }} />
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />

      <div className="zen-container relative z-10">
        <div className="text-center mb-20 space-y-6 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-black">
            The <span className="gradient-text neon-text">RESET</span> Blueprint®️
          </h2>
          <p className="text-2xl text-foreground/80 font-bold max-w-2xl mx-auto">
            A full-circle journey from doing to becoming<br/>
            Each step builds upon the last, creating holistic transformation
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {resetSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.letter}
                className="group relative animate-bounce-in hover-lift"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div 
                  className="h-full p-8 rounded-3xl bg-gradient-to-br from-card to-card/50 border-3 hover:border-4 transition-all duration-300 shadow-medium hover:shadow-strong relative overflow-hidden"
                  style={{ 
                    borderColor: `hsl(var(--${step.color}))`,
                    boxShadow: `0 8px 32px hsl(var(--${step.color}) / 0.15)`,
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, hsl(var(--${step.color}) / 0.1) 0%, transparent 100%)`,
                    }}
                  />

                  {/* Icon with color and animation */}
                  <div
                    className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 shadow-lg animate-scale-pulse"
                    style={{ 
                      backgroundColor: `hsl(var(--${step.color}) / 0.2)`,
                      boxShadow: `0 4px 20px hsl(var(--${step.color}) / 0.3)`,
                    }}
                  >
                    <Icon
                      className="w-10 h-10"
                      style={{ color: `hsl(var(--${step.color}))` }}
                    />
                  </div>

                  {/* Letter badge with animation */}
                  <div
                    className="absolute top-6 right-6 w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl border-3 shadow-glow animate-scale-pulse"
                    style={{
                      backgroundColor: `hsl(var(--${step.color}))`,
                      borderColor: `hsl(var(--${step.color}))`,
                      color: `hsl(var(--card))`,
                      boxShadow: `0 0 20px hsl(var(--${step.color}) / 0.5)`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    {step.letter}
                  </div>

                  {/* Content */}
                  <h3 className="relative text-3xl font-black mb-2">{step.title}</h3>
                  <p
                    className="relative text-base font-bold mb-4"
                    style={{ color: `hsl(var(--${step.color}))` }}
                  >
                    {step.subtitle}
                  </p>
                  <p className="relative text-foreground/70 font-medium mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Symbolism with icon */}
                  <div className="relative pt-4 border-t-2" style={{ borderColor: `hsl(var(--${step.color}) / 0.3)` }}>
                    <p className="text-sm text-foreground/60 font-semibold">
                      {step.symbolism}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Journey flow indicator - More dynamic */}
        <div className="mt-20 flex justify-center animate-fade-in-up animation-delay-700">
          <div className="inline-flex items-center gap-1.5 sm:gap-3 px-3 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-card via-primary/10 to-card border-2 sm:border-3 border-primary/30 shadow-glow">
            <div className="flex items-center gap-1.5 sm:gap-4">
              {resetSteps.map((step, index) => (
                <div key={step.letter} className="flex items-center gap-1.5 sm:gap-4">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-2 sm:border-3 transition-all duration-300 hover:scale-125 cursor-pointer shadow-medium hover-lift animate-scale-pulse"
                    style={{
                      backgroundColor: `hsl(var(--${step.color}))`,
                      borderColor: `hsl(var(--${step.color}))`,
                      color: `hsl(var(--card))`,
                      boxShadow: `0 4px 20px hsl(var(--${step.color}) / 0.4)`,
                      animationDelay: `${index * 0.3}s`,
                    }}
                  >
                    {step.letter}
                  </div>
                  {index < resetSteps.length - 1 && (
                    <div 
                      className="w-6 sm:w-12 h-1 rounded-full animate-shimmer"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--${step.color})), hsl(var(--${resetSteps[index + 1].color})))`,
                      }}
                    />
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
