import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function TestLocationAlert() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Flash Flood Warning',
    description: 'Heavy rainfall has caused rapid water level rise in low-lying areas. Residents should avoid driving through flooded roads and move to higher ground if necessary.',
    severity: 'warning' as 'critical' | 'warning' | 'info',
    type: 'flood',
    city: 'Chennai',
    location: 'Chennai and surrounding areas'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const alert = {
        id: `test-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        type: formData.type,
        location: formData.location,
        city: formData.city,
        timestamp: new Date().toISOString(),
        source: 'Test System'
      };

      const { data, error } = await supabase.functions.invoke('send-location-alerts', {
        body: { alert }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Test Alert Sent!',
        description: `Successfully sent to ${data.recipients || 0} users in ${formData.city}`,
      });

      console.log('Alert delivery result:', data);

    } catch (error) {
      console.error('Error sending test alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test alert',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Test Location-Based Alert
        </CardTitle>
        <CardDescription>
          Send a test emergency alert to users in a specific city. This will only reach users who have opted in for alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Target City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Chennai, Mumbai, Delhi"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value: 'critical' | 'warning' | 'info') => 
                  setFormData({ ...formData, severity: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Alert Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="storm">Storm</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location Details</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Detailed location description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Alert Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed alert information and instructions"
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Test Alert...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Test Alert
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}