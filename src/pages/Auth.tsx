import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { DiscoveryQuestionnaire } from "@/components/DiscoveryQuestionnaire";

const Auth = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [checkingDiscovery, setCheckingDiscovery] = useState(false);

  const checkDiscoveryStatus = async (userId: string) => {
    const { data } = await supabase
      .from("user_discovery")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    return !!data;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setCheckingDiscovery(true);
        const hasCompleted = await checkDiscoveryStatus(session.user.id);
        setCheckingDiscovery(false);
        if (hasCompleted) {
          navigate("/dashboard");
        } else {
          setShowDiscovery(true);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setCheckingDiscovery(true);
        const hasCompleted = await checkDiscoveryStatus(session.user.id);
        setCheckingDiscovery(false);
        if (hasCompleted) {
          navigate("/dashboard");
        } else {
          setShowDiscovery(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t.auth.signInSuccess);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast.success(t.auth.signUpSuccess);
      }
    } catch (error: any) {
      toast.error(error.message || t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoveryComplete = () => {
    setShowDiscovery(false);
    navigate("/dashboard");
  };

  // Show loading while checking discovery status
  if (checkingDiscovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show discovery questionnaire for new users
  if (showDiscovery) {
    return <DiscoveryQuestionnaire onComplete={handleDiscoveryComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.common.back}
        </Button>
        <Card className="w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? t.auth.welcomeBack : t.auth.createAccount}
          </h1>
          <p className="text-muted-foreground">
            {isLogin
              ? t.auth.getStarted
              : t.auth.getStarted}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t.auth.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.emailPlaceholder}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">{t.auth.password}</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.common.loading : isLogin ? t.auth.signIn : t.auth.signUp}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? t.auth.noAccount : t.auth.hasAccount}
          </button>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default Auth;
