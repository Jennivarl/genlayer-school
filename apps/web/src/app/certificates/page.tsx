export default function CertificatesPage() {
  return (
    <div className="page">
      <p className="eyebrow">Certification</p>
      <h1>Certificate pathways</h1>
      <p className="lede">GenLayer School will support certificate eligibility off-chain first, then on-chain minting through GenLayer Intelligent Contracts.</p>

      <section className="section grid two">
        <article className="card">
          <h2>Foundations Certificate</h2>
          <p>Unlock by completing the GenLayer Foundations track and passing its prep quiz.</p>
          <div className="pill-row"><span className="pill">Planned</span><span className="pill">Contract-ready</span></div>
        </article>
        <article className="card">
          <h2>Builder Certificate</h2>
          <p>Unlock by completing contract labs and demonstrating a basic GenLayerJS integration.</p>
          <div className="pill-row"><span className="pill">Planned</span><span className="pill">Python IC</span></div>
        </article>
      </section>
    </div>
  );
}
