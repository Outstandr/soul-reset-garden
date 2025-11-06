import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Fetching user data for:', user.id);

    // Fetch user's learning data
    const [journalData, quizData, progressData] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(10),
      
      supabase
        .from('user_quiz_attempts')
        .select('*, masterclass_lessons(title, module_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      
      supabase
        .from('user_lesson_progress')
        .select('*, masterclass_lessons(title, module_name, lesson_number)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
    ]);

    // Build context about the user
    const userContext = buildUserContext(
      journalData.data || [],
      quizData.data || [],
      progressData.data || []
    );

    console.log('User context built, calling AI...');

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are Lionel X - a straight-talking personal coach who keeps it real and conversational.

COURSE KNOWLEDGE:
- Module 1: Getting Fit (physical fitness, energy)
- Module 2: Knowing Who You Are (self-awareness, identity)
- Module 3: Become Your Own Boss (self-mastery, discipline)

YOUR STYLE:
- Keep responses SHORT (2-4 sentences max)
- Talk like you're texting a friend
- Ask one question at a time
- Give ONE piece of advice, not a whole list
- Use their name or "you" - make it personal
- No bullet points or long paragraphs
- Be direct but warm
- Reference their specific progress naturally

${userContext}

Remember: Short, conversational, one thought at a time. Like you're having a real conversation.`
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service unavailable. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Lionel coach error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildUserContext(journals: any[], quizzes: any[], progress: any[]): string {
  let context = '\n\nUSER PROFILE:\n';

  // Quiz performance
  if (quizzes.length > 0) {
    const avgScore = quizzes.reduce((acc, q) => acc + q.percentage, 0) / quizzes.length;
    const passedCount = quizzes.filter(q => q.passed).length;
    
    context += `\nQUIZ PERFORMANCE:
- Average Score: ${avgScore.toFixed(1)}%
- Passed: ${passedCount}/${quizzes.length} quizzes
- Recent attempts:\n`;
    
    quizzes.slice(0, 5).forEach(quiz => {
      context += `  * ${quiz.masterclass_lessons?.module_name} - ${quiz.masterclass_lessons?.title}: ${quiz.percentage}% (${quiz.passed ? 'PASSED' : 'FAILED'})\n`;
    });
  }

  // Progress overview
  if (progress.length > 0) {
    context += `\nLEARNING PROGRESS:
- Total lessons engaged: ${progress.length}
- Completed lessons: ${progress.filter(p => p.completed).length}
- Recent lessons:\n`;
    
    progress.slice(0, 5).forEach(p => {
      context += `  * ${p.masterclass_lessons?.module_name} - Lesson ${p.masterclass_lessons?.lesson_number}: ${p.masterclass_lessons?.title} (${p.completed ? 'Completed' : 'In Progress'})\n`;
    });
  }

  // Journal insights
  if (journals.length > 0) {
    context += `\nRECENT JOURNAL ENTRIES (Last 5):\n`;
    journals.slice(0, 5).forEach(j => {
      context += `\n[${j.entry_date}]`;
      if (j.mood) context += `\nMood: ${j.mood}`;
      if (j.energy_level) context += `\nEnergy: ${j.energy_level}/10`;
      if (j.wins) context += `\nWins: ${j.wins}`;
      if (j.challenges) context += `\nChallenges: ${j.challenges}`;
      if (j.goals) context += `\nGoals: ${j.goals}`;
      if (j.reflection) context += `\nReflection: ${j.reflection}`;
      context += '\n';
    });
  }

  if (journals.length === 0 && quizzes.length === 0 && progress.length === 0) {
    context += '\nThis user is just starting their journey. Welcome them warmly and help them understand how to get the most from the program.';
  }

  return context;
}
