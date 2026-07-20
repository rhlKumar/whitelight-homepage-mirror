import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient((globalThis as any).process.env.SUPABASE_URL!, (globalThis as any).process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_markers",
  title: "List extracted health markers",
  description: "List biomarkers extracted from the signed-in user's reports. Optionally filter by marker name (case-insensitive substring) or report id.",
  inputSchema: {
    marker_name: z.string().optional().describe("Optional case-insensitive substring to match marker name (e.g. 'vitamin d', 'ldl')."),
    report_id: z.string().uuid().optional().describe("Optional report id to restrict results to a single report."),
    limit: z.number().int().min(1).max(200).default(100),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ marker_name, report_id, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = supabaseForUser(ctx)
      .from("extracted_markers")
      .select("id, marker_name, value, unit, reference_range, report_date, report_id")
      .eq("user_id", ctx.getUserId())
      .order("report_date", { ascending: false })
      .limit(limit);
    if (marker_name) q = q.ilike("marker_name", `%${marker_name}%`);
    if (report_id) q = q.eq("report_id", report_id);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { markers: data ?? [] },
    };
  },
});