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

    console.log('Fetching user data for voice conversation:', user.id);

    // Fetch user's learning data (same as lionel-coach)
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

    // Build user context
    const userContext = buildUserContext(
      journalData.data || [],
      quizData.data || [],
      progressData.data || []
    );

    console.log('User context built for voice mode');

    // Get ElevenLabs credentials
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const ELEVENLABS_AGENT_ID = Deno.env.get('ELEVENLABS_AGENT_ID');

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    if (!ELEVENLABS_AGENT_ID) {
      throw new Error('ELEVENLABS_AGENT_ID not configured');
    }

    // Build the personalized system prompt
    const systemPrompt = `You are Lionel X - a straight-talking personal coach who keeps it real and conversational.

COURSE KNOWLEDGE:
- Module 1: Getting Fit (physical fitness, energy)
- Module 2: Knowing Who You Are (self-awareness, identity)
- Module 3: Become Your Own Boss (self-mastery, discipline)

YOUR STYLE:
- Keep responses SHORT (2-4 sentences max)
- Talk like you're having a real conversation
- Ask one question at a time
- Give ONE piece of advice, not a whole list
- Use their name or "you" - make it personal
- Be direct but warm
- Reference their specific progress naturally

${userContext}

Remember: Short, conversational, one thought at a time. Like you're having a real conversation.`;

    // Build personalized first message
    let firstMessage = "Hey! Good to hear from you. What's on your mind today?";
    
    if (progressData.data && progressData.data.length > 0) {
      const completedCount = progressData.data.filter((p: any) => p.completed).length;
      if (completedCount > 0) {
        firstMessage = `Hey! I see you've been putting in the work - ${completedCount} lessons completed. Nice! What can I help you with today?`;
      }
    } else if (journalData.data && journalData.data.length === 0 && quizData.data && quizData.data.length === 0) {
      firstMessage = "Hey! Looks like you're just starting your journey. Welcome! What's on your mind - any questions about the program or something specific you want to work on?";
    }

    // Build overrides object for the conversation
    const overrides = {
      agent: {
        prompt: {
          prompt: systemPrompt
        },
        first_message: firstMessage
      }
    };

    // Request conversation token for WebRTC (preferred for lower latency)
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const tokenData = await response.json();
    console.log('Got conversation token successfully');

    // Return the token and overrides
    // Client will use both to start the session
    return new Response(
      JSON.stringify({ 
        token: tokenData.token,
        overrides: overrides
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('ElevenLabs token error:', error);
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
