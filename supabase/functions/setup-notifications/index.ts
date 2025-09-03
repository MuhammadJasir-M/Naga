import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface NotificationRequest {
  phone?: string;
  email?: string;
  preferences: {
    sms: boolean;
    email: boolean;
    criticalAlerts: boolean;
    warningAlerts: boolean;
    infoAlerts: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone, email, preferences }: NotificationRequest = await req.json();

    console.log('Setting up notifications for:', { phone, email, preferences });

    // Validate environment variables
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    const smtpHost = Deno.env.get('SMTP_HOST');
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    // Check if required services are configured
    const smsConfigured = !!(twilioAccountSid && twilioAuthToken && twilioPhoneNumber);
    const emailConfigured = !!(smtpHost && smtpUser && smtpPass);

    if (preferences.sms && !smsConfigured) {
      return new Response(
        JSON.stringify({ 
          error: 'SMS service not configured. Please set up Twilio environment variables.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (preferences.email && !emailConfigured) {
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured. Please set up SMTP environment variables.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Test SMS service if enabled
    if (preferences.sms && phone && smsConfigured) {
      try {
        const testSMS = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: twilioPhoneNumber,
            To: phone,
            Body: '🚨 Emergency Alert System: Your SMS notifications are now active! You will receive instant emergency alerts.'
          })
        });

        if (!testSMS.ok) {
          console.error('SMS test failed:', await testSMS.text());
          return new Response(
            JSON.stringify({ 
              error: 'Failed to send test SMS. Please check your phone number and Twilio configuration.' 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
      } catch (error) {
        console.error('SMS setup error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'SMS setup failed. Please check Twilio configuration.' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // In a real application, you would store the subscriber information in a database
    console.log('Notification setup completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Notifications setup successfully!',
        services: {
          sms: preferences.sms && smsConfigured,
          email: preferences.email && emailConfigured
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error('Setup error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to setup notifications',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});