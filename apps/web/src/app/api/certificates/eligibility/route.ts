import { NextRequest, NextResponse } from "next/server";
import { getCertificateEligibility } from "@/lib/backend/learning";
import { getProgress, syncEligibleCertificates } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";

export async function GET(request: NextRequest) {
  const fallbackLearnerId = request.nextUrl.searchParams.get("learnerId");
  const auth = await resolveLearnerAuth(request, fallbackLearnerId);
  if (isAuthError(auth)) return auth;

  const progress = await getProgress(auth.learnerId);
  const certificates = getCertificateEligibility(progress);
  const records = await syncEligibleCertificates({
    learnerId: auth.learnerId,
    certificateSlugs: certificates.filter((certificate) => certificate.eligible).map((certificate) => certificate.certificateSlug),
  });

  return NextResponse.json({ auth, certificates, records });
}
