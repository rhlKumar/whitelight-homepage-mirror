import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listReports from "./tools/list_reports";
import listMarkers from "./tools/list_markers";
import getLatestInsights from "./tools/get_latest_insights";
import getProfile from "./tools/get_profile";

// The OAuth issuer MUST be the direct Supabase host, not the .lovable.cloud
// proxy. Build it from the project ref, which Vite inlines as a literal.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "chirayu-ai-mcp",
  title: "Chirayu AI",
  version: "0.1.0",
  instructions:
    "Read-only access to the signed-in Chirayu AI user's health data: uploaded reports, extracted biomarkers, latest AI-generated insights, and profile/questionnaire. Use these tools to answer questions about the user's own health trends and lab results.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listReports, listMarkers, getLatestInsights, getProfile],
});