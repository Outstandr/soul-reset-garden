import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Mountain, Play, CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTranslations } from "@/hooks/useTranslations";

export default function ResetByDiscipline() {
  const navigate = useNavigate();
  const t = useTranslations();
  const [module1Completed, setModule1Completed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    checkModule1Completion();
  }, []);

  const checkModule1Completion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_certificates')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_name', 'Module 1: Getting Fit')
        .maybeSingle();

      if (error) throw error;
      setModule1Completed(!!data);
    } catch (error) {
      console.error('Error checking module completion:', error);
    }
  };

  const stages = [
    {
      id: "book",
      title: t.resetByDiscipline.bookStage,
      subtitle: t.resetByDiscipline.bookSubtitle,
      description: t.resetByDiscipline.bookDescription,
      icon: <BookOpen className="w-8 h-8" />,
      status: "active",
      action: () => navigate("/book/reset-by-discipline")
    },
    {
      id: "masterclass",
      title: t.resetByDiscipline.masterclassStage,
      subtitle: t.resetByDiscipline.masterclassSubtitle,
      description: t.resetByDiscipline.masterclassDescription,
      icon: <Mountain className="w-8 h-8" />,
      status: "available",
      pillars: [
        { name: t.resetByDiscipline.mentalPillar, route: "/mental-pillar", completed: false },
        { name: t.resetByDiscipline.physicalPillar, route: "/physical-pillar", completed: false },
        { name: t.resetByDiscipline.spiritualPillar, route: "/spiritual-pillar", completed: false }
      ]
    },
    {
      id: "integration",
      title: t.resetByDiscipline.integrationStage,
      subtitle: t.resetByDiscipline.integrationSubtitle,
      description: t.resetByDiscipline.integrationDescription,
      icon: <CheckCircle2 className="w-8 h-8" />,
      status: "available",
      modules: [
        { name: "Module 1: Getting Fit", route: "/reset-discipline-course/1/1", lessons: 6 },
        { name: "Module 2: Knowing Who You Are", route: "/reset-discipline-course/2/1", lessons: 6 }
      ],
      finalExam: { name: "Final Certification Exam", route: "/final-certification-exam" }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="fixed inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative z-10">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="zen-container py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t.resetByDiscipline.backToDashboard}
              </Button>
            </div>
          </div>
        </header>

        <main className="zen-container py-12 space-y-12">
          <section className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-reset-execution/20 to-reset-execution/10 rounded-full border border-reset-execution/30">
              <Mountain className="w-6 h-6 text-reset-execution" />
              <span className="text-lg font-bold text-reset-execution">{t.resetByDiscipline.subtitle}</span>
            </div>
            <h1 className="text-5xl font-black gradient-text mb-4">{t.resetByDiscipline.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.resetByDiscipline.description}
            </p>
          </section>

          <section className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Your Journey Path</h2>
              <p className="text-muted-foreground">Complete each stage in order to build unshakable discipline</p>
            </div>

            {stages.map((stage, index) => (
              <Card 
                key={stage.id}
                className={`animate-fade-in-up ${
                  stage.status === "locked" 
                    ? "opacity-60" 
                    : "hover:shadow-medium transition-all"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      stage.status === "active" 
                        ? "bg-reset-execution/20 text-reset-execution" 
                        : stage.status === "available"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {stage.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <CardTitle className="text-2xl">{stage.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{stage.subtitle}</p>
                        </div>
                        {stage.status === "active" && (
                          <span className="px-3 py-1 rounded-full bg-reset-execution/20 text-reset-execution text-sm font-semibold">
                            Start Here
                          </span>
                        )}
                        {stage.status === "locked" && (
                          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-semibold">
                            Locked
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-base">{stage.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {stage.pillars && (
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      {stage.pillars.map((pillar) => (
                        <Card 
                          key={pillar.name}
                          className="hover:shadow-soft transition-shadow cursor-pointer"
                          onClick={() => navigate(pillar.route)}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <CardTitle className="text-lg">{pillar.name}</CardTitle>
                              {pillar.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : (
                                <Play className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(pillar.route);
                              }}
                            >
                              Start Lessons
                            </Button>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}

                {stage.modules && (
                  <CardContent>
                    <div className="space-y-3 mt-4">
                      {stage.modules.map((module: any, idx: number) => {
                        const isLocked = idx > 0 && !module1Completed;
                        return (
                          <Card 
                            key={module.name}
                            className={`transition-shadow ${
                              isLocked 
                                ? "opacity-60 cursor-not-allowed" 
                                : "hover:shadow-soft cursor-pointer"
                            }`}
                            onClick={() => !isLocked && navigate(module.route)}
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {isLocked && <Lock className="w-5 h-5 text-destructive" />}
                                  <div>
                                    <CardTitle className="text-lg">{module.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                      {isLocked 
                                        ? "Complete Module 1 to unlock" 
                                        : `${module.lessons} lessons with quizzes`
                                      }
                                    </p>
                                  </div>
                                </div>
                                <Button 
                                  variant={isLocked ? "destructive" : "outline"}
                                  size="sm"
                                  disabled={isLocked}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isLocked) navigate(module.route);
                                  }}
                                >
                                  {isLocked ? "Locked" : "Start Module"}
                                </Button>
                              </div>
                            </CardHeader>
                          </Card>
                        );
                      })}
                      
                      {stage.finalExam && (
                        <Card className="border-2 border-primary/30 bg-primary/5 hover:shadow-soft transition-shadow cursor-pointer"
                          onClick={() => navigate(stage.finalExam.route)}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                <div>
                                  <CardTitle className="text-lg text-primary">{stage.finalExam.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">Complete all modules to unlock • 80% required to pass</p>
                                </div>
                              </div>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(stage.finalExam.route);
                                }}
                              >
                                Take Exam
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      )}
                    </div>
                  </CardContent>
                )}

                {stage.action && stage.status !== "locked" && (
                  <CardContent>
                    <Button 
                      variant={stage.status === "active" ? "default" : "outline"}
                      size="lg"
                      onClick={stage.action}
                      className="w-full md:w-auto"
                    >
                      {stage.status === "active" ? "Begin Foundation" : "Continue"}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
