import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";

interface Supplement {
  name: string;
  form: string;
  reason: string;
  dosage: string;
  timing: string;
}

interface SupplementCardsProps {
  data: Supplement[];
  className?: string;
}

export const SupplementCards: React.FC<SupplementCardsProps> = ({ data, className = "" }) => {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {data.map((supplement, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                {supplement.name}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {supplement.form}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Reason</span>
              <p className="text-sm mt-1">{supplement.reason}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Dosage</span>
                <p className="text-sm mt-1">{supplement.dosage}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Timing</span>
                <p className="text-sm mt-1">{supplement.timing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
