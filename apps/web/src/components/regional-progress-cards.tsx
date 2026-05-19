"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CertificateEligibility, LearnerProgress, RegionalTrack } from "@genlayer-school/content";
import { useAuth } from "./app-providers";

type ProgressResponse = {
  progress?: LearnerProgress;
  certificates?: CertificateEligibility[];
  error?: string;
};

type RegionalStatus = {
  label: string;
  tone: "missing" | "warning" | "ready";
  href: string;
  action: string;
};

function getRegionalStatus(track: RegionalTrack, progress?: LearnerProgress, certificates: CertificateEligibility[] = []): RegionalStatus {
  const completedLessons = new Set(progress?.completedLessons ?? []);
  const completedLessonCount = track.lessons.filter((lesson) => completedLessons.has(`${track.slug}/${lesson.slug}`)).length;
  const lessonComplete = completedLessonCount === track.lessons.length;
  const quizPassed = progress?.quizAttempts.some((attempt) => attempt.quizSlug === track.quiz.slug && attempt.passed) ?? false;
  const certificate = certificates.find((item) => item.certificateSlug === `${track.slug}-regional-certificate`);

  if (certificate?.eligible) {
    return {
      label: "Certificate ready",
      tone: "ready",
      href: `/regions/${track.slug}/certificate`,
      action: "Download certificate",
    };
  }

  if (quizPassed) {
    return {
      label: "Quiz passed",
      tone: "ready",
      href: `/regions/${track.slug}/certificate`,
      action: "Open certificate",
    };
  }

  if (lessonComplete) {
    return {
      label: "Lesson complete",
      tone: "warning",
      href: `/regions/${track.slug}/quiz`,
      action: "Take quiz",
    };
  }

  if (completedLessonCount > 0) {
    return {
      label: "In progress",
      tone: "warning",
      href: `/regions/${track.slug}`,
      action: "Continue",
    };
  }

  return {
    label: "Not started",
    tone: "missing",
    href: `/regions/${track.slug}`,
    action: "Start learning",
  };
}

export function RegionalProgressCards({ tracks, compact = false }: { tracks: RegionalTrack[]; compact?: boolean }) {
  const auth = useAuth();
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      setLoading(true);
      setError(null);
      const response = await auth.authFetch("/api/progress");
      const payload = await response.json() as ProgressResponse;

      if (cancelled) return;
      if (!response.ok) {
        setError(payload.error ?? "Could not load regional progress.");
        setData(null);
      } else {
        setData(payload);
      }
      setLoading(false);
    }

    if (auth.ready) void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [auth]);

  const cards = useMemo(() => {
    return tracks.map((track) => ({
      track,
      status: getRegionalStatus(track, data?.progress, data?.certificates ?? []),
    }));
  }, [data, tracks]);

  if (loading) {
    return (
      <section className={compact ? "section" : "section grid two"}>
        <article className="card">
          <p className="meta">Regional progress</p>
          <h2>Loading</h2>
          <p>Checking lessons, quiz passes, and certificate readiness.</p>
        </article>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <article className="card">
          <p className="meta">Regional progress unavailable</p>
          <h2>Sign in to track progress</h2>
          <p>{error}</p>
          {auth.configured && !auth.authenticated && (
            <button className="button compact" type="button" onClick={auth.login}>Sign in</button>
          )}
        </article>
      </section>
    );
  }

  return (
    <section className={compact ? "section" : "section region-grid"}>
      {cards.map(({ track, status }) => (
        <article className="card region-card" key={track.slug}>
          <div className="status-row">
            <p className="meta">{track.regionName}</p>
            <span className={`pill status-${status.tone}`}>{status.label}</span>
          </div>
          <h2>{track.nativeRegionName}</h2>
          <p>{track.certificateTitle}</p>
          <div className="pill-row">
            <span className="pill">{track.nativeLanguageName}</span>
            <span className="pill">{track.lessons.length} lesson</span>
          </div>
          <div className="cta-row">
            <Link className="button compact" href={status.href}>{status.action}</Link>
            {!compact && <Link className="button secondary compact" href={`/regions/${track.slug}/quiz`}>Quiz</Link>}
          </div>
        </article>
      ))}
    </section>
  );
}
