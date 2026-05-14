import { NextResponse } from "next/server";
import { courses } from "@genlayer-school/content";
import { getPublishedCommunitySpotlights, getPublishedRegionalTracks, getPublishedWeeklySummaries } from "@/lib/backend/public-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const [communitySpotlights, regionalTracks, weeklySummaries] = await Promise.all([
    getPublishedCommunitySpotlights(),
    getPublishedRegionalTracks(),
    getPublishedWeeklySummaries(),
  ]);

  return NextResponse.json({ courses, regionalTracks, communitySpotlights, weeklySummaries });
}
