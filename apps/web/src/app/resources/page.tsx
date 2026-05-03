export default function ResourcesPage() {
  return (
    <div className="page">
      <p className="eyebrow">Resources</p>
      <h1>Builder resources</h1>
      <p className="lede">Curated links for learning, building, and staying close to GenLayer ecosystem updates.</p>

      <section className="section grid">
        <a className="card" href="https://docs.genlayer.com/">
          <h2>GenLayer Docs</h2>
          <p>Official documentation for Intelligent Contracts, GenLayerJS, testing, and developer workflows.</p>
        </a>
        <a className="card" href="https://studio.genlayer.com/contracts">
          <h2>GenLayer Studio</h2>
          <p>Browser-based environment for exploring and testing GenLayer contract ideas.</p>
        </a>
        <a className="card" href="https://github.com/genlayerlabs">
          <h2>GenLayer GitHub</h2>
          <p>Official GenLayer repositories, tooling, SDKs, and examples.</p>
        </a>
      </section>
    </div>
  );
}
