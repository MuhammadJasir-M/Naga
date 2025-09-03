import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts"

interface AlertRequest {
  recipients: {
    phone?: string;
    email?: string;
    language: string;
  }[];
  alert: {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    type: string;
    location: string;
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
    const { recipients, alert }: AlertRequest = await req.json()

    // Get environment variables
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')
    const smtpHost = Deno.env.get('SMTP_HOST')
    const smtpUser = Deno.env.get('SMTP_USER')
    const smtpPass = Deno.env.get('SMTP_PASS')
    const fromEmail = Deno.env.get('FROM_EMAIL')
    const smtpPortRaw = Deno.env.get('SMTP_PORT')
    const smtpPort = Number(smtpPortRaw || '465')

    // Compute config readiness and missing secrets
    const missingTwilio: string[] = []
    if (!twilioAccountSid) missingTwilio.push('TWILIO_ACCOUNT_SID')
    if (!twilioAuthToken) missingTwilio.push('TWILIO_AUTH_TOKEN')
    if (!twilioPhoneNumber) missingTwilio.push('TWILIO_PHONE_NUMBER')
    const smsEnabled = missingTwilio.length === 0

    const missingSmtp: string[] = []
    if (!smtpHost) missingSmtp.push('SMTP_HOST')
    if (!fromEmail) missingSmtp.push('FROM_EMAIL')
    if (!smtpUser) missingSmtp.push('SMTP_USER')
    if (!smtpPass) missingSmtp.push('SMTP_PASS')
    const emailEnabled = missingSmtp.length === 0

    console.log('Notification config summary:', { smsEnabled, emailEnabled, missingTwilio, missingSmtp })
    if (!smsEnabled) console.warn('SMS disabled due to missing secrets:', missingTwilio.join(', '))
    if (!emailEnabled) console.warn('Email disabled due to missing secrets:', missingSmtp.join(', '))

    console.log('Processing emergency alert:', alert.id, 'for', recipients.length, 'recipients')

    const tasks: Promise<any>[] = []
    const meta: Array<{ channel: 'SMS' | 'Email'; recipient: string }> = []
    const earlyErrors: Array<{ channel: 'SMS' | 'Email'; recipient: string; reason: string }> = []

    for (const recipient of recipients) {
      const lang = recipient.language || 'en'

      // Send SMS if phone number provided
      if (recipient.phone) {
        if (smsEnabled) {
          tasks.push(sendSMS(recipient.phone, alert, lang, twilioAccountSid!, twilioAuthToken!, twilioPhoneNumber))
          meta.push({ channel: 'SMS', recipient: recipient.phone })
        } else {
          earlyErrors.push({ channel: 'SMS', recipient: recipient.phone, reason: `SMS disabled: missing secrets: ${missingTwilio.join(', ')}` })
        }
      }

      // Send Email if email provided
      if (recipient.email) {
        if (emailEnabled) {
          tasks.push(sendEmail(recipient.email, alert, lang, smtpHost!, smtpUser, smtpPass, fromEmail!, Number.isFinite(smtpPort) ? smtpPort : 465))
          meta.push({ channel: 'Email', recipient: recipient.email })
        } else {
          earlyErrors.push({ channel: 'Email', recipient: recipient.email, reason: `Email disabled: missing secrets: ${missingSmtp.join(', ')}` })
        }
      }
    }

    const settled = await Promise.allSettled(tasks)

    const settledErrors = settled
      .map((result, i) => result.status === 'rejected' ? ({ ...meta[i], reason: (result as PromiseRejectedResult).reason?.message || String((result as PromiseRejectedResult).reason) }) : null)
      .filter(Boolean) as Array<{ channel: 'SMS' | 'Email'; recipient: string; reason: string }>

    const errors = [...earlyErrors, ...settledErrors]
    if (errors.length) console.error('Delivery errors:', errors)

    const sent = settled.filter(r => r.status === 'fulfilled').length
    const failed = errors.length

    return new Response(
      JSON.stringify({ 
        success: failed === 0, 
        sent, 
        failed,
        errors,
        config: { smsEnabled, emailEnabled, missingTwilio, missingSmtp },
        message: `Alert processing complete: ${sent} successful, ${failed} failed` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending emergency alerts:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send emergency alerts' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function sendSMS(
  phone: string, 
  alert: any, 
  language: string,
  accountSid: string, 
  authToken: string, 
  fromNumber: string | undefined
) {
  const smsBody = createSMSMessage(alert, language)
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  
  const body = new URLSearchParams({
    To: phone,
    From: fromNumber || (() => { throw new Error('Missing TWILIO_PHONE_NUMBER') })(),
    Body: smsBody
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  if (!response.ok) {
    const details = await response.text().catch(() => response.statusText)
    throw new Error(`SMS failed: ${response.status} ${details}`)
  }

  console.log(`SMS sent successfully to ${phone}`)
  return { type: 'SMS', recipient: phone, status: 'sent' }
}

async function sendEmail(
  email: string, 
  alert: any, 
  language: string,
  smtpHost: string,
  smtpUser: string | undefined,
  smtpPass: string | undefined,
  fromEmail: string,
  smtpPort: number
) {
  const emailContent = createEmailMessage(alert, language)
  
  try {
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPass
    })

    await client.send({
      from: fromEmail,
      to: email,
      subject: emailContent.subject,
      content: emailContent.html
    })

    await client.close()
    console.log(`Email sent successfully to ${email}`)
    return { type: 'Email', recipient: email, status: 'sent' }
  } catch (err) {
    console.error('Email send error detail:', err)
    throw new Error(`Email failed: ${(err as Error)?.message || String(err)}`)
  }
}

function createSMSMessage(alert: any, language: string): string {
  const severityEmoji = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const typeEmoji = {
    earthquake: '🌍',
    flood: '🌊',
    fire: '🔥',
    storm: '⛈️'
  }

  const localized = (alert.languages && alert.languages[language])
    ? alert.languages[language]
    : { title: alert.title, description: alert.description }

  return `${severityEmoji[alert.severity]} EMERGENCY ALERT

${localized.title}

📍 ${alert.location}
🕒 ${new Date(alert.timestamp).toLocaleString()}
📡 Source: ${alert.source}

${localized.description}

⚠️ Take immediate action if in affected area.

Reply STOP to unsubscribe.`
}

function createEmailMessage(alert: any, language: string) {
  const severityColor = {
    critical: '#dc2626',
    warning: '#f59e0b',
    info: '#3b82f6'
  }

  const localized = (alert.languages && alert.languages[language])
    ? alert.languages[language]
    : { title: alert.title, description: alert.description }

  return {
    subject: `🚨 ${alert.severity.toUpperCase()} ALERT: ${localized.title}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Emergency Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: ${severityColor[alert.severity]}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY ALERT</h1>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">${localized.title}</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>📍 Location:</strong> ${alert.location}</p>
              <p><strong>🕒 Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
              <p><strong>⚠️ Severity:</strong> ${alert.severity.toUpperCase()}</p>
              <p><strong>📡 Source:</strong> ${alert.source}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3>Alert Details:</h3>
              <p>${localized.description}</p>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; font-weight: bold; color: #92400e;">
                ⚠️ If you are in the affected area, please take immediate action and follow local authority guidance.
              </p>
            </div>
            
            <div style="font-size: 12px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <p>Emergency Alert System | Real-time disaster monitoring</p>
              <p>This is an automated emergency notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}