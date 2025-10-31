import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, BookmarkPlus, MessageSquare, Lightbulb, Star, Sparkles, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function BookLessonContent() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [checkpoints, setCheckpoints] = useState<number[]>([]);
  const [actionCompleted, setActionCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [showReflection, setShowReflection] = useState(false);

  // Mock lesson data (in real app, fetch based on lessonId)
  const lesson = {
    lessonNumber: 1,
    title: "Understanding Discipline vs. Motivation",
    category: "concept",
    readingTime: "8 min",
    xp: 25,
    content: `
# The Truth About Discipline

**Motivation is a liar.**

It shows up when you don't need it and disappears the moment things get hard. It's the fair-weather friend of personal development—exciting, inspiring, but utterly unreliable.

Discipline, on the other hand, is your ride-or-die.

## The Motivation Trap

Most people wait for motivation to strike before they take action. They scroll Instagram looking for that perfect quote, watch a few YouTube videos of people shouting at them to "just do it," and feel a temporary surge of energy.

Then what?

By Tuesday, the motivation is gone. The gym membership goes unused. The business plan sits untouched. The dream fades back into "someday."

**Here's the secret nobody tells you:** Disciplined people don't feel like doing it either.

They just do it anyway.

## What Discipline Really Is

Discipline is the bridge between goals and accomplishment. It's the ability to do what needs to be done, when it needs to be done, whether you feel like it or not.

Think of it like this:
- **Motivation** = Emotion-driven action
- **Discipline** = Identity-driven action

When you're motivated, you act because you *feel* like it.
When you're disciplined, you act because it's *who you are*.

## The Discipline Equation

Here's the formula that changes everything:

**Small Action × Consistency × Time = Transformation**

Not:
- Massive action when you feel like it
- Perfect execution when inspired
- Heroic effort on good days

Just small, consistent action. Every. Single. Day.

## Building Your Discipline Muscle

Discipline isn't something you're born with—it's something you build. Like a muscle, it gets stronger with use.

Start here:

**1. Choose ONE Thing**
Don't try to transform your entire life overnight. Pick one area where you'll practice discipline relentlessly.

**2. Make It Stupid Simple**
Your disciplined action should be so easy that you can't talk yourself out of it.
- Not "work out for an hour"—do 2 push-ups
- Not "write a chapter"—write 50 words
- Not "meditate for 30 minutes"—sit for 60 seconds

**3. Never Miss Twice**
Life happens. You'll miss a day. That's fine.
But never miss twice in a row. Missing once is an accident. Missing twice is the beginning of a new (bad) habit.

**4. Track Everything**
What gets measured gets improved. Use a simple tracker—a calendar, an app, a notebook. Mark every day you show up.

## The 48-Hour Rule

Here's a secret weapon: **You're always less than 48 hours away from momentum.**

Feeling stuck? Lost? Unmotivated?

Execute your discipline practice for just 2 days in a row, and watch what happens. The resistance starts to crack. The momentum builds. The identity shifts.

## Your New Identity

From this moment forward, you're no longer someone who "tries to be disciplined."

You ARE disciplined.

Every action you take is a vote for the type of person you want to become. Start voting for the disciplined version of you—one rep, one page, one day at a time.

---

**Remember:** Motivation gets you started. Discipline keeps you going.

Which one will you choose?
    `,
    keyTakeaways: [
      "Motivation is fleeting, discipline is forever",
      "Disciplined people don't always feel like it—they do it anyway",
      "Small action × Consistency × Time = Transformation",
      "Never miss twice in a row"
    ],
    actionStep: "Choose ONE area of your life where you'll practice discipline today. Make it stupidly simple—something you can do in 2 minutes or less. Then do it.",
    reflectionPrompt: "What's one area of your life where you've been waiting for motivation instead of building discipline? What would change if you committed to just 2 minutes a day?"
  };

  // Unlock checkpoints as user reads
  useEffect(() => {
    if (readingProgress >= 25 && !checkpoints.includes(25)) {
      setCheckpoints([...checkpoints, 25]);
      toast({
        title: "🎯 Checkpoint Reached!",
        description: "+5 bonus XP - You're making great progress!",
      });
    }
    if (readingProgress >= 50 && !checkpoints.includes(50)) {
      setCheckpoints([...checkpoints, 50]);
      toast({
        title: "🎯 Halfway There!",
        description: "+10 bonus XP - Keep going!",
      });
    }
    if (readingProgress >= 75 && !checkpoints.includes(75)) {
      setCheckpoints([...checkpoints, 75]);
      toast({
        title: "🎯 Almost Done!",
        description: "+15 bonus XP - Final stretch!",
      });
    }
  }, [readingProgress, checkpoints, toast]);

  const handleComplete = () => {
    setIsCompleted(true);
    toast({
      title: "🎉 Lesson Complete!",
      description: `+${lesson.xp} XP earned!`,
    });
    
    setTimeout(() => {
      navigate("/book/reset-by-discipline");
    }, 2000);
  };

  const handleHighlight = (text: string) => {
    if (!highlights.includes(text)) {
      setHighlights([...highlights, text]);
      toast({
        title: "✨ Highlighted!",
        description: "Saved to your highlights",
      });
    }
  };

  const handleActionComplete = () => {
    setActionCompleted(true);
    toast({
      title: "💪 Action Completed!",
      description: "+10 bonus XP for taking action!",
    });
  };

  const handleReflectionSave = () => {
    if (reflectionText.trim()) {
      toast({
        title: "💭 Reflection Saved!",
        description: "Your insights have been saved to your journal",
      });
      setShowReflection(false);
    }
  };

  // Simulate reading progress on scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setReadingProgress(Math.min(Math.round(scrollPercentage), 100));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/book/reset-discipline")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Book
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-black text-amber-400">{lesson.xp} XP</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black mb-2">
              Lesson {lesson.lessonNumber}: {lesson.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="capitalize px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {lesson.category}
              </span>
              <span>⏱️ {lesson.readingTime}</span>
              <span className="font-bold text-reset-rhythm">{readingProgress}% Complete</span>
            </div>
          </div>
          <Progress value={readingProgress} className="h-2 mt-3" />
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto"
        onScroll={handleScroll}
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {/* Interactive Lesson Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-12" ref={contentRef}>
          {lesson.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={idx} className="text-4xl font-black mb-6 mt-8 animate-fade-in">
                  {paragraph.slice(2)}
                </h1>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-3xl font-black mb-4 mt-8 text-reset-rhythm animate-fade-in">
                  {paragraph.slice(3)}
                </h2>
              );
            }
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              const text = paragraph.slice(2, -2);
              return (
                <div key={idx} className="relative group my-6 animate-fade-in">
                  <p className="text-xl font-black text-reset-energy p-4 bg-reset-energy/10 border-l-4 border-reset-energy rounded-r-lg cursor-pointer transition-all hover:bg-reset-energy/20">
                    {text}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleHighlight(text)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              );
            }
            if (paragraph.includes('\n- ')) {
              const items = paragraph.split('\n').filter(line => line.startsWith('- '));
              return (
                <ul key={idx} className="space-y-2 my-6 animate-fade-in">
                  {items.map((item, i) => (
                    <li key={i} className="ml-6 text-gray-300 flex items-start gap-3 group cursor-pointer hover:text-white transition-colors">
                      <span className="text-reset-rhythm mt-1">•</span>
                      <span className="flex-1">{item.slice(2)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleHighlight(item.slice(2))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Sparkles className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              );
            }
            if (paragraph.trim() === '' || paragraph === '---') return null;
            return (
              <p key={idx} className="my-4 text-gray-300 leading-relaxed animate-fade-in group relative cursor-pointer hover:text-white transition-colors">
                {paragraph}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleHighlight(paragraph)}
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Sparkles className="w-3 h-3" />
                </Button>
              </p>
            );
          })}
        </div>

        {/* Highlights Section */}
        {highlights.length > 0 && (
          <Card className="mb-8 p-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl font-black text-yellow-400">Your Highlights ({highlights.length})</h3>
            </div>
            <div className="space-y-3">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="p-3 bg-yellow-500/5 border-l-2 border-yellow-500 rounded-r text-gray-300">
                  {highlight}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Key Takeaways */}
        <Card className="mb-8 p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-black text-blue-400">Key Takeaways</h3>
          </div>
          <ul className="space-y-3">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 font-semibold">{takeaway}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Interactive Action Step */}
        <Card className={`mb-8 p-6 transition-all duration-300 ${
          actionCompleted 
            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50' 
            : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-green-400" />
            <h3 className="text-2xl font-black text-green-400">Your Action Step</h3>
          </div>
          <p className="text-gray-300 font-semibold leading-relaxed mb-4">{lesson.actionStep}</p>
          {!actionCompleted ? (
            <Button
              variant="hero"
              onClick={handleActionComplete}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Action Complete
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-green-400 font-bold animate-scale-in">
              <CheckCircle className="w-5 h-5" />
              <span>Action Completed! +10 XP</span>
            </div>
          )}
        </Card>

        {/* Interactive Reflection Prompt */}
        <Card className="mb-8 p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-black text-purple-400">Reflection Question</h3>
          </div>
          <p className="text-gray-300 font-semibold leading-relaxed mb-4">{lesson.reflectionPrompt}</p>
          
          {!showReflection ? (
            <Button
              variant="hero"
              onClick={() => setShowReflection(true)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Write Your Reflection
            </Button>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <Textarea
                placeholder="Write your thoughts here..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="min-h-[120px] bg-purple-500/5 border-purple-500/30 text-white placeholder:text-gray-500"
              />
              <div className="flex gap-3">
                <Button
                  variant="hero"
                  onClick={handleReflectionSave}
                  disabled={!reflectionText.trim()}
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Reflection
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowReflection(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Complete Button */}
        {!isCompleted && readingProgress >= 80 && (
          <div className="text-center animate-scale-in">
            <Button
              variant="hero"
              size="lg"
              onClick={handleComplete}
              className="px-12 py-6 text-xl font-black shadow-neon"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Mark Lesson Complete
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="text-center animate-scale-in">
            <Card className="inline-flex flex-col items-center gap-4 px-12 py-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h3 className="text-3xl font-black text-green-500">Lesson Complete!</h3>
              <p className="text-gray-400">+{lesson.xp} XP earned</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
