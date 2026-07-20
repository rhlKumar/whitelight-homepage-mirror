import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useHealthInsights = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [showDelayMessage, setShowDelayMessage] = useState(false);
  const [progressStage, setProgressStage] = useState<string>("uploaded");
  const [progressDetails, setProgressDetails] = useState<string>("");
  const [recentlyUpdated, setRecentlyUpdated] = useState<string[]>([]);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [updatingSections, setUpdatingSections] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const analysisInProgress = useRef(false);
  const insightRef = useRef<any>(null);

  useEffect(() => {
    insightRef.current = insight;
  }, [insight]);

  const generateAnalysis = useCallback(
    async (userId: string) => {
      if (analysisInProgress.current) {
        console.log("⚠️ Analysis already in progress, skipping duplicate call");
        return;
      }

      analysisInProgress.current = true;
      setAnalyzing(true);
      setProgress(0);
      setShowDelayMessage(false);

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / 150));
      }, 1000);

      const delayTimeout = setTimeout(() => setShowDelayMessage(true), 150000);

      try {
        const { data: reports, error: reportsError } = await supabase
          .from("reports")
          .select("id")
          .eq("user_id", userId);

        if (reportsError) throw reportsError;

        if (!reports || reports.length === 0) {
          toast({
            title: "No reports found",
            description: "Please upload your health reports first",
            variant: "destructive",
          });
          navigate("/upload");
          return;
        }

        const reportId = reports[0]?.id;
        const { data, error } = await supabase.functions.invoke("analyze-health-report", {
          body: { reportId },
        });

        if (error) throw new Error(`Failed to analyze reports: ${error.message || JSON.stringify(error)}`);

        clearInterval(progressInterval);
        clearTimeout(delayTimeout);
        setProgress(100);
        setInsight(data);
      } catch (error: any) {
        console.error("Analysis error:", error);
        clearInterval(progressInterval);
        clearTimeout(delayTimeout);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze reports",
          variant: "destructive",
        });
      } finally {
        analysisInProgress.current = false;
        setAnalyzing(false);
        setLoading(false);
      }
    },
    [toast, navigate],
  );

  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      const { data: userReports } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setReports(userReports || []);

      const { data: existingInsight } = await supabase
        .from("health_insights")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setInsight(existingInsight);
      setLoading(false);

      if (!existingInsight) {
        navigate("/dashboard");
      }
    };

    initData();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("insights-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "health_insights", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setInsight(payload.new as any);
          setLoading(false);
          setAnalyzing(false);
          toast({ title: "✨ Insights Generated", description: "Your health insights are now ready!", duration: 5000 });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "health_insights", filter: `user_id=eq.${user.id}` },
        async (payload) => {
          const updatedInsight = payload.new as any;
          const currentInsight = insightRef.current;

          if (updatedInsight.superseded_by) {
            if (currentInsight && updatedInsight.superseded_by === currentInsight.id) {
              console.error("⚠️ Circular supersession detected in realtime! Ignoring update.");
              return;
            }

            const { data: newInsight } = await supabase
              .from("health_insights")
              .select("*")
              .eq("id", updatedInsight.superseded_by)
              .maybeSingle();

            if (newInsight) {
              setInsight(newInsight);
              return;
            }
          }

          const oldVersion = currentInsight?.version || 0;
          const newVersion = updatedInsight.version || 0;
          const sectionsChanged =
            JSON.stringify(updatedInsight.last_updated_sections) !==
            JSON.stringify(currentInsight?.last_updated_sections);

          if (sectionsChanged && newVersion === oldVersion) {
            setUpdatingSections(updatedInsight.last_updated_sections || []);
            setUpdateInProgress(true);
          } else if (newVersion > oldVersion) {
            setInsight(updatedInsight);
            setUpdatingSections([]);
            setUpdateInProgress(false);
            setRecentlyUpdated(updatedInsight.last_updated_sections || []);
            toast({
              title: "✨ Insights Updated",
              description: "Your health plan has been updated based on the conversation.",
              duration: 4000,
            });
          } else {
            setInsight(updatedInsight);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  useEffect(() => {
    if (insight?.last_updated_sections) {
      setRecentlyUpdated(insight.last_updated_sections);
      const timer = setTimeout(() => setRecentlyUpdated([]), 10000);
      return () => clearTimeout(timer);
    }
  }, [insight?.last_updated_sections, insight?.last_updated_at]);

  useEffect(() => {
    if (!insight || !user) return;

    const status = (insight.analysis_data as any)?.status;
    if (status !== "processing") {
      setAnalyzing(false);
      setProgress(100);
      return;
    }

    setAnalyzing(true);
    setProgress(10);

    const pollInterval = setInterval(async () => {
      const { data: updated } = await supabase.from("health_insights").select("*").eq("id", insight.id).maybeSingle();

      if (!updated) {
        clearInterval(pollInterval);
        return;
      }

      const analysisData = updated.analysis_data as any;
      const updatedStatus = analysisData?.status;
      const progressData = analysisData?.progress;

      if (progressData) {
        setProgressStage(progressData.stage);
        setProgressDetails(progressData.details);
        if (progressData.percentage !== undefined) {
          setProgress(progressData.percentage);
        }
      }

      if (updatedStatus === "completed") {
        clearInterval(pollInterval);
        setInsight(updated);
        setAnalyzing(false);
        setProgress(100);
        toast({ title: "✨ Analysis Complete", description: "Your insights are ready!", duration: 5000 });
      } else if (updatedStatus === "failed") {
        clearInterval(pollInterval);
        setAnalyzing(false);
        toast({ title: "Analysis Failed", description: "Something went wrong during analysis", variant: "destructive" });
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [insight?.id, user, toast]);

  return {
    user,
    loading,
    analyzing,
    insight,
    reports,
    progress,
    showDelayMessage,
    progressStage,
    progressDetails,
    recentlyUpdated,
    updateInProgress,
    updatingSections,
    generateAnalysis,
  };
};
