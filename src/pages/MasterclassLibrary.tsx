import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MasterclassLibrary() {
  const navigate = useNavigate();

  const masterclasses = [
    {
      id: "mental",
      title: "Mental Pillar Masterclass",
      description: "Master your mind, master your reality. Complete mental mastery training.",
      duration: "47:00",
      thumbnail: "mental",
      videoUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/masterclass-videos/mental-mastery/Masterclass%20final%20aproved%20edit%20-%20mental%20mastery_compressed.mp4`,
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: "physical",
      title: "Physical Pillar Masterclass",
      description: "Your body is your business. Elite physical performance and vitality.",
      duration: "18:27",
      thumbnail: "physical",
      videoUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/masterclass-videos/mental-mastery/Masterclass%20final%20approved%20edit%20-%20physical%20pillar_compressed.mp4`,
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: "spiritual",
      title: "Spiritual Pillar Masterclass",
      description: "Build your unshakable foundation and discover your deeper purpose.",
      duration: "16:30",
      thumbnail: "spiritual",
      videoUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/masterclass-videos/mental-mastery/Masterclass%20Final%20-%20Aproved%20edit%20spiritual%20pilla%20_compressed.mp4`,
      color: "from-amber-500/20 to-orange-500/20"
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
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        <main className="zen-container py-12 space-y-12">
          <section className="text-center animate-fade-in-up">
            <h1 className="text-5xl font-black gradient-text mb-4">Masterclass Library</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Full-length masterclass videos from the Elite Self Discipline course. Watch complete lessons or access interactive modules below.
            </p>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {masterclasses.map((masterclass, index) => (
              <Card 
                key={masterclass.id}
                className="group hover:shadow-large transition-all animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`aspect-video rounded-lg bg-gradient-to-br ${masterclass.color} mb-4 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Play className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <CardTitle className="text-xl">{masterclass.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{masterclass.duration} • Full Video</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{masterclass.description}</p>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="default"
                      className="w-full"
                      onClick={() => window.open(masterclass.videoUrl, '_blank')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Full Video
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/${masterclass.id}-pillar`)}
                    >
                      Interactive Lessons
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="text-center py-8 border-t border-border">
            <p className="text-muted-foreground mb-4">
              Looking for interactive, step-by-step lessons?
            </p>
            <Button 
              variant="zen"
              size="lg"
              onClick={() => navigate("/book/reset-by-discipline")}
            >
              Go to Reset by Discipline Course
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}
