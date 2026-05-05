import { storageDriver } from "./progress-store";

type CheckStatus = "ready" | "warning" | "missing";

export type BackendDiagnosticCheck = {
  key: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

export type BackendDiagnostics = {
  environment: string;
  storageDriver: "local" | "supabase";
  requestedStorageDriver: "auto" | "local" | "supabase";
  productionReady: boolean;
  checks: BackendDiagnosticCheck[];
  missingRequiredKeys: string[];
};

function hasEnv(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

function requestedStorageDriver(): BackendDiagnostics["requestedStorageDriver"] {
  const raw = process.env.GENLAYER_SCHOOL_STORAGE_DRIVER?.toLowerCase();
  if (raw === "local" || raw === "supabase") return raw;
  return "auto";
}

function check(status: CheckStatus, key: string, label: string, detail: string): BackendDiagnosticCheck {
  return { key, label, status, detail };
}

export function getBackendDiagnostics(): BackendDiagnostics {
  const environment = process.env.NODE_ENV ?? "development";
  const requestedDriver = requestedStorageDriver();
  const supabaseUrl = hasEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseServiceRole = hasEnv("SUPABASE_SERVICE_ROLE_KEY");
  const privyPublicAppId = hasEnv("NEXT_PUBLIC_PRIVY_APP_ID");
  const privyAppId = hasEnv("PRIVY_APP_ID") || privyPublicAppId;
  const privyVerificationKey = hasEnv("PRIVY_VERIFICATION_KEY");
  const authRequired = process.env.PRIVY_AUTH_REQUIRED === "true";
  const adminAccessToken = hasEnv("ADMIN_ACCESS_TOKEN");

  const checks: BackendDiagnosticCheck[] = [
    check(
      storageDriver === "supabase" ? "ready" : environment === "production" ? "warning" : "ready",
      "storage-driver",
      "Storage driver",
      storageDriver === "supabase"
        ? "Supabase is active for learner profiles, progress, quizzes, and certificate records."
        : "Local JSON storage is active. This is useful for development, but production should use Supabase.",
    ),
    check(
      supabaseUrl && supabaseServiceRole ? "ready" : requestedDriver === "supabase" || environment === "production" ? "missing" : "warning",
      "supabase",
      "Supabase credentials",
      supabaseUrl && supabaseServiceRole
        ? "Supabase URL and service role key are configured."
        : "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable database-backed storage.",
    ),
    check(
      privyPublicAppId ? "ready" : environment === "production" ? "missing" : "warning",
      "privy-client",
      "Privy client",
      privyPublicAppId
        ? "Privy client app ID is configured."
        : "Set NEXT_PUBLIC_PRIVY_APP_ID so learners can sign in with Privy.",
    ),
    check(
      privyAppId && privyVerificationKey ? "ready" : authRequired || environment === "production" ? "missing" : "warning",
      "privy-server",
      "Privy server verification",
      privyAppId && privyVerificationKey
        ? "Privy access token verification is configured for protected API routes."
        : "Set PRIVY_APP_ID and PRIVY_VERIFICATION_KEY before requiring authenticated progress writes.",
    ),
    check(
      authRequired ? "ready" : environment === "production" ? "warning" : "ready",
      "auth-required",
      "Auth enforcement",
      authRequired
        ? "Progress APIs require valid Privy access tokens."
        : "Unauthenticated requests fall back to the demo learner. Keep this off only for local development.",
    ),
    check(
      adminAccessToken ? "ready" : environment === "production" ? "missing" : "warning",
      "admin-access",
      "Admin access token",
      adminAccessToken
        ? "Admin content APIs require the configured access token."
        : "Set ADMIN_ACCESS_TOKEN before using admin content operations in production.",
    ),
  ];

  const missingRequiredKeys: string[] = [];
  if (environment === "production" || requestedDriver === "supabase") {
    if (!supabaseUrl) missingRequiredKeys.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseServiceRole) missingRequiredKeys.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  if (environment === "production" || authRequired) {
    if (!privyPublicAppId) missingRequiredKeys.push("NEXT_PUBLIC_PRIVY_APP_ID");
    if (!privyAppId) missingRequiredKeys.push("PRIVY_APP_ID");
    if (!privyVerificationKey) missingRequiredKeys.push("PRIVY_VERIFICATION_KEY");
  }
  if (environment === "production" && !authRequired) missingRequiredKeys.push("PRIVY_AUTH_REQUIRED=true");
  if (environment === "production" && !adminAccessToken) missingRequiredKeys.push("ADMIN_ACCESS_TOKEN");

  return {
    environment,
    storageDriver,
    requestedStorageDriver: requestedDriver,
    productionReady: missingRequiredKeys.length === 0 && checks.every((item) => item.status !== "missing"),
    checks,
    missingRequiredKeys,
  };
}
