import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient((globalThis as any).process.env.SUPABASE_URL!, (globalThis as any).process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_profile",
  title: "Get user profile and questionnaire",
  description: "Get the signed-in user's profile and most recent lifestyle/health questionnaire responses.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    const [{ data: profile, error: pErr }, { data: q, error: qErr }] = await Promise.all([
      sb.from("profiles").select("id, full_name, phone, created_at").eq("id", userId).maybeSingle(),
      sb.from("questionnaire_responses").select("*").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    if (pErr) return { content: [{ type: "text", text: pErr.message }], isError: true };
    if (qErr) return { content: [{ type: "text", text: qErr.message }], isError: true };
    const payload = { profile, questionnaire: q };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});