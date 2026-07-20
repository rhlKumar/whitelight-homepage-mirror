import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, XCircle, FileText, Activity, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Progress = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [extractionStatus, setExtractionStatus] = useState<"pending" | "extracting" | "complete" | "failed">("pending");
  const [analysisStatus, setAnalysisStatus] = useState<"pending" | "processing" | "complete" | "error">("pending");
  const [currentStep, setCurrentStep] = useState(1);
  const [failedReports, setFailedReports] = useState<string[]>([]);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [progressStage, setProgressStage] = useState<string>("");
  const [progressDetails, setProgressDetails] = useState<string>("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    checkAuth();
  }, [navigate]);

  // Poll for extraction status - stops once analysis starts processing
  useEffect(() => {
    if (!user) return;
    // Stop polling extraction once analysis is processing or complete
    if (analysisStatus === "processing" || analysisStatus === "complete") return;

    const pollExtractionStatus = async () => {
      const { data: userReports } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Wait for reports to be created - don't navigate away immediately
      if (!userReports || userReports.length === 0) {
        return;
      }

      setReports(userReports);

      const pending = userReports.filter(r => r.extraction_status === "pending");
      const extracting = userReports.filter(r => r.extraction_status === "extracting");
      const failed = userReports.filter(r => r.extraction_status === "failed");
      const complete = userReports.filter(r => r.extraction_status === "complete" || r.extraction_status === "success");

      // Update failed reports list
      if (failed.length > 0) {
        setFailedReports(failed.map(r => r.id));
      }

      // Determine extraction status
      if (failed.length === userReports.length) {
        setExtractionStatus("failed");
        setCurrentStep(1);
      } else if (pending.length > 0 || extracting.length > 0) {
        setExtractionStatus("extracting");
        setCurrentStep(1);
      } else if (complete.length === userReports.length) {
        setExtractionStatus("complete");
        // Don't set currentStep here if analysis has started
        if (!analysisStarted) {
          setCurrentStep(2);
        }
      }
    };

    // Initial poll
    pollExtractionStatus();

    // Poll every 3 seconds
    const interval = setInterval(pollExtractionStatus, 3000);

    return () => clearInterval(interval);
  }, [user, navigate, analysisStatus]);

  // Auto-trigger extraction when page loads with pending reports
  useEffect(() => {
    if (!user || reports.length === 0) return;
    
    const hasPendingReports = reports.some(r => r.extraction_status === "pending");
    
    if (hasPendingReports && !analysisStarted) {
      const triggerExtraction = async () => {
        console.log("🚀 Triggering extraction and analysis for pending reports");
        setAnalysisStarted(true);

        try {
          const { error } = await supabase.functions.invoke("analyze-health-report", {
            body: { reportId: reports[0].id },
          });

          if (error) {
            console.error("Extraction trigger error:", error);
            toast.error("Failed to start processing");
          }
        } catch (error) {
          console.error("Failed to trigger extraction:", error);
          toast.error("Failed to start processing");
        }
      };

      triggerExtraction();
    }
  }, [user, reports, analysisStarted]);

  // Auto-trigger analysis when all extractions complete and check for existing analysis
  useEffect(() => {
    if (!user || reports.length === 0) return;

    const checkAndTriggerAnalysis = async () => {
      // First check if there's already an insight processing
      const { data: existingInsight } = await supabase
        .from("health_insights")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingInsight) {
        const status = (existingInsight.analysis_data as any)?.status;
        const progress = (existingInsight.analysis_data as any)?.progress;

        if (status === "complete") {
          // Set complete state first so polling can detect it
          setAnalysisStatus("complete");
          setCurrentStep(3);
          return;
        } else if (status === "error") {
          navigate(`/dashboard?error=analysis_failed`);
          return;
        } else if (status === "cancelled") {
          navigate("/dashboard");
          return;
        } else if (status === "processing") {
          // Analysis is already running, just track it
          setAnalysisStatus("processing");
          setAnalysisStarted(true);
          setCurrentStep(2);
          if (progress) {
            setProgressStage(progress.stage || "");
            setProgressDetails(progress.details || "");
          }
          return;
        }
      }

      // If extraction complete and no analysis started yet, trigger it
      if (extractionStatus === "complete" && !analysisStarted) {
        console.log("🚀 All extractions complete - auto-triggering analysis");
        setAnalysisStarted(true);
        setAnalysisStatus("processing");
        setCurrentStep(2);

        try {
          const { error } = await supabase.functions.invoke("analyze-health-report", {
            body: { reportId: reports[0].id },
          });

          if (error) {
            console.error("Analysis trigger error:", error);
            setAnalysisStatus("error");
          }
        } catch (error) {
          console.error("Failed to trigger analysis:", error);
          setAnalysisStatus("error");
        }
      }
    };

    if (extractionStatus === "complete") {
      checkAndTriggerAnalysis();
    }
  }, [extractionStatus, analysisStarted, reports, user, navigate]);

  // Poll for analysis status and progress - stops after navigation
  useEffect(() => {
    if (!user) return;
    // Only poll while processing
    if (analysisStatus !== "processing") return;

    const pollAnalysisStatus = async () => {
      const { data: insight } = await supabase
        .from("health_insights")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (insight) {
        const status = (insight.analysis_data as any)?.status;
        const progress = (insight.analysis_data as any)?.progress;

        // Update progress stage and details from health_insights
        if (progress) {
          setProgressStage(progress.stage || "");
          setProgressDetails(progress.details || "");

          // Update current step based on progress stage
          const stage = progress.stage;
          if (stage === "uploaded" || stage === "extracting") {
            setCurrentStep(1);
          } else if (stage === "extracted" || stage === "analyzing") {
            setCurrentStep(2);
          } else if (stage === "complete") {
            setCurrentStep(3);
          }
        }

        if (status === "complete") {
          setAnalysisStatus("complete");
          setCurrentStep(3);
          toast.success("Analysis complete!");
          // Navigate immediately
          navigate("/insights");
        } else if (status === "error") {
          setAnalysisStatus("error");
          setTimeout(() => {
            navigate(`/dashboard?error=analysis_failed`);
          }, 2000);
        } else if (status === "cancelled") {
          toast.info("Analysis cancelled - starting fresh...");
          setTimeout(() => navigate("/dashboard"), 1000);
        }
      }
    };

    // Initial poll
    pollAnalysisStatus();

    // Poll every 3 seconds for more responsive updates
    const interval = setInterval(pollAnalysisStatus, 3000);

    return () => clearInterval(interval);
  }, [user, analysisStatus, navigate]);

  // Handle extraction failure navigation
  useEffect(() => {
    if (extractionStatus === "failed") {
      toast.error("Report extraction failed");
      setTimeout(() => {
        navigate(`/?error=extraction_failed&failed_reports=${failedReports.join(",")}`);
      }, 2000);
    }
  }, [extractionStatus, failedReports, navigate]);

  const Step = ({ number, title, status }: { number: number; title: string; status: "pending" | "active" | "complete" | "error" }) => {
    return (
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
          status === "complete" ? "bg-green-500 text-white" :
          status === "active" ? "bg-primary text-primary-foreground" :
          status === "error" ? "bg-destructive text-destructive-foreground" :
          "bg-muted text-muted-foreground"
        }`}>
          {status === "complete" ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : status === "active" ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : status === "error" ? (
            <XCircle className="w-6 h-6" />
          ) : (
            <span className="text-lg font-semibold">{number}</span>
          )}
        </div>
        <p className={`text-sm font-medium text-center ${
          status === "active" ? "text-foreground" : "text-muted-foreground"
        }`}>
          {title}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 shadow-elevated">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Processing Your Health Reports</h1>
          </div>
          <p className="text-muted-foreground">
            Please wait while we extract and analyze your health data
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Step 
              number={1} 
              title="Extracting Data" 
              status={
                extractionStatus === "failed" ? "error" :
                extractionStatus === "complete" ? "complete" :
                currentStep === 1 ? "active" : "pending"
              } 
            />
            <div className={`flex-1 h-1 mx-4 ${currentStep > 1 ? "bg-primary" : "bg-muted"}`} />
            <Step 
              number={2} 
              title="Analyzing Reports" 
              status={
                analysisStatus === "error" ? "error" :
                analysisStatus === "complete" ? "complete" :
                currentStep === 2 ? "active" : "pending"
              } 
            />
            <div className={`flex-1 h-1 mx-4 ${currentStep > 2 ? "bg-primary" : "bg-muted"}`} />
            <Step 
              number={3} 
              title="Ready" 
              status={currentStep === 3 ? "complete" : "pending"} 
            />
          </div>
        </div>

        {/* Report Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4">Reports Being Processed:</h3>
          {reports.map((report) => {
            const status = report.extraction_status;
            return (
              <div key={report.id} className="flex items-center justify-between gap-2 p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {report.original_filename || report.file_name.split('/').pop()?.replace(/^\d+\.\d+\./, '')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {status === "pending" && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400 whitespace-nowrap">
                      Pending
                    </Badge>
                  )}
                  {status === "extracting" && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400 whitespace-nowrap">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Extracting...
                    </Badge>
                  )}
                  {(status === "complete" || status === "success") && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                  {status === "failed" && (
                    <Badge variant="destructive" className="whitespace-nowrap">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Status Message */}
        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-center">
            {extractionStatus === "extracting" && "Extracting blood markers from your reports..."}
            {extractionStatus === "complete" && analysisStatus === "processing" && progressDetails && progressDetails}
            {extractionStatus === "complete" && analysisStatus === "processing" && !progressDetails && "Analyzing your health data across all reports..."}
            {analysisStatus === "complete" && "Analysis complete! Redirecting to insights..."}
            {(extractionStatus === "failed" || analysisStatus === "error") && "An error occurred. Redirecting to dashboard..."}
          </p>
        </div>
      </Card>
      
      {/* Floating Chat Button - Hidden on Desktop as it has sidebar */}
      <div className="md:hidden">
        <Button
          onClick={() => navigate("/dashboard")}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated hover:shadow-2xl transition-all z-50"
        >
          <Activity className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Progress;
