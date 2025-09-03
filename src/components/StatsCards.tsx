import { ModernCard, ModernCardContent } from "@/components/ui/modern-card";
import { AlertTriangle, Shield, Globe, Activity } from "lucide-react";

interface StatsCardsProps {
  criticalCount: number;
  warningCount: number;
}

export const StatsCards = ({ criticalCount, warningCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      <ModernCard variant="stats" className="group bg-gradient-to-br from-red-500/10 via-pink-500/10 to-red-600/10 border-red-200/50">
        <ModernCardContent className="p-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent font-display">{criticalCount}</div>
              <div className="text-sm text-foreground font-medium">Critical Alerts</div>
              <div className="text-xs text-red-600/70 mt-1">Requires immediate action</div>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>

      <ModernCard variant="stats" className="group bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-orange-600/10 border-orange-200/50">
        <ModernCardContent className="p-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent font-display">{warningCount}</div>
              <div className="text-sm text-foreground font-medium">Warnings</div>
              <div className="text-xs text-orange-600/70 mt-1">Monitor closely</div>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>

      <ModernCard variant="stats" className="group bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 border-blue-200/50">
        <ModernCardContent className="p-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-display">16</div>
              <div className="text-sm text-foreground font-medium">Languages</div>
              <div className="text-xs text-blue-600/70 mt-1">Global accessibility</div>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>

      <ModernCard variant="stats" className="group bg-gradient-to-br from-green-500/10 via-teal-500/10 to-green-600/10 border-green-200/50">
        <ModernCardContent className="p-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent font-display">24/7</div>
              <div className="text-sm text-foreground font-medium">Monitoring</div>
              <div className="text-xs text-green-600/70 mt-1">Always operational</div>
            </div>
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  );
};