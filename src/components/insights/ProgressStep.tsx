import { CheckCircle2, Loader2 } from "lucide-react";

interface ProgressStepProps {
  stage: string;
  currentStage: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ProgressStep = ({ stage, currentStage, label, icon: Icon }: ProgressStepProps) => {
  const stages = ["uploaded", "extracting", "extracted", "analyzing"];
  const currentIndex = stages.indexOf(currentStage);
  const stageIndex = stages.indexOf(stage);
  const isComplete = stageIndex < currentIndex;
  const isCurrent = stage === currentStage;

  return (
    <div
      className={`flex items-center space-x-3 transition-all duration-300 ${
        isComplete ? "text-green-600" : isCurrent ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isComplete ? "bg-green-100 scale-110" : isCurrent ? "bg-primary/10 animate-pulse" : "bg-muted"
        }`}
      >
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
        )}
      </div>
      <span className={`font-medium transition-all ${isCurrent ? "scale-105" : ""}`}>{label}</span>
      {isCurrent && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
    </div>
  );
};
