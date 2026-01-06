import { useEffect, useMemo } from "react";
import { ModuleCard } from "@/components/ModuleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Zap, Heart, Mountain, Flower, BookOpen, PenLine, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LionelCoach } from "@/components/LionelCoach";
import { UserMenu } from "@/components/UserMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "@/hooks/useTranslations";
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

  useEffect(() => {
    window.scrollTo(0, 0);
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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-slate-600 bg-slate-700 backdrop-blur-sm sticky top-0 z-50">
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
      <main className="zen-container py-12 space-y-16">
        {/* Welcome Section */}
        <section className="animate-fade-in-up">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3">{t.dashboard.welcome}</h2>
            <p className="text-xl text-muted-foreground">
              {t.dashboard.continueJourney}
            </p>
          </div>
        </section>

        {/* Section 1: Module Grid + Next Steps */}
        <section className="animate-fade-in-up animation-delay-100">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">{t.dashboard.availableModules}</h3>
            <p className="text-muted-foreground">
              {t.dashboard.nextSteps}
            </p>
          </div>

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

          {/* Your Next Steps card */}
          <div className="mt-8">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-reset-rhythm animate-pulse" />
                  {t.dashboard.nextSteps}
                </CardTitle>
                <CardDescription>Reflect on one structure that supported your growth</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">
                  "What rhythm did you build today? Reflect on one structure that supported your growth."
                </p>
                <Button variant="zen" onClick={() => navigate("/journal")}>
                  <PenLine className="w-4 h-4 mr-2" />
                  {t.dashboard.viewJournal}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Lionel Coach */}
        <section className="animate-fade-in-up animation-delay-200">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">Your Personal Coach</h3>
            <p className="text-muted-foreground">Get personalized guidance based on your progress</p>
          </div>
          <LionelCoach />
        </section>

        {/* Quick Access */}
        <section className="animate-fade-in-up animation-delay-300">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">{t.dashboard.masterclassLibrary}</h3>
            <p className="text-muted-foreground">{t.dashboard.masterclassDescription}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card 
              className="hover:shadow-medium transition-shadow cursor-pointer"
              onClick={() => navigate("/masterclass-library")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Library className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{t.dashboard.masterclassLibrary}</CardTitle>
                <CardDescription>{t.dashboard.masterclassDescription}</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="hover:shadow-medium transition-shadow cursor-pointer"
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
                <div className="w-12 h-12 rounded-xl bg-reset-energy/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-reset-energy" />
                </div>
                <CardTitle>E-Reader</CardTitle>
                <CardDescription>Download RESET by Discipline book</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="hover:shadow-medium transition-shadow cursor-pointer"
              onClick={() => navigate("/journal")}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-reset-systems/10 flex items-center justify-center mb-4">
                  <PenLine className="w-6 h-6 text-reset-systems" />
                </div>
                <CardTitle>{t.nav.journal}</CardTitle>
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
