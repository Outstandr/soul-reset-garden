import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, User, Phone, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/useTranslations";
import { DiscoveryQuestionnaire } from "@/components/DiscoveryQuestionnaire";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", 
  "Netherlands", "Belgium", "Spain", "Italy", "Portugal", "Ireland", "Sweden", 
  "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Poland", "Russia",
  "Brazil", "Mexico", "Argentina", "Japan", "South Korea", "China", "India",
  "South Africa", "Nigeria", "Egypt", "UAE", "Saudi Arabia", "Other"
];

const Auth = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
    let cancelled = false;

    const resolveDiscovery = async (sessionUserId: string) => {
      setCheckingDiscovery(true);
      try {
        const hasCompleted = await checkDiscoveryStatus(sessionUserId);
        if (cancelled) return;
        if (hasCompleted) {
          navigate("/dashboard");
        } else {
          setShowDiscovery(true);
        }
      } catch {
        if (!cancelled) setShowDiscovery(true);
      } finally {
        if (!cancelled) setCheckingDiscovery(false);
      }
    };

    // Listener FIRST (avoid missing events)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id;

      // Important: if the session temporarily becomes null (tab switch / refresh),
      // don't reset the questionnaire; just ensure we aren't stuck on "Loading...".
      if (!userId) {
        setCheckingDiscovery(false);
        return;
      }

      void resolveDiscovery(userId);
    });

    // THEN fetch current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const userId = session?.user?.id;
      if (userId) void resolveDiscovery(userId);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
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
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
              country: country,
              phone_number: phoneNumber,
            },
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
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger className="w-full">
                    <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 234 567 8900"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </>
          )}

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
