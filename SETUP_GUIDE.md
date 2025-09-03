# 🚨 Emergency Alert System - Complete Setup Guide

## 📱 SMS & Email Delivery Configuration

To enable **real SMS and email delivery**, you need to configure environment variables in your Supabase project.

### 🔧 Supabase Setup Instructions

1. **Open your Supabase Dashboard**
   - Go to [https://supabase.com](https://supabase.com)
   - Navigate to your project

2. **Access Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Or go to **Settings** → **API** → **Project Settings**

3. **Add Required Environment Variables**

#### 📱 SMS Configuration (Twilio)
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token  
TWILIO_PHONE_NUMBER=+1234567890
```

**How to get Twilio credentials:**
1. Create account at [https://console.twilio.com](https://console.twilio.com)
2. Get a phone number from Twilio Console
3. Copy Account SID and Auth Token from dashboard

#### 📧 Email Configuration (SMTP)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

**For Gmail SMTP:**
1. Enable 2-factor authentication
2. Generate an App Password (not your regular password)
3. Use the App Password as SMTP_PASS

**For other providers:**
- **Outlook**: smtp-mail.outlook.com, port 587
- **Yahoo**: smtp.mail.yahoo.com, port 587
- **SendGrid**: smtp.sendgrid.net, port 587

### 🚀 Testing the Setup

1. **Configure Environment Variables** in Supabase
2. **Deploy Edge Functions** (automatically done by Lovable)
3. **Test Notifications**:
   - Go to your app
   - Click "Subscribe" tab
   - Enter your phone/email
   - Click "Enable Emergency Alerts"
   - You should receive a test message!

### 🛠️ Troubleshooting

#### No SMS Received?
- ✅ Check Twilio account balance
- ✅ Verify phone number format (+1234567890)
- ✅ Check Twilio console for delivery logs
- ✅ Ensure Twilio phone number is verified

#### No Email Received?
- ✅ Check spam/junk folder
- ✅ Verify SMTP credentials
- ✅ For Gmail: Use App Password, not regular password
- ✅ Check email provider's security settings

#### Console Errors?
- ✅ Verify all environment variables are set
- ✅ Check Supabase Edge Function logs
- ✅ Ensure proper Supabase project URL and keys

### 📋 Environment Variables Checklist

**Required for SMS:**
- [ ] TWILIO_ACCOUNT_SID
- [ ] TWILIO_AUTH_TOKEN  
- [ ] TWILIO_PHONE_NUMBER

**Required for Email:**
- [ ] SMTP_HOST
- [ ] SMTP_PORT (usually 587)
- [ ] SMTP_USER
- [ ] SMTP_PASS
- [ ] FROM_EMAIL

### 🎯 Features Included

✅ **Multi-language Support** (16+ languages)  
✅ **Real-time Government Data** (USGS, NWS, FEMA)  
✅ **Auto-refresh every 5 minutes**  
✅ **SMS + Email delivery**  
✅ **Responsive design**  
✅ **Production ready**  

### 🌟 Production Deployment

1. **Set up custom domain** in Supabase (optional)
2. **Configure environment variables** as above
3. **Test thoroughly** with real phone/email
4. **Monitor delivery logs** in Twilio/email provider
5. **Scale as needed** (Twilio/SMTP have rate limits)

---

**Need Help?** Check the console logs in your browser for specific error messages, or contact support with your Supabase project details.