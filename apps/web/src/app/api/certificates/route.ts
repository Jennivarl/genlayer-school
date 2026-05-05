import { NextRequest, NextResponse } from "next/server";
import type { CertificateEligibility, CertificateRecord } from "@genlayer-school/content";
import { getCertificateEligibility } from "@/lib/backend/learning";
import { getProgress, syncEligibleCertificates } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";

export type CertificatePathway = CertificateEligibility & {
  record: CertificateRecord | null;
};

function mergePathways(eligibilities: CertificateEligibility[], records: CertificateRecord[]): CertificatePathway[] {
  const recordsBySlug = new Map(records.map((record) => [record.certificateSlug, record]));
  return eligibilities.map((eligibility) => ({
    ...eligibility,
    record: recordsBySlug.get(eligibility.certificateSlug) ?? null,
  }));
}

export async function GET(request: NextRequest) {
  const fallbackLearnerId = request.nextUrl.searchParams.get("learnerId");
  const auth = await resolveLearnerAuth(request, fallbackLearnerId);
  if (isAuthError(auth)) return auth;

  const progress = await getProgress(auth.learnerId);
  const certificates = getCertificateEligibility(progress);
  const eligibleSlugs = certificates
    .filter((certificate) => certificate.eligible)
    .map((certificate) => certificate.certificateSlug);
  const records = await syncEligibleCertificates({
    learnerId: auth.learnerId,
    certificateSlugs: eligibleSlugs,
  });

  return NextResponse.json({
    auth,
    certificates: mergePathways(certificates, records),
    records,
  });
}
