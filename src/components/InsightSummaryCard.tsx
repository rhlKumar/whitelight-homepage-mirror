import { Card } from "@/components/ui/card";
import { ChevronRight, LucideIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InsightSummaryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  onClick: () => void;
  isRecentlyUpdated?: boolean;
  isUpdating?: boolean;
}

export function InsightSummaryCard({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  onClick,
  isRecentlyUpdated = false,
  isUpdating = false,
}: InsightSummaryCardProps) {
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6 hover:bg-muted/50 transition-all duration-300 group">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {title}
              </h3>
              {isUpdating && (
                <Badge variant="outline" className="animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Updating
                </Badge>
              )}
              {isRecentlyUpdated && !isUpdating && (
                <Badge variant="secondary" className="animate-in fade-in">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Updated
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1 flex-shrink-0" />
        </div>
      </div>
    </Card>
  );
}
