import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface AlertRequest {
  alert: {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    type: string;
    location: string;
    city: string;
    state?: string;
    timestamp: string;
    source: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { alert }: AlertRequest = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Processing location-based alert for:', alert.city)

    // Find users in the affected city who have email alerts enabled
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select(`
        user_id,
        full_name,
        city,
        users:user_id!inner (email),
        alert_subscriptions!inner (
          email_alerts,
          sms_alerts,
          severity_levels,
          alert_types
        )
      `)
      .ilike('city', `%${alert.city}%`)
      .eq('alert_subscriptions.email_alerts', true)

    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    console.log(`Found ${users?.length || 0} users in ${alert.city}`)

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `No users found in ${alert.city} with email alerts enabled`,
          sent: 0,
          failed: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Filter users based on their subscription preferences
    const eligibleUsers = users.filter(user => {
      const subscription = user.alert_subscriptions[0]
      
      // Check if user wants this severity level
      const wantsSeverity = subscription.severity_levels.includes(alert.severity)
      
      // Check if user wants this alert type
      const wantsType = subscription.alert_types.includes(alert.type)
      
      return wantsSeverity && wantsType
    })

    console.log(`${eligibleUsers.length} users are eligible for this alert`)

    if (eligibleUsers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No users match the alert preferences',
          sent: 0,
          failed: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Prepare recipients for the existing send-emergency-alert function
    const recipients = eligibleUsers.map(user => ({
      email: user.users.email,
      language: 'en' // Default to English, could be enhanced to use user preferences
    }))

    // Call the existing send-emergency-alert function
    const alertResponse = await supabase.functions.invoke('send-emergency-alert', {
      body: {
        recipients,
        alert
      }
    })

    if (alertResponse.error) {
      console.error('Error sending alerts:', alertResponse.error)
      throw alertResponse.error
    }

    const result = alertResponse.data

    // Log the alert delivery to the database for tracking
    const { error: logError } = await supabase
      .from('alert_logs')
      .insert({
        alert_id: alert.id,
        location: alert.location,
        city: alert.city,
        recipients_count: recipients.length,
        sent_count: result.sent || 0,
        failed_count: result.failed || 0,
        created_at: new Date().toISOString()
      })
      .single()

    if (logError) {
      console.warn('Failed to log alert delivery:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: result.success,
        message: `Alert sent to ${recipients.length} users in ${alert.city}`,
        location: alert.city,
        recipients: recipients.length,
        sent: result.sent || 0,
        failed: result.failed || 0,
        details: result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing location-based alerts:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process location-based alerts' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})