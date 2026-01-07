import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ghlWebhookUrl = Deno.env.get('GHL_WEBHOOK_URL');
    
    if (!ghlWebhookUrl) {
      console.error('GHL_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userData = await req.json();
    
    console.log('Sending user data to GHL:', {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      country: userData.country,
      phone: userData.phone,
      timestamp: new Date().toISOString()
    });

    // Send data to GHL webhook
    const response = await fetch(ghlWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Contact fields for GHL
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`.trim(),
        phone: userData.phone || '',
        country: userData.country || '',
        
        // Custom fields
        source: 'LPA Platform',
        signupDate: new Date().toISOString(),
        userId: userData.userId,
        
        // Tags for workflow automation
        tags: ['new_signup', 'lpa_platform'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GHL webhook error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send to GHL', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully sent user data to GHL');
    
    return new Response(
      JSON.stringify({ success: true, message: 'User data sent to GHL' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in ghl-webhook function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
