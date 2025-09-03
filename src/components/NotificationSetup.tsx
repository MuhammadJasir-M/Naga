import { useState } from 'react';
import { ModernCard, ModernCardContent, ModernCardHeader } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Smartphone, Mail, Bell, Shield, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AlertService from '@/services/alertService';

interface NotificationPreferences {
  sms: boolean;
  email: boolean;
  phone?: string;
  emailAddress?: string;
  criticalAlerts: boolean;
  warningAlerts: boolean;
  infoAlerts: boolean;
}

export function NotificationSetup() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    sms: true,
    email: true,
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const { toast } = useToast();

  const handleSetupNotifications = async () => {
    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function with correct URL
      const response = await fetch('https://ndxfqiwryuzjhwujqpca.supabase.co/functions/v1/setup-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keGZxaXdyeXV6amh3dWpxcGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjAwNzIsImV4cCI6MjA3MjM5NjA3Mn0.KzIy8E7L1vClDmd01uT8vp2c9KUwOm3Ukam-x45HCEw`
        },
        body: JSON.stringify({
          phone: preferences.phone,
          email: preferences.emailAddress,
          preferences: {
            sms: preferences.sms,
            email: preferences.email,
            criticalAlerts: preferences.criticalAlerts,
            warningAlerts: preferences.warningAlerts,
            infoAlerts: preferences.infoAlerts
          }
        })
      });

      console.log('Setup response:', response.status, await response.clone().text());

      if (response.ok) {
        setIsSetup(true);

        // Subscribe in-memory for immediate delivery tests
        try {
          const alertService = AlertService.getInstance();
          const language = (typeof window !== 'undefined' && localStorage.getItem('selectedLanguage')) || 'en';
          alertService.subscribe(preferences.emailAddress, preferences.phone, { ...preferences, language });
          console.log('Subscriber registered for delivery with language:', language);
        } catch (e) {
          console.warn('Subscription registration failed:', e);
        }

        toast({
          title: "🎉 Notifications Enabled Successfully!",
          description: "You'll receive real-time emergency alerts via SMS and email. Stay safe!",
          duration: 5000,
        });
      } else {
        throw new Error('Setup failed');
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Please ensure Twilio and SMTP are configured in Supabase environment variables.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-gradient mb-4">
          Enable Emergency Notifications
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay informed with instant SMS and email alerts for critical emergencies in your area.
          Our system delivers life-saving information within seconds of official announcements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* SMS Setup */}
        <ModernCard variant="premium" className="group">
          <ModernCardHeader className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-all">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">SMS Alerts</h3>
                <p className="text-sm text-muted-foreground">Instant mobile notifications</p>
              </div>
              <Switch
                checked={preferences.sms}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, sms: checked }))
                }
              />
            </div>
          </ModernCardHeader>
          <ModernCardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={preferences.phone || ''}
                  onChange={(e) => 
                    setPreferences(prev => ({ ...prev, phone: e.target.value }))
                  }
                  disabled={!preferences.sms}
                  className="mt-2"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  ⚡ Instant delivery
                </Badge>
                <Badge variant="outline" className="text-xs">
                  📱 Works globally
                </Badge>
                <Badge variant="outline" className="text-xs">
                  🔒 Secure & private
                </Badge>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Email Setup */}
        <ModernCard variant="premium" className="group">
          <ModernCardHeader className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-accent/20 rounded-xl group-hover:bg-accent/30 transition-all">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Alerts</h3>
                <p className="text-sm text-muted-foreground">Detailed emergency information</p>
              </div>
              <Switch
                checked={preferences.email}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, email: checked }))
                }
              />
            </div>
          </ModernCardHeader>
          <ModernCardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={preferences.emailAddress || ''}
                  onChange={(e) => 
                    setPreferences(prev => ({ ...prev, emailAddress: e.target.value }))
                  }
                  disabled={!preferences.email}
                  className="mt-2"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  📧 Rich content
                </Badge>
                <Badge variant="outline" className="text-xs">
                  🗺️ Maps & images
                </Badge>
                <Badge variant="outline" className="text-xs">
                  📊 Detailed reports
                </Badge>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>

      {/* Alert Preferences */}
      <ModernCard variant="glass" className="overflow-hidden">
        <ModernCardHeader className="p-6">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Alert Preferences</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Choose which types of emergency alerts you want to receive
          </p>
        </ModernCardHeader>
        <ModernCardContent className="p-6 pt-0">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-critical/5 border border-critical/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-critical/20 rounded-lg">
                  <Shield className="h-4 w-4 text-critical" />
                </div>
                <div>
                  <p className="font-medium text-critical">Critical Emergency Alerts</p>
                  <p className="text-xs text-muted-foreground">Life-threatening situations requiring immediate action</p>
                </div>
              </div>
              <Switch
                checked={preferences.criticalAlerts}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, criticalAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <Shield className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-warning">Warning Alerts</p>
                  <p className="text-xs text-muted-foreground">Potential hazards that require attention</p>
                </div>
              </div>
              <Switch
                checked={preferences.warningAlerts}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, warningAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-info/5 border border-info/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/20 rounded-lg">
                  <Shield className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="font-medium text-info">Information Alerts</p>
                  <p className="text-xs text-muted-foreground">General updates and advisory information</p>
                </div>
              </div>
              <Switch
                checked={preferences.infoAlerts}
                onCheckedChange={(checked) => 
                  setPreferences(prev => ({ ...prev, infoAlerts: checked }))
                }
              />
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>

      {/* Setup Button */}
      <div className="text-center">
        {!isSetup ? (
          <ModernButton
            variant="premium"
            size="xl"
            onClick={handleSetupNotifications}
            isLoading={isLoading}
            disabled={
              (!preferences.sms && !preferences.email) ||
              (preferences.sms && !preferences.phone) ||
              (preferences.email && !preferences.emailAddress)
            }
            className="px-12 py-4 text-lg font-semibold"
          >
            <Bell className="w-6 h-6 mr-3" />
            {isLoading ? 'Setting Up Notifications...' : 'Enable Emergency Alerts'}
          </ModernButton>
        ) : (
          <div className="flex items-center justify-center gap-3 p-6 bg-success/10 border border-success/30 rounded-2xl">
            <div className="p-3 bg-success/20 rounded-full">
              <Check className="h-6 w-6 text-success" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-success">Notifications Active!</h4>
              <p className="text-sm text-muted-foreground">
                You're now receiving emergency alerts via {preferences.sms && preferences.email ? 'SMS and email' : preferences.sms ? 'SMS' : 'email'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <ModernCard variant="glass">
        <ModernCardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="p-3 bg-info/20 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <Shield className="h-6 w-6 text-info" />
            </div>
            <h4 className="font-semibold">SMS & Email Setup Required</h4>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              To enable real SMS and email delivery, you need to configure Twilio (for SMS) and SMTP (for email) 
              in your Supabase project environment variables.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h5 className="font-medium text-primary mb-2">📱 SMS Setup (Twilio)</h5>
                <ul className="text-xs text-muted-foreground space-y-1 text-left">
                  <li>• TWILIO_ACCOUNT_SID</li>
                  <li>• TWILIO_AUTH_TOKEN</li>
                  <li>• TWILIO_PHONE_NUMBER</li>
                </ul>
              </div>
              
              <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                <h5 className="font-medium text-accent mb-2">📧 Email Setup (SMTP)</h5>
                <ul className="text-xs text-muted-foreground space-y-1 text-left">
                  <li>• SMTP_HOST</li>
                  <li>• SMTP_USER & SMTP_PASS</li>
                  <li>• FROM_EMAIL</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <Badge variant="outline" className="bg-primary/10">
                🔧 Production Ready
              </Badge>
              <Badge variant="outline" className="bg-success/10">
                🌍 16 Languages
              </Badge>
              <Badge variant="outline" className="bg-info/10">
                ⚡ Real-time Delivery
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              Check <strong>SETUP_GUIDE.md</strong> for detailed configuration instructions
            </p>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );
}