import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, BarChart3, LogOut, Activity, ClipboardList, Menu, Upload as UploadIcon, AlertCircle, Trash2, ChevronDown, User, Watch, Loader2, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import HealthChat from "@/components/HealthChat";
import { useMediaQuery } from "@/hooks/useMediaQuery";
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [latestInsight, setLatestInsight] = useState<any>(null);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [reportToDelete, setReportToDelete] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Helper function to extract file path from either format (full URL or path-only)
  const extractFilePath = (fileUrl: string): string => {
    if (fileUrl.includes('supabase.co/storage')) {
      // Extract path from full URL: health-reports/user-id/filename.pdf
      const match = fileUrl.match(/health-reports\/(.*)$/);
      return match ? match[1] : fileUrl;
    }
    return fileUrl; // Already a path
  };
  const handleViewReport = async (report: any) => {
    try {
      const filePath = extractFilePath(report.file_url);

      // Generate a signed URL that expires in 1 hour
      const {
        data,
        error
      } = await supabase.storage.from("health-reports").createSignedUrl(filePath, 3600); // 3600 seconds = 1 hour

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      console.error("Error generating signed URL:", error);
      toast.error("Failed to open report. Please try again.");
    }
  };
  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    try {
      const filePath = extractFilePath(reportToDelete.file_url);

      // Delete the file from storage
      const {
        error: storageError
      } = await supabase.storage.from("health-reports").remove([filePath]);
      if (storageError) throw storageError;

      // Delete associated markers
      const {
        error: markersError
      } = await supabase.from("extracted_markers").delete().eq("report_id", reportToDelete.id);
      if (markersError) throw markersError;

      // Delete the report record
      const {
        error: reportError
      } = await supabase.from("reports").delete().eq("id", reportToDelete.id);
      if (reportError) throw reportError;
      
      toast.success("Report deleted successfully");
      await loadReports();
      setReportToDelete(null);
      
      // Check if there are remaining reports to trigger regeneration
      const { data: remainingReports } = await supabase
        .from("reports")
        .select("id")
        .eq("user_id", user.id);
      
      if (remainingReports && remainingReports.length > 0) {
        toast.info("Regenerating analysis with remaining reports...");
        
        // Trigger new analysis (this will cancel any existing one)
        setTimeout(async () => {
          try {
            await supabase.functions.invoke("analyze-health-report", {
              body: { reportId: remainingReports[0].id },
            });
            navigate("/insights");
          } catch (error) {
            console.error("Failed to regenerate analysis:", error);
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report. Please try again.");
    }
  };
  useEffect(() => {
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        fetchUserProfile(session.user.id);
      }
    });
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });
    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  // Load reports when user is available
  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Report extraction updated:', payload);
          loadReports();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_insights',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Analysis insight updated:', payload);
          // Fetch fresh reports for THIS user instead of using stale closure state
          const { data: freshReports } = await supabase
            .from("reports")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          
          if (freshReports && freshReports.length > 0) {
            loadAnalysisStatus(freshReports);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  const fetchUserProfile = async (userId: string) => {
    const {
      data,
      error
    } = await supabase.from("profiles").select("full_name").eq("id", userId).single();
    if (!error && data) {
      setUserProfile(data);
    }
  };
  const loadReports = async () => {
    if (!user) return;
    
    const {
      data,
      error
    } = await supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    });
    if (error) {
      toast.error("Failed to load reports");
    } else {
      setReports(data || []);
      
      // Load analysis status after reports are loaded
      if (data && data.length > 0) {
        loadAnalysisStatus(data);
      }
    }
  };

  const loadAnalysisStatus = async (currentReports: any[]) => {
    if (!user) return;
    
    const { data: insight } = await supabase
      .from("health_insights")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setLatestInsight(insight);
    
    // Treat null/undefined extraction_status as complete (legacy reports)
    // Only block on explicitly pending/extracting/error states
    const allExtracted = currentReports.every(r => 
      !r.extraction_status || 
      r.extraction_status === 'complete' || 
      r.extraction_status === 'success'
    );
    setExtractionComplete(allExtracted);
  };

  const handleRetryExtraction = async (reportId: string) => {
    navigate("/progress");
  };

  const handleRetryAnalysis = async () => {
    // Delete failed insight
    if (!user) return;
    
    await supabase
      .from("health_insights")
      .delete()
      .eq("user_id", user.id)
      .like("analysis_data->>status", "error");
    
    toast.info("Retrying analysis...");
    navigate("/progress");
  };

  // Handle error state from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "analysis_failed") {
      toast.error("Analysis failed. Please retry from the dashboard.");
    } else if (params.get("error") === "extraction_failed") {
      toast.error("Report extraction failed. You can retry individual reports.");
    }
  }, [location.search]);

  const handleRegenerateAnalysis = async () => {
    if (!user || !reports.length) return;
    
    try {
      toast.info("Starting comprehensive analysis across all reports...");
      
      const { data, error } = await supabase.functions.invoke("analyze-health-report", {
        body: { reportId: reports[0].id },
      });
      
      if (error) throw error;
      
      toast.success("Analysis started! Redirecting to insights...");
      setTimeout(() => navigate("/insights"), 2000);
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error("Failed to start analysis. Please try again.");
    }
  };

  const getExtractionStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'extracting':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Extracting...
        </Badge>;
      case 'complete':
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ready
        </Badge>;
      case 'error':
        return <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>;
      default:
        return null;
    }
  };

  const getAnalysisStatusBadge = () => {
    if (!extractionComplete) {
      const extractingCount = reports.filter(r => 
        r.extraction_status !== 'complete' && r.extraction_status !== 'success'
      ).length;
      
      if (extractingCount > 0) {
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processing {extractingCount} report{extractingCount > 1 ? 's' : ''}...
        </Badge>;
      }
    }
    
    if (!latestInsight) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400">
        <AlertCircle className="w-3 h-3 mr-1" />
        Analysis Pending
      </Badge>;
    }
    
    const status = latestInsight.analysis_data?.status;
    
    if (status === "processing") {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Analyzing All Reports...
      </Badge>;
    }
    
    if (status === "cancelled") {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400">
        <AlertCircle className="w-3 h-3 mr-1" />
        Restarting Analysis...
      </Badge>;
    }
    
    if (status === "error") {
      return <Badge variant="destructive">
        <AlertCircle className="w-3 h-3 mr-1" />
        Analysis Failed
      </Badge>;
    }
    
    if (status === "complete") {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Insights Ready
      </Badge>;
    }
    
    return null;
  };
  const handleSignOut = async () => {
    try {
      const {
        error
      } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }
  return <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card shadow-card flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold">Chirayu AI</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/questionnaire")}>
              <ClipboardList className="w-4 h-4 mr-2" />
              Medical History
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span>{userProfile?.full_name || user?.email || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-6 mt-8">
                <div className="px-3 py-2 border-b">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{userProfile?.full_name || 'User'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <Button variant="ghost" className="justify-start" onClick={() => navigate("/questionnaire")}>
                  <ClipboardList className="w-4 h-4 mr-3" />
                  Medical History
                </Button>
                <Button variant="ghost" className="justify-start text-destructive hover:text-destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content with Chat */}
      {isMobile ? (
        <>
          <main className="flex-1 overflow-y-auto pb-20">
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
              <div className="max-w-4xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8 sm:mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3">Welcome back!</h2>
                  <p className="text-lg sm:text-xl text-muted-foreground">
                    Let's understand your health story together
                  </p>
                </div>

                {/* Health Reports - Moved to Top */}
                {reports.length > 0 && <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-semibold">Your Health Reports</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {reports.length} report{reports.length !== 1 ? 's' : ''} uploaded
                        </p>
                      </div>
                       <div className="flex gap-2">
                         {extractionComplete && latestInsight?.analysis_data?.status === "error" && (
                           <Button variant="outline" size="sm" onClick={handleRetryAnalysis}>
                             <Activity className="w-4 h-4 mr-2" />
                             Retry Analysis
                           </Button>
                         )}
                         <Button variant="outline" size="sm" onClick={() => navigate("/upload")}>
                           <Upload className="w-4 h-4 mr-2" />
                           Upload More
                         </Button>
                       </div>
                    </div>
                    <div className="space-y-4">
                      {reports.map(report => <Card key={report.id} className="p-6 hover:shadow-card transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold truncate">
                                    {report.file_name.split('/').pop()?.replace(/^\d+\.\d+\./, '') || report.file_name}
                                  </h4>
                                  {getExtractionStatusBadge(report.extraction_status)}
                                </div>
                                 <p className="text-sm text-muted-foreground">
                                   {report.report_date ? `Report Date: ${new Date(report.report_date).toLocaleDateString()}` : `Uploaded ${new Date(report.created_at).toLocaleDateString()}`}
                                 </p>
                               </div>
                             </div>
                             <div className="flex items-center gap-2 flex-shrink-0">
                               {report.extraction_status === 'failed' && (
                                 <Button variant="outline" size="sm" onClick={() => handleRetryExtraction(report.id)}>
                                   Retry
                                 </Button>
                               )}
                               <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                                 View
                               </Button>
                               <Button variant="destructive" size="sm" onClick={() => setReportToDelete(report)}>
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                             </div>
                          </div>
                        </Card>)}
                    </div>
                  </div>}

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <Card className="p-8 hover:shadow-elevated transition-shadow cursor-pointer group" onClick={() => navigate("/upload")}>
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                        <Upload className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      Upload Reports
                    </h3>
                    <p className="text-muted-foreground">
                      Upload multiple blood reports to track trends over time and get more accurate insights
                    </p>
                    <div className="mt-4 flex items-center text-primary font-medium">
                      Get Started
                      <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                    </div>
                  </Card>

                  <Card className="p-8 hover:shadow-elevated transition-shadow cursor-pointer group" onClick={() => {
                    if (reports.length === 0) {
                      toast.error("Please upload a report first");
                    } else if (!extractionComplete) {
                      toast.error("Please wait for report extraction to complete");
                    } else if (!latestInsight || latestInsight.analysis_data?.status !== "complete") {
                      toast.error("Please wait for analysis to complete");
                    } else {
                      navigate("/insights");
                    }
                  }}>
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success to-accent flex items-center justify-center mb-4">
                        <BarChart3 className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      View Insights
                    </h3>
                    <p className="text-muted-foreground">
                      Review your health analysis and get personalized recommendations
                    </p>
                    <div className="mt-4 flex items-center text-primary font-medium">
                      View Dashboard
                      <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                    </div>
                  </Card>

                  <Card className="p-8 hover:shadow-elevated transition-shadow cursor-pointer group" onClick={() => navigate("/questionnaire")}>
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-4">
                        <ClipboardList className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      Medical History
                    </h3>
                    <p className="text-muted-foreground">
                      Fill or update your lifestyle and health information for better insights
                    </p>
                    <div className="mt-4 flex items-center text-primary font-medium">
                      Fill Form
                      <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                    </div>
                  </Card>

                  <Card className="p-8 hover:shadow-elevated transition-shadow relative overflow-hidden group opacity-75">
                    <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 text-white text-xs font-semibold rounded-full">
                      Coming Soon
                    </div>
                    <div className="mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-primary flex items-center justify-center mb-4">
                        <Watch className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">
                      Connect Wearables
                    </h3>
                    <p className="text-muted-foreground">
                      Sync your fitness tracker and smartwatch data for comprehensive health tracking and deeper insights
                    </p>
                    <div className="mt-4 flex items-center text-muted-foreground font-medium">
                      Available Soon
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>

          {/* Floating Chat Button */}
          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3),0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-110 backdrop-blur-sm border-2 border-white/20 z-50"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
                  boxShadow: '0 0 0 0 hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.3), 0 10px 30px rgba(0,0,0,0.2)',
                  filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.5))',
                }}
              >
                <Activity className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0">
              <HealthChat />
            </SheetContent>
          </Sheet>
        </>
      ) : <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={60} minSize={30} maxSize={75}>
            <main className="h-full overflow-y-auto">
              <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
                <div className="max-w-full">
                  {/* Welcome Section */}
                  <div className="mb-8 lg:mb-12">
                    <h2 className="text-2xl lg:text-4xl font-bold mb-3">Welcome back!</h2>
                    <p className="text-base lg:text-xl text-muted-foreground">
                      Let's understand your health story together
                    </p>
                  </div>

                  {/* Health Reports - Moved to Top */}
                  {reports.length > 0 && <div className="mb-8 lg:mb-12">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-semibold">Your Health Reports</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {reports.length} report{reports.length !== 1 ? 's' : ''} uploaded
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {extractionComplete && latestInsight?.analysis_data?.status === "error" && (
                            <Button variant="outline" onClick={handleRegenerateAnalysis}>
                              <Activity className="w-4 h-4 mr-2" />
                              Retry Analysis
                            </Button>
                          )}
                          <Button variant="outline" onClick={() => navigate("/upload")}>
                            <UploadIcon className="w-4 h-4 mr-2" />
                            Upload More Reports
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {reports.map(report => <Card key={report.id} className="p-6 hover:shadow-card transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h4 className="font-semibold truncate">
                                      {report.original_filename || report.file_name.split('/').pop()?.replace(/^\d+\.\d+\./, '') || report.file_name}
                                    </h4>
                                    {getExtractionStatusBadge(report.extraction_status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {report.report_date ? `Report Date: ${new Date(report.report_date).toLocaleDateString()}` : `Uploaded ${new Date(report.created_at).toLocaleDateString()}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                                  View
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setReportToDelete(report)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>)}
                      </div>
                    </div>}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12">
                    <Card className="p-6 lg:p-8 hover:shadow-elevated transition-shadow cursor-pointer group" onClick={() => navigate("/upload")}>
                      <div className="mb-4">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {reports.length > 0 ? "Upload More Reports" : "Upload Reports"}
                      </h3>
                      <p className="text-muted-foreground">
                        {reports.length > 0 ? "Add another blood report to track your health trends over time. More reports = more accurate analysis!" : "Upload multiple blood reports (one at a time) to track health trends over time. More reports = more accurate analysis and better recommendations!"}
                      </p>
                      <div className="mt-4 flex items-center text-primary font-medium">
                        Get Started
                        <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                      </div>
                    </Card>

                    <Card className="p-6 lg:p-8 hover:shadow-elevated transition-shadow cursor-pointer group" onClick={() => {
                      if (reports.length === 0) {
                        toast.error("Please upload a report first");
                      } else if (!extractionComplete) {
                        toast.error("Please wait for report extraction to complete");
                      } else if (!latestInsight || latestInsight.analysis_data?.status !== "complete") {
                        toast.error("Please wait for analysis to complete");
                      } else {
                        navigate("/insights");
                      }
                    }}>
                      <div className="mb-4">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-success to-accent flex items-center justify-center mb-4">
                          <BarChart3 className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">Your Health Status and Action Plan</h3>
                      <p className="text-muted-foreground">Review your health analysis and see personalized recommendations</p>
                      <div className="mt-4 flex items-center text-primary font-medium">
                        View Health Dashboard
                        <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                      </div>
                    </Card>

                    <Card className="p-6 lg:p-8 hover:shadow-elevated transition-shadow cursor-pointer group" onClick={() => navigate("/questionnaire")}>
                      <div className="mb-4">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-4">
                          <ClipboardList className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        Medical History
                      </h3>
                      <p className="text-muted-foreground">
                        Fill or update your lifestyle and health information for better insights
                      </p>
                      <div className="mt-4 flex items-center text-primary font-medium">
                        Fill Form
                        <span className="ml-2 group-hover:ml-4 transition-all">→</span>
                      </div>
                    </Card>

                    <Card className="p-6 lg:p-8 hover:shadow-elevated transition-shadow relative overflow-hidden group opacity-75">
                      <div className="absolute top-4 right-4 px-3 py-1 bg-accent/90 text-white text-xs font-semibold rounded-full">
                        Coming Soon
                      </div>
                      <div className="mb-4">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-warning to-primary flex items-center justify-center mb-4">
                          <Watch className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-semibold mb-2">
                        Connect Wearables
                      </h3>
                      <p className="text-muted-foreground">
                        Sync your fitness tracker and smartwatch data for comprehensive health tracking and deeper insights
                      </p>
                      <div className="mt-4 flex items-center text-muted-foreground font-medium">
                        Available Soon
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={25} maxSize={70}>
            <HealthChat />
          </ResizablePanel>
        </ResizablePanelGroup>}

      <AlertDialog open={!!reportToDelete} onOpenChange={open => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Health Report?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete this report? This action will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Permanently delete the report file</li>
                <li>Remove all extracted health markers from this report</li>
                <li>Trigger a new health analysis based on your remaining reports</li>
                <li>Update your health insights and action plans accordingly</li>
              </ul>
              <p className="font-semibold text-destructive mt-3">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport} className="bg-destructive hover:bg-destructive/90">
              Delete Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Dashboard;