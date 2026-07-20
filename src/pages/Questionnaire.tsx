import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Activity, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Questionnaire = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    location: "",
    dietType: "",
    alcoholGlasses: "",
    cigarettes: "",
    exerciseTimes: "",
    sleepHours: "",
    sleepTimeRange: "",
    familyHistory: "",
    symptoms: "",
    currentMedications: "",
    stressLevel: "",
    waterIntake: ""
  });

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("questionnaire_responses")
        .select("*")
        .eq("user_id", session.session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsUpdate(true);
        setFormData({
          age: data.age?.toString() || "",
          gender: data.gender || "",
          location: data.location || "",
          dietType: data.diet_type || "",
          alcoholGlasses: data.alcohol_glasses_per_month?.toString() || "",
          cigarettes: data.cigarettes_per_day?.toString() || "",
          exerciseTimes: data.exercise_times_per_week?.toString() || "",
          sleepHours: data.sleep_hours?.toString() || "",
          sleepTimeRange: data.sleep_time_range || "",
          familyHistory: (data.family_history as any)?.conditions || "",
          symptoms: data.symptoms || "",
          currentMedications: data.mental_health || "",
          stressLevel: data.stress_level || "",
          waterIntake: data.food_habits?.replace("Water intake: ", "").replace(" glasses/day", "") || ""
        });
      }
    } catch (error: any) {
      console.error("Error loading questionnaire:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error("Not authenticated");

      const dataToSubmit = {
        user_id: session.session.user.id,
        age: parseInt(formData.age) || null,
        gender: formData.gender || null,
        location: formData.location || null,
        diet_type: formData.dietType || null,
        alcohol_glasses_per_month: parseInt(formData.alcoholGlasses) || 0,
        cigarettes_per_day: parseInt(formData.cigarettes) || 0,
        exercise_times_per_week: parseInt(formData.exerciseTimes) || null,
        sleep_hours: parseFloat(formData.sleepHours) || null,
        sleep_time_range: formData.sleepTimeRange || null,
        family_history: { conditions: formData.familyHistory },
        symptoms: formData.symptoms || null,
        mental_health: formData.currentMedications || null,
        stress_level: formData.stressLevel || null,
        food_habits: `Water intake: ${formData.waterIntake} glasses/day`
      };

      const { error } = await supabase
        .from("questionnaire_responses")
        .upsert(dataToSubmit, { onConflict: "user_id" });

      if (error) throw error;

      // If updating, trigger re-analysis with new questionnaire data
      if (isUpdate) {
        toast.success("Medical history updated! Regenerating insights...");
        
        // Get existing insights to archive
        const { data: existingInsights } = await supabase
          .from("health_insights")
          .select("*")
          .eq("user_id", session.session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // If there are existing insights, archive them before regenerating
        if (existingInsights) {
          await supabase
            .from("health_insights_history")
            .insert({
              insight_id: existingInsights.id,
              user_id: session.session.user.id,
              version: existingInsights.version || 1,
              analysis_data: existingInsights.analysis_data,
              updated_sections: ['questionnaire_update'],
              change_summary: {
                summary: "Medical history questionnaire was updated. Full analysis will be regenerated with new information."
              }
            });

          // Delete current insights to trigger regeneration
          await supabase
            .from("health_insights")
            .delete()
            .eq("user_id", session.session.user.id);
        }

        // Trigger re-analysis immediately (function uses authenticated user automatically)
        const { error: analysisError } = await supabase.functions.invoke("analyze-health-report");

        if (analysisError) {
          console.error("Analysis trigger error:", analysisError);
          toast.error("Failed to trigger re-analysis. Please refresh the insights page.");
        } else {
          toast.success("Analysis started! Check the Insights page in a moment.");
        }

        // Navigate to insights page to show progress
        navigate("/insights");
      } else {
        toast.success("Questionnaire submitted!");
        navigate("/insights");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit questionnaire");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-6 py-4">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Button variant="ghost" onClick={() => navigate("/dashboard", { state: { fromQuestionnaire: true } })}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard", { state: { fromQuestionnaire: true } })}>
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
                  <p className="text-sm text-muted-foreground">No additional actions available</p>
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
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold">{isUpdate ? "Update Medical History" : "Lifestyle Questionnaire"}</h1>
                <p className="text-muted-foreground">
                  {isUpdate ? "Update your lifestyle and health profile" : "Complete this once to personalize your health insights"}
                </p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Fill in the blanks to help us understand your lifestyle and health profile.
            </p>
          </div>

          <Card className="p-8 shadow-elevated">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Sentence */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  I am a{" "}
                  <input
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-16 px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent text-center outline-none transition-colors"
                    required
                  />
                  {" "}year old{" "}
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  >
                    <option value="">select</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="other">other</option>
                  </select>
                  {" "}from{" "}
                  <input
                    placeholder="Mumbai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-32 px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  />
                  .
                </p>
              </div>

              {/* Diet Sentence */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  I am a{" "}
                  <select
                    value={formData.dietType}
                    onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                    className="px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  >
                    <option value="">select</option>
                    <option value="vegetarian">vegetarian</option>
                    <option value="non-vegetarian">non-vegetarian</option>
                    <option value="vegan">vegan</option>
                    <option value="eggetarian">eggetarian</option>
                  </select>
                  .
                </p>
              </div>

              {/* Habits Sentence */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  I drink{" "}
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.alcoholGlasses}
                    onChange={(e) => setFormData({ ...formData, alcoholGlasses: e.target.value })}
                    className="w-16 px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent text-center outline-none transition-colors"
                    min="0"
                  />
                  {" "}glasses of alcohol in a month and smoke{" "}
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.cigarettes}
                    onChange={(e) => setFormData({ ...formData, cigarettes: e.target.value })}
                    className="w-16 px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent text-center outline-none transition-colors"
                    min="0"
                  />
                  {" "}cigarettes in a day.
                </p>
              </div>

              {/* Exercise Sentence */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  I exercise{" "}
                  <select
                    value={formData.exerciseTimes}
                    onChange={(e) => setFormData({ ...formData, exerciseTimes: e.target.value })}
                    className="px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  >
                    <option value="">select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7+</option>
                  </select>
                  {" "}times in a week.
                </p>
              </div>

              {/* Sleep Sentence */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  On average, I sleep{" "}
                  <select
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                    className="px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  >
                    <option value="">select</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10+</option>
                  </select>
                  {" "}hours each night. I usually go to bed around{" "}
                  <select
                    value={formData.sleepTimeRange}
                    onChange={(e) => setFormData({ ...formData, sleepTimeRange: e.target.value })}
                    className="px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  >
                    <option value="">select</option>
                    <option value="9pm">9 PM</option>
                    <option value="10pm">10 PM</option>
                    <option value="11pm">11 PM</option>
                    <option value="12am">12 AM</option>
                    <option value="1am">1 AM</option>
                    <option value="2am">2 AM</option>
                    <option value="irregular">Irregular</option>
                  </select>
                  .
                </p>
              </div>

              {/* Water Intake */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  I drink approximately{" "}
                  <select
                    value={formData.waterIntake}
                    onChange={(e) => setFormData({ ...formData, waterIntake: e.target.value })}
                    className="px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  >
                    <option value="">select</option>
                    <option value="1-2">1-2</option>
                    <option value="3-4">3-4</option>
                    <option value="5-6">5-6</option>
                    <option value="7-8">7-8</option>
                    <option value="9-10">9-10</option>
                    <option value="10+">10+</option>
                  </select>
                  {" "}glasses of water per day.
                </p>
              </div>

              {/* Stress Level */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  My stress level is generally{" "}
                  <select
                    value={formData.stressLevel}
                    onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value })}
                    className="px-2 py-0 border-0 border-b-2 border-muted-foreground/30 focus:border-primary bg-transparent outline-none transition-colors"
                    required
                  >
                    <option value="">select</option>
                    <option value="very-low">very low</option>
                    <option value="low">low</option>
                    <option value="moderate">moderate</option>
                    <option value="high">high</option>
                    <option value="very-high">very high</option>
                  </select>
                  .
                </p>
              </div>

              {/* Family History */}
              <div className="space-y-3">
                <Label htmlFor="family-history" className="text-lg font-semibold">Family Medical History</Label>
                <Textarea
                  id="family-history"
                  placeholder="e.g., Diabetes, High BP, Heart Disease, Cancer..."
                  value={formData.familyHistory}
                  onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Current Symptoms */}
              <div className="space-y-3">
                <Label htmlFor="symptoms" className="text-lg font-semibold">Current Symptoms or Health Concerns</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., Frequent headaches, back pain, fatigue..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Current Medications */}
              <div className="space-y-3">
                <Label htmlFor="medications" className="text-lg font-semibold">Current Medications or Supplements</Label>
                <Textarea
                  id="medications"
                  placeholder="e.g., Vitamin D, Multivitamin, Blood pressure medication..."
                  value={formData.currentMedications}
                  onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? (isUpdate ? "Updating..." : "Submitting...") : (isUpdate ? "Update Medical History" : "Complete Questionnaire")}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Questionnaire;