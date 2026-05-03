import { NextRequest, NextResponse } from "next/server";
import { getCertificateEligibility } from "@/lib/backend/learning";
import { getProgress } from "@/lib/backend/progress-store";

export async function GET(request: NextRequest) {
  const learnerId = request.nextUrl.searchParams.get("learnerId");
  const progress = await getProgress(learnerId);
  return NextResponse.json({ certificates: getCertificateEligibility(progress) });
}
