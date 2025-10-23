import { Hero } from "@/components/Hero";
import { ResetOverview } from "@/components/ResetOverview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="zen-container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">RESET Blueprint®️</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">About</Button>
              <Button variant="ghost" size="sm">Testimonials</Button>
              <Button variant="zen" size="sm" onClick={() => navigate('/dashboard')}>
                Sign In
              </Button>
              <Button variant="hero" size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* RESET Overview */}
      <ResetOverview />

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="zen-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for <span className="gradient-text">Transformation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete ecosystem designed for your holistic journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="border-0 shadow-medium hover:shadow-strong transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-reset-rhythm/10 flex items-center justify-center">
                  <Video className="w-8 h-8 text-reset-rhythm" />
                </div>
                <h3 className="text-xl font-bold">Masterclass Courses</h3>
                <p className="text-muted-foreground">
                  In-depth video courses for each RESET module with guided exercises
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-medium hover:shadow-strong transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-reset-energy/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-reset-energy" />
                </div>
                <h3 className="text-xl font-bold">Digital E-Reader</h3>
                <p className="text-muted-foreground">
                  Access all five RESET books with highlighting and note-taking
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-medium hover:shadow-strong transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-reset-systems/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-reset-systems" />
                </div>
                <h3 className="text-xl font-bold">Community Circles</h3>
                <p className="text-muted-foreground">
                  Connect with fellow travelers on the RESET journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-reset-energy/5 to-reset-transformation/5">
        <div className="zen-container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Begin Your <span className="gradient-text">RESET</span> Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join 10,000+ students transforming from structure to surrender, 
              from doing to becoming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="journey" size="lg" className="text-lg px-8" onClick={() => navigate('/dashboard')}>
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Download Free Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="zen-container">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 RESET Blueprint®️. All rights reserved.</p>
            <p className="text-sm">From foundation to transformation, one step at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
