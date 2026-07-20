import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload as UploadIcon, ArrowLeft, FileText, AlertCircle, ClipboardList, Menu, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Upload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Filter only PDFs
    const pdfFiles = selectedFiles.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length !== selectedFiles.length) {
      toast.error("Please upload PDF files only");
      return;
    }

    // Check total limit
    if (files.length + pdfFiles.length > 1) {
      toast.error("Only 1 file allowed");
      return;
    }

    // Check file sizes
    const maxSizeMB = 8;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = pdfFiles.filter((f) => f.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      const fileSizeMB = (oversizedFiles[0].size / 1024 / 1024).toFixed(2);
      toast.error(
        `${oversizedFiles[0].name} (${fileSizeMB}MB) exceeds ${maxSizeMB}MB limit. Please compress your PDF.`,
        {
          duration: 5000,
        },
      );
      return;
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
    toast.success(`${pdfFiles.length} file(s) selected`);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const uploadFile = async (file: File, isBaseline: boolean) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) throw new Error("Not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${session.session.user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("health-reports").upload(filePath, file);

    if (uploadError) throw uploadError;

    const { error: dbError } = await supabase.from("reports").insert({
      user_id: session.session.user.id,
      file_name: filePath,
      file_url: filePath, // Store just the path, not the public URL
      original_filename: file.name, // Store the original filename
      is_baseline: isBaseline,
      report_date: new Date().toISOString().split("T")[0],
    });

    if (dbError) throw dbError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please upload at least one health report");
      return;
    }

    setUploading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error("Not authenticated");

      // Only delete reports with failed extraction
      const { data: failedReports } = await supabase
        .from("reports")
        .select("id, file_name")
        .eq("user_id", session.session.user.id)
        .eq("extraction_status", "failed");

      if (failedReports && failedReports.length > 0) {
        // Delete files from storage
        const filePaths = failedReports.map((r) => r.file_name);
        await supabase.storage.from("health-reports").remove(filePaths);

        // Delete records from reports table (this will cascade delete extracted_markers)
        const failedIds = failedReports.map((r) => r.id);
        await supabase.from("reports").delete().in("id", failedIds);

        toast.success(`Removed ${failedReports.length} failed report(s)`);
      }

      // Delete any error insights to allow fresh analysis
      await supabase
        .from("health_insights")
        .delete()
        .eq("user_id", session.session.user.id)
        .like("analysis_data->>status", "error");

      // Upload all files
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], false);
      }

      toast.success(`${files.length} report(s) uploaded successfully!`);

      // Always navigate to progress page to show extraction and analysis status
      navigate("/progress");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 w-full">
            <Button variant="ghost" onClick={() => navigate("/dashboard", { state: { fromUpload: true } })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/questionnaire")}>
              <ClipboardList className="w-4 h-4 mr-2" />
              Medical History
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between w-full">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard", { state: { fromUpload: true } })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Button variant="outline" onClick={() => navigate("/questionnaire")} className="w-full justify-start">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Medical History
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Upload Health Reports</h1>
            <p className="text-xl text-muted-foreground">
              Upload your blood test reports to begin your personalized health analysis
            </p>
          </div>

          {/* Info Card - Benefits of Multiple Reports */}
          <Card className="p-6 bg-primary/5 border-primary/20 mb-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">📈 Upload Multiple Reports for Better Analysis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  You can upload multiple blood test reports (one at a time). The more historical data you provide, the
                  better we can track your health trends, identify patterns, and provide more accurate personalized
                  recommendations.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-elevated mb-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Health Report Upload */}
              <div>
                <Label className="text-lg font-semibold mb-4 block">
                  Health Report <span className="text-destructive">*</span>
                </Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="health-report"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={files.length >= 1}
                  />
                  <label htmlFor="health-report" className="flex flex-col items-center cursor-pointer">
                    {files.length > 0 ? (
                      <div className="w-full space-y-3">
                        {files.map((f, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-success" />
                              <div>
                                <p className="font-medium">{f.name}</p>
                                <p className="text-sm text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <UploadIcon className="w-12 h-12 text-muted-foreground mb-3" />
                        <p className="text-lg font-medium mb-1">Click to upload your health report</p>
                        <p className="text-sm text-muted-foreground">PDF format, max 8MB</p>
                        <p className="text-xs text-muted-foreground mt-1">For optimal processing performance</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Privacy Notice */}
              <Card className="p-4 bg-secondary border-none">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Your Privacy Matters</p>
                    <p className="text-muted-foreground">We never share your data with third parties.</p>
                  </div>
                </div>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={uploading || files.length === 0}>
                {uploading ? "Uploading..." : "Extract markers and analyse"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
      
      {/* Floating Chat Button - Hidden on Desktop as it has sidebar */}
      <div className="md:hidden">
        <Button
          onClick={() => window.location.href = "/dashboard"}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated hover:shadow-2xl transition-all z-50"
        >
          <Activity className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Upload;
