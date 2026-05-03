import { NextResponse } from "next/server";
import { communitySpotlights, courses, weeklySummaries } from "@genlayer-school/content";

export async function GET() {
  return NextResponse.json({ courses, communitySpotlights, weeklySummaries });
}
