import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "./LanguageSelector";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Bell, Shield } from "lucide-react";

export const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    language: "en",
    emailNotifications: true,
    smsNotifications: false,
    severityLevels: ["critical", "warning"],
    alertTypes: ["earthquake", "flood", "fire", "storm"]
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate subscription
    toast({
      title: "Subscription Successful!",
      description: `You'll receive emergency alerts in your selected language via ${
        formData.emailNotifications && formData.smsNotifications ? 'email and SMS' :
        formData.emailNotifications ? 'email' : 'SMS'
      }.`,
    });
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Subscribe to Emergency Alerts
        </CardTitle>
        <CardDescription>
          Get real-time emergency notifications in your preferred language. 
          Our system processes alerts from verified government sources including USGS, FEMA, and National Weather Service.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                />
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-4">
            <h4 className="font-medium">Language Preference</h4>
            <div className="space-y-2">
              <Label>Receive alerts in:</Label>
              <LanguageSelector
                selectedLanguage={formData.language}
                onLanguageChange={(language) => setFormData(prev => ({...prev, language}))}
              />
              <p className="text-sm text-muted-foreground">
                Alerts are automatically translated using advanced NLP processing
              </p>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Delivery Method
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-notifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({...prev, emailNotifications: checked as boolean}))
                  }
                />
                <Label htmlFor="email-notifications">Email notifications</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms-notifications"
                  checked={formData.smsNotifications}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({...prev, smsNotifications: checked as boolean}))
                  }
                  disabled={!formData.phone}
                />
                <Label htmlFor="sms-notifications">
                  SMS notifications {!formData.phone && "(Phone number required)"}
                </Label>
              </div>
            </div>
          </div>

          {/* Alert Severity */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Alert Severity Levels
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'critical', label: 'Critical', color: 'critical' },
                { id: 'warning', label: 'Warning', color: 'warning' },
                { id: 'info', label: 'Information', color: 'info' }
              ].map((severity) => (
                <Badge
                  key={severity.id}
                  variant={formData.severityLevels.includes(severity.id) ? severity.color as any : 'outline'}
                  className="cursor-pointer transition-all"
                  onClick={() => toggleSeverity(severity.id)}
                >
                  {severity.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Alert Types */}
          <div className="space-y-4">
            <h4 className="font-medium">Alert Types</h4>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'earthquake', label: 'Earthquakes', icon: '📊' },
                { id: 'flood', label: 'Floods', icon: '🌊' },
                { id: 'fire', label: 'Wildfires', icon: '🔥' },
                { id: 'storm', label: 'Storms', icon: '⛈️' },
                { id: 'other', label: 'Other', icon: '⚠️' }
              ].map((type) => (
                <Badge
                  key={type.id}
                  variant={formData.alertTypes.includes(type.id) ? 'secondary' : 'outline'}
                  className="cursor-pointer transition-all gap-1"
                  onClick={() => toggleAlertType(type.id)}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-hero hover:opacity-90 transition-all"
            size="lg"
          >
            Subscribe to Emergency Alerts
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By subscribing, you agree to receive emergency notifications. 
            You can unsubscribe at any time. Your data is protected and never shared.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};