import { NextRequest, NextResponse } from "next/server";
import type { AdminContentStatus } from "@genlayer-school/content";
import { communitySpotlights, regionalTracks, weeklySummaries } from "@genlayer-school/content";
import { requireAdminAuth } from "@/lib/backend/admin-auth";
import { contentStorageDriver, saveAdminContentEntry } from "@/lib/backend/content-store";

type BootstrapPayload = {
  status?: AdminContentStatus;
};

function isContentStatus(value: unknown): value is AdminContentStatus {
  return value === "draft" || value === "published";
}

export async function POST(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const payload = await request.json().catch(() => ({})) as BootstrapPayload;
  const status = isContentStatus(payload.status) ? payload.status : "draft";

  const weeklyEntries = await Promise.all(weeklySummaries.map((summary) => (
    saveAdminContentEntry({ kind: "weekly", status, payload: summary })
  )));
  const spotlightEntries = await Promise.all(communitySpotlights.map((spotlight) => (
    saveAdminContentEntry({ kind: "spotlight", status, payload: spotlight })
  )));
  const regionalEntries = await Promise.all(regionalTracks.map((track) => (
    saveAdminContentEntry({ kind: "regional", status, payload: track })
  )));

  return NextResponse.json({
    storageDriver: contentStorageDriver,
    status,
    bootstrapped: {
      weekly: weeklyEntries.length,
      spotlight: spotlightEntries.length,
      regional: regionalEntries.length,
      total: weeklyEntries.length + spotlightEntries.length + regionalEntries.length,
    },
  });
}
