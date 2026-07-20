import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, ChevronDown } from "lucide-react";

interface Marker {
  name: string;
  value: string;
  referenceRange: string;
  status: "normal" | "suboptimal" | "abnormal";
  comment: string;
}

interface MarkerCategory {
  category: string;
  markers: Marker[];
}

interface MarkerCardsProps {
  data: MarkerCategory[];
  className?: string;
  isMobile?: boolean;
}

export const MarkerCards: React.FC<MarkerCardsProps> = ({ data, className = "", isMobile = false }) => {
  const [showOnlyAbnormal, setShowOnlyAbnormal] = useState(false);
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (index: number) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "suboptimal":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "abnormal":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500";
      case "suboptimal":
        return "bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-l-amber-500";
      case "abnormal":
        return "bg-rose-50/50 dark:bg-rose-950/20 border-l-4 border-l-rose-500";
      default:
        return "bg-card border-l-4 border-l-border";
    }
  };

  const filterMarkers = (markers: Marker[]) => {
    if (!showOnlyAbnormal) return markers;
    return markers.filter(m => m.status === "abnormal" || m.status === "suboptimal");
  };

  const getOptimalCount = (markers: Marker[]) => {
    const normalCount = markers.filter(m => m.status === "normal").length;
    const total = markers.length;
    return { normalCount, total };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <Button
          variant={showOnlyAbnormal ? "default" : "outline"}
          size="sm"
          onClick={() => setShowOnlyAbnormal(!showOnlyAbnormal)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          {showOnlyAbnormal ? "Show All" : "Show Issues Only"}
        </Button>
      </div>

      {data.map((category, catIndex) => {
        const filteredMarkers = filterMarkers(category.markers);
        const { normalCount, total } = getOptimalCount(category.markers);
        
        if (filteredMarkers.length === 0) return null;

        return (
          <Collapsible
            key={catIndex}
            open={openCategories.has(catIndex)}
            onOpenChange={() => toggleCategory(catIndex)}
            className="space-y-3"
          >
            <CollapsibleTrigger className="w-full group">
              <div className="flex items-center justify-between gap-3 p-3 md:p-4 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 min-h-[72px]">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <ChevronDown 
                    className={`w-6 h-6 md:w-5 md:h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                      openCategories.has(catIndex) ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                  <h3 className="text-base md:text-xl font-bold text-foreground text-left break-words">{category.category}</h3>
                </div>
                <Badge 
                  variant="outline" 
                  className="text-xs md:text-sm font-semibold bg-background/80 border-primary/30 flex-shrink-0 whitespace-nowrap"
                >
                  {normalCount}/{total}
                </Badge>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-3">
              <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3 md:grid-cols-2'}`}>
                {filteredMarkers.map((marker, markerIndex) => (
                  <Card 
                    key={markerIndex} 
                    className={`hover:shadow-lg transition-all duration-300 ${getStatusBgColor(marker.status)}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold">{marker.name}</CardTitle>
                        <Badge className={`${getStatusColor(marker.status)} border`} variant="secondary">
                          {marker.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-background/50 rounded-md">
                        <span className="text-sm text-muted-foreground">Value</span>
                        <span className="font-bold text-base">{marker.value}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Reference Range</span>
                        <span className="font-mono text-xs opacity-80">{marker.referenceRange}</span>
                      </div>
                      {marker.comment && (
                        <p className="text-sm text-muted-foreground pt-2 border-t leading-relaxed">{marker.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}

      {data.every(category => filterMarkers(category.markers).length === 0) && showOnlyAbnormal && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No abnormal or suboptimal markers found. Great job! 🎉</p>
        </div>
      )}
    </div>
  );
};
