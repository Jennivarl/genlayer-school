import { getBackendDiagnostics } from "@/lib/backend/diagnostics";

function statusLabel(status: string) {
  if (status === "ready") return "Ready";
  if (status === "missing") return "Missing";
  return "Check";
}

export default function BackendPage() {
  const diagnostics = getBackendDiagnostics();

  return (
    <div className="page">
      <p className="eyebrow">Operations</p>
      <h1>Backend diagnostics</h1>
      <p className="lede">A safe configuration view for Privy, Supabase, storage mode, and production readiness.</p>

      <section className="section grid">
        <article className="card">
          <p className="meta">Environment</p>
          <h2>{diagnostics.environment}</h2>
          <p>Current runtime mode for this deployment.</p>
        </article>
        <article className="card">
          <p className="meta">Storage</p>
          <h2>{diagnostics.storageDriver}</h2>
          <p>Requested driver: {diagnostics.requestedStorageDriver}.</p>
        </article>
        <article className="card">
          <p className="meta">Production readiness</p>
          <h2>{diagnostics.productionReady ? "Ready" : "Needs setup"}</h2>
          <p>{diagnostics.productionReady ? "Required production checks are satisfied." : "Finish the missing checks before launch."}</p>
        </article>
      </section>

      <section className="section grid two">
        {diagnostics.checks.map((item) => (
          <article className="card" key={item.key}>
            <p className="meta">{item.label}</p>
            <div className="status-row">
              <h2>{statusLabel(item.status)}</h2>
              <span className={`pill status-${item.status}`}>{item.status}</span>
            </div>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      {diagnostics.missingRequiredKeys.length > 0 && (
        <section className="section card">
          <p className="meta">Required before production</p>
          <h2>Missing configuration</h2>
          <div className="pill-row">
            {diagnostics.missingRequiredKeys.map((key) => (
              <span className="pill status-missing" key={key}>{key}</span>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2>Deployment checklist</h2>
        <div className="list">
          {diagnostics.deploymentChecklist.map((item) => (
            <article className="list-item" key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
              <span className={`pill status-${item.complete ? "ready" : "warning"}`}>{item.complete ? "Done" : "Todo"}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
