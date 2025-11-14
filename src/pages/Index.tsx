import { Hero } from "@/components/Hero";
import { ResetOverview } from "@/components/ResetOverview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Video, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="zen-container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold gradient-text">RESET Blueprint®️</h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}>About</Button>
              <Button variant="ghost" size="sm" onClick={() => {
                document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
              }}>Testimonials</Button>
              <LanguageSwitcher />
              <Button variant="zen" size="sm" onClick={() => navigate('/dashboard')}>
                Sign In
              </Button>
              <Button variant="hero" size="sm" onClick={() => navigate('/dashboard')}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2 animate-fade-in-up">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
              >
                About
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
              >
                Testimonials
              </Button>
              <div className="px-2 py-2">
                <LanguageSwitcher />
              </div>
              <Button 
                variant="zen" 
                className="w-full"
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* RESET Overview - About Section */}
      <div id="about">
        <ResetOverview />
      </div>

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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-primary/5 via-reset-energy/5 to-reset-transformation/5">
        <div className="zen-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              What Our <span className="gradient-text">Community</span> Says
            </h2>
            <p className="text-xl text-muted-foreground">
              Real transformations from real people
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="border-0 shadow-medium">
              <CardContent className="pt-8 space-y-4">
                <p className="text-muted-foreground italic">
                  "The RESET Blueprint transformed how I approach every day. I've built rhythms that actually stick."
                </p>
                <p className="font-semibold">- Sarah M.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-medium">
              <CardContent className="pt-8 space-y-4">
                <p className="text-muted-foreground italic">
                  "Finally, a program that goes beyond surface-level changes. This is about becoming, not just doing."
                </p>
                <p className="font-semibold">- James K.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-medium">
              <CardContent className="pt-8 space-y-4">
                <p className="text-muted-foreground italic">
                  "The five pillars gave me a complete framework. I'm not just productive, I'm fulfilled."
                </p>
                <p className="font-semibold">- Maria L.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
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
