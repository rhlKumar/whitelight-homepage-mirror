import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";

type AuthorizationDetails = {
  client?: { name?: string; client_uri?: string; logo_uri?: string; redirect_uris?: string[] };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};

// Beta helper typing — @supabase/supabase-js exposes auth.oauth at runtime.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const humanScope = (scope?: string): string[] => {
  if (!scope) return [];
  return scope
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => {
      if (s === "openid") return "Verify your identity";
      if (s === "email") return "Share your email address";
      if (s === "profile") return "Share your basic profile";
      return `Additional permission: ${s}`;
    });
};

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      setUserEmail(sess.session.user.email ?? null);
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";

  return (
    <>
      <Helmet>
        <title>Connect {clientName} to Chirayu AI</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-md p-8 shadow-elevated">
          {error && (
            <div className="mb-4 text-sm rounded-md bg-destructive/10 text-destructive p-3">{error}</div>
          )}
          {!details && !error && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading authorization request…
            </div>
          )}
          {details && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold leading-tight">Connect {clientName} to Chirayu AI</h1>
                  {userEmail && (
                    <p className="text-xs text-muted-foreground mt-0.5">Signed in as {userEmail}</p>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                This lets <span className="font-medium text-foreground">{clientName}</span> call
                Chirayu AI tools as you and read your health data on your behalf.
              </p>

              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                  Permissions
                </p>
                <ul className="space-y-1.5 text-sm">
                  {humanScope(details.scope).map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Read your uploaded reports, extracted markers, insights, and profile</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  This does not bypass Chirayu AI's permissions or backend policies.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                </Button>
              </div>
            </>
          )}
        </Card>
      </main>
    </>
  );
}