-- Create course modules and lessons tracking with quiz functionality
CREATE TABLE IF NOT EXISTS public.course_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_number integer NOT NULL,
  title text NOT NULL,
  description text,
  passing_score integer NOT NULL DEFAULT 70,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid NOT NULL REFERENCES public.masterclass_lessons(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('multiple-choice', 'true-false', 'short-answer')),
  options jsonb,
  correct_answer text NOT NULL,
  points integer NOT NULL DEFAULT 10,
  order_number integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user quiz attempts table
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  lesson_id uuid NOT NULL REFERENCES public.masterclass_lessons(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_points integer NOT NULL,
  percentage integer NOT NULL,
  passed boolean NOT NULL,
  answers jsonb NOT NULL,
  attempt_number integer NOT NULL DEFAULT 1,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.user_certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  course_name text NOT NULL,
  module_name text,
  issue_date timestamp with time zone NOT NULL DEFAULT now(),
  certificate_number text NOT NULL UNIQUE,
  final_score integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_modules
CREATE POLICY "Anyone can view course modules"
  ON public.course_modules FOR SELECT
  USING (true);

-- RLS Policies for quiz_questions
CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (true);

-- RLS Policies for user_quiz_attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON public.user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON public.user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_certificates
CREATE POLICY "Users can view their own certificates"
  ON public.user_certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates"
  ON public.user_certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_quiz_questions_lesson ON public.quiz_questions(lesson_id);
CREATE INDEX idx_user_quiz_attempts_user_lesson ON public.user_quiz_attempts(user_id, lesson_id);
CREATE INDEX idx_user_certificates_user ON public.user_certificates(user_id);

-- Trigger for updated_at on user_quiz_attempts
CREATE TRIGGER update_user_quiz_attempts_updated_at
  BEFORE UPDATE ON public.user_quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();