import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient((globalThis as any).process.env.SUPABASE_URL!, (globalThis as any).process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_latest_insights",
  title: "Get latest health insights",
  description: "Get the signed-in user's most recent Chirayu AI health insight analysis (summary, markers, recommendations, and 3-month plan).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("health_insights")
      .select("id, analysis_data, report_ids, version, created_at, last_updated_at, last_updated_sections, is_invalidated")
      .eq("user_id", ctx.getUserId())
      .is("superseded_by", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "No insights available yet. Upload a health report to generate insights." }] };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { insight: data },
    };
  },
});