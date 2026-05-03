export const dynamic = "force-dynamic";

import { getCertificateEligibility } from "@/lib/backend/learning";
import { getProgress } from "@/lib/backend/progress-store";

export default async function CertificatesPage() {
  const progress = await getProgress();
  const certificates = getCertificateEligibility(progress);

  return (
    <div className="page">
      <p className="eyebrow">Certification</p>
      <h1>Certificate pathways</h1>
      <p className="lede">GenLayer School models certificate eligibility off-chain first, then connects eligible certificates to GenLayer Intelligent Contract minting.</p>

      <section className="section grid two">
        {certificates.map((certificate) => (
          <article className="card" key={certificate.certificateSlug}>
            <p className="meta">{certificate.eligible ? "Ready for mint flow" : "Requirements pending"}</p>
            <h2>{certificate.title}</h2>
            <div className="list">
              {certificate.requirements.map((requirement) => (
                <div className="list-item" key={requirement.label}>
                  <span>{requirement.label}</span>
                  <span className="pill">{requirement.complete ? "Done" : "Pending"}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

