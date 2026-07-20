import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target } from "lucide-react";

interface MonthPlan {
  month: string;
  nutrition: string;
  lifestyle: string;
  supplements: string;
  exercise: string;
  tests: string;
  expectedOutcomes: string;
}

interface ThreeMonthPlanCardsProps {
  data: MonthPlan[];
  className?: string;
}

export const ThreeMonthPlanCards: React.FC<ThreeMonthPlanCardsProps> = ({ data, className = "" }) => {
  const getMonthColor = (month: string) => {
    if (month.includes("1")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (month.includes("2")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    if (month.includes("3")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {data.map((plan, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {plan.month}
              </CardTitle>
              <Badge className={getMonthColor(plan.month)}>Phase {index + 1}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-primary uppercase">Nutrition</h4>
                <p className="text-sm text-muted-foreground">{plan.nutrition}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-primary uppercase">Lifestyle</h4>
                <p className="text-sm text-muted-foreground">{plan.lifestyle}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-primary uppercase">Supplements</h4>
                <p className="text-sm text-muted-foreground">{plan.supplements}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-primary uppercase">Exercise</h4>
                <p className="text-sm text-muted-foreground">{plan.exercise}</p>
              </div>
            </div>
            {plan.tests && (
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-sm font-semibold text-primary uppercase">Further Tests</h4>
                <p className="text-sm text-muted-foreground">{plan.tests}</p>
              </div>
            )}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-green-600 dark:text-green-400 uppercase">
                <Target className="h-4 w-4" />
                Expected Outcomes
              </h4>
              <p className="text-sm">{plan.expectedOutcomes}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
