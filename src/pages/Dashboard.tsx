import { useEffect, useMemo, useState } from "react";
import { ModuleCard } from "@/components/ModuleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Zap, Heart, Mountain, Flower, BookOpen, PenLine, Library, Sparkles, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LionelCoach } from "@/components/LionelCoach";
import { UserMenu } from "@/components/UserMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "@/hooks/useTranslations";
import { OnboardingTour } from "@/components/OnboardingTour";
import { PersonalizedPlanView } from "@/components/PersonalizedPlanView";
import { supabase } from "@/integrations/supabase/client";
import lpaLogoWhite from "@/assets/lpa-logo-white.png";

// Module name mapping to database module_name field
const MODULE_NAME_MAP: Record<string, string> = {
  "Reset by Discipline": "Module 1: Getting Fit",
  "The Reset in You": "Module 2: Rhythm & Structure",
  "Reset Your Addiction": "Module 3: Energy & Vitality",
  "Reset the Love in You": "Module 4: Systems & Relationships",
  "Reset the Trust in You": "Module 5: Transformation & Integration",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const { getModuleProgress, isLoading: progressLoading } = useModuleProgress();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if user needs onboarding and has a plan
  useEffect(() => {
    const checkOnboardingAndPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("has_completed_onboarding")
            .eq("id", user.id)
            .single();
          
          if (profile && !profile.has_completed_onboarding) {
            setShowOnboarding(true);
          }

          // Check if user has a personalized plan
          const { data: discovery } = await supabase
            .from("user_discovery")
            .select("ai_report")
            .eq("user_id", user.id)
            .maybeSingle();
          
          if (discovery?.ai_report) {
            setHasPlan(true);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setOnboardingChecked(true);
      }
    };

    checkOnboardingAndPlan();
  }, []);


  const baseModules = useMemo(() => [
    {
      title: t.modules.resetByDiscipline,
      subtitle: t.modules.resetByDisciplineSubtitle,
      description: t.modules.resetByDisciplineDesc,
      icon: <Mountain className="w-6 h-6" style={{ color: "hsl(var(--reset-execution))" }} />,
      color: "reset-execution",
      status: "active" as const,
    },
    {
      title: t.modules.theResetInYou,
      subtitle: t.modules.theResetInYouSubtitle,
      description: t.modules.theResetInYouDesc,
      icon: <Leaf className="w-6 h-6" style={{ color: "hsl(var(--reset-rhythm))" }} />,
      color: "reset-rhythm",
      status: "locked" as const,
    },
    {
      title: t.modules.resetYourAddiction,
      subtitle: t.modules.resetYourAddictionSubtitle,
      description: t.modules.resetYourAddictionDesc,
      icon: <Zap className="w-6 h-6" style={{ color: "hsl(var(--reset-energy))" }} />,
      color: "reset-energy",
      status: "locked" as const,
    },
    {
      title: t.modules.resetTheLoveInYou,
      subtitle: t.modules.resetTheLoveInYouSubtitle,
      description: t.modules.resetTheLoveInYouDesc,
      icon: <Heart className="w-6 h-6" style={{ color: "hsl(var(--reset-systems))" }} />,
      color: "reset-systems",
      status: "locked" as const,
    },
    {
      title: t.modules.resetTheTrustInYou,
      subtitle: t.modules.resetTheTrustInYouSubtitle,
      description: t.modules.resetTheTrustInYouDesc,
      icon: <Flower className="w-6 h-6" style={{ color: "hsl(var(--reset-transformation))" }} />,
      color: "reset-transformation",
      status: "locked" as const,
    },
  ], [t]);

  // Combine base modules with real progress data
  const modules = useMemo(() => {
    return baseModules.map((module) => {
      const dbModuleName = MODULE_NAME_MAP[module.title];
      const progress = getModuleProgress(dbModuleName);
      return {
        ...module,
        progress,
      };
    });
  }, [getModuleProgress, baseModules]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Onboarding Tour */}
      {onboardingChecked && showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-reset-energy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-reset-systems/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-600 bg-slate-700/95 backdrop-blur-md sticky top-0 z-50">
        <div className="zen-container py-4">
          <div className="flex items-center justify-between">
            <img src={lpaLogoWhite} alt="Leaders Performance Academy" className="h-10" />
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-slate-600" onClick={() => navigate("/journal")}>
                <PenLine className="w-4 h-4 mr-2" />
                {t.nav.journal}
              </Button>
              <LanguageSwitcher />
              <UserMenu />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="zen-container py-12 space-y-20 relative z-10">
        {/* Hero Welcome Section */}
        <section id="hero-section" className="animate-fade-in-up relative">
          <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 overflow-hidden">
            {/* Hero Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-reset-energy/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-reset-systems/15 rounded-full blur-xl animate-float" />
            
            {/* Animated Border Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-reset-energy/20 to-reset-systems/20 animate-gradient opacity-50" style={{ padding: '1px' }} />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary animate-scale-pulse" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Leaders Performance Academy</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {t.dashboard.welcome}
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
                {t.dashboard.continueJourney}
              </p>
            </div>
          </div>
        </section>

        {/* Personalized Plan Section - Show if user has a plan */}
        {hasPlan && (
          <section className="animate-fade-in-up animation-delay-50">
            <div className="mb-8 flex items-center gap-4">
              <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-primary to-reset-energy" />
              <div>
                <h3 className="text-3xl font-bold">Your Personalized Plan</h3>
                <p className="text-muted-foreground">AI-generated diet, training, and lesson recommendations</p>
              </div>
            </div>
            <PersonalizedPlanView embedded />
          </section>
        )}

        {/* Section 1: Module Grid + Next Steps */}
        <section className="animate-fade-in-up animation-delay-100">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {progressLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-fade-in-up">
                  <Skeleton className="h-64 w-full rounded-xl" />
                </div>
              ))
            ) : (
              modules.map((module, index) => (
                <div
                  key={module.title}
                  id={index === 0 ? "first-module-card" : undefined}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <ModuleCard
                    {...module}
                    onStart={() => {
                      if (module.status !== "locked") {
                        if (module.title === "Reset by Discipline") {
                          navigate("/reset-by-discipline");
                        } else {
                          navigate("/journey/reset-in-you");
                        }
                      }
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Your Next Steps card - Enhanced */}
          <div id="next-steps-card" className="mt-10">
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-glow hover-lift">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-reset-rhythm/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{t.dashboard.nextSteps}</CardTitle>
                    <CardDescription>Daily reflection practice</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary/40 pl-4 mb-6">
                  "What rhythm did you build today? Reflect on one structure that supported your growth."
                </blockquote>
                <Button 
                  variant="zen" 
                  onClick={() => navigate("/journal")}
                  className="group"
                >
                  <PenLine className="w-4 h-4 mr-2" />
                  {t.dashboard.viewJournal}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Lionel Coach - Enhanced */}
        <section id="lionel-coach" className="animate-fade-in-up animation-delay-200 relative">
          {/* Section Header with accent line */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <div>
              <h3 className="text-3xl font-bold">Your Personal Coach</h3>
              <p className="text-muted-foreground">Get personalized guidance based on your progress</p>
            </div>
          </div>
          <LionelCoach />
        </section>

        {/* Quick Access - Enhanced */}
        <section id="quick-access" className="animate-fade-in-up animation-delay-300">
          <div className="mb-8 flex items-center gap-4">
            <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-reset-energy to-reset-systems" />
            <div>
              <h3 className="text-3xl font-bold">{t.dashboard.masterclassLibrary}</h3>
              <p className="text-muted-foreground">{t.dashboard.masterclassDescription}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card 
              className="group hover-lift cursor-pointer border-2 border-transparent hover:border-primary/30 bg-gradient-to-br from-card to-primary/5 transition-all duration-300"
              onClick={() => navigate("/masterclass-library")}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Library className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{t.dashboard.masterclassLibrary}</CardTitle>
                <CardDescription>{t.dashboard.masterclassDescription}</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="group hover-lift cursor-pointer border-2 border-transparent hover:border-reset-energy/30 bg-gradient-to-br from-card to-reset-energy/5 transition-all duration-300"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/RESET_BY_DISCIPLINE_FINAL_V4.pdf';
                link.download = 'RESET_BY_DISCIPLINE_FINAL_V4.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-reset-energy/20 to-reset-energy/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-7 h-7 text-reset-energy" />
                </div>
                <CardTitle className="group-hover:text-reset-energy transition-colors">E-Reader</CardTitle>
                <CardDescription>Download RESET by Discipline book</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="group hover-lift cursor-pointer border-2 border-transparent hover:border-reset-systems/30 bg-gradient-to-br from-card to-reset-systems/5 transition-all duration-300"
              onClick={() => navigate("/journal")}
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-reset-systems/20 to-reset-systems/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PenLine className="w-7 h-7 text-reset-systems" />
                </div>
                <CardTitle className="group-hover:text-reset-systems transition-colors">{t.nav.journal}</CardTitle>
                <CardDescription>RESET series journals</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
