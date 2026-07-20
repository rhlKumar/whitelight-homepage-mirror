import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Activity, FileText, Target, Brain, Loader2 } from "lucide-react";
import { ProgressStep } from "./ProgressStep";

interface AnalysisProgressViewProps {
  progress: number;
  progressStage: string;
  progressDetails: string;
  showDelayMessage: boolean;
}

export const AnalysisProgressView = ({
  progress,
  progressStage,
  progressDetails,
  showDelayMessage,
}: AnalysisProgressViewProps) => {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            Analyzing Your Health Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 px-6 pb-8">
          <div className="space-y-6">
            <ProgressStep stage="uploaded" currentStage={progressStage} label="Report Uploaded" icon={FileText} />
            <ProgressStep stage="extracting" currentStage={progressStage} label="Extracting Data" icon={Target} />
            <ProgressStep stage="extracted" currentStage={progressStage} label="Data Extracted" icon={Activity} />
            <ProgressStep stage="analyzing" currentStage={progressStage} label="Analyzing Results" icon={Brain} />
          </div>

          {progressDetails && (
            <Alert className="bg-primary/5 border-primary/20">
              <AlertDescription className="text-center text-sm text-muted-foreground">
                {progressDetails}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">{Math.round(progress)}% Complete</p>
          </div>

          {showDelayMessage && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertDescription className="text-center text-sm text-amber-900">
                This is taking longer than expected. Your analysis is still processing, please wait...
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/30 rounded-lg p-6 space-y-3 border border-border/50">
            <p className="text-center text-sm text-muted-foreground leading-relaxed">
              ✨ We're carefully analyzing your health data with AI to provide personalized insights
            </p>
            <p className="text-center text-xs text-muted-foreground">This typically takes 1-3 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
