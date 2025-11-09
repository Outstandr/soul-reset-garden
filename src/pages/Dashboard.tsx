import { useEffect } from "react";
import { JourneyCircle } from "@/components/JourneyCircle";
import { ModuleCard } from "@/components/ModuleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Zap, Heart, Mountain, Flower, BookOpen, PenLine, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LionelCoach } from "@/components/LionelCoach";

const journeySteps = [
  {
    id: "rhythm",
    letter: "R",
    title: "Rhythm",
    color: "reset-rhythm",
    icon: "bamboo",
    completed: false,
    active: true,
  },
  {
    id: "energy",
    letter: "E",
    title: "Energy",
    color: "reset-energy",
    icon: "water",
    completed: false,
    active: false,
  },
  {
    id: "systems",
    letter: "S",
    title: "Systems",
    color: "reset-systems",
    icon: "roots",
    completed: false,
    active: false,
  },
  {
    id: "execution",
    letter: "E",
    title: "Execution",
    color: "reset-execution",
    icon: "mountain",
    completed: false,
    active: false,
  },
  {
    id: "transformation",
    letter: "T",
    title: "Transformation",
    color: "reset-transformation",
    icon: "lotus",
    completed: false,
    active: false,
  },
];

const modules = [
  {
    title: "The Reset in You",
    subtitle: "Rhythm & Structure",
    description: "Build a strong foundation for growth through daily rhythms and intentional structure.",
    icon: <Leaf className="w-6 h-6" style={{ color: "hsl(var(--reset-rhythm))" }} />,
    color: "reset-rhythm",
    status: "locked" as const,
    progress: 0,
  },
  {
    title: "Reset Your Addiction",
    subtitle: "Energy & Vitality",
    description: "Break through blockages and reclaim your vital power and life force.",
    icon: <Zap className="w-6 h-6" style={{ color: "hsl(var(--reset-energy))" }} />,
    color: "reset-energy",
    status: "locked" as const,
    progress: 0,
  },
  {
    title: "Reset the Love in You",
    subtitle: "Systems & Relationships",
    description: "Cultivate emotional growth and conscious connection with yourself and others.",
    icon: <Heart className="w-6 h-6" style={{ color: "hsl(var(--reset-systems))" }} />,
    color: "reset-systems",
    status: "locked" as const,
    progress: 0,
  },
  {
    title: "Reset by Discipline",
    subtitle: "Execution & Action",
    description: "Put leadership and consistency into practice with focused discipline.",
    icon: <Mountain className="w-6 h-6" style={{ color: "hsl(var(--reset-execution))" }} />,
    color: "reset-execution",
    status: "active" as const,
    progress: 0,
  },
  {
    title: "Reset the Trust in You",
    subtitle: "Transformation & Integration",
    description: "Embody mastery, trust, and complete transformation of your identity.",
    icon: <Flower className="w-6 h-6" style={{ color: "hsl(var(--reset-transformation))" }} />,
    color: "reset-transformation",
    status: "locked" as const,
    progress: 0,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="zen-container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">RESET Blueprint®️</h1>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Library
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/journal")}>
                <PenLine className="w-4 h-4 mr-2" />
                Journal
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary" />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="zen-container py-12 space-y-16">
        {/* Welcome Section */}
        <section className="animate-fade-in-up">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3">Welcome back, Explorer</h2>
            <p className="text-xl text-muted-foreground">
              Continue your transformational journey
            </p>
          </div>

          {/* Daily Focus Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-reset-rhythm animate-pulse" />
                Today's Focus
              </CardTitle>
              <CardDescription>Your daily rhythm builder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">
                "What rhythm did you build today? Reflect on one structure that supported your growth."
              </p>
              <Button variant="zen" onClick={() => navigate("/journal")}>
                <PenLine className="w-4 h-4 mr-2" />
                Write in Journal
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Journey Circle */}
        <section className="animate-fade-in-up animation-delay-100">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Your Journey Map</h3>
            <p className="text-muted-foreground">
              From structure to surrender, from doing to becoming
            </p>
          </div>
          <JourneyCircle steps={journeySteps} currentStep={0} />
        </section>

        {/* Module Grid */}
        <section className="animate-fade-in-up animation-delay-200">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">Your Modules</h3>
            <p className="text-muted-foreground">
              Each module builds upon the last, creating holistic transformation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <div
                key={module.title}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
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
            ))}
          </div>
        </section>

        {/* Lionel Coach */}
        <section className="animate-fade-in-up animation-delay-500">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">Your Personal Coach</h3>
            <p className="text-muted-foreground">Get personalized guidance based on your progress</p>
          </div>
          <LionelCoach />
        </section>

        {/* Quick Access */}
        <section className="animate-fade-in-up animation-delay-600">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">Quick Access</h3>
            <p className="text-muted-foreground">Jump to your favorite resources</p>
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
                <CardTitle>Masterclass Library</CardTitle>
                <CardDescription>Full masterclass videos for each pillar</CardDescription>
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
                <CardTitle>Digital Journal</CardTitle>
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
