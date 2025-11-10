-- Insert the 20 book lessons for "Reset by Discipline"
INSERT INTO public.masterclass_lessons (
  module_name, 
  lesson_number, 
  title, 
  description,
  interactive_type,
  video_start_time,
  video_end_time
) VALUES 
  ('Book: Reset by Discipline', 1, 'Understanding Discipline vs. Motivation', 'The truth about discipline and why motivation is unreliable', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 2, 'The Biology of Willpower', 'Understanding how your brain processes decisions and builds habits', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 3, 'Identity-Based Change', 'How to build discipline by shifting your identity', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 4, 'The 2-Minute Rule', 'Making discipline stupidly simple to start', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 5, 'Never Miss Twice', 'The one rule that prevents failure', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 6, 'Environmental Design', 'Make discipline the path of least resistance', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 7, 'The Discipline Stack', 'How to build multiple disciplines without overwhelm', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 8, 'Energy Management', 'Discipline is about managing energy, not time', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 9, 'The Accountability System', 'Building external systems for internal discipline', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 10, 'Dealing with Resistance', 'What to do when everything in you says quit', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 11, 'The Mental Fortress', 'Building unshakeable mental discipline', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 12, 'Physical Discipline Foundations', 'Why physical discipline is the gateway to everything else', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 13, 'Emotional Regulation', 'Mastering your emotional responses', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 14, 'The Discipline Journal', 'Tracking your way to transformation', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 15, 'Social Discipline', 'Managing relationships and boundaries', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 16, 'Financial Discipline', 'The discipline that creates freedom', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 17, 'Recovery and Rest', 'The discipline of strategic recovery', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 18, 'The 30-Day Reset', 'Your complete transformation protocol', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 19, 'Maintaining Momentum', 'How to keep discipline alive long-term', 'none', '0:00', '0:00'),
  ('Book: Reset by Discipline', 20, 'Your Discipline Legacy', 'Building a life of permanent transformation', 'none', '0:00', '0:00')
ON CONFLICT DO NOTHING;