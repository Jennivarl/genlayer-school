import { NextRequest, NextResponse } from "next/server";
import { getCertificateEligibility } from "@/lib/backend/learning";
import { getProgress } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";

export async function GET(request: NextRequest) {
  const fallbackLearnerId = request.nextUrl.searchParams.get("learnerId");
  const auth = await resolveLearnerAuth(request, fallbackLearnerId);
  if (isAuthError(auth)) return auth;

  const progress = await getProgress(auth.learnerId);
  return NextResponse.json({ auth, certificates: getCertificateEligibility(progress) });
}
