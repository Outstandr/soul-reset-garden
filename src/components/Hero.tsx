import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-50"
        style={{ background: "var(--gradient-hero)" }}
      />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-float"
          style={{ background: "hsl(var(--reset-rhythm))" }}
        />
        <div
          className="absolute bottom-32 right-20 w-24 h-24 rounded-full opacity-20 animate-float"
          style={{ background: "hsl(var(--reset-transformation))", animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full opacity-20 animate-float"
          style={{ background: "hsl(var(--reset-energy))", animationDelay: "2s" }}
        />
      </div>

      {/* Content */}
      <div className="zen-container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border shadow-soft animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium">Transform Your Life with the RESET Blueprint®️</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up animation-delay-100">
            From Structure to{" "}
            <span className="gradient-text">Surrender</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            A complete journey from foundation to transformation. Build rhythm, reclaim energy, 
            nurture connection, master execution, and embody trust.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
            <Button variant="hero" size="lg" className="group">
              Begin Your Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Explore the Blueprint
            </Button>
          </div>

          {/* Social proof */}
          <div className="pt-8 flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-muted-foreground animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-muted"
                  />
                ))}
              </div>
              <span>10,000+ students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">★★★★★</span>
              <span>4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
