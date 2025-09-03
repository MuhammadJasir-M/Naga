import { Badge } from "@/components/ui/badge";
import { ModernButton } from "@/components/ui/modern-button";
import { Bell, Smartphone, TrendingUp } from "lucide-react";
import heroImage from "@/assets/emergency-hero-new.jpg";
import emergencyLogo from "@/assets/emergency-logo.png";

interface HeroSectionProps {
  totalSubscribers: number;
}

export const HeroSection = ({ totalSubscribers }: HeroSectionProps) => {
  return (
    <div className="relative h-[100vh] hero-gradient-overlay overflow-hidden animate-gradient">
      <div 
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-500/30 to-blue-600/40"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-accent rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-info rounded-full animate-glow"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="text-center text-white max-w-6xl">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <img 
                src={emergencyLogo} 
                alt="Emergency Alert System Logo" 
                className="h-24 w-24 drop-shadow-2xl animate-float"
              />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse-glow flex items-center justify-center animate-rainbow-border">
                <Bell className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-8xl font-display font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                Emergency Alert System
              </h1>
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <Badge className="animate-pulse-glow px-6 py-3 text-lg bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                  🔴 LIVE MONITORING
                </Badge>
                <Badge className="glass-morphism text-white border-white/40 px-6 py-3 text-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  ⚡ 5-MIN UPDATES
                </Badge>
                <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                  🌍 GLOBAL COVERAGE
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-2xl opacity-95 max-w-4xl mx-auto leading-relaxed mb-8 font-medium">
            Real-time Indian government emergency alerts with multilingual support 
            for Tamil, Telugu, Hindi, Bengali and all Indian languages with instant SMS and email delivery
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-10 text-lg opacity-90">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="font-medium">16+ Languages</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-info rounded-full animate-pulse"></div>
              <span className="font-medium">Government Sources</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
              <span className="font-medium">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="font-medium">{totalSubscribers.toLocaleString()} Subscribers</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6">
            <ModernButton variant="premium" size="lg" className="font-semibold">
              <Smartphone className="w-5 h-5 mr-2" />
              Get Instant Alerts
            </ModernButton>
            <ModernButton variant="outline-modern" size="lg" className="font-semibold">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Analytics
            </ModernButton>
          </div>
        </div>
      </div>
    </div>
  );
};