import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LESSONS_DATA = [
  // Module 1: Getting Fit (Physical)
  { id: "4168900e-c9b8-4ede-8359-061c7caf190c", module: "physical", title: "Introduction to Getting Fit", focus: ["fitness basics", "discipline", "physical vitality"] },
  { id: "intro-safe-progression", module: "physical", title: "Fitness Assessment & Safe Progression", focus: ["fitness assessment", "injury prevention", "safe training"] },
  { id: "smarter-framework", module: "physical", title: "Goal Setting with SMARTER Framework", focus: ["goal setting", "planning", "measurement"] },
  { id: "training-fundamentals", module: "physical", title: "Training Fundamentals", focus: ["exercise form", "training principles", "workout structure"] },
  { id: "sleep-recovery", module: "physical", title: "Sleep & Recovery Systems", focus: ["sleep optimization", "recovery", "rest"] },
  { id: "nutrition-energy", module: "physical", title: "Nutrition & Energy Management", focus: ["nutrition", "diet", "energy levels"] },
  
  // Module 2: Knowing Who You Are (Mental)
  { id: "f5e098c5-52a9-45a0-be97-06994a7afef6", module: "mental", title: "Introduction & The Three Worlds", focus: ["self-awareness", "mental clarity", "life pillars"] },
  { id: "86f499db-bea0-4e84-b363-05b4fea03ded", module: "mental", title: "Are You a Passenger or a Driver?", focus: ["control", "ownership", "decision making"] },
  { id: "426f5ff0-7ae3-4720-bb31-c89ee274422c", module: "mental", title: "Outcome Independence", focus: ["process focus", "detachment", "stoicism"] },
  { id: "a8a3f01a-b5e2-473b-83bd-bd5397f93060", module: "mental", title: "Cognitive Sovereignty", focus: ["thought control", "mental discipline", "mindfulness"] },
  { id: "684becd3-35d0-4007-a01f-bbb88d88e3ed", module: "mental", title: "Strategic Patience", focus: ["long-term vision", "patience", "delayed gratification"] },
  { id: "bb003e3f-5564-4274-865d-4dd3dd08b810", module: "mental", title: "Decision Velocity & The 90% Rule", focus: ["decision making", "speed", "analysis paralysis"] },
  { id: "a589d511-1de0-4dd9-a681-e1709478d08e", module: "mental", title: "The Leader Decision Filter", focus: ["leadership", "filtering decisions", "priorities"] },
  { id: "0be694d7-76c3-44e6-96c3-0a8d0bcca381", module: "mental", title: "Mental Toughness & Emotional Flexibility", focus: ["resilience", "emotional control", "stress management"] },
  { id: "41ed473b-93d6-47d0-bad6-129baf350717", module: "mental", title: "Your Attention, The Battlefield", focus: ["focus", "attention management", "distraction"] },
  { id: "667a1f04-ab77-4a80-95b6-c2c981fd979a", module: "mental", title: "The Mindset Flip (You Are Enough)", focus: ["self-worth", "confidence", "self-acceptance"] },
  
  // Module 3: Become Your Own Boss (Spiritual)
  { id: "spiritual-purpose", module: "spiritual", title: "Finding Your Purpose", focus: ["purpose", "meaning", "life direction"] },
  { id: "spiritual-values", module: "spiritual", title: "Living by Your Values", focus: ["values", "integrity", "authenticity"] },
  { id: "spiritual-leadership", module: "spiritual", title: "Self-Leadership", focus: ["leadership", "self-mastery", "influence"] },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { discoveryData } = await req.json();

    // Build comprehensive prompt for AI
    const prompt = buildPrompt(discoveryData);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating personalized plan for user:', user.id);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are Lionel, an elite performance coach at Leader Performance Academy. You specialize in creating personalized transformation plans that combine physical training, mental discipline, and spiritual growth.

Your task is to analyze a user's discovery questionnaire responses and create a comprehensive, personalized plan.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations outside the JSON.

The JSON structure must be:
{
  "summary": {
    "title": "string - A personalized title for their journey",
    "overview": "string - 2-3 paragraph analysis of who they are and their potential",
    "personality_insight": "string - Key insight about their personality type",
    "strength_areas": ["array of 3 strings - their natural strengths"],
    "growth_areas": ["array of 3 strings - areas to focus on"]
  },
  "recommended_lessons": [
    {
      "lesson_id": "string - lesson ID from the list",
      "title": "string - lesson title",
      "reason": "string - why this lesson is critical for them",
      "priority": 1-5
    }
  ],
  "diet_plan": {
    "approach": "string - overall nutrition philosophy for them",
    "meal_timing": "string - when they should eat based on their schedule",
    "daily_structure": {
      "morning": "string - morning meal recommendations",
      "midday": "string - lunch recommendations", 
      "evening": "string - dinner recommendations",
      "snacks": "string - snack recommendations"
    },
    "hydration": "string - water intake recommendations",
    "avoid": ["array of foods/habits to avoid"],
    "prioritize": ["array of foods/nutrients to prioritize"],
    "weekly_tips": ["array of 3-5 actionable tips"]
  },
  "training_plan": {
    "approach": "string - overall training philosophy for them",
    "weekly_structure": {
      "days_per_week": number,
      "session_duration": "string",
      "schedule": [
        {
          "day": "string - day name or number",
          "focus": "string - what to train",
          "details": "string - specific exercises/activities"
        }
      ]
    },
    "progression": "string - how to progress over 4-8 weeks",
    "recovery": "string - recovery recommendations",
    "warnings": ["array of things to be careful about based on their profile"]
  },
  "first_week_actions": [
    "string - specific action for day 1-2",
    "string - specific action for day 3-4",
    "string - specific action for day 5-7"
  ],
  "motivational_message": "string - personalized encouragement based on their challenges"
}

Available lessons to recommend from (use 5-8 most relevant):
${LESSONS_DATA.map(l => `- ID: "${l.id}", Title: "${l.title}", Module: ${l.module}, Focus: ${l.focus.join(', ')}`).join('\n')}`
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response
    let parsedPlan;
    try {
      // Clean up any potential markdown formatting
      let cleanedContent = aiContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      }
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      parsedPlan = JSON.parse(cleanedContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Failed to parse AI response');
    }

    // Update user_discovery with the generated plan
    const { error: updateError } = await supabaseClient
      .from('user_discovery')
      .update({
        ai_report: parsedPlan.summary,
        recommended_lessons: parsedPlan.recommended_lessons?.map((l: any) => l.lesson_id) || [],
        personalized_diet_plan: parsedPlan.diet_plan,
        personalized_training_plan: parsedPlan.training_plan,
        report_generated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating discovery:', updateError);
      throw updateError;
    }

    console.log('Successfully generated plan for user:', user.id);

    return new Response(JSON.stringify({ 
      success: true,
      plan: parsedPlan 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-personalized-plan:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildPrompt(data: any): string {
  return `
DISCOVERY QUESTIONNAIRE RESPONSES:

=== ENERGY & HEALTH ===
- Current energy level: ${data.energy_level}/10
- Overall health rating: ${data.health_level}/10
- Stress level: ${data.stress_level}/10
- Current discipline level: ${data.discipline_level}/10
- Commitment to change: ${data.commitment_level}/10

=== PERSONALITY & MINDSET ===
- Personality type: ${data.personality_type || 'Not specified'}
- Motivation style: ${data.motivation_style || 'Not specified'}
- Decision-making style: ${data.decision_making || 'Not specified'}
- How they describe themselves: ${data.describe_yourself || 'Not provided'}

=== SLEEP & RECOVERY ===
- Hours of sleep: ${data.sleep_hours || 'Not specified'}
- Sleep quality: ${data.sleep_quality}/10
- Wake up time: ${data.wake_up_time || 'Not specified'}

=== EATING PATTERNS ===
- Meals per day: ${data.meals_per_day || 'Not specified'}
- Eating style: ${data.eating_style || 'Not specified'}
- Hydration level: ${data.hydration_level}/10
- Dietary restrictions: ${data.dietary_restrictions || 'None'}
- Biggest nutrition challenge: ${data.biggest_nutrition_challenge || 'Not specified'}

=== FITNESS & ACTIVITY ===
- Current workout frequency: ${data.workout_frequency || 'Not specified'}
- Preferred workout type: ${data.preferred_workout || 'Not specified'}
- Fitness goal: ${data.fitness_goal || 'Not specified'}

=== GOALS & CHALLENGES ===
- Primary goal: ${data.primary_goal || 'Not specified'}
- Secondary goals: ${data.secondary_goals?.join(', ') || 'None specified'}
- Biggest challenge: ${data.biggest_challenge || 'Not specified'}
- What holds them back: ${data.what_holds_you_back || 'Not specified'}
- Where they want to be: ${data.where_you_want_to_be || 'Not specified'}

=== LIFESTYLE ===
- Occupation type: ${data.occupation_type || 'Not specified'}
- Family situation: ${data.family_situation || 'Not specified'}
- Biggest life priority: ${data.biggest_life_priority || 'Not specified'}
- Time available for training: ${data.time_available || 'Not specified'}

Based on this comprehensive profile, create a deeply personalized transformation plan that addresses their specific situation, challenges, and goals. Be specific, actionable, and encouraging.`;
}
