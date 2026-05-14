import { NextRequest, NextResponse } from "next/server";
import { getCertificateEligibility } from "@/lib/backend/learning";
import { getProgress, requestCertificateMint, syncEligibleCertificates } from "@/lib/backend/progress-store";
import { isAuthError, resolveLearnerAuth } from "@/lib/backend/auth";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

type CertificateRequestPayload = {
  learnerId?: string;
  certificateSlug?: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CertificateRequestPayload;
  const auth = await resolveLearnerAuth(request, payload.learnerId);
  if (isAuthError(auth)) return auth;

  if (!payload.certificateSlug) {
    return NextResponse.json({ error: "certificateSlug is required." }, { status: 400 });
  }

  const progress = await getProgress(auth.learnerId);
  const regionalTracks = await getPublishedRegionalTracks();
  const certificates = getCertificateEligibility(progress, regionalTracks);
  const certificate = certificates.find((item) => item.certificateSlug === payload.certificateSlug);

  if (!certificate) {
    return NextResponse.json({ error: "Unknown certificate." }, { status: 404 });
  }
  if (!certificate.eligible) {
    return NextResponse.json({ error: "Certificate requirements are not complete." }, { status: 400 });
  }

  await syncEligibleCertificates({
    learnerId: auth.learnerId,
    certificateSlugs: [certificate.certificateSlug],
  });
  const record = await requestCertificateMint({
    learnerId: auth.learnerId,
    certificateSlug: certificate.certificateSlug,
  });

  return NextResponse.json({ auth, certificate, record });
}
