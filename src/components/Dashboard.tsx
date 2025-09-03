import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroSection } from './HeroSection';
import { StatsCards } from './StatsCards';
import { AlertCard } from './AlertCard';
import { UserProfile } from './UserProfile';
import { EnhancedSubscriptionForm } from './EnhancedSubscriptionForm';
import { LanguageSelector } from './LanguageSelector';
import { TestLocationAlert } from './TestLocationAlert';
import { mockAlerts, governmentSources } from "@/data/mockAlerts";
import { Alert } from "@/types/alert";
import AlertService from "@/services/alertService";
import { useToast } from "@/hooks/use-toast";
import { 
  RefreshCw,
  Database,
  Users,
  Zap
} from "lucide-react";

export const Dashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const autoRefreshInterval = useRef<NodeJS.Timeout>();
  const alertService = AlertService.getInstance();
  const { toast } = useToast();

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const criticalCount = activeAlerts.filter(alert => alert.severity === 'critical').length;
  const warningCount = activeAlerts.filter(alert => alert.severity === 'warning').length;
  const totalSubscribers = 1247; // Mock data for subscribers

  const translateAlerts = (alerts: Alert[], language: string) => {
    if (language === 'en') return alerts;
    
    return alerts.map(alert => {
      // Create a new alert object to ensure proper re-rendering
      const translatedAlert = { ...alert };
      
      if (alert.languages && alert.languages[language]) {
        translatedAlert.title = alert.languages[language].title;
        translatedAlert.description = alert.languages[language].description;
      }
      
      return translatedAlert;
    });
  };

  const refreshAlerts = async () => {
    setIsRefreshing(true);
    try {
      const newAlerts = await alertService.fetchLatestAlerts();
      const freshAlerts = translateAlerts(newAlerts, selectedLanguage);
      setAlerts(freshAlerts);
      setLastUpdated(new Date());
      
      if (newAlerts.length > 0) {
        toast({
          title: `${newAlerts.length} New Alert${newAlerts.length > 1 ? 's' : ''} Received!`,
          description: "Fresh emergency updates from Indian government sources.",
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to fetch latest alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Language changed to:', selectedLanguage);
    const translated = translateAlerts(alerts, selectedLanguage);
    console.log('Translated alerts:', translated.length);
    setAlerts(translated);

    try {
      localStorage.setItem('selectedLanguage', selectedLanguage);
    } catch {}
  }, [selectedLanguage]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('selectedLanguage');
      if (saved && saved !== selectedLanguage) {
        setSelectedLanguage(saved);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-refresh alerts every 5 minutes
    if (autoRefreshEnabled) {
      autoRefreshInterval.current = alertService.startAutoRefresh((newAlerts) => {
        const translatedAlerts = translateAlerts(newAlerts, selectedLanguage);
        setAlerts(translatedAlerts);
        setLastUpdated(new Date());
        
        if (newAlerts.length > 0) {
          toast({
            title: "🚨 Live Update!",
            description: `${newAlerts.length} new emergency alert${newAlerts.length > 1 ? 's' : ''} received from Indian government sources.`,
            duration: 6000,
          });
        }
      });
    }

    // Update timestamp every 30 seconds
    const timestampInterval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => {
      if (autoRefreshInterval.current) {
        alertService.stopAutoRefresh(autoRefreshInterval.current);
      }
      clearInterval(timestampInterval);
    };
  }, [autoRefreshEnabled, selectedLanguage, toast, alertService]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <HeroSection totalSubscribers={totalSubscribers} />
      
      <div className="container mx-auto px-6 -mt-32 relative z-10">
        <StatsCards criticalCount={criticalCount} warningCount={warningCount} />

        <Tabs defaultValue="profile" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
              <div className="flex items-center gap-2">
                <Badge variant={autoRefreshEnabled ? "success" : "secondary"} className="text-xs">
                  {autoRefreshEnabled ? "🔄 Auto-refresh ON" : "⏸️ Auto-refresh OFF"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  className="gap-2 text-xs"
                >
                  {autoRefreshEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshAlerts}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Updating...' : 'Refresh Now'}
              </Button>
            </div>
          </div>

          <TabsContent value="profile" className="space-y-6">
            <UserProfile />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Live Emergency Alerts
                    </CardTitle>
                    <CardDescription>
                      Real-time updates from verified government sources • Last updated: {lastUpdated.toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <Badge variant="success" className="animate-pulse">
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {activeAlerts.length > 0 ? (
              <div className="grid gap-6">
                {activeAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    selectedLanguage={selectedLanguage}
                  />
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">
                    All monitored areas are currently safe. We'll notify you immediately if any emergency situations arise.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="subscribe">
            <div className="space-y-6">
              <EnhancedSubscriptionForm />
              <TestLocationAlert />
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Government Data Sources
                </CardTitle>
                <CardDescription>
                  Our system integrates with verified government agencies to provide accurate, real-time emergency information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {governmentSources.map((source, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold">{source.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {source.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {source.types.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            Visit Site
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  System Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">NLP Processing</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Real-time government feed parsing</li>
                      <li>• Automated alert classification</li>
                      <li>• Severity level determination</li>
                      <li>• Location extraction and mapping</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Multi-language Support</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 16 supported languages including rare Indian languages</li>
                      <li>• Advanced translation with context preservation</li>
                      <li>• Cultural adaptation for local understanding</li>
                      <li>• High-quality emergency terminology</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Delivery Methods</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Email notifications with rich formatting</li>
                      <li>• SMS alerts for immediate attention</li>
                      <li>• Customizable notification preferences</li>
                      <li>• Delivery confirmation and tracking</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Integration Points</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Government API integration (USGS, FEMA, NWS)</li>
                      <li>• Twilio SMS service integration</li>
                      <li>• SMTP email server integration</li>
                      <li>• Real-time database synchronization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};