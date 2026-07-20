import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSelectedText } from "@/contexts/SelectedTextContext";
import { useHealthInsights } from "@/hooks/useHealthInsights";
import { useTextSelectionHandler } from "@/hooks/useTextSelection";
import { AnalysisProgressView } from "@/components/insights/AnalysisProgressView";
import { AnalysisErrorView } from "@/components/insights/AnalysisErrorView";
import { InsightsContent } from "@/components/insights/InsightsContent";
import { generateMarkersTable, generateSupplementsTable, generateThreeMonthPlanTable } from "@/utils/reportHtmlGenerator";

export default function Insights() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { setSelectedText, triggerExplain } = useSelectedText();
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    user,
    loading,
    analyzing,
    insight,
    progress,
    showDelayMessage,
    progressStage,
    progressDetails,
    recentlyUpdated,
    updateInProgress,
    updatingSections,
    generateAnalysis,
  } = useHealthInsights();

  const { showTooltip, tooltipPosition, hideTooltip } = useTextSelectionHandler(
    contentRef,
    setSelectedText
  );

  const handleExplainClick = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text) {
      const formattedMessage = `[Selected from Analysis]\n"${text}"\n\nExplain this`;
      triggerExplain(formattedMessage);
      hideTooltip();
      window.getSelection()?.removeAllRanges();
    }
  };

  const downloadPDF = async () => {
    if (!insight) return;

    try {
      toast({ title: "Preparing report...", description: "Opening print dialog" });

      const analysisData = insight.analysis_data;
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        toast({
          title: "Error",
          description: "Please allow pop-ups to download the report",
          variant: "destructive",
        });
        return;
      }

      const markersHtml = analysisData.markersTableHtml || generateMarkersTable(analysisData.markersData);
      const supplementsHtml = analysisData.supplementsTableHtml || generateSupplementsTable(analysisData.supplementsData);
      const threeMonthPlanHtml = analysisData.threeMonthPlanHtml || generateThreeMonthPlanTable(analysisData.threeMonthPlanData);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Health Analysis Report</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1, h2, h3 { color: #2c3e50; margin-top: 20px; }
              table { border-collapse: collapse; width: 100%; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .section { margin-bottom: 30px; page-break-inside: avoid; }
              @media print { body { margin: 0; padding: 15px; } .section { page-break-inside: avoid; } }
            </style>
          </head>
          <body>
            <h1>Health Analysis Report</h1>
            <p><em>Generated on ${new Date().toLocaleDateString()}</em></p>
            ${markersHtml ? `<div class="section"><h2>Health Markers</h2>${markersHtml}</div>` : ""}
            ${analysisData.triangulationHtml ? `<div class="section"><h2>Analysis Summary</h2>${analysisData.triangulationHtml}</div>` : ""}
            ${analysisData.riskAssessmentHtml ? `<div class="section"><h2>Risk Assessment</h2>${analysisData.riskAssessmentHtml}</div>` : ""}
            ${analysisData.professionalhelp ? `<div class="section"><h2>Professional Recommendations</h2>${analysisData.professionalhelp}</div>` : ""}
            ${analysisData.actionPlanHtml ? `<div class="section"><h2>Action Plan</h2>${analysisData.actionPlanHtml}</div>` : ""}
            ${supplementsHtml ? `<div class="section"><h2>Recommended Supplements</h2>${supplementsHtml}</div>` : ""}
            ${threeMonthPlanHtml ? `<div class="section"><h2>3-Month Plan</h2>${threeMonthPlanHtml}</div>` : ""}
            <p style="margin-top: 40px; font-size: 12px; color: #666;">
              <strong>Disclaimer:</strong> This analysis is for educational purposes only and should not replace professional medical advice.
            </p>
          </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    } catch (error: any) {
      console.error("Print error:", error);
      toast({ title: "Error", description: "Failed to prepare report for printing", variant: "destructive" });
    }
  };

  const status = insight?.analysis_data?.status;

  if (status === "processing" || (loading && !insight)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
        <AnalysisProgressView
          progress={progress}
          progressStage={progressStage}
          progressDetails={progressDetails}
          showDelayMessage={showDelayMessage}
        />
      </div>
    );
  }

  const isStuckProcessing =
    insight?.analysis_data?.status === "processing" &&
    insight?.created_at &&
    Date.now() - new Date(insight.created_at).getTime() > 10 * 60 * 1000;

  if (insight?.analysis_data?.status === "error" || isStuckProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <AnalysisErrorView
          onRetry={() => user && generateAnalysis(user.id)}
          onNavigateHome={() => navigate("/dashboard")}
          onNavigateUpload={() => navigate("/upload")}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background to-muted flex flex-col overflow-hidden">
      <InsightsContent
        insight={insight}
        contentRef={contentRef}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        recentlyUpdated={recentlyUpdated}
        updatingSections={updatingSections}
        updateInProgress={updateInProgress}
        onDownloadPDF={downloadPDF}
      />

      {showTooltip &&
        createPortal(
          <div
            className="fixed z-50 animate-in fade-in-0 zoom-in-95"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <Button
              onClick={handleExplainClick}
              size="sm"
              className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              💡 Explain this
            </Button>
          </div>,
          document.body
        )}
    </div>
  );
}
