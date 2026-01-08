-- Rename fitness_goal to fitness_goals and change type to TEXT[]
ALTER TABLE public.user_discovery 
  ALTER COLUMN fitness_goal TYPE TEXT[] USING CASE 
    WHEN fitness_goal IS NULL THEN NULL 
    ELSE ARRAY[fitness_goal] 
  END;

ALTER TABLE public.user_discovery 
  RENAME COLUMN fitness_goal TO fitness_goals;