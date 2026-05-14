import { NextRequest, NextResponse } from "next/server";
import { getCertificateEligibility, summarizeProgress } from "@/lib/backend/learning";
import { getProgress } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

export async function GET(request: NextRequest) {
  const fallbackLearnerId = request.nextUrl.searchParams.get("learnerId");
  const auth = await resolveLearnerAuth(request, fallbackLearnerId);
  if (isAuthError(auth)) return auth;

  const progress = await getProgress(auth.learnerId);
  const regionalTracks = await getPublishedRegionalTracks();

  return NextResponse.json({
    auth,
    progress,
    summary: summarizeProgress(progress, regionalTracks),
    certificates: getCertificateEligibility(progress, regionalTracks),
  });
}
