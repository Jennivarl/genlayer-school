"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminContentEntry, AdminContentKind, AdminContentStatus } from "@genlayer-school/content";
import { communitySpotlights, weeklySummaries } from "@genlayer-school/content";

type AdminContentResponse = {
  storageDriver?: string;
  entries?: AdminContentEntry[];
  entry?: AdminContentEntry;
  error?: string;
};

const weeklyTemplate = JSON.stringify(weeklySummaries[0], null, 2);
const spotlightTemplate = JSON.stringify(communitySpotlights[0], null, 2);

function getHeaders(token: string) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token.trim()) headers.set("x-admin-token", token.trim());
  return headers;
}

export function AdminContentConsole() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<AdminContentStatus>("draft");
  const [weeklyJson, setWeeklyJson] = useState(weeklyTemplate);
  const [spotlightJson, setSpotlightJson] = useState(spotlightTemplate);
  const [entries, setEntries] = useState<AdminContentEntry[]>([]);
  const [storageDriver, setStorageDriver] = useState("unknown");
  const [message, setMessage] = useState<string | null>(null);
  const [savingKind, setSavingKind] = useState<AdminContentKind | null>(null);

  const counts = useMemo(() => ({
    weekly: entries.filter((entry) => entry.kind === "weekly").length,
    spotlight: entries.filter((entry) => entry.kind === "spotlight").length,
    published: entries.filter((entry) => entry.status === "published").length,
  }), [entries]);

  const applyEntriesResponse = useCallback((response: Response, payload: AdminContentResponse) => {
    if (!response.ok) {
      setMessage(payload.error ?? "Could not load admin content.");
      return;
    }
    setStorageDriver(payload.storageDriver ?? "unknown");
    setEntries(payload.entries ?? []);
    setMessage(null);
  }, []);

  const fetchEntries = useCallback(async (nextToken: string) => {
    const response = await fetch("/api/admin/content", {
      headers: getHeaders(nextToken),
    });
    const payload = await response.json() as AdminContentResponse;
    return { response, payload };
  }, []);

  async function loadEntries(nextToken = token) {
    const { response, payload } = await fetchEntries(nextToken);
    applyEntriesResponse(response, payload);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialEntries() {
      const { response, payload } = await fetchEntries("");
      if (!cancelled) applyEntriesResponse(response, payload);
    }

    void loadInitialEntries();

    return () => {
      cancelled = true;
    };
  }, [applyEntriesResponse, fetchEntries]);

  async function save(kind: AdminContentKind) {
    setSavingKind(kind);
    setMessage(null);

    try {
      const payload = JSON.parse(kind === "weekly" ? weeklyJson : spotlightJson) as unknown;
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ kind, status, payload }),
      });
      const data = await response.json() as AdminContentResponse;

      if (!response.ok) {
        setMessage(data.error ?? "Could not save content.");
      } else {
        setMessage(`${kind === "weekly" ? "Weekly summary" : "Spotlight"} saved as ${status}.`);
        await loadEntries();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid JSON payload.");
    }

    setSavingKind(null);
  }

  return (
    <>
      <section className="section grid">
        <article className="card">
          <p className="meta">Storage</p>
          <h2>{storageDriver}</h2>
          <p>Admin content uses the same local/Supabase driver as the backend.</p>
        </article>
        <article className="card">
          <p className="meta">Drafts and posts</p>
          <h2>{entries.length}</h2>
          <p>{counts.weekly} weekly entries and {counts.spotlight} spotlights.</p>
        </article>
        <article className="card">
          <p className="meta">Published</p>
          <h2>{counts.published}</h2>
          <p>Published entries are ready for public content integration.</p>
        </article>
      </section>

      <section className="section card">
        <p className="meta">Admin access</p>
        <h2>Token</h2>
        <div className="form-grid">
          <label>
            <span>Admin token</span>
            <input
              onChange={(event) => setToken(event.target.value)}
              placeholder="Only required when ADMIN_ACCESS_TOKEN is set"
              type="password"
              value={token}
            />
          </label>
          <label>
            <span>Save status</span>
            <select onChange={(event) => setStatus(event.target.value as AdminContentStatus)} value={status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        <div className="cta-row">
          <button className="button secondary compact" type="button" onClick={() => loadEntries()}>Refresh</button>
          {message && <span className="pill">{message}</span>}
        </div>
      </section>

      <section className="section grid two">
        <article className="card editor-card">
          <p className="meta">Gen-Fren weekly</p>
          <h2>Summary and prep quiz</h2>
          <textarea value={weeklyJson} onChange={(event) => setWeeklyJson(event.target.value)} spellCheck={false} />
          <button className="button compact" disabled={savingKind === "weekly"} type="button" onClick={() => save("weekly")}>
            {savingKind === "weekly" ? "Saving" : "Save weekly"}
          </button>
        </article>

        <article className="card editor-card">
          <p className="meta">Community spotlight</p>
          <h2>Monthly feature</h2>
          <textarea value={spotlightJson} onChange={(event) => setSpotlightJson(event.target.value)} spellCheck={false} />
          <button className="button compact" disabled={savingKind === "spotlight"} type="button" onClick={() => save("spotlight")}>
            {savingKind === "spotlight" ? "Saving" : "Save spotlight"}
          </button>
        </article>
      </section>

      <section className="section">
        <h2>Content queue</h2>
        <div className="list">
          {entries.map((entry) => (
            <article className="list-item" key={entry.id}>
              <span>{entry.title}</span>
              <span className={`pill status-${entry.status === "published" ? "ready" : "warning"}`}>{entry.kind} · {entry.status}</span>
            </article>
          ))}
          {entries.length === 0 && <article className="card"><p>No admin content entries yet.</p></article>}
        </div>
      </section>
    </>
  );
}
