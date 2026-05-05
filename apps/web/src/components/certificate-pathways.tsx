"use client";

import { useEffect, useState } from "react";
import type { CertificateEligibility } from "@genlayer-school/content";
import { useAuth } from "./app-providers";

type ProgressResponse = {
  certificates?: CertificateEligibility[];
  error?: string;
};

export function CertificatePathways() {
  const auth = useAuth();
  const [certificates, setCertificates] = useState<CertificateEligibility[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCertificates() {
      setLoading(true);
      setError(null);
      const response = await auth.authFetch("/api/progress");
      const payload = await response.json() as ProgressResponse;

      if (cancelled) return;
      if (!response.ok) {
        setError(payload.error ?? "Could not load certificate pathways.");
        setCertificates([]);
      } else {
        setCertificates(payload.certificates ?? []);
      }
      setLoading(false);
    }

    if (auth.ready) void loadCertificates();

    return () => {
      cancelled = true;
    };
  }, [auth]);

  if (loading) {
    return (
      <section className="section grid two">
        <article className="card"><p className="meta">Certification</p><h2>Loading</h2><p>Checking eligibility requirements.</p></article>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <article className="card">
          <p className="meta">Certification unavailable</p>
          <h2>Could not load pathways</h2>
          <p>{error}</p>
          {auth.configured && !auth.authenticated && (
            <button className="button compact" type="button" onClick={auth.login}>Sign in</button>
          )}
        </article>
      </section>
    );
  }

  return (
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
  );
}
