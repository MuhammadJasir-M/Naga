export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  type: 'earthquake' | 'flood' | 'fire' | 'storm' | 'other';
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  source: string;
  magnitude?: number;
  languages: Record<string, {
    title: string;
    description: string;
  }>;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  preferredLanguage: string;
  isSubscribed: boolean;
  subscriptionPreferences: {
    email: boolean;
    sms: boolean;
    severity: ('critical' | 'warning' | 'info')[];
    alertTypes: ('earthquake' | 'flood' | 'fire' | 'storm' | 'other')[];
  };
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}