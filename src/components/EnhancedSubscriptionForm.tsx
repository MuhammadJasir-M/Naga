import { useState } from "react";
import { ModernCard, ModernCardContent, ModernCardHeader } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LocationSelector } from "./LocationSelector";
import { LanguageSelector } from "./LanguageSelector";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Bell, Shield, MapPin, Languages, CheckCircle } from "lucide-react";
import AlertService from '@/services/alertService';

interface SubscriptionData {
  email: string;
  phone: string;
  language: string;
  state: string;
  region: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  severityLevels: string[];
  alertTypes: string[];
}

export function EnhancedSubscriptionForm() {
  const [formData, setFormData] = useState<SubscriptionData>({
    email: "",
    phone: "",
    language: "en",
    state: "",
    region: "",
    emailNotifications: true,
    smsNotifications: false,
    severityLevels: ["critical", "warning"],
    alertTypes: ["earthquake", "flood", "fire", "storm"]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Test notification setup with Supabase edge function
      const response = await fetch('https://ndxfqiwryuzjhwujqpca.supabase.co/functions/v1/setup-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keGZxaXdyeXV6amh3dWpxcGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjAwNzIsImV4cCI6MjA3MjM5NjA3Mn0.KzIy8E7L1vClDmd01uT8vp2c9KUwOm3Ukam-x45HCEw`
        },
        body: JSON.stringify({
          phone: formData.smsNotifications ? formData.phone : undefined,
          email: formData.emailNotifications ? formData.email : undefined,
          preferences: {
            sms: formData.smsNotifications,
            email: formData.emailNotifications,
            criticalAlerts: formData.severityLevels.includes('critical'),
            warningAlerts: formData.severityLevels.includes('warning'),
            infoAlerts: formData.severityLevels.includes('info')
          }
        })
      });

      if (response.ok) {
        // Subscribe to in-memory alert service for immediate delivery
        const alertService = AlertService.getInstance();
        alertService.subscribe(
          formData.emailNotifications ? formData.email : undefined, 
          formData.smsNotifications ? formData.phone : undefined, 
          {
            language: formData.language,
            state: formData.state,
            region: formData.region,
            severityLevels: formData.severityLevels,
            alertTypes: formData.alertTypes,
            ...formData
          }
        );

        setIsSubscribed(true);
        toast({
          title: "🎉 Subscription Successful!",
          description: `You'll receive emergency alerts for ${formData.state || 'all of India'} via ${
            formData.emailNotifications && formData.smsNotifications ? 'email and SMS' :
            formData.emailNotifications ? 'email' : 'SMS'
          } in ${formData.language === 'en' ? 'English' : 'your selected language'}.`,
          duration: 6000,
        });
      } else {
        throw new Error('Setup failed');
      }
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "Please ensure all required fields are filled and services are configured.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSeverity = (severity: string) => {
    setFormData(prev => ({
      ...prev,
      severityLevels: prev.severityLevels.includes(severity)
        ? prev.severityLevels.filter(s => s !== severity)
        : [...prev.severityLevels, severity]
    }));
  };

  const toggleAlertType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      alertTypes: prev.alertTypes.includes(type)
        ? prev.alertTypes.filter(t => t !== type)
        : [...prev.alertTypes, type]
    }));
  };

  if (isSubscribed) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <ModernCard variant="premium" className="text-center">
          <ModernCardContent className="p-8">
            <div className="space-y-6">
              <div className="p-4 bg-success/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-success mb-2">Subscription Active!</h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  You're now subscribed to receive emergency alerts for {formData.state || 'all of India'}. 
                  Our system will notify you instantly when critical situations arise in your area.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-primary/5 rounded-lg border">
                  <Mail className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">{formData.emailNotifications ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border">
                  <Phone className="h-5 w-5 text-accent mb-2" />
                  <p className="text-sm font-medium">SMS</p>
                  <p className="text-xs text-muted-foreground">{formData.smsNotifications ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="p-4 bg-info/5 rounded-lg border">
                  <MapPin className="h-5 w-5 text-info mb-2" />
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-xs text-muted-foreground">{formData.state || 'All India'}</p>
                </div>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-gradient mb-4">
          Subscribe to Emergency Alerts
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get real-time emergency notifications in your preferred language for your specific location. 
          Our system processes alerts from verified Indian government sources including IMD, NDMA, and state disaster management authorities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <ModernCard variant="glass">
          <ModernCardHeader className="p-6">
            <h4 className="font-semibold flex items-center gap-2 text-xl">
              <Mail className="h-5 w-5 text-primary" />
              Contact Information
            </h4>
          </ModernCardHeader>
          <ModernCardContent className="p-6 pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  required
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">Primary contact for detailed alert information</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">For instant SMS alerts (Optional but recommended)</p>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Delivery Preferences */}
        <ModernCard variant="glass">
          <ModernCardHeader className="p-6">
            <h4 className="font-semibold flex items-center gap-2 text-xl">
              <Phone className="h-5 w-5 text-accent" />
              Delivery Preferences
            </h4>
          </ModernCardHeader>
          <ModernCardContent className="p-6 pt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Detailed alerts with maps & images</p>
                  </div>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({...prev, emailNotifications: checked}))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">Instant text alerts</p>
                  </div>
                </div>
                <Switch
                  checked={formData.smsNotifications}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({...prev, smsNotifications: checked}))
                  }
                  disabled={!formData.phone}
                />
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Location & Language */}
        <div className="grid md:grid-cols-2 gap-8">
          <ModernCard variant="glass">
            <ModernCardHeader className="p-6">
              <h4 className="font-semibold flex items-center gap-2 text-xl">
                <Languages className="h-5 w-5 text-info" />
                Language Preference
              </h4>
            </ModernCardHeader>
            <ModernCardContent className="p-6 pt-0">
              <div className="space-y-4">
                <Label>Receive alerts in:</Label>
                <LanguageSelector
                  selectedLanguage={formData.language}
                  onLanguageChange={(language) => setFormData(prev => ({...prev, language}))}
                />
                <p className="text-xs text-muted-foreground">
                  Alerts are automatically translated using advanced AI technology
                </p>
              </div>
            </ModernCardContent>
          </ModernCard>

          <ModernCard variant="glass">
            <ModernCardHeader className="p-6">
              <h4 className="font-semibold flex items-center gap-2 text-xl">
                <MapPin className="h-5 w-5 text-success" />
                Location Settings
              </h4>
            </ModernCardHeader>
            <ModernCardContent className="p-6 pt-0">
              <LocationSelector
                selectedState={formData.state}
                selectedRegion={formData.region}
                onStateChange={(state) => setFormData(prev => ({...prev, state}))}
                onRegionChange={(region) => setFormData(prev => ({...prev, region}))}
              />
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Alert Preferences */}
        <ModernCard variant="glass">
          <ModernCardHeader className="p-6">
            <h4 className="font-semibold flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-warning" />
              Alert Preferences
            </h4>
          </ModernCardHeader>
          <ModernCardContent className="p-6 pt-0">
            <div className="space-y-6">
              {/* Severity Levels */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Alert Severity Levels</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'critical', label: 'Critical', color: 'critical', desc: 'Life-threatening emergencies' },
                    { id: 'warning', label: 'Warning', color: 'warning', desc: 'Potential hazards' },
                    { id: 'info', label: 'Information', color: 'info', desc: 'General updates' }
                  ].map((severity) => (
                    <Badge
                      key={severity.id}
                      variant={formData.severityLevels.includes(severity.id) ? severity.color as any : 'outline'}
                      className="cursor-pointer transition-all p-3 text-sm"
                      onClick={() => toggleSeverity(severity.id)}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {severity.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Alert Types */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Emergency Types</Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'earthquake', label: 'Earthquakes', icon: '🏗️' },
                    { id: 'flood', label: 'Floods', icon: '🌊' },
                    { id: 'fire', label: 'Wildfires', icon: '🔥' },
                    { id: 'storm', label: 'Storms', icon: '⛈️' },
                    { id: 'other', label: 'Other Emergencies', icon: '⚠️' }
                  ].map((type) => (
                    <Badge
                      key={type.id}
                      variant={formData.alertTypes.includes(type.id) ? 'secondary' : 'outline'}
                      className="cursor-pointer transition-all p-3 text-sm gap-2"
                      onClick={() => toggleAlertType(type.id)}
                    >
                      <span className="text-lg">{type.icon}</span>
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Submit Button */}
        <div className="text-center">
          <ModernButton
            type="submit"
            variant="premium"
            size="xl"
            isLoading={isLoading}
            disabled={
              !formData.email ||
              (!formData.emailNotifications && !formData.smsNotifications) ||
              (formData.smsNotifications && !formData.phone) ||
              formData.severityLevels.length === 0 ||
              formData.alertTypes.length === 0
            }
            className="px-12 py-4 text-lg font-semibold"
          >
            <Bell className="w-6 h-6 mr-3" />
            {isLoading ? 'Setting Up Alerts...' : 'Subscribe to Emergency Alerts'}
          </ModernButton>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          By subscribing, you agree to receive emergency notifications from verified Indian government sources. 
          Your data is protected and never shared. You can unsubscribe at any time. 
          This service is provided free of charge to help keep Indian citizens safe.
        </p>
      </form>
    </div>
  );
}