import { useState } from 'react';
import { ModernCard, ModernCardContent, ModernCardHeader } from '@/components/ui/modern-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Send, Zap, Target, AlertTriangle } from 'lucide-react';
import EnhancedAlertService from '@/services/enhancedAlertService';
import LocationService from '@/services/locationService';
import { Alert } from '@/types/alert';

export function EnhancedAlertTester() {
  const [formData, setFormData] = useState({
    title: 'Flash Flood Emergency - Chennai Metro',
    description: 'Heavy monsoon rains have caused severe flooding in Chennai metropolitan area. Water levels rising rapidly in low-lying areas. Residents advised to move to higher ground immediately.',
    severity: 'critical' as 'critical' | 'warning' | 'info',
    type: 'flood',
    location: 'Chennai, Tamil Nadu',
    coordinates: { lat: 13.0827, lng: 80.2707 }
  });
  
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<any>(null);
  const { toast } = useToast();
  
  const locationService = LocationService.getInstance();
  const alertService = EnhancedAlertService.getInstance();

  const handleLocationChange = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
    
    // Get coordinates for the location
    const coordinates = locationService.getCityCoordinates(location);
    if (coordinates) {
      setFormData(prev => ({ ...prev, coordinates }));
      
      // Calculate zones
      const alertZones = locationService.getAlertZones(coordinates);
      setZones(alertZones);
    }
  };

  const handleTestAlert = async () => {
    setLoading(true);
    
    try {
      const testAlert: Alert = {
        id: `test-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        type: formData.type,
        location: formData.location,
        coordinates: formData.coordinates,
        timestamp: new Date(),
        source: 'Test Emergency System',
        languages: {},
        isActive: true
      };

      // Process and distribute the alert
      await alertService.testLocationBasedAlert(testAlert);
      
      toast({
        title: '🚨 Test Alert Sent Successfully!',
        description: `Location-based emergency alert distributed to all zones around ${formData.location}`,
        duration: 6000,
      });
      
    } catch (error) {
      console.error('Test alert failed:', error);
      toast({
        title: 'Test Failed',
        description: 'Unable to send test alert. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const majorCities = locationService.getMajorIndianCities();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-gradient mb-4">
          Enhanced Alert Testing System
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Test the complete NLP-powered emergency alert system with location-based targeting, 
          multilingual translation, and zone-specific severity adjustment.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Alert Configuration */}
        <ModernCard variant="premium">
          <ModernCardHeader className="p-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-primary" />
              Configure Test Alert
            </h3>
          </ModernCardHeader>
          <ModernCardContent className="p-6 pt-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Emergency alert headline"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select 
                  value={formData.severity} 
                  onValueChange={(value: 'critical' | 'warning' | 'info') => 
                    setFormData(prev => ({ ...prev, severity: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">🚨 Critical</SelectItem>
                    <SelectItem value="warning">⚠️ Warning</SelectItem>
                    <SelectItem value="info">ℹ️ Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Alert Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="earthquake">🌍 Earthquake</SelectItem>
                    <SelectItem value="flood">🌊 Flood</SelectItem>
                    <SelectItem value="fire">🔥 Fire</SelectItem>
                    <SelectItem value="storm">⛈️ Storm</SelectItem>
                    <SelectItem value="other">📢 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Primary Location</Label>
              <Select 
                value={formData.location} 
                onValueChange={handleLocationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a major Indian city" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {majorCities.map((city) => (
                    <SelectItem key={city.city} value={`${city.city}, ${city.state}`}>
                      <div className="flex items-center justify-between w-full">
                        <span>{city.city}, {city.state}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {city.region}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Alert Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed emergency information and instructions"
                rows={4}
              />
            </div>

            <ModernButton
              variant="premium"
              size="lg"
              onClick={handleTestAlert}
              isLoading={loading}
              disabled={!formData.title || !formData.location || !formData.description}
              className="w-full"
            >
              <Send className="w-5 h-5 mr-2" />
              {loading ? 'Sending Test Alert...' : 'Send Location-Based Test Alert'}
            </ModernButton>
          </ModernCardContent>
        </ModernCard>

        {/* Zone Preview */}
        <ModernCard variant="glass">
          <ModernCardHeader className="p-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6 text-accent" />
              Alert Distribution Zones
            </h3>
          </ModernCardHeader>
          <ModernCardContent className="p-6 pt-0">
            {zones ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-primary">Primary Location</h4>
                    <p className="text-sm text-muted-foreground">{formData.location}</p>
                  </div>
                </div>

                {/* Immediate Zone */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-critical rounded-full"></div>
                    <h4 className="font-semibold text-critical">Immediate Zone (0-5km)</h4>
                    <Badge variant="critical" className="text-xs">
                      {formData.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="pl-6 space-y-1">
                    {zones.immediate.length > 0 ? (
                      zones.immediate.map((city: any, index: number) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          📍 {city.city}, {city.state}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No major cities in immediate zone</p>
                    )}
                  </div>
                </div>

                {/* Nearby Zone */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-warning rounded-full"></div>
                    <h4 className="font-semibold text-warning">Nearby Zone (5-25km)</h4>
                    <Badge variant="warning" className="text-xs">
                      {formData.severity === 'critical' ? 'WARNING' : 'INFO'}
                    </Badge>
                  </div>
                  <div className="pl-6 space-y-1">
                    {zones.nearby.length > 0 ? (
                      zones.nearby.slice(0, 5).map((city: any, index: number) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          📍 {city.city}, {city.state}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No major cities in nearby zone</p>
                    )}
                    {zones.nearby.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{zones.nearby.length - 5} more cities
                      </p>
                    )}
                  </div>
                </div>

                {/* Regional Zone */}
                {formData.severity === 'critical' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-info rounded-full"></div>
                      <h4 className="font-semibold text-info">Regional Zone (25-100km)</h4>
                      <Badge variant="info" className="text-xs">INFO</Badge>
                    </div>
                    <div className="pl-6 space-y-1">
                      {zones.regional.length > 0 ? (
                        zones.regional.slice(0, 3).map((city: any, index: number) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            📍 {city.city}, {city.state}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No major cities in regional zone</p>
                      )}
                      {zones.regional.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{zones.regional.length - 3} more cities
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Smart Distribution:</strong> Alerts are automatically adjusted based on distance</p>
                    <p><strong>Multilingual:</strong> Each recipient gets alerts in their preferred language</p>
                    <p><strong>Targeted:</strong> Only relevant subscribers receive each alert</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a location to see alert distribution zones
                </p>
              </div>
            )}
          </ModernCardContent>
        </ModernCard>
      </div>

      {/* System Features */}
      <ModernCard variant="glass">
        <ModernCardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Advanced NLP Alert Processing</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Location Intelligence</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Automatic coordinate extraction</li>
                  <li>• 5km/25km/100km zone targeting</li>
                  <li>• 70+ major Indian cities covered</li>
                  <li>• Distance-based severity adjustment</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-accent/10 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold">Smart Processing</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Government data parsing (USGS, IMD, NDMA)</li>
                  <li>• Automatic severity classification</li>
                  <li>• Context-aware translations</li>
                  <li>• Emergency instruction injection</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-success/10 rounded-xl">
                  <Send className="h-8 w-8 text-success mx-auto mb-2" />
                  <h4 className="font-semibold">Multi-Channel Delivery</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• SMS via Twilio integration</li>
                  <li>• Rich HTML email delivery</li>
                  <li>• 16+ language support</li>
                  <li>• Delivery confirmation tracking</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="bg-primary/10">🇮🇳 India-First Design</Badge>
              <Badge variant="outline" className="bg-success/10">🌍 70+ Cities Covered</Badge>
              <Badge variant="outline" className="bg-info/10">⚡ Real-time Processing</Badge>
              <Badge variant="outline" className="bg-warning/10">🎯 Zone-Based Targeting</Badge>
              <Badge variant="outline" className="bg-accent/10">🗣️ 16 Languages</Badge>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );
}