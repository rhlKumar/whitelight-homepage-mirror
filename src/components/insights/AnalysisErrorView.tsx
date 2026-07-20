import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Home, Upload } from "lucide-react";

interface AnalysisErrorViewProps {
  onRetry: () => void;
  onNavigateHome: () => void;
  onNavigateUpload: () => void;
}

export const AnalysisErrorView = ({ onRetry, onNavigateHome, onNavigateUpload }: AnalysisErrorViewProps) => {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="border-2 border-destructive/20">
        <CardContent className="pt-8 space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Analysis Timeout</AlertTitle>
            <AlertDescription className="mt-2">
              The analysis is taking longer than expected. This might be due to:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Complex health data requiring more processing time</li>
                <li>High server load</li>
                <li>Network connectivity issues</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button onClick={onRetry} className="w-full" size="lg">
              Try Again
            </Button>
            <div className="flex gap-3">
              <Button onClick={onNavigateHome} variant="outline" className="flex-1" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
              <Button onClick={onNavigateUpload} variant="outline" className="flex-1" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Re-upload
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            If the problem persists, please contact support
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
