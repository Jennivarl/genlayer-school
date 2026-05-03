import { NextRequest, NextResponse } from "next/server";
import { getCertificateEligibility, summarizeProgress } from "@/lib/backend/learning";
import { getProgress } from "@/lib/backend/progress-store";

export async function GET(request: NextRequest) {
  const learnerId = request.nextUrl.searchParams.get("learnerId");
  const progress = await getProgress(learnerId);

  return NextResponse.json({
    progress,
    summary: summarizeProgress(progress),
    certificates: getCertificateEligibility(progress),
  });
}
