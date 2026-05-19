import { NextRequest, NextResponse } from "next/server";
import type { AdminContentKind, AdminContentStatus } from "@genlayer-school/content";
import { communitySpotlights, regionalTracks, weeklySummaries } from "@genlayer-school/content";
import { requireAdminAuth } from "@/lib/backend/admin-auth";
import { contentStorageDriver, saveAdminContentEntry } from "@/lib/backend/content-store";

type BootstrapPayload = {
  scope?: AdminContentKind | "all";
  status?: AdminContentStatus;
};

function isContentStatus(value: unknown): value is AdminContentStatus {
  return value === "draft" || value === "published";
}

function isBootstrapScope(value: unknown): value is AdminContentKind | "all" {
  return value === "all" || value === "weekly" || value === "spotlight" || value === "regional";
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const payload = await request.json().catch(() => ({})) as BootstrapPayload;
  const status = isContentStatus(payload.status) ? payload.status : "draft";
  const scope = isBootstrapScope(payload.scope) ? payload.scope : "all";

  const shouldSeed = (kind: AdminContentKind) => scope === "all" || scope === kind;
  const weeklyEntries = shouldSeed("weekly")
    ? await Promise.all(weeklySummaries.map((summary) => (
      saveAdminContentEntry({ kind: "weekly", status, payload: summary })
    )))
    : [];
  const spotlightEntries = shouldSeed("spotlight")
    ? await Promise.all(communitySpotlights.map((spotlight) => (
      saveAdminContentEntry({ kind: "spotlight", status, payload: spotlight })
    )))
    : [];
  const regionalEntries = shouldSeed("regional")
    ? await Promise.all(regionalTracks.map((track) => (
      saveAdminContentEntry({ kind: "regional", status, payload: track })
    )))
    : [];

  return NextResponse.json({
    storageDriver: contentStorageDriver,
    scope,
    status,
    bootstrapped: {
      weekly: weeklyEntries.length,
      spotlight: spotlightEntries.length,
      regional: regionalEntries.length,
      total: weeklyEntries.length + spotlightEntries.length + regionalEntries.length,
    },
  });
}
