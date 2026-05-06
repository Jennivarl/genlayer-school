import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/backend/admin-auth";
import { listAdminContentEntries, contentStorageDriver } from "@/lib/backend/content-store";
import { getLearningAnalytics, storageDriver } from "@/lib/backend/progress-store";

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const [learning, contentEntries] = await Promise.all([
    getLearningAnalytics(),
    listAdminContentEntries(),
  ]);

  return NextResponse.json({
    storageDriver,
    contentStorageDriver,
    learning,
    content: {
      totalEntries: contentEntries.length,
      weeklyEntries: contentEntries.filter((entry) => entry.kind === "weekly").length,
      spotlightEntries: contentEntries.filter((entry) => entry.kind === "spotlight").length,
      publishedEntries: contentEntries.filter((entry) => entry.status === "published").length,
      draftEntries: contentEntries.filter((entry) => entry.status === "draft").length,
      recentEntries: contentEntries.slice(0, 8).map((entry) => ({
        id: entry.id,
        kind: entry.kind,
        slug: entry.slug,
        title: entry.title,
        status: entry.status,
        updatedAt: entry.updatedAt,
      })),
    },
  });
}
