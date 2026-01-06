-- Drop existing table and recreate with comprehensive fields
DROP TABLE IF EXISTS public.user_discovery;

CREATE TABLE public.user_discovery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Basic energy/health (existing)
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  health_level INTEGER CHECK (health_level >= 1 AND health_level <= 10),
  
  -- Personality & Mindset
  personality_type TEXT, -- e.g., 'introvert', 'extrovert', 'ambivert'
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  discipline_level INTEGER CHECK (discipline_level >= 1 AND discipline_level <= 10),
  motivation_style TEXT, -- e.g., 'reward_driven', 'fear_driven', 'purpose_driven'
  decision_making TEXT, -- e.g., 'quick_intuitive', 'slow_analytical', 'emotional'
  
  -- Sleep & Recovery
  sleep_hours INTEGER CHECK (sleep_hours >= 1 AND sleep_hours <= 14),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  wake_up_time TEXT, -- e.g., 'before_6am', '6am_8am', '8am_10am', 'after_10am'
  
  -- Eating Patterns
  meals_per_day INTEGER CHECK (meals_per_day >= 1 AND meals_per_day <= 8),
  eating_style TEXT, -- e.g., 'healthy_balanced', 'fast_food', 'emotional_eating', 'skip_meals'
  hydration_level INTEGER CHECK (hydration_level >= 1 AND hydration_level <= 10),
  biggest_nutrition_challenge TEXT,
  dietary_restrictions TEXT, -- e.g., 'none', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free'
  
  -- Fitness & Activity
  workout_frequency TEXT, -- e.g., 'never', '1-2_weekly', '3-4_weekly', '5+_weekly'
  preferred_workout TEXT, -- e.g., 'gym', 'home', 'outdoors', 'sports', 'none'
  fitness_goal TEXT, -- e.g., 'lose_weight', 'build_muscle', 'endurance', 'flexibility', 'general_health'
  
  -- Goals & Challenges
  primary_goal TEXT,
  secondary_goals TEXT[],
  biggest_challenge TEXT,
  time_available TEXT, -- e.g., '30min', '1hour', '2hours', 'flexible'
  commitment_level INTEGER CHECK (commitment_level >= 1 AND commitment_level <= 10),
  
  -- Lifestyle
  occupation_type TEXT, -- e.g., 'desk_job', 'active_job', 'student', 'entrepreneur', 'other'
  family_situation TEXT, -- e.g., 'single', 'married_no_kids', 'married_with_kids', 'single_parent'
  biggest_life_priority TEXT, -- e.g., 'career', 'family', 'health', 'relationships', 'personal_growth'
  
  -- About themselves (free text)
  describe_yourself TEXT,
  where_you_want_to_be TEXT,
  what_holds_you_back TEXT,
  
  -- AI Generated Report
  ai_report JSONB,
  recommended_lessons TEXT[],
  personalized_diet_plan JSONB,
  personalized_training_plan JSONB,
  report_generated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_discovery ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own discovery" 
ON public.user_discovery 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own discovery" 
ON public.user_discovery 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discovery" 
ON public.user_discovery 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_discovery_updated_at
BEFORE UPDATE ON public.user_discovery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();