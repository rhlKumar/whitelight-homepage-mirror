import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const { insightId, sectionsToUpdate, conversationContext, updateReason, newInformation } = await req.json();

    console.log("Update request:", { insightId, sectionsToUpdate, updateReason });

    // Fetch existing insight
    const { data: insight, error: insightError } = await supabaseClient
      .from("health_insights")
      .select("*")
      .eq("id", insightId)
      .eq("user_id", user.id)
      .single();

    if (insightError || !insight) {
      throw new Error("Insight not found");
    }

    // Fetch questionnaire data
    const { data: questionnaire } = await supabaseClient
      .from("questionnaire_responses")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Save current state to history before updating (will add change_summary after AI generation)
    const historyId = crypto.randomUUID();
    await supabaseClient.from("health_insights_history").insert({
      id: historyId,
      insight_id: insight.id,
      user_id: user.id,
      version: insight.version || 1,
      updated_sections: sectionsToUpdate,
      analysis_data: insight.analysis_data,
    });

    // Build targeted prompt for Gemini
    const sectionNames = {
      triangulationHtml: "Symptom Triangulation & Patterns",
      riskAssessmentHtml: "Prioritized Chronic Conditions",
      actionPlanHtml: "Corrective Action Plan",
      threeMonthPlanData: "3-Month Wellness Roadmap",
      threeMonthPlanHtml: "3-Month Wellness Roadmap",
      professionalhelp: "Professional Help & Disclaimer",
      supplementsData: "Recommended Supplements",
      supplementsTableHtml: "Recommended Supplements",
      markersData: "Health Markers Analysis",
      markersTableHtml: "Health Markers Analysis",
    };

    const requestedSections = sectionsToUpdate
      .map((s: string) => sectionNames[s as keyof typeof sectionNames])
      .join(", ");

    const systemPrompt = `You are a health analysis specialist updating specific sections of a comprehensive health report.

CONTEXT:
- Original Analysis Date: ${new Date(insight.created_at).toLocaleDateString()}
- Current Version: ${insight.version || 1}
- Sections to Update: ${requestedSections}
- Update Reason: ${updateReason}
- New Information: ${newInformation}

CRITICAL RULES:
1. Update ONLY the sections specified: ${sectionsToUpdate.join(", ")}
2. Maintain consistency with unchanged sections and original marker data
3. Reference the new information from the conversation naturally
4. Keep medical terminology consistent with the original analysis
5. Return ONLY valid JSON with the requested sections AND a natural language change_summary 

CONVERSATION CONTEXT (last 10 messages):
${conversationContext.map((m: any) => `${m.role}: ${m.content}`).join("\n")}

ORIGINAL HEALTH DATA:
Questionnaire: ${JSON.stringify(questionnaire || {})}
Current Analysis Sections: ${JSON.stringify(insight.analysis_data)}

IMPORTANT DATA FORMAT GUIDELINES:
- For markersData: Return structured array format with categories and markers
- For supplementsData: Return structured array format with supplement details
- For threeMonthPlanData: Return structured array format with monthly plans
- For HTML sections (triangulationHtml, riskAssessmentHtml, actionPlanHtml, professionalhelp): Return properly escaped HTML
- For backward compatibility, also support markersTableHtml, supplementsTableHtml, threeMonthPlanHtml as HTML

You must also generate a detailed change_summary object that explains what changed and why.

Return ONLY a JSON object. The structure depends on which sections are being updated:
- If updating markersData: Include structured array with categories and markers
- If updating supplementsData: Include structured array with supplement objects
- If updating threeMonthPlanData: Include structured array with monthly plan objects  
- If updating HTML sections: Include properly escaped HTML strings
- Always include change_summary object

Example structure:
{
  ${sectionsToUpdate.map((s: string) => {
    if (s === 'markersData') {
      return `"markersData": [{"category": "Category", "markers": [{"name": "Marker", "value": "value", "referenceRange": "range", "status": "normal/suboptimal/abnormal", "comment": "interpretation"}]}]`;
    } else if (s === 'supplementsData') {
      return `"supplementsData": [{"name": "Supplement", "form": "capsule", "reason": "Why needed", "dosage": "Amount", "timing": "When"}]`;
    } else if (s === 'threeMonthPlanData') {
      return `"threeMonthPlanData": [{"month": "Month 1", "nutrition": "...", "lifestyle": "...", "supplements": "...", "exercise": "...", "tests": "...", "expectedOutcomes": "..."}]`;
    } else {
      return `"${s}": "<div>...your updated content here...</div>"`;
    }
  }).join(",\n  ")},
  "change_summary": {
    "sections": [
      {
        "sectionKey": "${sectionsToUpdate[0]}",
        "sectionName": "${sectionNames[sectionsToUpdate[0] as keyof typeof sectionNames]}",
        "keyChanges": ["Specific change 1", "Specific change 2"],
        "reasoning": "Why these changes were made"
      }
    ],
    "overall": "Brief summary of all changes across sections"
  }
}`;

    // Helper function to call Gemini with fallback to flash model
    const callGeminiWithFallback = async (systemPrompt: string, userPrompt: string) => {
      const GOOGLE_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
      const models = ["gemini-2.5-flash", "gemini-2.5-pro"];
      
      for (let i = 0; i < models.length; i++) {
        const model = models[i];
        console.log(`Attempting to use ${model}...`);
        
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }]
                },
                contents: [{
                  role: "user",
                  parts: [{ text: userPrompt }]
                }],
                generationConfig: {
                  temperature: 0.7,
                  responseMimeType: "application/json"
                }
              }),
            }
          );

          if (response.ok) {
            console.log(`Successfully connected to ${model}`);
            return response;
          }

          const errorText = await response.text();
          console.error(`${model} failed:`, response.status, errorText);
          
          // If it's a 503 and not the last model, try next model
          if (response.status === 503 && i < models.length - 1) {
            console.log(`${model} is overloaded, trying next model...`);
            continue;
          }
          
          // For other errors or last model, throw
          throw new Error(`Failed to generate updated insights: ${response.status}`);
        } catch (error) {
          if (i === models.length - 1) throw error;
          console.log(`Error with ${model}, trying next model...`);
        }
      }
      
      throw new Error("All models failed");
    };

    // Call Gemini with fallback mechanism
    const response = await callGeminiWithFallback(
      systemPrompt,
      `Update the following sections based on the new information: ${sectionsToUpdate.join(", ")}`
    );

    const aiData = await response.json();
    const aiResponse = aiData.candidates[0].content.parts[0].text;

    console.log("AI Response:", aiResponse.substring(0, 200));

    // Parse the JSON response with robust error handling
    let updatedSections;
    let changeSummary;
    try {
      console.log("🔍 Parsing analysis JSON response...");
      let responseText = aiResponse;

      if (!responseText) {
        console.error("❌ No response text in Gemini result");
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

      // First attempt: direct parse
      try {
        const parsed = JSON.parse(jsonString);
        changeSummary = parsed.change_summary;
        delete parsed.change_summary;
        updatedSections = parsed;
        console.log("✅ Direct JSON parse successful");
      } catch (directParseError) {
        console.log("⚠️ Direct parse failed, attempting cleanup...");

        // Second attempt: clean up common issues with control characters
        jsonString = jsonString
          // Remove any control characters except those in strings
          .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
          // Fix any unescaped newlines in strings (but preserve \n)
          .replace(/(?<!\\)\\n/g, "\\n")
          .replace(/\n/g, " ")
          .replace(/\r/g, " ")
          .replace(/\t/g, " ");

        try {
          const parsed = JSON.parse(jsonString);
          changeSummary = parsed.change_summary;
          delete parsed.change_summary;
          updatedSections = parsed;
          console.log("✅ Cleaned JSON parse successful");
        } catch (cleanParseError) {
          console.error("❌ All parsing attempts failed");
          console.error("❌ First 500 chars of JSON:", jsonString.substring(0, 500));
          console.error("❌ Last 200 chars of JSON:", jsonString.substring(jsonString.length - 200));
          throw new Error(
            `JSON parsing failed: ${cleanParseError instanceof Error ? cleanParseError.message : String(cleanParseError)}`
          );
        }
      }
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      console.error("❌ Raw response preview:", aiResponse.substring(0, 1000));
      throw new Error(`Invalid analysis response format: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

    // Merge updated sections with existing analysis data
    const updatedAnalysisData = {
      ...insight.analysis_data,
      ...updatedSections,
    };

    // Update the health_insights record
    const newVersion = (insight.version || 1) + 1;
    const { error: updateError } = await supabaseClient
      .from("health_insights")
      .update({
        analysis_data: updatedAnalysisData,
        version: newVersion,
        last_updated_at: new Date().toISOString(),
        last_updated_sections: sectionsToUpdate,
      })
      .eq("id", insightId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error("Failed to update insights");
    }

    // Update the history record with the change summary
    if (changeSummary) {
      await supabaseClient
        .from("health_insights_history")
        .update({ change_summary: changeSummary })
        .eq("id", historyId);
    }

    console.log("Successfully updated insights:", { version: newVersion, sections: sectionsToUpdate });

    return new Response(
      JSON.stringify({
        success: true,
        version: newVersion,
        updatedSections: sectionsToUpdate,
        changeSummary,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in update-health-insights:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
