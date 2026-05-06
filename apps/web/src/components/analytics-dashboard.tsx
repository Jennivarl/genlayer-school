"use client";

import { useCallback, useEffect, useState } from "react";
import type { LearningAnalytics } from "@/lib/backend/progress-store-types";

const ADMIN_TOKEN_SESSION_KEY = "genlayer-school-admin-token";

type AnalyticsResponse = {
  storageDriver?: string;
  contentStorageDriver?: string;
  learning?: LearningAnalytics;
  content?: {
    totalEntries: number;
    weeklyEntries: number;
    spotlightEntries: number;
    publishedEntries: number;
    draftEntries: number;
    recentEntries: Array<{
      id: string;
      kind: "weekly" | "spotlight";
      slug: string;
      title: string;
      status: "draft" | "published";
      updatedAt: string;
    }>;
  };
  error?: string;
};

function getHeaders(token: string) {
  const headers = new Headers();
  if (token.trim()) headers.set("x-admin-token", token.trim());
  return headers;
}

export function AnalyticsDashboard() {
  const [token, setToken] = useState("");
  const [draftToken, setDraftToken] = useState("");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async (nextToken: string) => {
    const response = await fetch("/api/admin/analytics", {
      headers: getHeaders(nextToken),
    });
    const payload = await response.json() as AnalyticsResponse;
    return { response, payload };
  }, []);

  const applyAnalyticsResponse = useCallback((response: Response, payload: AnalyticsResponse) => {
    if (!response.ok) {
      setMessage(payload.error ?? "Could not load analytics.");
      setData(null);
      return;
    }

    setData(payload);
    setMessage(null);
  }, []);

  async function loadAnalytics(nextToken = token) {
    setLoading(true);
    const { response, payload } = await fetchAnalytics(nextToken);
    applyAnalyticsResponse(response, payload);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialAnalytics() {
      const savedToken = window.sessionStorage.getItem(ADMIN_TOKEN_SESSION_KEY) ?? "";
      setToken(savedToken);
      setDraftToken(savedToken);
      const { response, payload } = await fetchAnalytics(savedToken);
      if (!cancelled) applyAnalyticsResponse(response, payload);
    }

    window.setTimeout(() => {
      void loadInitialAnalytics();
    }, 0);

    return () => {
      cancelled = true;
    };
  }, [applyAnalyticsResponse, fetchAnalytics]);

  async function unlockAndLoad() {
    const nextToken = draftToken.trim();
    window.sessionStorage.setItem(ADMIN_TOKEN_SESSION_KEY, nextToken);
    setToken(nextToken);
    await loadAnalytics(nextToken);
  }

  const learning = data?.learning;
  const content = data?.content;

  return (
    <>
      <section className="section card">
        <p className="meta">Admin access</p>
        <h2>Analytics token</h2>
        <div className="form-grid">
          <label>
            <span>Admin token</span>
            <input
              onChange={(event) => setDraftToken(event.target.value)}
              placeholder="Uses the same session token as Admin"
              type="password"
              value={draftToken}
            />
          </label>
        </div>
        <div className="cta-row">
          <button className="button compact" disabled={loading} type="button" onClick={unlockAndLoad}>{loading ? "Loading" : "Load analytics"}</button>
          <button className="button secondary compact" disabled={loading} type="button" onClick={() => loadAnalytics()}>{loading ? "Loading" : "Refresh"}</button>
          {message && <span className="pill status-warning">{message}</span>}
        </div>
      </section>

      <section className="section grid">
        <article className="card"><p className="meta">Learners</p><h2>{learning?.learnerCount ?? 0}</h2><p>{learning?.profileCount ?? 0} learner profiles.</p></article>
        <article className="card"><p className="meta">Lessons completed</p><h2>{learning?.completedLessonCount ?? 0}</h2><p>Total completed lesson records.</p></article>
        <article className="card"><p className="meta">Quiz attempts</p><h2>{learning?.quizAttemptCount ?? 0}</h2><p>{learning?.passedQuizAttemptCount ?? 0} passed, {learning?.averageQuizPercent ?? 0}% average score.</p></article>
      </section>

      <section className="section grid two">
        <article className="card">
          <p className="meta">Certificate lifecycle</p>
          <h2>Certificates</h2>
          <div className="pill-row">
            <span className="pill status-eligible">eligible {learning?.certificateStatusCounts.eligible ?? 0}</span>
            <span className="pill status-mint-pending">pending {learning?.certificateStatusCounts.mint_pending ?? 0}</span>
            <span className="pill status-minted">minted {learning?.certificateStatusCounts.minted ?? 0}</span>
            <span className="pill status-missing">revoked {learning?.certificateStatusCounts.revoked ?? 0}</span>
          </div>
        </article>
        <article className="card">
          <p className="meta">Content operations</p>
          <h2>{content?.totalEntries ?? 0} entries</h2>
          <p>{content?.publishedEntries ?? 0} published, {content?.draftEntries ?? 0} drafts.</p>
          <div className="pill-row">
            <span className="pill">weekly {content?.weeklyEntries ?? 0}</span>
            <span className="pill">spotlights {content?.spotlightEntries ?? 0}</span>
          </div>
        </article>
      </section>

      <section className="section grid two">
        <article className="card">
          <p className="meta">Recent quiz attempts</p>
          <h2>Latest learner activity</h2>
          <div className="list">
            {(learning?.recentQuizAttempts ?? []).map((attempt) => (
              <div className="list-item" key={`${attempt.learnerId}-${attempt.quizSlug}-${attempt.submittedAt}`}>
                <span>{attempt.quizSlug}</span>
                <span className={`pill status-${attempt.passed ? "ready" : "warning"}`}>{attempt.percent}%</span>
              </div>
            ))}
            {(learning?.recentQuizAttempts ?? []).length === 0 && <p>No quiz attempts yet.</p>}
          </div>
        </article>
        <article className="card">
          <p className="meta">Recent content</p>
          <h2>Publishing queue</h2>
          <div className="list">
            {(content?.recentEntries ?? []).map((entry) => (
              <div className="list-item" key={entry.id}>
                <span>{entry.title}</span>
                <span className={`pill status-${entry.status === "published" ? "ready" : "warning"}`}>{entry.kind}</span>
              </div>
            ))}
            {(content?.recentEntries ?? []).length === 0 && <p>No content entries yet.</p>}
          </div>
        </article>
      </section>
    </>
  );
}
