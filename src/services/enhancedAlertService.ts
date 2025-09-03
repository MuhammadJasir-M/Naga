import { Alert } from '@/types/alert';
import { supabase } from '@/integrations/supabase/client';
import LocationService from './locationService';
import NLPAlertProcessor from './nlpAlertProcessor';

interface Subscriber {
  id: string;
  email?: string;
  phone?: string;
  city: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  preferences: {
    language: string;
    emailAlerts: boolean;
    smsAlerts: boolean;
    severityLevels: string[];
    alertTypes: string[];
  };
}

interface AlertZone {
  type: 'immediate' | 'nearby' | 'regional';
  severity: 'critical' | 'warning' | 'info';
  cities: string[];
  radius: number;
}

class EnhancedAlertService {
  private static instance: EnhancedAlertService;
  private locationService: LocationService;
  private nlpProcessor: NLPAlertProcessor;

  private constructor() {
    this.locationService = LocationService.getInstance();
    this.nlpProcessor = NLPAlertProcessor.getInstance();
  }

  static getInstance(): EnhancedAlertService {
    if (!EnhancedAlertService.instance) {
      EnhancedAlertService.instance = new EnhancedAlertService();
    }
    return EnhancedAlertService.instance;
  }

  // Process and distribute alerts with location-based targeting
  async processAndDistributeAlert(alert: Alert): Promise<void> {
    console.log('🚨 Processing emergency alert:', alert.id);

    try {
      // Step 1: Determine alert coordinates
      const alertCoordinates = alert.coordinates || 
        this.locationService.getCityCoordinates(alert.location);

      if (!alertCoordinates) {
        console.error('❌ Could not determine alert coordinates for:', alert.location);
        return;
      }

      // Step 2: Define alert zones with different severity levels
      const zones = this.defineAlertZones(alertCoordinates, alert.severity);
      
      // Step 3: Get subscribers from database
      const subscribers = await this.getActiveSubscribers();
      
      // Step 4: Filter subscribers by location and create targeted alerts
      const targetedAlerts = await this.createTargetedAlerts(alert, zones, subscribers);
      
      // Step 5: Send notifications via Supabase Edge Functions
      await this.sendLocationBasedNotifications(targetedAlerts);
      
      console.log('✅ Alert distribution completed for:', alert.id);
      
    } catch (error) {
      console.error('❌ Error processing alert:', error);
      throw error;
    }
  }

  // Define alert zones based on distance and original severity
  private defineAlertZones(alertCoordinates: { lat: number; lng: number }, originalSeverity: string): AlertZone[] {
    const zones: AlertZone[] = [];

    // Immediate zone (0-5km) - Same severity as original
    const immediateZone = this.locationService.getAlertZones(alertCoordinates);
    if (immediateZone.immediate.length > 0) {
      zones.push({
        type: 'immediate',
        severity: originalSeverity as 'critical' | 'warning' | 'info',
        cities: immediateZone.immediate.map(city => city.city),
        radius: 5
      });
    }

    // Nearby zone (5-25km) - Reduced severity (critical->warning, warning->info)
    if (immediateZone.nearby.length > 0) {
      const nearbySeverity = this.reduceSeverity(originalSeverity);
      zones.push({
        type: 'nearby',
        severity: nearbySeverity,
        cities: immediateZone.nearby.map(city => city.city),
        radius: 25
      });
    }

    // Regional zone (25-100km) - Info level only for critical original alerts
    if (originalSeverity === 'critical' && immediateZone.regional.length > 0) {
      zones.push({
        type: 'regional',
        severity: 'info',
        cities: immediateZone.regional.map(city => city.city),
        radius: 100
      });
    }

    return zones;
  }

  // Reduce severity level for distant zones
  private reduceSeverity(severity: string): 'critical' | 'warning' | 'info' {
    switch (severity) {
      case 'critical': return 'warning';
      case 'warning': return 'info';
      default: return 'info';
    }
  }

  // Get active subscribers from database
  private async getActiveSubscribers(): Promise<Subscriber[]> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          city,
          state,
          users:user_id!inner (email),
          alert_subscriptions!inner (
            email_alerts,
            sms_alerts,
            severity_levels,
            alert_types
          )
        `)
        .eq('alert_subscriptions.email_alerts', true);

      if (error) {
        console.error('Error fetching subscribers:', error);
        return [];
      }

      return (profiles || []).map(profile => {
        const subscription = profile.alert_subscriptions[0];
        const cityCoordinates = this.locationService.getCityCoordinates(profile.city);
        
        return {
          id: profile.user_id,
          email: profile.users.email,
          phone: profile.phone_number,
          city: profile.city,
          state: profile.state,
          coordinates: cityCoordinates,
          preferences: {
            language: 'en', // Default, could be enhanced
            emailAlerts: subscription.email_alerts,
            smsAlerts: subscription.sms_alerts,
            severityLevels: subscription.severity_levels,
            alertTypes: subscription.alert_types
          }
        };
      });
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }

  // Create targeted alerts for different zones
  private async createTargetedAlerts(
    originalAlert: Alert, 
    zones: AlertZone[], 
    subscribers: Subscriber[]
  ): Promise<Array<{ alert: Alert; recipients: Subscriber[]; zone: AlertZone }>> {
    const targetedAlerts: Array<{ alert: Alert; recipients: Subscriber[]; zone: AlertZone }> = [];

    for (const zone of zones) {
      // Filter subscribers in this zone
      const zoneSubscribers = subscribers.filter(subscriber => {
        // Check if subscriber's city is in this zone
        const isInZone = zone.cities.some(city => 
          subscriber.city.toLowerCase().includes(city.toLowerCase()) ||
          city.toLowerCase().includes(subscriber.city.toLowerCase())
        );

        if (!isInZone) return false;

        // Check subscriber preferences
        const wantsSeverity = subscriber.preferences.severityLevels.includes(zone.severity);
        const wantsType = subscriber.preferences.alertTypes.includes(originalAlert.type);
        
        return wantsSeverity && wantsType;
      });

      if (zoneSubscribers.length === 0) continue;

      // Create zone-specific alert
      const zoneAlert = await this.createZoneSpecificAlert(originalAlert, zone);
      
      targetedAlerts.push({
        alert: zoneAlert,
        recipients: zoneSubscribers,
        zone
      });
    }

    return targetedAlerts;
  }

  // Create zone-specific alert with appropriate messaging
  private async createZoneSpecificAlert(originalAlert: Alert, zone: AlertZone): Promise<Alert> {
    let zoneAlert = { ...originalAlert };
    
    // Modify alert based on zone type
    if (zone.type === 'nearby') {
      zoneAlert.title = `Nearby Emergency Alert: ${originalAlert.title}`;
      zoneAlert.description = `Emergency situation detected ${zone.radius}km from your location. ${originalAlert.description} Monitor the situation and be prepared to take action if conditions change.`;
      zoneAlert.severity = zone.severity;
    } else if (zone.type === 'regional') {
      zoneAlert.title = `Regional Alert: ${originalAlert.title}`;
      zoneAlert.description = `Emergency situation in your region. ${originalAlert.description} Stay informed and follow local authority guidance.`;
      zoneAlert.severity = zone.severity;
    }

    // Generate multilingual content for zone-specific alert
    zoneAlert = await this.nlpProcessor.generateMultilingualContent(zoneAlert);
    
    return zoneAlert;
  }

  // Send location-based notifications
  private async sendLocationBasedNotifications(
    targetedAlerts: Array<{ alert: Alert; recipients: Subscriber[]; zone: AlertZone }>
  ): Promise<void> {
    console.log(`📨 Sending ${targetedAlerts.length} targeted alert batches`);

    const notificationPromises = targetedAlerts.map(async ({ alert, recipients, zone }) => {
      console.log(`📍 Zone ${zone.type} (${zone.radius}km): ${recipients.length} recipients`);
      
      // Prepare recipients for edge function
      const formattedRecipients = recipients.map(subscriber => ({
        email: subscriber.preferences.emailAlerts ? subscriber.email : undefined,
        phone: subscriber.preferences.smsAlerts ? subscriber.phone : undefined,
        language: subscriber.preferences.language
      })).filter(r => r.email || r.phone);

      if (formattedRecipients.length === 0) return;

      try {
        // Call enhanced edge function
        const response = await fetch('https://ndxfqiwryuzjhwujqpca.supabase.co/functions/v1/send-emergency-alert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keGZxaXdyeXV6amh3dWpxcGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjAwNzIsImV4cCI6MjA3MjM5NjA3Mn0.KzIy8E7L1vClDmd01uT8vp2c9KUwOm3Ukam-x45HCEw`
          },
          body: JSON.stringify({
            recipients: formattedRecipients,
            alert: {
              ...alert,
              zone: zone.type,
              radius: zone.radius
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Zone ${zone.type} notifications sent: ${result.sent} successful, ${result.failed} failed`);
        } else {
          const error = await response.text();
          console.error(`❌ Failed to send zone ${zone.type} notifications:`, error);
        }
      } catch (error) {
        console.error(`❌ Network error for zone ${zone.type}:`, error);
      }
    });

    await Promise.all(notificationPromises);
  }

  // Test the complete alert system
  async testLocationBasedAlert(testAlert: Alert): Promise<void> {
    console.log('🧪 Testing location-based alert system...');
    
    // Add test coordinates if not present
    if (!testAlert.coordinates) {
      testAlert.coordinates = this.locationService.getCityCoordinates(testAlert.location) || 
        { lat: 28.7041, lng: 77.1025 }; // Default to Delhi
    }

    await this.processAndDistributeAlert(testAlert);
  }
}

export default EnhancedAlertService;