import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { lessonId, videoUrl } = await req.json();

    if (!lessonId || !videoUrl) {
      throw new Error('lessonId and videoUrl are required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Starting subtitle generation for lesson: ${lessonId}`);

    // Create job tracker
    const { data: job, error: jobError } = await supabaseClient
      .from('subtitle_generation_jobs')
      .insert({ lesson_id: lessonId, status: 'processing' })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      throw jobError;
    }

    // Download video as audio
    console.log('Downloading video from:', videoUrl);
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    console.log(`Downloaded video: ${videoBlob.size} bytes`);

    // Generate subtitles for each language
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'nl', name: 'Dutch' },
      { code: 'ru', name: 'Russian' }
    ];

    const subtitleUrls: Record<string, string> = {};

    for (const lang of languages) {
      console.log(`Generating ${lang.name} subtitles...`);

      const formData = new FormData();
      formData.append('file', videoBlob, 'audio.mp4');
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'vtt');
      formData.append('language', lang.code);

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error for ${lang.name}:`, errorText);
        throw new Error(`Failed to generate ${lang.name} subtitles: ${errorText}`);
      }

      const vttContent = await response.text();
      console.log(`Generated ${lang.name} VTT (${vttContent.length} bytes)`);

      // Upload VTT to storage
      const fileName = `subtitles/${lessonId}_${lang.code}.vtt`;
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from('masterclass-videos')
        .upload(fileName, vttContent, {
          contentType: 'text/vtt',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Error uploading ${lang.name} subtitle:`, uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from('masterclass-videos')
        .getPublicUrl(fileName);

      subtitleUrls[`subtitle_${lang.code}_url`] = publicUrl;
      console.log(`Uploaded ${lang.name} subtitle to:`, publicUrl);
    }

    // Update lesson with subtitle URLs
    const { error: updateError } = await supabaseClient
      .from('masterclass_lessons')
      .update(subtitleUrls)
      .eq('id', lessonId);

    if (updateError) {
      console.error('Error updating lesson:', updateError);
      throw updateError;
    }

    // Update job status
    await supabaseClient
      .from('subtitle_generation_jobs')
      .update({ status: 'completed' })
      .eq('id', job.id);

    console.log('Subtitle generation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        subtitles: subtitleUrls,
        message: 'Subtitles generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-subtitles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Try to update job status if we have lessonId
    try {
      const body = await req.json();
      const { lessonId } = body;
      if (lessonId) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        await supabaseClient
          .from('subtitle_generation_jobs')
          .update({ 
            status: 'failed',
            error_message: errorMessage
          })
          .eq('lesson_id', lessonId);
      }
    } catch (e) {
      console.error('Failed to update job status:', e);
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});