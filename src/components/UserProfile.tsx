import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, MapPin, Mail, Phone, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  full_name: string;
  city: string;
  address: string;
  phone_number: string;
  country: string;
}

interface AlertSubscription {
  email_alerts: boolean;
  sms_alerts: boolean;
  severity_levels: string[];
  alert_types: string[];
}

export function UserProfile() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<AlertSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch alert subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('alert_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (subscriptionError) throw subscriptionError;
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {profile?.full_name ? getInitials(profile.full_name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{profile?.full_name || 'User'}</CardTitle>
              <CardDescription className="flex items-center text-sm">
                <Mail className="h-3 w-3 mr-1" />
                {user?.email}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {profile && (
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{profile.city}, {profile.country}</span>
            </div>
            
            {profile.phone_number && (
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.phone_number}</span>
              </div>
            )}

            {profile.address && (
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.address}</span>
              </div>
            )}
          </div>
        )}

        {subscription && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center text-sm font-medium">
              <Settings className="h-4 w-4 mr-2" />
              Alert Preferences
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Email Alerts:</span>
                <Badge variant={subscription.email_alerts ? "default" : "secondary"}>
                  {subscription.email_alerts ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>SMS Alerts:</span>
                <Badge variant={subscription.sms_alerts ? "default" : "secondary"}>
                  {subscription.sms_alerts ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Alert Types:</div>
              <div className="flex flex-wrap gap-1">
                {subscription.alert_types.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Severity Levels:</div>
              <div className="flex flex-wrap gap-1">
                {subscription.severity_levels.map((level) => (
                  <Badge key={level} variant="outline" className="text-xs">
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}