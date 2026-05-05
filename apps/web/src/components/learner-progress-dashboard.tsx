"use client";

import { useEffect, useState } from "react";
import { courses, weeklySummaries, type CertificateEligibility, type LearnerProgress } from "@genlayer-school/content";
import { useAuth } from "./app-providers";

type ProgressSummary = {
  learnerId: string;
  completedLessonCount: number;
  lessonTotal: number;
  lessonPercent: number;
  passedQuizCount: number;
  quizAttemptCount: number;
  updatedAt: string;
};

type ProgressResponse = {
  progress?: LearnerProgress;
  summary?: ProgressSummary;
  certificates?: CertificateEligibility[];
  error?: string;
};

const lessonTotal = courses.reduce((total, course) => total + course.lessons.length, 0);

export function LearnerProgressDashboard() {
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
        setError(payload.error ?? "Could not load progress.");
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

  if (loading) {
    return (
      <section className="section grid">
        <article className="card"><p className="meta">Lessons</p><h2>Loading</h2><p>Fetching learner progress.</p></article>
        <article className="card"><p className="meta">Quiz attempts</p><h2>Loading</h2><p>Checking quiz history.</p></article>
        <article className="card"><p className="meta">Weekly prep</p><h2>{weeklySummaries.length}</h2><p>Gen-Fren prep issue ready.</p></article>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <article className="card">
          <p className="meta">Progress unavailable</p>
          <h2>Could not load dashboard</h2>
          <p>{error}</p>
          {auth.configured && !auth.authenticated && (
            <button className="button compact" type="button" onClick={auth.login}>Sign in</button>
          )}
        </article>
      </section>
    );
  }

  const summary = data?.summary;
  const certificates = data?.certificates ?? [];

  return (
    <>
      <section className="section grid">
        <article className="card"><p className="meta">Lessons</p><h2>{summary?.completedLessonCount ?? 0}/{summary?.lessonTotal ?? lessonTotal}</h2><p>{summary?.lessonPercent ?? 0}% complete.</p></article>
        <article className="card"><p className="meta">Quiz attempts</p><h2>{summary?.quizAttemptCount ?? 0}</h2><p>{summary?.passedQuizCount ?? 0} passed quiz checkpoints.</p></article>
        <article className="card"><p className="meta">Weekly prep</p><h2>{weeklySummaries.length}</h2><p>Gen-Fren prep issue ready.</p></article>
      </section>

      <section className="section grid two">
        {certificates.map((certificate) => (
          <article className="card" key={certificate.certificateSlug}>
            <p className="meta">{certificate.eligible ? "Eligible" : "In progress"}</p>
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
    </>
  );
}
