import { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Printer, MessageCircle, Activity, Brain, Target, Clock, Pill, AlertCircle, ArrowLeft, ClipboardList } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { MarkerCards } from "@/components/MarkerCards";
import { SupplementCards } from "@/components/SupplementCards";
import { ThreeMonthPlanCards } from "@/components/ThreeMonthPlanCards";
import { InsightSummaryCard } from "@/components/InsightSummaryCard";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import HealthChat from "@/components/HealthChat";
import { generateSupplementsTable, generateThreeMonthPlanTable } from "@/utils/reportHtmlGenerator";
import { Card } from "@/components/ui/card";

interface InsightsContentProps {
  insight: any;
  contentRef: RefObject<HTMLDivElement>;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  selectedSection: string | null;
  setSelectedSection: (section: string | null) => void;
  recentlyUpdated: string[];
  updatingSections: string[];
  updateInProgress: boolean;
  onDownloadPDF: () => void;
}

export const InsightsContent = ({
  insight,
  contentRef,
  chatOpen,
  setChatOpen,
  selectedSection,
  setSelectedSection,
  recentlyUpdated,
  updatingSections,
  updateInProgress,
  onDownloadPDF,
}: InsightsContentProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const analysisData = insight.analysis_data;
  const {
    markersData = [],
    markersTableHtml = "",
    triangulationHtml = "",
    riskAssessmentHtml = "",
    actionPlanHtml = "",
    supplementsData = [],
    supplementsTableHtml = "",
    threeMonthPlanData = [],
    threeMonthPlanHtml = "",
    professionalhelp = "",
  } = analysisData;

  const sectionCards = [
    {
      id: 'markers',
      icon: Activity,
      title: 'All Markers',
      description: 'View comprehensive blood test results with reference ranges and status indicators',
      gradientFrom: 'from-primary',
      gradientTo: 'to-accent',
      content: () => (
        <div>
          {markersData?.length > 0 ? (
            <MarkerCards data={markersData} isMobile={isMobile} />
          ) : markersTableHtml ? (
            isMobile ? (
              <ResponsiveTable htmlContent={markersTableHtml} />
            ) : (
              <div className="prose prose-gray max-w-none dark:prose-invert overflow-x-auto" dangerouslySetInnerHTML={{ __html: markersTableHtml }} />
            )
          ) : (
            <p className="text-muted-foreground">No marker data available</p>
          )}
        </div>
      ),
    },
    {
      id: 'symptoms',
      icon: AlertCircle,
      title: 'Potential Symptoms',
      description: 'Understand health symptoms based on your test results and marker correlations',
      gradientFrom: 'from-warning',
      gradientTo: 'to-primary',
      content: () => triangulationHtml ? (
        <div className="insight-content" dangerouslySetInnerHTML={{ __html: triangulationHtml }} />
      ) : null,
    },
    {
      id: 'risks',
      icon: Brain,
      title: 'Root Cause Analysis',
      description: 'Discover underlying health issues and risk factors identified in your analysis',
      gradientFrom: 'from-accent',
      gradientTo: 'to-secondary',
      content: () => riskAssessmentHtml ? (
        <div className="insight-content" dangerouslySetInnerHTML={{ __html: riskAssessmentHtml }} />
      ) : null,
    },
    {
      id: 'supplements',
      icon: Pill,
      title: 'Supplements',
      description: 'Personalized supplement recommendations with dosage, timing, and scientific rationale',
      gradientFrom: 'from-success',
      gradientTo: 'to-accent',
      content: () => (
        <div>
          {isMobile ? (
            supplementsData?.length > 0 ? (
              <SupplementCards data={supplementsData} />
            ) : supplementsTableHtml ? (
              <ResponsiveTable htmlContent={supplementsTableHtml} />
            ) : (
              <p className="text-muted-foreground">No supplement recommendations available</p>
            )
          ) : (
            supplementsTableHtml ? (
              <div className="prose prose-gray max-w-none dark:prose-invert overflow-x-auto" dangerouslySetInnerHTML={{ __html: supplementsTableHtml }} />
            ) : supplementsData?.length > 0 ? (
              <div className="prose prose-gray max-w-none dark:prose-invert overflow-x-auto" dangerouslySetInnerHTML={{ __html: generateSupplementsTable(supplementsData) }} />
            ) : (
              <p className="text-muted-foreground">No supplement recommendations available</p>
            )
          )}
        </div>
      ),
    },
    {
      id: 'action-plan',
      icon: Target,
      title: 'Action Plan',
      description: 'Immediate lifestyle changes and nutrition guidance for optimal health',
      gradientFrom: 'from-primary',
      gradientTo: 'to-success',
      content: () => actionPlanHtml ? (
        <div className="insight-content" dangerouslySetInnerHTML={{ __html: actionPlanHtml }} />
      ) : null,
    },
    {
      id: '3-month-plan',
      icon: Clock,
      title: '3-Month Plan',
      description: 'Structured 3-month roadmap for sustainable health improvement',
      gradientFrom: 'from-accent',
      gradientTo: 'to-warning',
      content: () => (
        <div>
          {isMobile ? (
            threeMonthPlanData?.length > 0 ? (
              <ThreeMonthPlanCards data={threeMonthPlanData} />
            ) : threeMonthPlanHtml ? (
              <ResponsiveTable htmlContent={threeMonthPlanHtml} />
            ) : (
              <p className="text-muted-foreground">No 3-month plan available</p>
            )
          ) : (
            threeMonthPlanHtml ? (
              <div className="prose prose-gray max-w-none dark:prose-invert overflow-x-auto" dangerouslySetInnerHTML={{ __html: threeMonthPlanHtml }} />
            ) : threeMonthPlanData?.length > 0 ? (
              <div className="prose prose-gray max-w-none dark:prose-invert overflow-x-auto" dangerouslySetInnerHTML={{ __html: generateThreeMonthPlanTable(threeMonthPlanData) }} />
            ) : (
              <p className="text-muted-foreground">No 3-month plan available</p>
            )
          )}
        </div>
      ),
    },
    {
      id: 'professional',
      icon: MessageCircle,
      title: 'Professional Advice',
      description: 'When to seek medical attention and which specialists to consult',
      gradientFrom: 'from-success',
      gradientTo: 'to-primary',
      content: () => professionalhelp ? (
        <div className="insight-content" dangerouslySetInnerHTML={{ __html: professionalhelp }} />
      ) : null,
    },
  ].filter(card => card.content() !== null);

  const NavButtons = () => (
    <div className="flex items-center gap-2">
      <Button onClick={() => navigate("/questionnaire")} variant="outline" size="sm" className="gap-2">
        <ClipboardList className="w-4 h-4" />
        <span className="hidden sm:inline">Medical History</span>
      </Button>
      <Button onClick={onDownloadPDF} variant="outline" size="sm" className="gap-2">
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print</span>
      </Button>
    </div>
  );

  if (isMobile) {
    if (selectedSection) {
      const selectedCard = sectionCards.find(c => c.id === selectedSection);
      if (!selectedCard) return null;

      return (
        <>
          <div className="flex-1 h-full overflow-y-auto pb-20">
            <div ref={contentRef} className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <Button onClick={() => setSelectedSection(null)} variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <NavButtons />
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedCard.gradientFrom} ${selectedCard.gradientTo} flex items-center justify-center`}>
                    <selectedCard.icon className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold">{selectedCard.title}</h1>
                </div>
                <p className="text-muted-foreground">{selectedCard.description}</p>
              </div>

              <div className="space-y-4">
                {selectedCard.content()}
              </div>
            </div>
          </div>
          <FloatingChatButton onClick={() => setChatOpen(true)} />
          <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <SheetContent side="bottom" className="h-[85vh] p-0">
              <HealthChat onClose={() => setChatOpen(false)} />
            </SheetContent>
          </Sheet>
        </>
      );
    }

    return (
      <>
        <div className="flex-1 h-full overflow-y-auto pb-20">
          <div ref={contentRef} className="container mx-auto px-4 py-8 max-w-7xl relative">
            <div className="flex items-center justify-between mb-8">
              <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
              <NavButtons />
            </div>

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Your Health Insights
              </h1>
              <p className="text-lg text-muted-foreground">AI-powered analysis of your health data</p>
            </div>

            <div className="space-y-4">
              {sectionCards.map((card) => (
                <InsightSummaryCard
                  key={card.id}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  gradientFrom={card.gradientFrom}
                  gradientTo={card.gradientTo}
                  onClick={() => setSelectedSection(card.id)}
                  isRecentlyUpdated={recentlyUpdated.includes(card.id)}
                  isUpdating={updatingSections.includes(card.id)}
                />
              ))}
            </div>
          </div>
        </div>
        <FloatingChatButton onClick={() => setChatOpen(true)} />
        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetContent side="bottom" className="h-[85vh] p-0">
            <HealthChat onClose={() => setChatOpen(false)} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  if (selectedSection) {
    const selectedCard = sectionCards.find(c => c.id === selectedSection);
    if (!selectedCard) return null;

    return (
      <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="h-full overflow-y-auto">
            <div ref={contentRef} className="container mx-auto px-6 py-8 max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <Button onClick={() => setSelectedSection(null)} variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Sections
                </Button>
                <NavButtons />
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCard.gradientFrom} ${selectedCard.gradientTo} flex items-center justify-center`}>
                    <selectedCard.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{selectedCard.title}</h1>
                    <p className="text-muted-foreground">{selectedCard.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {selectedCard.content()}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />

        <ResizablePanel defaultSize={35} minSize={30} maxSize={50}>
          <div className="h-full bg-muted/30">
            <HealthChat />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
      <ResizablePanel defaultSize={65} minSize={40}>
        <div className="h-full overflow-y-auto">
          <div ref={contentRef} className="container mx-auto px-6 py-8 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
              <NavButtons />
            </div>

            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Your Health Insights
              </h1>
              <p className="text-lg text-muted-foreground">AI-powered analysis of your health data</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sectionCards.map((card) => (
                <InsightSummaryCard
                  key={card.id}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  gradientFrom={card.gradientFrom}
                  gradientTo={card.gradientTo}
                  onClick={() => setSelectedSection(card.id)}
                  isRecentlyUpdated={recentlyUpdated.includes(card.id)}
                  isUpdating={updatingSections.includes(card.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />

      <ResizablePanel defaultSize={35} minSize={30} maxSize={50}>
        <div className="h-full bg-muted/30">
          <HealthChat />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
