import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64 } from "https://deno.land/std@0.224.0/encoding/base64.ts";

// Declare EdgeRuntime global for background tasks
declare const EdgeRuntime: {
  waitUntil(promise: Promise<any>): void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Add shutdown handler to track function lifecycle
addEventListener("beforeunload", (ev: any) => {
  console.log("🛑 Function shutting down, reason:", ev.detail?.reason);
});

/**
 * Calls Gemini API with automatic fallback from flash to pro on failure
 */
async function callGeminiWithFallback(
  endpoint: "generateContent",
  requestBody: any,
  apiKey: string,
  timeoutMs: number = 240000,
  context: string = "API call",
): Promise<Response> {
  const models = ["gemini-2.5-pro", "gemini-2.5-flash"];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      console.log(`🔄 ${context}: Trying ${model}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      // If successful, return immediately
      if (response.ok) {
        console.log(`✅ ${context}: ${model} succeeded`);
        return response;
      }

      // Clone before reading body so we can still return the response if needed
      const responseClone = response.clone();
      const errorBody = await responseClone.text();
      console.warn(`⚠️ ${context}: ${model} failed with ${response.status}: ${errorBody.substring(0, 200)}`);
      lastError = new Error(`${model} failed: ${response.status}`);

      // If it's a rate limit (429), server overload (503), or server error (5xx), try next model
      if (response.status === 429 || response.status === 503 || response.status >= 500) {
        continue;
      }

      // For other errors (4xx), don't retry - return the original (unconsumed) response
      return response;
    } catch (error) {
      console.error(`❌ ${context}: ${model} threw error:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));

      // If timeout, try next model
      if (error instanceof Error && error.name === "AbortError") {
        console.log(`⏰ ${context}: ${model} timed out, trying next model...`);
        continue;
      }

      // For network errors, try next model
      continue;
    }
  }

  // All models failed
  throw lastError || new Error(`${context}: All models failed`);
}

// --- Main Server Function ---
serve(async (req) => {
  console.log("🚀 ANALYZE-HEALTH-REPORT v2.2 - SUPPLEMENTS TABLE ADDED - " + new Date().toISOString());

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Wrap everything in try-catch to ensure CORS headers on all responses
  try {
    // --- User Auth & Data Fetching ---
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { reportId } = body;

    // ========================================================================
    // --- DISTRIBUTED LOCK WITH CANCELLATION SUPPORT ---
    // ========================================================================
    const lockId = crypto.randomUUID();
    console.log(`🔒 Attempting to acquire lock with ID: ${lockId}`);

    // Check for existing lock first
    const { data: existingLock } = await supabaseClient
      .from("analysis_locks")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingLock) {
      const lockAge = Date.now() - new Date(existingLock.locked_at).getTime();
      const isStale = lockAge > 10 * 60 * 1000; // 10 minutes

      if (!isStale) {
        console.log("⚠️ Active analysis detected - cancelling it to start fresh");

        // Cancel existing analysis by marking insights as cancelled
        await supabaseClient
          .from("health_insights")
          .update({
            analysis_data: {
              status: "cancelled",
              message: "Analysis cancelled due to new request",
            },
          })
          .eq("user_id", user.id)
          .like("analysis_data->>status", "processing");

        console.log("✅ Previous analysis cancelled");
      } else {
        console.log("🔓 Stale lock detected (>10 minutes), will be overwritten");
      }
    }

    // Acquire or update lock
    const { data: lockAcquired, error: lockError } = await supabaseClient
      .from("analysis_locks")
      .upsert(
        {
          user_id: user.id,
          locked_at: new Date().toISOString(),
          function_instance_id: lockId,
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single();

    console.log("✅ Lock acquired successfully");

    // Get reports - either specific report or all user reports
    let report;
    let reportsError;

    if (reportId) {
      // Get the specific report that triggered this analysis
      const result = await supabaseClient.from("reports").select("*").eq("id", reportId).single();
      report = result.data;
      reportsError = result.error;
    } else {
      // Get the most recent report for full re-analysis (e.g., after questionnaire update)
      const result = await supabaseClient
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      report = result.data;
      reportsError = result.error;
    }
    if (reportsError) {
      console.error("Reports fetch error:", reportsError);
      return new Response(JSON.stringify({ error: "Failed to fetch reports" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get ALL reports for this user (for comprehensive analysis)
    const { data: allUserReports } = await supabaseClient
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const allReportIds = allUserReports?.map((r) => r.id) || [];
    console.log(`📋 Found ${allUserReports?.length || 0} total reports for user`);

    // If no reports exist, clean up old data and return
    if (!allUserReports || allUserReports.length === 0) {
      console.log("🗑️ No reports found - cleaning up old insights and markers");

      // Delete any existing insights
      await supabaseClient.from("health_insights").delete().eq("user_id", user.id);

      // Delete any extracted markers
      await supabaseClient.from("extracted_markers").delete().eq("user_id", user.id);

      return new Response(
        JSON.stringify({
          message: "All reports deleted. Upload a new report to start analysis.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if analysis already exists
    const { data: existingInsight } = await supabaseClient
      .from("health_insights")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get all reports that should be included in analysis (pending or success)
    const { data: allReports } = await supabaseClient
      .from("reports")
      .select("id")
      .eq("user_id", user.id)
      .or("extraction_status.eq.pending,extraction_status.eq.success");

    // DEDUPLICATION: If an insight was created in the last 2 minutes, return it to prevent race conditions
    if (existingInsight) {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const createdVeryRecently = new Date(existingInsight.created_at) > twoMinutesAgo;

      if (createdVeryRecently) {
        console.log("⚠️ Insight created within last 2 minutes - returning existing to prevent duplicates");

        // Release lock before returning
        await supabaseClient.from("analysis_locks").delete().eq("user_id", user.id).eq("function_instance_id", lockId);

        return new Response(JSON.stringify(existingInsight), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // If recent successful analysis exists (within 1 hour), check if it includes ALL reports
    if (existingInsight && allReports) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const insightStatus = (existingInsight.analysis_data as any)?.status;
      const isRecent = new Date(existingInsight.created_at) > oneHourAgo;

      // Check if existing insight includes ALL available reports (not just current one)
      const allReportsIncluded = allReports.every((r) => existingInsight.report_ids?.includes(r.id));

      // Only return existing insight if it's recent, successful, AND includes ALL reports
      if (isRecent && insightStatus !== "error" && insightStatus !== "processing" && allReportsIncluded) {
        console.log("Returning existing recent analysis (includes all reports)");
        return new Response(JSON.stringify(existingInsight), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // If it's an error or processing, or doesn't include all reports, delete it and create new one
      if (insightStatus === "error" || insightStatus === "processing" || !allReportsIncluded) {
        console.log("Deleting existing insight - creating fresh comprehensive analysis with all reports");
        await supabaseClient.from("health_insights").delete().eq("id", existingInsight.id);
      }
    }

    // Delete any other existing insights for this user
    await supabaseClient.from("health_insights").delete().eq("user_id", user.id);

    // Create placeholder insight with ALL report IDs (not just the triggering one)
    const { data: placeholderInsight, error: placeholderError } = await supabaseClient
      .from("health_insights")
      .insert({
        user_id: user.id,
        report_ids: allReportIds, // ✅ Include ALL reports for comprehensive analysis
        questionnaire_id: null,
        analysis_data: {
          status: "processing",
          message: "Analysis in progress. This takes 2-3 minutes.",
        },
      })
      .select()
      .single();

    if (placeholderError) {
      console.error("Failed to create placeholder:", placeholderError);
      return new Response(JSON.stringify({ error: "Failed to initialize analysis" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Created placeholder insight (ID: ${placeholderInsight.id})`);

    // ========================================================================
    // --- CANCEL AND REPLACE: Mark any existing processing insights as superseded ---
    // ========================================================================
    const { data: oldProcessingInsights } = await supabaseClient
      .from("health_insights")
      .select("id, superseded_by")
      .eq("user_id", user.id)
      .eq("analysis_data->>status", "processing")
      .neq("id", placeholderInsight.id)
      .is("superseded_by", null); // Only update if not already superseded

    if (oldProcessingInsights && oldProcessingInsights.length > 0) {
      console.log(`🔄 Found ${oldProcessingInsights.length} old processing insight(s) - marking as superseded`);

      for (const oldInsight of oldProcessingInsights) {
        await supabaseClient
          .from("health_insights")
          .update({ superseded_by: placeholderInsight.id })
          .eq("id", oldInsight.id);
      }

      console.log(`✅ Marked ${oldProcessingInsights.length} old insight(s) as superseded`);
    }

    // Helper function to check if this insight has been superseded
    const checkIfSuperseded = async () => {
      const { data: currentInsight } = await supabaseClient
        .from("health_insights")
        .select("superseded_by")
        .eq("id", placeholderInsight.id)
        .single();

      if (currentInsight?.superseded_by) {
        console.log(`⚠️ Insight ${placeholderInsight.id} has been superseded by ${currentInsight.superseded_by}`);
        throw new Error("SUPERSEDED");
      }
    };

    // Helper function to update progress
    const updateProgress = async (stage: string, details: string) => {
      try {
        await supabaseClient
          .from("health_insights")
          .update({
            analysis_data: {
              status: "processing",
              progress: {
                stage,
                details,
                timestamp: new Date().toISOString(),
              },
            },
          })
          .eq("id", placeholderInsight.id);
        console.log(`📊 Progress updated: ${stage} - ${details}`);
      } catch (error) {
        console.error("Failed to update progress:", error);
      }
    };

    // Process analysis in background using waitUntil to keep function alive
    const processAnalysis = async () => {
      try {
        console.log("🔄 Background processing started for insight:", placeholderInsight.id);

        // Initial progress update
        await updateProgress("uploaded", `Processing ${report.file_name}`);

        const { data: questionnaire, error: qError } = await supabaseClient
          .from("questionnaire_responses")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (qError) console.log("Questionnaire error (optional):", qError);

        // --- PDF Download & Base64 Encoding ---
        console.log("Downloading PDFs from storage...");

        // --- Get Google API Key (needed for both extraction and analysis) ---
        const GOOGLE_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
        if (!GOOGLE_API_KEY) {
          throw new Error("Google AI API key not configured");
        }

        // Check if superseded before starting extraction
        await checkIfSuperseded();

        // Extract markers from ALL pending reports (not just the triggering one)
        const pendingReports = allUserReports?.filter((r) => r.extraction_status === "pending") || [];

        if (pendingReports.length > 0) {
          console.log(`📋 Found ${pendingReports.length} pending report(s) to extract`);

          // ========================================================================
          // --- EXTRACTION LOGIC FOR ALL PENDING REPORTS ---
          // ========================================================================
          const extractionSystemPrompt = `You are an automated data extraction engine. Your ONLY function is to scan the provided PDF file and extract blood marker data and the report date into a structured JSON format.
CRITICAL RULES:
1. NO ANALYSIS: Do not interpret, analyze, explain, or comment on the values. Do not assume, make up or hallucinate any value, if one can not be read, skip the marker.
2. LITERAL EXTRACTION: Extract every value, unit, reference range, and report date EXACTLY as it appears in the PDF. Do not make up or ha
3. EXTRACT REPORT DATE: Find and extract the date when the report was issued/collected. Look for labels like "Report Date", "Collection Date", "Test Date", or similar. Format as YYYY-MM-DD.
4. IGNORE SUMMARIES: Extract every marker from the detailed result pages.
5. STICK TO THE SCHEMA: Your output MUST be ONLY a valid JSON object.
6. FAILURE CONDITION: If a PDF cannot be read, return an empty markers array and null reportDate.`;

          // Process each pending report
          for (const pendingReport of pendingReports) {
            await updateProgress("extracting", `Extracting blood markers from ${pendingReport.file_name}...`);

            try {
              console.log(`\n📄 Processing file: ${pendingReport.file_name}`);

              // Download file
              const { data: fileData, error: downloadError } = await supabaseClient.storage
                .from("health-reports")
                .download(pendingReport.file_name);

              if (downloadError) {
                console.error(`❌ Error downloading ${pendingReport.file_name}:`, downloadError);
                await supabaseClient
                  .from("reports")
                  .update({
                    extraction_status: "failed",
                    extraction_error: "Download failed",
                  })
                  .eq("id", pendingReport.id);
                continue; // Skip to next report
              }

              if (!fileData) {
                console.error(`❌ No file data for ${pendingReport.file_name}`);
                await supabaseClient
                  .from("reports")
                  .update({
                    extraction_status: "failed",
                    extraction_error: "No file data",
                  })
                  .eq("id", pendingReport.id);
                continue;
              }

              const fileSizeInMB = fileData.size / (1024 * 1024);
              console.log(`📦 File size: ${fileSizeInMB.toFixed(2)}MB`);

              if (fileSizeInMB > 8) {
                await supabaseClient
                  .from("reports")
                  .update({
                    extraction_status: "failed",
                    extraction_error: "File exceeds 8MB limit",
                  })
                  .eq("id", pendingReport.id);
                continue;
              }

              // Convert to base64
              const arrayBuffer = await fileData.arrayBuffer();
              const base64 = encodeBase64(arrayBuffer);
              console.log(
                `✅ Encoded ${pendingReport.file_name} (${(base64.length / 1024 / 1024).toFixed(2)}MB base64)`,
              );

              // Extract markers and report date
              const extractionUserText = `Please extract the blood marker data and report date from this file.
FileName: "${pendingReport.file_name}"

Return a JSON object:
{
  "reportDate": "YYYY-MM-DD format of when the report/sample was collected",
  "markers": [
    { "name": "Marker name", "value": "value", "unit": "unit", "referenceRange": "range" }
  ]
}`;

              const extractionStartTime = Date.now();

              console.log(`📤 Sending to Gemini for extraction...`);

              const extractionRequestBody = {
                contents: [
                  {
                    role: "user",
                    parts: [
                      { text: extractionUserText },
                      { inline_data: { mime_type: "application/pdf", data: base64 } },
                    ],
                  },
                ],
                system_instruction: { parts: [{ text: extractionSystemPrompt }] },
                generationConfig: {
                  response_mime_type: "application/json",
                  temperature: 0.1,
                },
              };

              const extractionResponse = await callGeminiWithFallback(
                "generateContent",
                extractionRequestBody,
                GOOGLE_API_KEY,
                240000, // 4 minute timeout
                `PDF Extraction for ${pendingReport.file_name}`,
              );
              const extractionDuration = ((Date.now() - extractionStartTime) / 1000).toFixed(1);
              console.log(`⏱️ Extraction took ${extractionDuration}s`);

              if (!extractionResponse.ok) {
                const errorBody = await extractionResponse.text();
                console.error(`❌ Extraction API failed (${extractionResponse.status}):`, errorBody);
                await supabaseClient
                  .from("reports")
                  .update({
                    extraction_status: "failed",
                    extraction_error: `API error: ${extractionResponse.status}`,
                  })
                  .eq("id", pendingReport.id);
                continue;
              }

              const extractionResult = await extractionResponse.json();

              let responseText = extractionResult.candidates[0].content.parts[0].text;
              responseText = responseText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
              const extractedData = JSON.parse(responseText);
              console.log(
                `✅ Extracted ${extractedData.markers?.length || 0} markers and report date from ${pendingReport.file_name}`,
              );

              // Use extracted report date if available, fallback to existing report date
              const reportDate = extractedData.reportDate || pendingReport.report_date;
              console.log(`📅 Report date: ${reportDate}`);

              // Store markers in database with extracted report date
              if (extractedData.markers && extractedData.markers.length > 0) {
                const markersToInsert = extractedData.markers.map((marker: any) => ({
                  report_id: pendingReport.id,
                  user_id: user.id,
                  marker_name: marker.name,
                  value: marker.value,
                  unit: marker.unit,
                  reference_range: marker.referenceRange,
                  report_date: reportDate,
                }));

                const { error: insertError } = await supabaseClient.from("extracted_markers").insert(markersToInsert);

                if (insertError) {
                  console.error("Failed to store markers:", insertError);
                  throw insertError;
                }

                console.log(`💾 Stored ${markersToInsert.length} markers for ${pendingReport.file_name}`);
              }

              // Update report with extracted date and mark as successful
              const { error: updateError } = await supabaseClient
                .from("reports")
                .update({
                  extraction_status: "success",
                  report_date: reportDate,
                })
                .eq("id", pendingReport.id);

              if (updateError) {
                console.error(`❌ Failed to update report status for ${pendingReport.file_name}:`, updateError);
              } else {
                console.log(`✅ Successfully processed ${pendingReport.file_name}`);
              }
            } catch (fileError) {
              console.error(`❌ Error processing ${pendingReport.file_name}:`, fileError);
              await supabaseClient
                .from("reports")
                .update({
                  extraction_status: "failed",
                  extraction_error: fileError instanceof Error ? fileError.message : "Processing failed",
                })
                .eq("id", pendingReport.id);
              // Continue with next report instead of throwing
            }
          }

          // Check if any extractions succeeded
          const successfulExtractions = await supabaseClient
            .from("reports")
            .select("id")
            .in(
              "id",
              pendingReports.map((r) => r.id),
            )
            .eq("extraction_status", "success");

          if (!successfulExtractions.data || successfulExtractions.data.length === 0) {
            // Mark insight as extraction failed
            await supabaseClient
              .from("health_insights")
              .update({
                analysis_data: {
                  status: "error",
                  message: "Failed to extract data from PDF. Please ensure the file is a valid health report.",
                  extractionFailed: true,
                  errorDetails: "All report extractions failed",
                },
              })
              .eq("id", placeholderInsight.id);

            throw new Error("EXTRACTION_FAILED: All report extractions failed. No markers available for analysis.");
          }

          // Update progress: extraction complete
          await updateProgress(
            "extracted",
            `Successfully extracted markers from ${successfulExtractions.data.length} report(s). Preparing analysis...`,
          );
        } else {
          console.log("✅ All reports already extracted. Proceeding to analysis with existing markers.");
        }

        // ========================================================================
        // --- STEP 2: FETCH ALL HISTORICAL MARKERS & ANALYZE ---
        // ========================================================================
        console.log("STEP 2: Fetching all historical markers...");

        // Fetch all successfully extracted markers for this user
        const { data: allMarkers, error: markersError } = await supabaseClient
          .from("extracted_markers")
          .select("*")
          .eq("user_id", user.id)
          .order("report_date", { ascending: true });

        if (markersError) {
          console.error("Failed to fetch historical markers:", markersError);
          throw new Error("Failed to fetch historical data");
        }

        console.log(`📊 Found ${allMarkers?.length || 0} historical markers`);

        // Group markers by report date for analysis
        const markersByDate = allMarkers?.reduce((acc: any, marker: any) => {
          const date = marker.report_date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            name: marker.marker_name,
            value: marker.value,
            unit: marker.unit,
            referenceRange: marker.reference_range,
          });
          return acc;
        }, {});

        const historicalData = {
          reports: Object.entries(markersByDate || {}).map(([date, markers]) => ({
            reportDate: date,
            markers: markers,
          })),
        };

        console.log("STEP 2: Starting health analysis with historical data...");

        // Log payload size for debugging
        const payloadSize = (JSON.stringify(historicalData).length / 1024).toFixed(2);
        console.log(`📦 Historical data payload size: ${payloadSize} KB`);

        const analysisSystemPrompt = `You are a holistic health practitioner analyzing blood markers and medical history.
Follow these steps:
1. Blood Marker Analysis: Create structured data for markers with values, reference ranges, status/comments. Comment on EVERY marker. Group markers by function. Always highlight the suboptimal/abnormal marker. used for markersData
2. Potential Symptoms: Describe symptoms linked to bloodwork/medical-history. skip low probablity symptomps. used for triangulationHtml
3. Risk Assessment: Analyze and Prioritize chronic health risks. correlate markers with each other and medical history. Explain with detailed biochemistry assoicated. skip the low priority conditions (keep maximum 3-4). used for riskAssessmentHtml
4. Action Plan: Prioritize (skip low priority, keep maximum 3-4) conditions and suggest corrective actions across nutrition, lifestyle, and exercise and further tests. used for actionPlanHtml
5. Supplements: Create structured data for recommended supplements with: name, form, reason, dosage, timing. Base recommendations ONLY on the blood markers and health risks identified. used for supplementsData
6. 3-Month Plan: Detailed monthly plan as structured data with month, focus areas (nutrition, lifestyle, supplements, exercise, tests), and expected outcomes. used for threeMonthPlanData
7. Professional Help: Disclaimer and guidance on seeking professional help (which doctors and what to ask/tell). used for professionalhelp
8. Clarifying Questions: 3-4 concise questions to help with further analysis and validation/invalidation of risk probabbilities

CRITICAL JSON FORMATTING RULES:
- Return ONLY valid JSON, no markdown formatting, no comments
- HTML content (for triangulationHtml, riskAssessmentHtml, actionPlanHtml, professionalhelp) MUST be properly escaped for JSON
- Do not include any text before or after the JSON object
- Ensure all strings are properly closed and escaped

Return this exact JSON structure:
{
  "markersData": [
    {
      "category": "Category name (e.g., Metabolic Panel, Lipid Panel)",
      "markers": [
        {
          "name": "Marker name",
          "value": "value with unit",
          "referenceRange": "reference range",
          "status": "normal/suboptimal/abnormal",
          "comment": "Brief interpretation"
        }
      ]
    }
  ],
  "triangulationHtml": "Properly formatted and escaped modern HTML, symptoms",
  "riskAssessmentHtml": "Properly formatted and escaped modern HTML, risks",
  "actionPlanHtml": "Properly formatted and escaped modern HTML, recommendations",
  "supplementsData": [
    {
      "name": "Supplement name",
      "form": "capsule/powder/liquid/etc",
      "reason": "Why this supplement based on markers",
      "dosage": "Specific amounts",
      "timing": "When to take during the day"
    }
  ],
  "threeMonthPlanData": [
    {
      "month": "Month 1/2/3",
      "nutrition": "Nutrition focus",
      "lifestyle": "Lifestyle changes",
      "supplements": "Supplement adjustments",
      "exercise": "Exercise recommendations",
      "tests": "Further tests to consider",
      "expectedOutcomes": "Expected outcomes"
    }
  ],
  "professionalhelp": "Properly formatted and escaped HTML disclaimer",
  "clarifyingQuestions": ["question1", "question2"]
}`;

        const analysisUserText = `Patient Medical History:
${questionnaire ? JSON.stringify(questionnaire, null, 2) : "No medical history provided. Focus on blood markers only."}

Historical Blood Marker Data (ordered by date):
${JSON.stringify(historicalData, null, 2)}

IMPORTANT: You have access to multiple reports over time. Analyze trends, improvements, and deteriorations across all report dates. Comment on how values have changed over time.`;

        // Check if superseded before starting expensive AI analysis
        await checkIfSuperseded();

        console.log(`📤 STEP 2: Sending analysis request`);
        const analysisStartTime = Date.now();

        let analysisResponse;
        try {
          console.log("🚀 Making Gemini analysis request...");

          // Update progress: starting AI analysis
          await updateProgress(
            "analyzing",
            `Running comprehensive health analysis across ${allReportIds.length} report(s). This may take 3-5 minutes...`,
          );

          const requestBody = {
            contents: [{ role: "user", parts: [{ text: analysisUserText }] }],
            system_instruction: { parts: [{ text: analysisSystemPrompt }] },
            generationConfig: {
              response_mime_type: "application/json",
              temperature: 0.2,
            },
          };

          const requestSize = (JSON.stringify(requestBody).length / 1024).toFixed(2);
          console.log(`📦 Request payload size: ${requestSize} KB`);
          console.log(`🌐 Sending request to Gemini...`);

          try {
            analysisResponse = await callGeminiWithFallback(
              "generateContent",
              requestBody,
              GOOGLE_API_KEY,
              480000, // 8 minute timeout
              "Health Analysis",
            );

            console.log(`✅ Gemini fetch completed with status: ${analysisResponse.status}`);
          } catch (fetchError) {
            console.error("❌ Fetch to Gemini failed:", fetchError);
            console.error("❌ Fetch error type:", fetchError instanceof Error ? fetchError.name : typeof fetchError);
            throw fetchError;
          }
          const analysisDuration = ((Date.now() - analysisStartTime) / 1000).toFixed(1);
          console.log(`⏱️ Gemini analysis took ${analysisDuration}s`);

          if (!analysisResponse.ok) {
            const errorBody = await analysisResponse.text();
            console.error(`❌ Analysis failed (${analysisResponse.status}):`, errorBody);
            console.error(`❌ Full error response:`, errorBody);
            throw new Error(`AI analysis failed (${analysisResponse.status}): ${errorBody.substring(0, 500)}`);
          }

          console.log("✅ Analysis response received, parsing...");
        } catch (error) {
          console.error("❌ Analysis request error:", error);
          console.error("❌ Error details:", error instanceof Error ? error.stack : String(error));

          if (error instanceof Error && error.name === "AbortError") {
            console.error("❌ Gemini analysis timed out after 8 minutes");
            throw new Error(
              "Analysis timed out due to large dataset or complex report. Your extracted markers are saved. Please refresh to retry with optimized processing, or contact support if this continues.",
            );
          }
          throw error;
        }

        const analysisResult = await analysisResponse.json();
        let analysisData;
        try {
          console.log("🔍 Parsing analysis JSON response...");
          let responseText = analysisResult.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!responseText) {
            console.error("❌ No response text in Gemini result:", JSON.stringify(analysisResult).substring(0, 500));
            throw new Error("Empty response from AI");
          }

          // Clean up markdown code blocks and trim
          responseText = responseText
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

          // Try to find JSON object boundaries
          const firstBrace = responseText.indexOf("{");
          const lastBrace = responseText.lastIndexOf("}");

          if (firstBrace === -1 || lastBrace === -1) {
            console.error("❌ No JSON boundaries found in response");
            console.error("❌ Response text:", responseText.substring(0, 500));
            throw new Error("Could not find valid JSON in response");
          }

          // Extract JSON substring
          let jsonString = responseText.substring(firstBrace, lastBrace + 1);

          console.log("🔍 Attempting to parse JSON (length: " + jsonString.length + " chars)");

          // First attempt: direct parse (works if response_mime_type works correctly)
          try {
            analysisData = JSON.parse(jsonString);
            console.log("✅ STEP 2 Complete - Direct JSON parse successful");
          } catch (directParseError) {
            console.log("⚠️ Direct parse failed, attempting cleanup...");

            // Second attempt: clean up common issues
            jsonString = jsonString
              // Remove any control characters except those in strings
              .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
              // Fix any unescaped newlines in strings (but preserve \n)
              .replace(/(?<!\\)\\n/g, "\\n")
              .replace(/\n/g, " ")
              .replace(/\r/g, " ")
              .replace(/\t/g, " ");

            try {
              analysisData = JSON.parse(jsonString);
              console.log("✅ STEP 2 Complete - Cleaned JSON parse successful");
            } catch (cleanParseError) {
              console.error("❌ All parsing attempts failed");
              console.error("❌ First 500 chars of JSON:", jsonString.substring(0, 500));
              console.error("❌ Last 200 chars of JSON:", jsonString.substring(jsonString.length - 200));
              throw new Error(
                `JSON parsing failed: ${cleanParseError instanceof Error ? cleanParseError.message : String(cleanParseError)}`,
              );
            }
          }
        } catch (e) {
          console.error("❌ Failed to parse analysis response:", e);
          console.error("❌ Raw response preview:", JSON.stringify(analysisResult).substring(0, 1000));
          throw new Error(`Invalid analysis response format: ${e instanceof Error ? e.message : String(e)}`);
        }

        // Extract clarifying questions
        const clarifyingQuestions = analysisData.clarifyingQuestions || [];
        const { clarifyingQuestions: _, ...dataToStore } = analysisData;

        console.log(`💾 Updating placeholder with results...`);

        // Update the placeholder with real analysis and set status to complete
        const { error: updateError } = await supabaseClient
          .from("health_insights")
          .update({
            questionnaire_id: questionnaire?.id || null,
            analysis_data: {
              ...dataToStore,
              status: "complete",
              progress: {
                stage: "complete",
                details: "Analysis completed successfully",
                timestamp: new Date().toISOString(),
              },
            },
          })
          .eq("id", placeholderInsight.id);

        if (updateError) {
          console.error("❌ Failed to update insights:", updateError);
          throw updateError;
        }

        console.log(`✅ Analysis complete (ID: ${placeholderInsight.id})`);

        // Post clarifying questions to chat (check if not superseded first)
        if (clarifyingQuestions && Array.isArray(clarifyingQuestions) && clarifyingQuestions.length > 0) {
          console.log("Posting clarifying questions...");

          // Check if superseded before posting questions to avoid duplicates
          await checkIfSuperseded();

          const questionsMessage = `I am your health coach. I will be guiding you through your journey to your best health. I have capability to change your monthly plan based on your inputs, goals, constraints and your progress. You can ask me clarification about your blood report analysis and ask question plan among any other health related query e.g.

1\. What are correct dosage for my supplements and when in the day should i have them.

2\. Detail out my nutrition plan with exact recipes and ingredients.

3\. Make my monthly exercise plan based on my report and my current lifestyle

4\. You can ask me add a typical day schedule to your plan with your constraints (e.g. you work 11am to 8pm).

 I also have some questions based on your report:\n\n${clarifyingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n\n")}\n\nYou can answer these questions here, or [fill out your medical history form](/questionnaire) for more comprehensive insights.`;

          await supabaseClient.from("health_chat_messages").insert({
            user_id: user.id,
            role: "assistant",
            content: questionsMessage,
            message_type: "chat",
          });

          console.log("Posted clarifying questions" + questionsMessage);
        }
      } catch (error) {
        console.error("❌ Background processing failed:", error);
        console.error("❌ Error details:", error instanceof Error ? error.stack : JSON.stringify(error));

        const errorMessage = error instanceof Error ? error.message : "Analysis failed";

        // If superseded, just exit gracefully without updating
        if (errorMessage === "SUPERSEDED") {
          console.log(`✅ Analysis ${placeholderInsight.id} gracefully exited - superseded by newer analysis`);
          return;
        }

        const isExtractionError = errorMessage.includes("EXTRACTION_FAILED");
        const isTimeout = errorMessage.includes("timed out") || errorMessage.includes("timeout");

        // Update placeholder with error state
        await supabaseClient
          .from("health_insights")
          .update({
            analysis_data: {
              status: "error",
              message: isExtractionError
                ? "Failed to extract data from PDF. Please ensure the file is a valid health report."
                : isTimeout
                  ? "Analysis timed out due to large dataset. Your extracted markers are saved. Please refresh to retry with optimized processing."
                  : `Analysis failed: ${errorMessage}. Please refresh to retry.`,
              extractionFailed: isExtractionError,
              hasExtractedMarkers: !isExtractionError,
              errorDetails: errorMessage,
            },
          })
          .eq("id", placeholderInsight.id);

        console.error("❌ Updated insight with error status");
      } finally {
        // Release lock in finally block to ensure it's always released
        console.log(`🔓 Releasing lock (ID: ${lockId})`);
        await supabaseClient.from("analysis_locks").delete().eq("user_id", user.id).eq("function_instance_id", lockId);
        console.log("✅ Lock released");
      }
    };

    // Start background processing using EdgeRuntime.waitUntil to keep function alive
    const backgroundPromise = processAnalysis().catch((error) => {
      console.error("❌ Background analysis failed:", error);
    });

    // Register background task with EdgeRuntime to prevent premature shutdown
    try {
      EdgeRuntime.waitUntil(backgroundPromise);
      console.log("✅ Registered background task with EdgeRuntime.waitUntil");
    } catch (e) {
      console.error("⚠️ EdgeRuntime.waitUntil not available:", e);
      console.error("⚠️ Function may shut down before background processing completes");
    }

    console.log("✅ Returning immediate response - analysis will continue in background");

    // Return the placeholder immediately - frontend will poll for updates
    return new Response(JSON.stringify(placeholderInsight), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "no stack");

    // Always return with CORS headers
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        type: "unexpected_error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
