import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe } from 'lucide-react';
import { indianStates, regionColors } from '@/data/indianStates';

interface LocationSelectorProps {
  selectedState?: string;
  selectedRegion?: string;
  onStateChange: (state: string) => void;
  onRegionChange: (region: string) => void;
}

export function LocationSelector({ 
  selectedState, 
  selectedRegion, 
  onStateChange, 
  onRegionChange 
}: LocationSelectorProps) {
  const [filterByRegion, setFilterByRegion] = useState(false);

  const regions = Array.from(new Set(indianStates.map(state => state.region)));
  const filteredStates = selectedRegion && selectedRegion !== "" 
    ? indianStates.filter(state => state.region === selectedRegion)
    : indianStates;

  const selectedStateData = indianStates.find(state => state.code === selectedState);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Location Settings
        </h4>
        <Badge 
          variant="outline" 
          className="cursor-pointer transition-all hover:bg-primary/10"
          onClick={() => setFilterByRegion(!filterByRegion)}
        >
          <Globe className="h-3 w-3 mr-1" />
          {filterByRegion ? 'Show All States' : 'Filter by Region'}
        </Badge>
      </div>

      <div className="grid gap-4">
        {filterByRegion && (
          <div className="space-y-2">
            <Label htmlFor="region">Select Region</Label>
            <Select value={selectedRegion || "all"} onValueChange={(value) => onRegionChange(value === "all" ? "" : value)}>
              <SelectTrigger id="region" className="bg-background">
                <SelectValue placeholder="Choose a region..." />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: regionColors[region as keyof typeof regionColors] }}
                      />
                      {region} India
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="state">Select State/UT</Label>
          <Select value={selectedState || "all"} onValueChange={(value) => onStateChange(value === "all" ? "" : value)}>
            <SelectTrigger id="state" className="bg-background">
              <SelectValue placeholder="Choose your state or union territory..." />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-background border border-border shadow-lg z-50">
              <SelectItem value="all">All States & UTs</SelectItem>
            {filteredStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{state.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: regionColors[state.region] }}
                      />
                      {state.region}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStateData && (
          <div className="p-4 bg-gradient-card rounded-lg border border-primary/20">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h5 className="font-semibold text-primary">{selectedStateData.name}</h5>
                <p className="text-sm text-muted-foreground">Capital: {selectedStateData.capital}</p>
              </div>
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: regionColors[selectedStateData.region],
                  color: regionColors[selectedStateData.region]
                }}
              >
                {selectedStateData.region} India
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              You'll receive emergency alerts specifically for {selectedStateData.name} and surrounding areas.
            </p>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground space-y-2">
        <p className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <strong>Location-based filtering:</strong> Only receive alerts relevant to your selected area
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(regionColors).map(([region, color]) => (
            <div key={region} className="flex items-center gap-1 text-xs">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: color }}
              />
              {region}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}