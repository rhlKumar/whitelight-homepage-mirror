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

    const { message } = await req.json();

    // Store user message
    await supabaseClient.from("health_chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: message,
      message_type: "chat",
    });

    // Get conversation history - ONLY chat messages for AI context
    // Get last 30 messages in descending order, then reverse for chronological context
    const { data: recentMessages } = await supabaseClient
      .from("health_chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .eq("message_type", "chat")
      .order("created_at", { ascending: false })
      .limit(30);

    const messages = recentMessages?.reverse() || [];

    // Get latest health insight for context
    const { data: latestInsight } = await supabaseClient
      .from("health_insights")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get only NEW messages since last insight update for tool calling context
    // This prevents re-processing old information
    const lastUpdateTime = latestInsight?.last_updated_at || latestInsight?.created_at;
    const newMessagesSinceUpdate =
      messages?.filter((m) => !lastUpdateTime || new Date(m.created_at) > new Date(lastUpdateTime)) || [];

    const systemPrompt = `You are a helpful health assistant who is chronic health condition expert and nutrition/fitness coach with access to the user's health analysis and the ability to update their insights and their action plan when they share new information.
Provide personalized health advice and based on their actual data. Be supportive, clear, and actionable. Alaways ask to help with example next steps
IMPORTANT: After your natural conversational response, always append a special JSON block at the VERY END in the below format. This flag is needed to update other systems for the user.

---UPDATE_FLAG---
{
  "needsUpdate": true or false,
  "sections": ["actionPlanHtml", "triangulationHtml"],
  "reason": "User reported new symptom: persistent headaches for 3 days",
  "newInfo": "New symptom: headaches (3 days, morning, moderate severity)"
}
---END_FLAG---

The flag must be the LAST thing in your response. Include it AFTER your natural conversational text.

HEALTH ANALYSIS DATA: ${JSON.stringify(latestInsight?.analysis_data || {})}

CRITICAL INSTRUCTIONS:
- ONLY reference data from the user's actual health analysis provided above
- NEVER make up, assume, or hallucinate any health data, markers, or values
- If you don't have specific information, ASK clarifying questions instead of assuming
- If the user's question requires data you don't have, explicitly state what information is missing and ask for it
- Always be clear about what is based on their actual data vs. general health information
- Try to explain why of your answer
UPDATE FLAG PROTOCOL: Only consider information from messages AFTER the last insight update (timestamp: ${lastUpdateTime || "N/A"}).
flag should be true ONLY when:
✅ User reports NEW symptoms (e.g., "I've been having headaches for 3 days")
✅ User shares lifestyle changes (e.g., "I started a vegetarian diet")
✅ User provides new health information (e.g., "My doctor diagnosed me with thyroid issues")
✅ User requests modifications to action plan (e.g., "I can't do high-impact exercises")
✅ User shares new test results or medical history
✅ User reports changes in existing symptoms (e.g., "My fatigue is much worse now")

flag should be false when:
❌ User asks questions about existing analysis
❌ User requests explanations or clarifications
❌ User discusses general health topics without personal relevance
❌ Information was already shared BEFORE ${lastUpdateTime || "N/A"}

When to update which sections:
- triangulationHtml: NEW symptoms or significant symptom changes
- riskAssessmentHtml: New risk factors, diagnoses, family history
- actionPlanHtml: Modified recommendations, barriers to current plan
- threeMonthPlanHtml: Action plan changes, timeline adjustments
- professionalhelp: New specialist referrals needed

FORMATTING RULES:
- ALWAYS use Markdown formatting in your non-json responses
- For tables, use Markdown table syntax (| Header | Header |), NEVER use HTML tables
- Use **bold** for emphasis, *italic* for secondary emphasis
- Use bullet points with - or * for lists
- Use ### for section headings
`;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || []).map((m) => ({ role: m.role, content: m.content })),
    ];

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    // Convert messages to Gemini format
    const geminiMessages = chatMessages.slice(1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Function to try Gemini with fallback
    async function callGeminiWithFallback(geminiMessages: any[], systemPrompt: string, GOOGLE_API_KEY: string) {
      const models = [
        "gemini-2.5-flash", // Try Flash first
        "gemini-2.5-pro", // Fallback to Pro
      ];

      let lastError = null;

      for (const model of models) {
        try {
          console.log(`Attempting to use ${model}...`);

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${GOOGLE_API_KEY}&alt=sse`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: geminiMessages,
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                generationConfig: {
                  temperature: 1,
                  maxOutputTokens: 8192,
                },
              }),
            },
          );

          if (response.ok) {
            console.log(`Successfully connected to ${model}`);
            return response;
          }

          const errorText = await response.text();
          console.error(`${model} failed:`, response.status, errorText);
          lastError = { status: response.status, text: errorText, model };

          // If it's a 503 (overloaded), try the next model
          if (response.status === 503) {
            console.log(`${model} is overloaded, trying next model...`);
            continue;
          }

          // For other errors, throw immediately
          throw new Error(`${model} error: ${errorText}`);
        } catch (error) {
          console.error(`Error calling ${model}:`, error);
          lastError = error;
        }
      }

      // All models failed
      throw new Error(`All models unavailable. Last error: ${JSON.stringify(lastError)}`);
    }

    // MAIN CONVERSATION FLOW - Stream response with model fallback
    const response = await callGeminiWithFallback(geminiMessages, systemPrompt, GOOGLE_API_KEY);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);

      let errorMessage = "AI service temporarily unavailable";

      if (response.status === 503) {
        errorMessage = "AI models are currently overloaded. Please try again in a moment.";
      } else if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please wait a moment before trying again.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } else if (response.status === 401) {
        errorMessage = "Authentication error. Please contact support.";
      }

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Gemini SSE format to OpenAI-compatible format for frontend
    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let fullAssistantMessage = "";
        let isClosed = false;

        try {
          // Read and process stream
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim() || !line.startsWith("data: ")) continue;

              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const parts = parsed.candidates?.[0]?.content?.parts || [];

                for (const part of parts) {
                  if (part.text && !isClosed) {
                    fullAssistantMessage += part.text;

                    const openAIFormat = {
                      choices: [
                        {
                          delta: { content: part.text },
                        },
                      ],
                    };
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(openAIFormat)}\n\n`));
                  }
                }
              } catch (e) {
                // Silent parse error - don't try to enqueue after close
                if (!isClosed) {
                  console.error("Parse error:", e);
                }
              }
            }
          }

          // Process any remaining buffer data
          if (buffer.trim() && !isClosed) {
            const lines = buffer.split("\n");
            for (const line of lines) {
              if (!line.trim() || !line.startsWith("data: ")) continue;
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const parts = parsed.candidates?.[0]?.content?.parts || [];
                for (const part of parts) {
                  if (part.text) {
                    fullAssistantMessage += part.text;
                    const openAIFormat = {
                      choices: [{ delta: { content: part.text } }],
                    };
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(openAIFormat)}\n\n`));
                  }
                }
              } catch (e) {
                console.error("Final buffer parse error:", e);
              }
            }
          }

          // Now close the stream
          if (!isClosed) {
            controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
            controller.close();
            isClosed = true;
          }
        } catch (error) {
          console.error("Stream error:", error);
          if (!isClosed) {
            controller.error(error);
            isClosed = true;
          }
        }

        // Post-stream processing (after controller is closed)
        try {
          // Parse for update flag
          let cleanedMessage = fullAssistantMessage;
          let updateFlag = null;

          const flagMatch = fullAssistantMessage.match(/---UPDATE_FLAG---\s*(\{[\s\S]*?\})\s*---END_FLAG---/);

          if (flagMatch) {
            try {
              updateFlag = JSON.parse(flagMatch[1]);
              cleanedMessage = fullAssistantMessage.replace(/---UPDATE_FLAG---[\s\S]*?---END_FLAG---/, "").trim();
              console.log("Update flag detected:", updateFlag);
            } catch (e) {
              console.error("Failed to parse update flag:", e);
            }
          }

          // Save cleaned assistant message
          await supabaseClient.from("health_chat_messages").insert({
            user_id: user.id,
            role: "assistant",
            content: cleanedMessage,
            message_type: "chat",
          });

          // Trigger update if needed
          if (updateFlag?.needsUpdate === true) {
            console.log("Triggering insight update for sections:", updateFlag.sections);

            const recentMessages = newMessagesSinceUpdate.slice(-10);

            supabaseClient.functions
              .invoke("update-health-insights", {
                body: {
                  insightId: latestInsight?.id,
                  sectionsToUpdate: updateFlag.sections,
                  conversationContext: recentMessages,
                  updateReason: updateFlag.reason,
                  newInformation: updateFlag.newInfo,
                },
              })
              .then(({ data, error }) => {
                if (error) {
                  console.error("Update failed:", error);
                } else {
                  console.log("Update completed:", data);
                }
              });
          } else {
            console.log("No update needed");
          }
        } catch (postError) {
          console.error("Post-stream processing error:", postError);
        }
      },
    });

    return new Response(transformedStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in health-chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
