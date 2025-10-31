-- Create table for masterclass lessons
CREATE TABLE public.masterclass_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_start_time TEXT NOT NULL,
  video_end_time TEXT NOT NULL,
  interactive_type TEXT NOT NULL,
  interactive_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(module_name, lesson_number)
);

-- Create table for user lesson progress
CREATE TABLE public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.masterclass_lessons(id),
  completed BOOLEAN DEFAULT false,
  video_progress NUMERIC DEFAULT 0,
  interactive_responses JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.masterclass_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies for masterclass_lessons (public read)
CREATE POLICY "Anyone can view lessons"
ON public.masterclass_lessons FOR SELECT
USING (true);

-- Policies for user_lesson_progress
CREATE POLICY "Users can view their own progress"
ON public.user_lesson_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_lesson_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_lesson_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_lesson_progress_updated_at
BEFORE UPDATE ON public.user_lesson_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Mental Pillar lessons
INSERT INTO public.masterclass_lessons (module_name, lesson_number, title, description, video_start_time, video_end_time, interactive_type, interactive_config) VALUES
('mental', 1, 'Introduction & The Three Worlds', 'Understand the three foundational worlds: Spiritual, Mental, and Physical', '00:00', '04:37', 'self-diagnostic', '{"question": "Which of the Three Worlds (Spiritual, Mental, Physical) do you feel you focus on most? And which do you neglect?", "options": ["Spiritual", "Mental", "Physical"]}'),
('mental', 2, 'Are You a Passenger or a Driver?', 'Self-assess whether you control your life or react to it', '04:38', '06:54', 'passenger-driver', '{"statements": ["My thoughts control my mood", "I react to my day", "I proactively plan my actions", "I wait for things to happen", "I make things happen", "I feel in control", "I feel overwhelmed often"]}'),
('mental', 3, 'Component 1: Outcome Independence', 'Focus on processes you control rather than outcomes', '06:55', '10:28', 'process-outcome', '{"prompts": {"goal": "Identify a major goal", "outcome": "What is the outcome you want?", "processes": "List 3 processes you can control"}}'),
('mental', 4, 'Component 2: Cognitive Sovereignty', 'Take control of your thoughts with a 3-step tool', '10:29', '12:04', 'cognitive-sovereignty', '{"steps": ["Catch: Write a negative thought", "Challenge: Say that is not true", "Replace: Write your replacement thought"]}'),
('mental', 5, 'Component 3: Strategic Patience', 'Build your 2-3 year vision with daily discipline', '12:05', '12:57', 'vision-journal', '{"prompt": "What is your 2-3 year vision? What one daily discipline will get you there?"}'),
('mental', 6, 'Decision Velocity & The 90% Rule', 'Learn to make decisions with 90% of information', '12:58', '14:29', 'scenario-quiz', '{"scenarios": [{"question": "You are choosing a vendor. You have vetted 3 and have a clear favorite, but you could check 3 more. Do you have 90% of info?", "options": ["Yes, make the decision", "No, I need 100%"], "correct": 0}]}'),
('mental', 7, 'The Leader Decision Filter', 'Use 3 questions to filter every decision', '14:30', '15:31', 'decision-filter', '{"questions": ["Does this move me closer to my 2-3 year vision?", "Does this align with my core values?", "Can I trust myself to handle the worst-case scenario?"]}'),
('mental', 8, 'Mental Toughness & Emotional Flexibility', 'Build resilience through discomfort and breathing', '15:32', '17:06', 'discomfort-breath', '{"pledge": "I will do one uncomfortable thing every day for 30 days", "breath": {"in": 4, "hold": 7, "out": 8}}'),
('mental', 9, 'Your Attention, The Battlefield', 'Build your Focus Fortress with concrete actions', '17:07', '19:07', 'focus-fortress', '{"actions": ["Single-Tasking: I will do one task at a time", "Power Blocks: I will schedule a 90-minute power block", "Environment Design: I will remove 3 distractions from my workspace"]}'),
('mental', 10, 'The Mindset Flip (You Are Enough)', 'Recognize what is already good about you', '19:08', '20:38', 'already-good', '{"prompt": "Write down three things about yourself that are already good"}'),
('mental', 11, 'The 7-Day Awakening (Days 1-4)', 'Your action plan for the first 4 days', '20:39', '22:47', 'action-checklist', '{"days": ["Day 1: Morning Routine", "Day 2: Cognitive Sovereignty", "Day 3: Decision Velocity", "Day 4: Focus Fortress"]}'),
('mental', 12, 'The 7-Day Awakening (Days 5-7) & Conclusion', 'Complete your awakening journey', '22:48', '26:27', 'action-commitment', '{"days": ["Day 5: Strategic Patience", "Day 6: Mental Toughness", "Day 7: Mindset Flip"], "commitment": "I am ready to begin my awakening"}');