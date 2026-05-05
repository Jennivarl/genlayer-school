"use client";

import { useCallback, useEffect, useState } from "react";
import type { CertificateEligibility, CertificateRecord } from "@genlayer-school/content";
import { useAuth } from "./app-providers";

type CertificatePathway = CertificateEligibility & {
  record: CertificateRecord | null;
};

type ProgressResponse = {
  certificates?: CertificatePathway[];
  error?: string;
};

export function CertificatePathways() {
  const auth = useAuth();
  const [certificates, setCertificates] = useState<CertificatePathway[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingSlug, setRequestingSlug] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    const response = await auth.authFetch("/api/certificates");
    const payload = await response.json() as ProgressResponse;
    return { response, payload };
  }, [auth]);

  const applyCertificateResponse = useCallback((response: Response, payload: ProgressResponse) => {
    if (!response.ok) {
      setError(payload.error ?? "Could not load certificate pathways.");
      setCertificates([]);
    } else {
      setError(null);
      setCertificates(payload.certificates ?? []);
    }
    setLoading(false);
  }, []);

  async function refreshCertificates() {
    setLoading(true);
    const { response, payload } = await fetchCertificates();
    applyCertificateResponse(response, payload);
  }


  useEffect(() => {
    let cancelled = false;

    async function loadInitialCertificates() {
      const { response, payload } = await fetchCertificates();
      if (!cancelled) applyCertificateResponse(response, payload);
    }

    if (auth.ready) void loadInitialCertificates();

    return () => {
      cancelled = true;
    };
  }, [applyCertificateResponse, auth.ready, fetchCertificates]);

  async function requestMint(certificateSlug: string) {
    setRequestingSlug(certificateSlug);
    setError(null);
    const response = await auth.authFetch("/api/certificates/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ certificateSlug }),
    });
    const payload = await response.json() as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Could not request certificate mint.");
    } else {
      await refreshCertificates();
    }

    setRequestingSlug(null);
  }

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
          <p className="meta">{certificate.record?.status ?? (certificate.eligible ? "eligible" : "requirements pending")}</p>
          <h2>{certificate.title}</h2>
          <div className="list">
            {certificate.requirements.map((requirement) => (
              <div className="list-item" key={requirement.label}>
                <span>{requirement.label}</span>
                <span className="pill">{requirement.complete ? "Done" : "Pending"}</span>
              </div>
            ))}
          </div>
          <div className="cta-row">
            <button
              className="button compact"
              disabled={!certificate.eligible || certificate.record?.status === "mint_pending" || certificate.record?.status === "minted" || requestingSlug === certificate.certificateSlug}
              onClick={() => requestMint(certificate.certificateSlug)}
              type="button"
            >
              {requestingSlug === certificate.certificateSlug ? "Requesting" : certificate.record?.status === "mint_pending" ? "Mint pending" : certificate.record?.status === "minted" ? "Minted" : "Request mint"}
            </button>
            <span className={`pill ${certificate.record ? `status-${certificate.record.status.replace("_", "-")}` : ""}`}>
              {certificate.record?.status ?? "not eligible"}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}
