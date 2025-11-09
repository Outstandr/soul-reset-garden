import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { format, addDays, subDays } from "date-fns";

const Journal = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Journal entry state
  const [gratitude, setGratitude] = useState("");
  const [goals, setGoals] = useState("");
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState("");
  const [energyLevel, setEnergyLevel] = useState([5]);

  const moods = ["😊 Great", "🙂 Good", "😐 Okay", "😔 Low", "😫 Struggling"];

  useEffect(() => {
    // Load from localStorage for the selected date
    const savedEntry = localStorage.getItem(`journal-${format(currentDate, "yyyy-MM-dd")}`);
    if (savedEntry) {
      const entry = JSON.parse(savedEntry);
      setGratitude(entry.gratitude || "");
      setGoals(entry.goals || "");
      setWins(entry.wins || "");
      setChallenges(entry.challenges || "");
      setReflection(entry.reflection || "");
      setMood(entry.mood || "");
      setEnergyLevel(entry.energy_level ? [entry.energy_level] : [5]);
    } else {
      // Reset form if no saved data
      setGratitude("");
      setGoals("");
      setWins("");
      setChallenges("");
      setReflection("");
      setMood("");
      setEnergyLevel([5]);
    }
  }, [currentDate]);

  const saveJournalEntry = async () => {
    setSaving(true);
    
    const entry = {
      gratitude,
      goals,
      wins,
      challenges,
      reflection,
      mood,
      energy_level: energyLevel[0],
      entry_date: format(currentDate, "yyyy-MM-dd")
    };

    // Save to localStorage
    localStorage.setItem(`journal-${format(currentDate, "yyyy-MM-dd")}`, JSON.stringify(entry));
    
    toast.success("Journal entry saved!");
    setSaving(false);
  };

  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={saveJournalEntry} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Date Navigation */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="text-center">
                <h2 className="text-2xl font-bold">{format(currentDate, "EEEE, MMMM d, yyyy")}</h2>
                {format(currentDate, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd") && (
                  <Button variant="link" size="sm" onClick={goToToday}>
                    Go to Today
                  </Button>
                )}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextDay}
              disabled={format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Mood & Energy */}
        <Card className="p-6 mb-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                How are you feeling today?
              </label>
              <div className="flex gap-2 flex-wrap">
                {moods.map((m) => (
                  <Button
                    key={m}
                    variant={mood === m ? "default" : "outline"}
                    onClick={() => setMood(m)}
                    className="flex-1 min-w-[100px]"
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-3 block">
                Energy Level: {energyLevel[0]}/10
              </label>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Gratitude */}
        <Card className="p-6 mb-6">
          <label className="text-sm font-semibold mb-3 block">
            🙏 What are you grateful for today?
          </label>
          <Textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="I'm grateful for..."
            className="min-h-[120px]"
          />
        </Card>

        {/* Goals */}
        <Card className="p-6 mb-6">
          <label className="text-sm font-semibold mb-3 block">
            🎯 Today's Goals & Intentions
          </label>
          <Textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Today I will..."
            className="min-h-[120px]"
          />
        </Card>

        {/* Wins */}
        <Card className="p-6 mb-6">
          <label className="text-sm font-semibold mb-3 block">
            🏆 Today's Wins & Achievements
          </label>
          <Textarea
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            placeholder="I accomplished..."
            className="min-h-[120px]"
          />
        </Card>

        {/* Challenges */}
        <Card className="p-6 mb-6">
          <label className="text-sm font-semibold mb-3 block">
            💪 Challenges & Lessons Learned
          </label>
          <Textarea
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            placeholder="I faced... and learned..."
            className="min-h-[120px]"
          />
        </Card>

        {/* Reflection */}
        <Card className="p-6 mb-6">
          <label className="text-sm font-semibold mb-3 block">
            ✨ Daily Reflection & Notes
          </label>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Today I noticed... I feel..."
            className="min-h-[120px]"
          />
        </Card>

        <div className="text-center">
          <Button size="lg" onClick={saveJournalEntry} disabled={saving}>
            <Save className="mr-2 h-5 w-5" />
            {saving ? "Saving..." : "Save Journal Entry"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Journal;