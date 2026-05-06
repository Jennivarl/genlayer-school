"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AdminContentEntry,
  AdminContentKind,
  AdminContentPayload,
  AdminContentStatus,
  CommunitySpotlight,
  Quiz,
  QuizQuestion,
  SpotlightItem,
  WeeklySummary,
} from "@genlayer-school/content";
import { communitySpotlights, weeklySummaries } from "@genlayer-school/content";

type AdminContentResponse = {
  storageDriver?: string;
  entries?: AdminContentEntry[];
  entry?: AdminContentEntry;
  error?: string;
};

const ADMIN_TOKEN_SESSION_KEY = "genlayer-school-admin-token";

type WeeklyForm = {
  slug: string;
  weekOf: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  links: SpotlightItem[];
  contentText: string;
  quiz: Quiz;
};

type SpotlightForm = {
  slug: string;
  month: string;
  title: string;
  featuredBuilder: string;
  featuredProject: string;
  highlights: SpotlightItem[];
  contentText: string;
};

function getHeaders(token: string) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token.trim()) headers.set("x-admin-token", token.trim());
  return headers;
}

function textToContent(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((text) => ({ type: "paragraph" as const, text }));
}

function contentToText(payload: { content: Array<{ type: string; text?: string; title?: string; items?: string[] }> }) {
  return payload.content
    .map((block) => {
      if (block.type === "list") return block.items?.join("\n") ?? "";
      if (block.type === "callout") return [block.title, block.text].filter(Boolean).join("\n");
      return block.text ?? "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function createQuestion(index: number): QuizQuestion {
  return {
    id: `q${index}`,
    prompt: "",
    options: ["", "", "", ""],
    correctOption: 0,
    explanation: "",
  };
}

function toWeeklyForm(summary: WeeklySummary): WeeklyForm {
  return {
    slug: summary.slug,
    weekOf: summary.weekOf,
    title: summary.title,
    summary: summary.summary,
    keyConcepts: [...summary.keyConcepts],
    links: summary.links.map((link) => ({ ...link })),
    contentText: contentToText(summary),
    quiz: {
      ...summary.quiz,
      questions: summary.quiz.questions.map((question) => ({
        ...question,
        options: [...question.options],
      })),
    },
  };
}

function toSpotlightForm(spotlight: CommunitySpotlight): SpotlightForm {
  return {
    slug: spotlight.slug,
    month: spotlight.month,
    title: spotlight.title,
    featuredBuilder: spotlight.featuredBuilder,
    featuredProject: spotlight.featuredProject,
    highlights: spotlight.highlights.map((item) => ({ ...item })),
    contentText: contentToText(spotlight),
  };
}

function weeklyPayload(form: WeeklyForm): WeeklySummary {
  return {
    slug: form.slug.trim(),
    weekOf: form.weekOf.trim(),
    title: form.title.trim(),
    summary: form.summary.trim(),
    keyConcepts: form.keyConcepts.map((item) => item.trim()).filter(Boolean),
    links: form.links.filter((link) => link.title.trim()).map((link) => ({
      title: link.title.trim(),
      description: link.description.trim(),
      url: link.url?.trim() || undefined,
    })),
    content: textToContent(form.contentText),
    quiz: {
      ...form.quiz,
      slug: form.quiz.slug.trim(),
      title: form.quiz.title.trim(),
      questions: form.quiz.questions.map((question, index) => ({
        ...question,
        id: question.id.trim() || `q${index + 1}`,
        prompt: question.prompt.trim(),
        options: question.options.map((option) => option.trim()),
        explanation: question.explanation.trim(),
      })),
    },
  };
}

function spotlightPayload(form: SpotlightForm): CommunitySpotlight {
  return {
    slug: form.slug.trim(),
    month: form.month.trim(),
    title: form.title.trim(),
    featuredBuilder: form.featuredBuilder.trim(),
    featuredProject: form.featuredProject.trim(),
    highlights: form.highlights.filter((item) => item.title.trim()).map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
      url: item.url?.trim() || undefined,
    })),
    content: textToContent(form.contentText),
  };
}

function validateWeekly(payload: WeeklySummary): string | null {
  if (!payload.slug || !payload.title || !payload.summary) return "Weekly slug, title, and summary are required.";
  if (!payload.weekOf) return "Week of is required.";
  if (!payload.quiz.slug || !payload.quiz.title) return "Quiz slug and title are required.";
  if (payload.quiz.questions.some((question) => !question.prompt || question.options.some((option) => !option))) {
    return "Every quiz question needs a prompt and four options.";
  }
  return null;
}

function validateSpotlight(payload: CommunitySpotlight): string | null {
  if (!payload.slug || !payload.title || !payload.month) return "Spotlight slug, title, and month are required.";
  if (!payload.featuredBuilder || !payload.featuredProject) return "Featured builder and project are required.";
  return null;
}

export function AdminContentConsole() {
  const [draftToken, setDraftToken] = useState("");
  const [token, setToken] = useState("");
  const [locked, setLocked] = useState(true);
  const [weekly, setWeekly] = useState<WeeklyForm>(() => toWeeklyForm(weeklySummaries[0]));
  const [spotlight, setSpotlight] = useState<SpotlightForm>(() => toSpotlightForm(communitySpotlights[0]));
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
      const savedToken = window.sessionStorage.getItem(ADMIN_TOKEN_SESSION_KEY) ?? "";
      const { response, payload } = await fetchEntries(savedToken);
      if (!cancelled) applyEntriesResponse(response, payload);
      if (!cancelled && savedToken) {
        setToken(savedToken);
        setDraftToken(savedToken);
        setLocked(false);
      }
    }

    window.setTimeout(() => {
      void loadInitialEntries();
    }, 0);

    return () => {
      cancelled = true;
    };
  }, [applyEntriesResponse, fetchEntries]);

  async function unlockAdmin() {
    const nextToken = draftToken.trim();
    window.sessionStorage.setItem(ADMIN_TOKEN_SESSION_KEY, nextToken);
    setToken(nextToken);
    setLocked(false);
    setMessage(nextToken ? "Admin unlocked for this browser session." : "Admin unlocked in local mode.");
    await loadEntries(nextToken);
  }

  function lockAdmin() {
    window.sessionStorage.removeItem(ADMIN_TOKEN_SESSION_KEY);
    setToken("");
    setDraftToken("");
    setLocked(true);
    setEntries([]);
    setStorageDriver("locked");
    setMessage("Admin locked.");
  }

  async function save(kind: AdminContentKind, status: AdminContentStatus) {
    if (locked) {
      setMessage("Unlock admin before saving content.");
      return;
    }

    setSavingKind(kind);
    setMessage(null);

    const payload: AdminContentPayload = kind === "weekly" ? weeklyPayload(weekly) : spotlightPayload(spotlight);
    const validationError = kind === "weekly" ? validateWeekly(payload as WeeklySummary) : validateSpotlight(payload as CommunitySpotlight);

    if (validationError) {
      setMessage(validationError);
      setSavingKind(null);
      return;
    }

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

    setSavingKind(null);
  }

  function loadEntry(entry: AdminContentEntry) {
    if (locked) {
      setMessage("Unlock admin before editing content.");
      return;
    }

    if (entry.kind === "weekly") setWeekly(toWeeklyForm(entry.payload as WeeklySummary));
    else setSpotlight(toSpotlightForm(entry.payload as CommunitySpotlight));
    setMessage(`Loaded ${entry.title}.`);
  }

  function updateWeeklyLink(index: number, patch: Partial<SpotlightItem>) {
    setWeekly((current) => ({
      ...current,
      links: current.links.map((link, itemIndex) => itemIndex === index ? { ...link, ...patch } : link),
    }));
  }

  function updateHighlight(index: number, patch: Partial<SpotlightItem>) {
    setSpotlight((current) => ({
      ...current,
      highlights: current.highlights.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
    }));
  }

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setWeekly((current) => ({
      ...current,
      quiz: {
        ...current.quiz,
        questions: current.quiz.questions.map((question, itemIndex) => itemIndex === index ? { ...question, ...patch } : question),
      },
    }));
  }

  function updateQuestionOption(questionIndex: number, optionIndex: number, value: string) {
    setWeekly((current) => ({
      ...current,
      quiz: {
        ...current.quiz,
        questions: current.quiz.questions.map((question, itemIndex) => itemIndex === questionIndex
          ? { ...question, options: question.options.map((option, index) => index === optionIndex ? value : option) }
          : question),
      },
    }));
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
          <p>Published entries appear on public weekly and spotlight pages.</p>
        </article>
      </section>

      <section className="section card">
        <p className="meta">Admin access</p>
        <div className="status-row">
          <h2>{locked ? "Locked" : "Unlocked"}</h2>
          <span className={`pill status-${locked ? "warning" : "ready"}`}>{locked ? "locked" : "session active"}</span>
        </div>
        <div className="form-grid">
          <label>
            <span>Admin token</span>
            <input
              onChange={(event) => setDraftToken(event.target.value)}
              placeholder="Only required when ADMIN_ACCESS_TOKEN is set"
              type="password"
              value={draftToken}
            />
          </label>
        </div>
        <div className="cta-row">
          <button className="button compact" type="button" onClick={unlockAdmin}>Unlock admin</button>
          <button className="button secondary compact" disabled={locked} type="button" onClick={lockAdmin}>Lock admin</button>
          <button className="button secondary compact" disabled={locked} type="button" onClick={() => loadEntries()}>Refresh</button>
          {message && <span className="pill">{message}</span>}
        </div>
      </section>

      {locked && (
        <section className="section card">
          <p className="meta">Content tools paused</p>
          <h2>Unlock admin to edit</h2>
          <p>Drafting and publishing controls stay hidden until this browser session is unlocked.</p>
        </section>
      )}

      {!locked && <section className="section grid two">
        <article className="card admin-form">
          <p className="meta">Gen-Fren weekly</p>
          <h2>Summary and prep quiz</h2>
          <div className="form-grid">
            <label><span>Title</span><input value={weekly.title} onChange={(event) => setWeekly({ ...weekly, title: event.target.value })} /></label>
            <label><span>Slug</span><input value={weekly.slug} onChange={(event) => setWeekly({ ...weekly, slug: event.target.value })} /></label>
            <label><span>Week of</span><input value={weekly.weekOf} onChange={(event) => setWeekly({ ...weekly, weekOf: event.target.value })} /></label>
            <label><span>Quiz pass percent</span><input type="number" min={0} max={100} value={weekly.quiz.passPercent} onChange={(event) => setWeekly({ ...weekly, quiz: { ...weekly.quiz, passPercent: Number(event.target.value) } })} /></label>
          </div>
          <label className="field-block"><span>Summary</span><textarea value={weekly.summary} onChange={(event) => setWeekly({ ...weekly, summary: event.target.value })} /></label>
          <label className="field-block"><span>Article body</span><textarea value={weekly.contentText} onChange={(event) => setWeekly({ ...weekly, contentText: event.target.value })} /></label>

          <div className="sub-editor">
            <div className="status-row"><h3>Key concepts</h3><button className="button secondary compact" type="button" onClick={() => setWeekly({ ...weekly, keyConcepts: [...weekly.keyConcepts, ""] })}>Add</button></div>
            {weekly.keyConcepts.map((concept, index) => (
              <div className="inline-editor" key={`concept-${index}`}>
                <input value={concept} onChange={(event) => setWeekly({ ...weekly, keyConcepts: weekly.keyConcepts.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} />
                <button className="button secondary compact" type="button" onClick={() => setWeekly({ ...weekly, keyConcepts: weekly.keyConcepts.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
              </div>
            ))}
          </div>

          <div className="sub-editor">
            <div className="status-row"><h3>Links</h3><button className="button secondary compact" type="button" onClick={() => setWeekly({ ...weekly, links: [...weekly.links, { title: "", description: "", url: "" }] })}>Add</button></div>
            {weekly.links.map((link, index) => (
              <div className="stack-editor" key={`weekly-link-${index}`}>
                <input placeholder="Title" value={link.title} onChange={(event) => updateWeeklyLink(index, { title: event.target.value })} />
                <input placeholder="Description" value={link.description} onChange={(event) => updateWeeklyLink(index, { description: event.target.value })} />
                <input placeholder="URL" value={link.url ?? ""} onChange={(event) => updateWeeklyLink(index, { url: event.target.value })} />
                <button className="button secondary compact" type="button" onClick={() => setWeekly({ ...weekly, links: weekly.links.filter((_, itemIndex) => itemIndex !== index) })}>Remove link</button>
              </div>
            ))}
          </div>

          <div className="sub-editor">
            <div className="status-row"><h3>Quiz</h3><button className="button secondary compact" type="button" onClick={() => setWeekly({ ...weekly, quiz: { ...weekly.quiz, questions: [...weekly.quiz.questions, createQuestion(weekly.quiz.questions.length + 1)] } })}>Add question</button></div>
            <div className="form-grid">
              <label><span>Quiz title</span><input value={weekly.quiz.title} onChange={(event) => setWeekly({ ...weekly, quiz: { ...weekly.quiz, title: event.target.value } })} /></label>
              <label><span>Quiz slug</span><input value={weekly.quiz.slug} onChange={(event) => setWeekly({ ...weekly, quiz: { ...weekly.quiz, slug: event.target.value } })} /></label>
            </div>
            {weekly.quiz.questions.map((question, questionIndex) => (
              <div className="stack-editor" key={`question-${questionIndex}`}>
                <input placeholder="Question prompt" value={question.prompt} onChange={(event) => updateQuestion(questionIndex, { prompt: event.target.value })} />
                {question.options.map((option, optionIndex) => (
                  <input key={`question-${questionIndex}-option-${optionIndex}`} placeholder={`Option ${optionIndex + 1}`} value={option} onChange={(event) => updateQuestionOption(questionIndex, optionIndex, event.target.value)} />
                ))}
                <label><span>Correct option</span><select value={question.correctOption} onChange={(event) => updateQuestion(questionIndex, { correctOption: Number(event.target.value) })}>{question.options.map((_, index) => <option key={index} value={index}>Option {index + 1}</option>)}</select></label>
                <input placeholder="Explanation" value={question.explanation} onChange={(event) => updateQuestion(questionIndex, { explanation: event.target.value })} />
                <button className="button secondary compact" type="button" onClick={() => setWeekly({ ...weekly, quiz: { ...weekly.quiz, questions: weekly.quiz.questions.filter((_, itemIndex) => itemIndex !== questionIndex) } })}>Remove question</button>
              </div>
            ))}
          </div>

          <div className="cta-row">
            <button className="button compact" disabled={savingKind === "weekly"} type="button" onClick={() => save("weekly", "draft")}>Save draft</button>
            <button className="button secondary compact" disabled={savingKind === "weekly"} type="button" onClick={() => save("weekly", "published")}>Publish</button>
          </div>
        </article>

        <article className="card admin-form">
          <p className="meta">Community spotlight</p>
          <h2>Monthly feature</h2>
          <div className="form-grid">
            <label><span>Title</span><input value={spotlight.title} onChange={(event) => setSpotlight({ ...spotlight, title: event.target.value })} /></label>
            <label><span>Slug</span><input value={spotlight.slug} onChange={(event) => setSpotlight({ ...spotlight, slug: event.target.value })} /></label>
            <label><span>Month</span><input value={spotlight.month} onChange={(event) => setSpotlight({ ...spotlight, month: event.target.value })} /></label>
            <label><span>Featured builder</span><input value={spotlight.featuredBuilder} onChange={(event) => setSpotlight({ ...spotlight, featuredBuilder: event.target.value })} /></label>
            <label><span>Featured project</span><input value={spotlight.featuredProject} onChange={(event) => setSpotlight({ ...spotlight, featuredProject: event.target.value })} /></label>
          </div>
          <label className="field-block"><span>Article body</span><textarea value={spotlight.contentText} onChange={(event) => setSpotlight({ ...spotlight, contentText: event.target.value })} /></label>

          <div className="sub-editor">
            <div className="status-row"><h3>Highlights</h3><button className="button secondary compact" type="button" onClick={() => setSpotlight({ ...spotlight, highlights: [...spotlight.highlights, { title: "", description: "", url: "" }] })}>Add</button></div>
            {spotlight.highlights.map((highlight, index) => (
              <div className="stack-editor" key={`highlight-${index}`}>
                <input placeholder="Title" value={highlight.title} onChange={(event) => updateHighlight(index, { title: event.target.value })} />
                <input placeholder="Description" value={highlight.description} onChange={(event) => updateHighlight(index, { description: event.target.value })} />
                <input placeholder="URL" value={highlight.url ?? ""} onChange={(event) => updateHighlight(index, { url: event.target.value })} />
                <button className="button secondary compact" type="button" onClick={() => setSpotlight({ ...spotlight, highlights: spotlight.highlights.filter((_, itemIndex) => itemIndex !== index) })}>Remove highlight</button>
              </div>
            ))}
          </div>

          <section className="preview-panel">
            <p className="meta">{spotlight.month || "Month"}</p>
            <h3>{spotlight.title || "Spotlight title"}</h3>
            <p>Featured builder: {spotlight.featuredBuilder || "Builder"}. Featured project: {spotlight.featuredProject || "Project"}.</p>
          </section>

          <div className="cta-row">
            <button className="button compact" disabled={savingKind === "spotlight"} type="button" onClick={() => save("spotlight", "draft")}>Save draft</button>
            <button className="button secondary compact" disabled={savingKind === "spotlight"} type="button" onClick={() => save("spotlight", "published")}>Publish</button>
          </div>
        </article>
      </section>}

      {!locked && <section className="section">
        <h2>Content queue</h2>
        <div className="list">
          {entries.map((entry) => (
            <article className="list-item" key={entry.id}>
              <span>{entry.title}</span>
              <div className="cta-row inline-actions">
                <button className="button secondary compact" type="button" onClick={() => loadEntry(entry)}>Edit</button>
                <span className={`pill status-${entry.status === "published" ? "ready" : "warning"}`}>{entry.kind} - {entry.status}</span>
              </div>
            </article>
          ))}
          {entries.length === 0 && <article className="card"><p>No admin content entries yet.</p></article>}
        </div>
      </section>}
    </>
  );
}
