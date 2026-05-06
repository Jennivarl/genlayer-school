import { NextResponse } from "next/server";
import { courses } from "@genlayer-school/content";
import { getPublishedCommunitySpotlights, getPublishedWeeklySummaries } from "@/lib/backend/public-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const [communitySpotlights, weeklySummaries] = await Promise.all([
    getPublishedCommunitySpotlights(),
    getPublishedWeeklySummaries(),
  ]);

  return NextResponse.json({ courses, communitySpotlights, weeklySummaries });
}
