import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";

export const Hero = () => {
  const t = useTranslations();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/3" />
      
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 md:right-40 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-primary/8 rounded-full blur-3xl" />

      <div className="zen-container relative z-10 text-center py-12 px-4 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 animate-fade-in-up">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold text-primary">
              {t.landing.hero.badge}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in-up animation-delay-100">
            {t.landing.hero.title}{" "}
            <span className="text-primary">
              {t.landing.hero.titleHighlight}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            {t.landing.hero.subtitle}
            <br className="hidden sm:block"/>
            <span className="sm:hidden"> </span>{t.landing.hero.subtitleMobile}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto shadow-medium hover:shadow-strong">
                {t.landing.hero.ctaPrimary}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 w-full sm:w-auto"
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t.landing.hero.ctaSecondary}
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-16 animate-fade-in-up animation-delay-400">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="text-3xl md:text-4xl font-bold text-primary">10K+</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">Leaders Transformed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-primary" />
                <span className="text-3xl md:text-4xl font-bold text-primary">95%</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-6 h-6 text-primary" />
                <span className="text-3xl md:text-4xl font-bold text-primary">5 Pillars</span>
              </div>
              <div className="text-sm font-medium text-muted-foreground">To Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};