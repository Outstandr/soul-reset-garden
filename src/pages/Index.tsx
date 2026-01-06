import { Hero } from "@/components/Hero";
import { ResetOverview } from "@/components/ResetOverview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Video, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "@/hooks/useTranslations";
import lpaLogo from "@/assets/lpa-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="zen-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={lpaLogo} alt="Leaders Performance Academy" className="h-10 md:h-12 w-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}>{t.landing.about}</Button>
              <Button variant="ghost" size="sm" onClick={() => {
                document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
              }}>{t.landing.testimonialsLink}</Button>
              <LanguageSwitcher />
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                {t.auth.signIn}
              </Button>
              <Button size="sm" onClick={() => navigate('/dashboard')}>
                {t.auth.getStarted}
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
                {t.landing.about}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
              >
                {t.landing.testimonialsLink}
              </Button>
              <div className="px-2 py-2">
                <LanguageSwitcher />
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                {t.auth.signIn}
              </Button>
              <Button 
                className="w-full"
                onClick={() => {
                  navigate('/dashboard');
                  setMobileMenuOpen(false);
                }}
              >
                {t.auth.getStarted}
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
      <section className="py-24 bg-muted/50">
        <div className="zen-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t.landing.features.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.landing.features.subtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="border border-border shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t.landing.features.masterclasses.title}</h3>
                <p className="text-muted-foreground">
                  {t.landing.features.masterclasses.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t.landing.features.ereader.title}</h3>
                <p className="text-muted-foreground">
                  {t.landing.features.ereader.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t.landing.features.community.title}</h3>
                <p className="text-muted-foreground">
                  {t.landing.features.community.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="zen-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t.landing.testimonials.title}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.landing.testimonials.subtitle}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="border border-border shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <p className="text-muted-foreground italic">
                  "{t.landing.testimonials.quote1}"
                </p>
                <p className="font-semibold">- {t.landing.testimonials.author1}</p>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <p className="text-muted-foreground italic">
                  "{t.landing.testimonials.quote2}"
                </p>
                <p className="font-semibold">- {t.landing.testimonials.author2}</p>
              </CardContent>
            </Card>
            <Card className="border border-border shadow-soft">
              <CardContent className="pt-8 space-y-4">
                <p className="text-muted-foreground italic">
                  "{t.landing.testimonials.quote3}"
                </p>
                <p className="font-semibold">- {t.landing.testimonials.author3}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="zen-container text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              {t.landing.cta.title}
            </h2>
            <p className="text-xl text-primary-foreground/90">
              {t.landing.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 bg-background text-foreground hover:bg-background/90" onClick={() => navigate('/dashboard')}>
                {t.landing.cta.button}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                {t.landing.cta.downloadGuide}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="zen-container">
          <div className="flex flex-col items-center gap-4">
            <img src={lpaLogo} alt="Leaders Performance Academy" className="h-12 w-auto opacity-80" />
            <div className="text-center text-muted-foreground">
              <p className="mb-2">© 2025 {t.landing.footer.title}. {t.landing.footer.copyright}</p>
              <p className="text-sm">{t.landing.footer.description}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;