"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CertificateEligibility, LearnerProfile, RegionalTrack } from "@genlayer-school/content";
import { useAuth } from "./app-providers";

type CertificatePathway = CertificateEligibility & {
  record: { status: string } | null;
};

type RegionalCertificateProps = {
  track: RegionalTrack;
};

const templateColors: Record<string, { primary: string; secondary: string; accent: string }> = {
  china: { primary: "#7a1f1f", secondary: "#f6d365", accent: "#ffe9a8" },
  india: { primary: "#1f6f50", secondary: "#f5a623", accent: "#dbeafe" },
  indonesia: { primary: "#a82020", secondary: "#f7f3e8", accent: "#ffdfdf" },
  latam: { primary: "#245c9c", secondary: "#f7c948", accent: "#c6f6d5" },
  nigeria: { primary: "#0b6b3a", secondary: "#f4f0e8", accent: "#7ee787" },
  russia: { primary: "#253b80", secondary: "#d23f3f", accent: "#f4f0e8" },
  korea: { primary: "#243b6b", secondary: "#d94b4b", accent: "#f4f0e8" },
  turkey: { primary: "#8a1d2c", secondary: "#f4f0e8", accent: "#ffccd5" },
  ukraine: { primary: "#1d4f91", secondary: "#f7c948", accent: "#dbeafe" },
  vietnam: { primary: "#9d1b1b", secondary: "#f7c948", accent: "#ffe9a8" },
};

function certificateSlug(track: RegionalTrack): string {
  return `${track.slug}-regional-certificate`;
}

function getDisplayName(profile: LearnerProfile | null): string {
  return profile?.username ?? profile?.displayName ?? "GenLayer Learner";
}

function drawCertificate(canvas: HTMLCanvasElement, track: RegionalTrack, name: string) {
  const palette = templateColors[track.slug] ?? templateColors.latam;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = 1600;
  const height = 1000;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#f8f4ea";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = palette.primary;
  ctx.fillRect(0, 0, width, 110);
  ctx.fillRect(0, height - 110, width, 110);

  ctx.strokeStyle = palette.secondary;
  ctx.lineWidth = 16;
  ctx.strokeRect(54, 54, width - 108, height - 108);

  ctx.strokeStyle = palette.primary;
  ctx.lineWidth = 3;
  ctx.strokeRect(92, 92, width - 184, height - 184);

  ctx.fillStyle = palette.primary;
  ctx.font = "700 54px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GenLayer School", width / 2, 210);

  ctx.fillStyle = "#25312d";
  ctx.font = "700 72px Arial";
  ctx.fillText("Certificate of Completion", width / 2, 320);

  ctx.fillStyle = "#51615a";
  ctx.font = "32px Arial";
  ctx.fillText("This certifies that", width / 2, 405);

  ctx.fillStyle = palette.primary;
  ctx.font = "700 76px Georgia";
  ctx.fillText(name, width / 2, 510);

  ctx.fillStyle = "#51615a";
  ctx.font = "32px Arial";
  ctx.fillText("completed the regional GenLayer basics track", width / 2, 585);

  ctx.fillStyle = "#25312d";
  ctx.font = "700 42px Arial";
  ctx.fillText(track.certificateTitle, width / 2, 660);

  ctx.fillStyle = "#51615a";
  ctx.font = "28px Arial";
  ctx.fillText(`${track.regionName} - ${track.languageName}`, width / 2, 720);
  ctx.fillText(new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), width / 2, 770);

  ctx.fillStyle = palette.primary;
  ctx.font = "700 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Regional template placeholder", 130, 870);

  ctx.textAlign = "right";
  ctx.fillText("GenLayer Community", width - 130, 870);

  ctx.fillStyle = palette.secondary;
  ctx.beginPath();
  ctx.arc(800, 850, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.primary;
  ctx.font = "700 30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GL", 800, 861);
}

export function RegionalCertificate({ track }: RegionalCertificateProps) {
  const auth = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [certificate, setCertificate] = useState<CertificatePathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const name = getDisplayName(profile);
  const hasUsername = Boolean(profile?.username);
  const eligible = Boolean(certificate?.eligible);

  const redraw = useCallback(() => {
    if (canvasRef.current) drawCertificate(canvasRef.current, track, name);
  }, [name, track]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    let cancelled = false;

    async function loadCertificateState() {
      setLoading(true);
      setError(null);
      const [profileResponse, certificateResponse] = await Promise.all([
        auth.authFetch("/api/profile"),
        auth.authFetch("/api/certificates"),
      ]);
      const profilePayload = await profileResponse.json() as { profile?: LearnerProfile; error?: string };
      const certificatePayload = await certificateResponse.json() as { certificates?: CertificatePathway[]; error?: string };

      if (cancelled) return;

      if (!profileResponse.ok || !certificateResponse.ok) {
        setError(profilePayload.error ?? certificatePayload.error ?? "Could not load certificate state.");
        setLoading(false);
        return;
      }

      setProfile(profilePayload.profile ?? null);
      setCertificate((certificatePayload.certificates ?? []).find((item) => item.certificateSlug === certificateSlug(track)) ?? null);
      setLoading(false);
    }

    if (auth.ready) void loadCertificateState();

    return () => {
      cancelled = true;
    };
  }, [auth, track]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas || !eligible || !hasUsername) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${track.slug}-genlayer-certificate-${profile?.username}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  if (!auth.authenticated && auth.configured) {
    return (
      <section className="section card">
        <p className="eyebrow">Certificate locked</p>
        <h2>Sign in to download your regional certificate</h2>
        <p>Your certificate uses your GenLayer School username, so you need to sign in first.</p>
        <button className="button" type="button" onClick={auth.login}>Sign in</button>
      </section>
    );
  }

  return (
    <section className="section grid two">
      <article className="card">
        <p className="eyebrow">Regional certificate</p>
        <h2>{track.certificateTitle}</h2>
        <p>
          This placeholder template will be replaced by your final regional certificate design later. The username overlay and download flow will stay the same.
        </p>
        {loading && <p className="meta">Checking profile and eligibility.</p>}
        {error && <p className="meta">{error}</p>}
        <div className="list">
          <div className="list-item">
            <span>Signed in</span>
            <span className="pill">{auth.authenticated || !auth.configured ? "Done" : "Pending"}</span>
          </div>
          <div className="list-item">
            <span>Username set</span>
            <span className="pill">{hasUsername ? "Done" : "Pending"}</span>
          </div>
          {(certificate?.requirements ?? []).map((requirement) => (
            <div className="list-item" key={requirement.label}>
              <span>{requirement.label}</span>
              <span className="pill">{requirement.complete ? "Done" : "Pending"}</span>
            </div>
          ))}
        </div>
        <div className="cta-row">
          <button className="button" disabled={!eligible || !hasUsername || loading} type="button" onClick={downloadPng}>
            Download PNG
          </button>
          {!hasUsername && <Link className="button secondary" href="/dashboard">Set username</Link>}
          {!eligible && <Link className="button secondary" href={`/regions/${track.slug}`}>Complete track</Link>}
        </div>
      </article>

      <article className="card certificate-preview-card">
        <canvas ref={canvasRef} className="certificate-canvas" aria-label={`${track.certificateTitle} preview`} />
      </article>
    </section>
  );
}
