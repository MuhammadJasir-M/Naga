
import { Alert } from "@/types/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface AlertCardProps {
  alert: Alert;
  selectedLanguage: string;
}

export const AlertCard = ({ alert, selectedLanguage }: AlertCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'critical';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'earthquake':
        return '🌍';
      case 'flood':
        return '🌊';
      case 'fire':
        return '🔥';
      case 'storm':
        return '⛈️';
      default:
        return '⚠️';
    }
  };

  // Enhanced translation logic
  const getCurrentAlert = () => {
    console.log('Alert languages available:', Object.keys(alert.languages || {}));
    console.log('Selected language:', selectedLanguage);
    
    if (selectedLanguage === 'en') {
      return { title: alert.title, description: alert.description };
    }
    
    if (alert.languages && alert.languages[selectedLanguage]) {
      console.log('Found translation for', selectedLanguage);
      return {
        title: alert.languages[selectedLanguage].title,
        description: alert.languages[selectedLanguage].description
      };
    }
    
    console.log('No translation found, using English');
    return { title: alert.title, description: alert.description };
  };

  const currentAlert = getCurrentAlert();

  return (
    <Card className={`alert-modern ${alert.severity} hover:scale-[1.02] transition-all duration-500`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
        alert.severity === 'critical' ? 'from-critical to-critical/70' :
        alert.severity === 'warning' ? 'from-warning to-warning/70' :
        'from-info to-info/70'
      }`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl mt-1" role="img" aria-label={alert.type}>
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-2">
                {currentAlert.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant={getSeverityColor(alert.severity) as any} className="uppercase text-xs font-medium">
                  {alert.severity}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {alert.type}
                </Badge>
                {selectedLanguage !== 'en' && (
                  <Badge variant="outline" className="text-xs bg-primary/10">
                    {selectedLanguage.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-muted-foreground">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground">
          {currentAlert.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{alert.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{format(alert.timestamp, "MMM d, HH:mm")}</span>
          </div>
        </div>

        {alert.magnitude && (
          <div className="text-sm">
            <span className="font-medium">Magnitude:</span> {alert.magnitude}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            Source: {alert.source}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-3 w-3" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
