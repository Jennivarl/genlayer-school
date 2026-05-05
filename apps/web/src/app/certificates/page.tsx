import { CertificatePathways } from "@/components/certificate-pathways";

export default function CertificatesPage() {
  return (
    <div className="page">
      <p className="eyebrow">Certification</p>
      <h1>Certificate pathways</h1>
      <p className="lede">GenLayer School models certificate eligibility off-chain first, then connects eligible certificates to GenLayer Intelligent Contract minting.</p>

      <CertificatePathways />
    </div>
  );
}

