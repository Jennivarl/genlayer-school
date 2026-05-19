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
  RegionalTrack,
  SpotlightItem,
  WeeklySummary,
} from "@genlayer-school/content";
import { communitySpotlights, regionalTracks, weeklySummaries } from "@genlayer-school/content";

type AdminContentResponse = {
  storageDriver?: string;
  entries?: AdminContentEntry[];
  entry?: AdminContentEntry;
  scope?: AdminContentKind | "all";
  bootstrapped?: {
    weekly: number;
    spotlight: number;
    regional: number;
    total: number;
  };
  error?: string;
};

type CertificateTemplate = {
  regionSlug: string;
  regionName: string;
  languageName: string;
  nativeLanguageName: string;
  certificateTitle: string;
  fileName: string;
  repositoryPath: string;
  publicUrl: string;
  available: boolean;
  sizeBytes: number | null;
  updatedAt: string | null;
};

type CertificateTemplateResponse = {
  templates?: CertificateTemplate[];
  summary?: {
    available: number;
    missing: number;
    total: number;
  };
  error?: string;
};

type ContentQaCheck = {
  severity: "error" | "warning";
  label: string;
  detail: string;
  regionSlug?: string;
};

type ContentQaResponse = {
  ready?: boolean;
  summary?: {
    regions: number;
    expectedRegions: number;
    publishedRegionalOverrides: number;
    errors: number;
    warnings: number;
  };
  routes?: string[];
  checks?: ContentQaCheck[];
  error?: string;
};

type BootstrapScope = AdminContentKind | "all";
type BootstrapRun = {
  scope: BootstrapScope;
  status: AdminContentStatus;
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

type RegionalLesson = RegionalTrack["lessons"][number];

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

function createRegionalLesson(index: number): RegionalLesson {
  return {
    slug: `lesson-${index}`,
    title: "",
    durationMinutes: 5,
    summary: "",
    objectives: [""],
    content: [],
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

function toRegionalForm(track: RegionalTrack): RegionalTrack {
  return {
    ...track,
    lessons: track.lessons.map((lesson) => ({
      ...lesson,
      objectives: [...lesson.objectives],
      content: lesson.content.map((block) => ({ ...block })),
    })),
    quiz: {
      ...track.quiz,
      questions: track.quiz.questions.map((question) => ({
        ...question,
        options: [...question.options],
      })),
    },
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

function regionalPayload(form: RegionalTrack): RegionalTrack {
  return {
    ...form,
    slug: form.slug.trim() as RegionalTrack["slug"],
    regionName: form.regionName.trim(),
    nativeRegionName: form.nativeRegionName.trim(),
    languageName: form.languageName.trim(),
    nativeLanguageName: form.nativeLanguageName.trim(),
    locale: form.locale.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    unityMessage: form.unityMessage.trim(),
    certificateTitle: form.certificateTitle.trim(),
    lessons: form.lessons.map((lesson, index) => ({
      ...lesson,
      slug: lesson.slug.trim() || `lesson-${index + 1}`,
      title: lesson.title.trim(),
      durationMinutes: Number(lesson.durationMinutes) || 5,
      summary: lesson.summary.trim(),
      objectives: lesson.objectives.map((objective) => objective.trim()).filter(Boolean),
    })),
    quiz: {
      ...form.quiz,
      slug: form.quiz.slug.trim(),
      title: form.quiz.title.trim(),
      passPercent: Number(form.quiz.passPercent),
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

function validateRegional(payload: RegionalTrack): string | null {
  if (!payload.slug || !payload.title || !payload.regionName || !payload.nativeRegionName) return "Regional slug, title, and region names are required.";
  if (!payload.languageName || !payload.nativeLanguageName || !payload.locale) return "Regional language labels and locale are required.";
  if (!payload.description || !payload.unityMessage || !payload.certificateTitle) return "Regional description, unity message, and certificate title are required.";
  if (!Array.isArray(payload.lessons) || payload.lessons.length === 0) return "Regional lessons are required.";
  if (payload.lessons.some((lesson) => !lesson.slug || !lesson.title || !lesson.summary || lesson.objectives.length === 0 || lesson.content.length === 0)) {
    return "Every regional lesson needs a slug, title, summary, objective, and body content.";
  }
  if (!payload.quiz?.slug || !payload.quiz?.title || !Array.isArray(payload.quiz.questions)) return "Regional quiz is required.";
  if (payload.quiz.passPercent < 0 || payload.quiz.passPercent > 100) return "Regional quiz pass percent must be between 0 and 100.";
  if (payload.quiz.questions.length === 0) return "Regional quiz needs at least one question.";
  if (payload.quiz.questions.some((question) => !question.prompt || question.options.length < 2 || question.options.some((option) => !option))) {
    return "Every regional quiz question needs a prompt and at least two options.";
  }
  if (payload.quiz.questions.some((question) => question.correctOption < 0 || question.correctOption >= question.options.length)) {
    return "Every regional quiz question needs a valid correct option.";
  }
  if (payload.quiz.questions.some((question) => !question.explanation)) {
    return "Every regional quiz question needs an explanation.";
  }
  return null;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "Missing";
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}

function bootstrapScopeLabel(scope: BootstrapScope) {
  if (scope === "all") return "all seed content";
  if (scope === "weekly") return "weekly summaries";
  if (scope === "spotlight") return "community spotlights";
  return "regional tracks";
}

export function AdminContentConsole() {
  const [draftToken, setDraftToken] = useState("");
  const [token, setToken] = useState("");
  const [locked, setLocked] = useState(true);
  const [weekly, setWeekly] = useState<WeeklyForm>(() => toWeeklyForm(weeklySummaries[0]));
  const [spotlight, setSpotlight] = useState<SpotlightForm>(() => toSpotlightForm(communitySpotlights[0]));
  const [selectedRegionSlug, setSelectedRegionSlug] = useState(regionalTracks[0].slug);
  const [regional, setRegional] = useState<RegionalTrack>(() => toRegionalForm(regionalTracks[0]));
  const [entries, setEntries] = useState<AdminContentEntry[]>([]);
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>([]);
  const [certificateTemplateSummary, setCertificateTemplateSummary] = useState<CertificateTemplateResponse["summary"] | null>(null);
  const [certificateTemplateError, setCertificateTemplateError] = useState<string | null>(null);
  const [loadingCertificateTemplates, setLoadingCertificateTemplates] = useState(false);
  const [contentQa, setContentQa] = useState<ContentQaResponse | null>(null);
  const [contentQaError, setContentQaError] = useState<string | null>(null);
  const [loadingContentQa, setLoadingContentQa] = useState(false);
  const [storageDriver, setStorageDriver] = useState("unknown");
  const [message, setMessage] = useState<string | null>(null);
  const [savingKind, setSavingKind] = useState<AdminContentKind | null>(null);
  const [bootstrappingRun, setBootstrappingRun] = useState<BootstrapRun | null>(null);

  const counts = useMemo(() => ({
    weekly: entries.filter((entry) => entry.kind === "weekly").length,
    spotlight: entries.filter((entry) => entry.kind === "spotlight").length,
    regional: entries.filter((entry) => entry.kind === "regional").length,
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

  const fetchCertificateTemplates = useCallback(async (nextToken: string) => {
    const response = await fetch("/api/admin/certificate-templates", {
      headers: getHeaders(nextToken),
    });
    const payload = await response.json() as CertificateTemplateResponse;
    return { response, payload };
  }, []);

  async function loadCertificateTemplates(nextToken = token) {
    setLoadingCertificateTemplates(true);
    setCertificateTemplateError(null);
    const { response, payload } = await fetchCertificateTemplates(nextToken);

    if (!response.ok) {
      setCertificateTemplateError(payload.error ?? "Could not load certificate template status.");
      setCertificateTemplates([]);
      setCertificateTemplateSummary(null);
    } else {
      setCertificateTemplates(payload.templates ?? []);
      setCertificateTemplateSummary(payload.summary ?? null);
    }
    setLoadingCertificateTemplates(false);
  }

  const fetchContentQa = useCallback(async (nextToken: string) => {
    const response = await fetch("/api/admin/content/qa", {
      headers: getHeaders(nextToken),
    });
    const payload = await response.json() as ContentQaResponse;
    return { response, payload };
  }, []);

  async function loadContentQa(nextToken = token) {
    setLoadingContentQa(true);
    setContentQaError(null);
    const { response, payload } = await fetchContentQa(nextToken);

    if (!response.ok) {
      setContentQaError(payload.error ?? "Could not run content QA.");
      setContentQa(null);
    } else {
      setContentQa(payload);
    }
    setLoadingContentQa(false);
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
        const templates = await fetchCertificateTemplates(savedToken);
        if (!cancelled && templates.response.ok) {
          setCertificateTemplates(templates.payload.templates ?? []);
          setCertificateTemplateSummary(templates.payload.summary ?? null);
          setCertificateTemplateError(null);
        } else if (!cancelled) {
          setCertificateTemplateError(templates.payload.error ?? "Could not load certificate template status.");
        }
        const qa = await fetchContentQa(savedToken);
        if (!cancelled && qa.response.ok) {
          setContentQa(qa.payload);
          setContentQaError(null);
        } else if (!cancelled) {
          setContentQaError(qa.payload.error ?? "Could not run content QA.");
        }
      }
    }

    window.setTimeout(() => {
      void loadInitialEntries();
    }, 0);

    return () => {
      cancelled = true;
    };
  }, [applyEntriesResponse, fetchCertificateTemplates, fetchContentQa, fetchEntries]);

  async function unlockAdmin() {
    const nextToken = draftToken.trim();
    window.sessionStorage.setItem(ADMIN_TOKEN_SESSION_KEY, nextToken);
    setToken(nextToken);
    setLocked(false);
    setMessage(nextToken ? "Admin unlocked for this browser session." : "Admin unlocked in local mode.");
    await loadEntries(nextToken);
    await loadCertificateTemplates(nextToken);
    await loadContentQa(nextToken);
  }

  function lockAdmin() {
    window.sessionStorage.removeItem(ADMIN_TOKEN_SESSION_KEY);
    setToken("");
    setDraftToken("");
    setLocked(true);
    setEntries([]);
    setCertificateTemplates([]);
    setCertificateTemplateSummary(null);
    setCertificateTemplateError(null);
    setContentQa(null);
    setContentQaError(null);
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

    let payload: AdminContentPayload;
    let validationError: string | null;

    try {
      payload = kind === "weekly"
        ? weeklyPayload(weekly)
        : kind === "spotlight"
          ? spotlightPayload(spotlight)
          : regionalPayload(regional);
      validationError = kind === "weekly"
        ? validateWeekly(payload as WeeklySummary)
        : kind === "spotlight"
          ? validateSpotlight(payload as CommunitySpotlight)
          : validateRegional(payload as RegionalTrack);
    } catch {
      setMessage("Could not prepare content payload.");
      setSavingKind(null);
      return;
    }

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
      setMessage(`${kind === "weekly" ? "Weekly summary" : kind === "spotlight" ? "Spotlight" : "Regional track"} saved as ${status}.`);
      await loadEntries();
      if (kind === "regional") await loadContentQa();
    }

    setSavingKind(null);
  }

  async function bootstrapSeedContent(scope: BootstrapScope, status: AdminContentStatus) {
    if (locked) {
      setMessage("Unlock admin before bootstrapping content.");
      return;
    }

    setBootstrappingRun({ scope, status });
    setMessage(null);

    const response = await fetch("/api/admin/content/bootstrap", {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify({ scope, status }),
    });
    const payload = await response.json() as AdminContentResponse;

    if (!response.ok) {
      setMessage(payload.error ?? "Could not bootstrap content.");
    } else {
      setMessage(`Bootstrapped ${payload.bootstrapped?.total ?? 0} ${bootstrapScopeLabel(payload.scope ?? scope)} entries as ${status}.`);
      await loadEntries();
      if (scope === "all" || scope === "regional") await loadContentQa();
    }

    setBootstrappingRun(null);
  }

  function loadEntry(entry: AdminContentEntry) {
    if (locked) {
      setMessage("Unlock admin before editing content.");
      return;
    }

    if (entry.kind === "weekly") setWeekly(toWeeklyForm(entry.payload as WeeklySummary));
    else if (entry.kind === "spotlight") setSpotlight(toSpotlightForm(entry.payload as CommunitySpotlight));
    else {
      const track = entry.payload as RegionalTrack;
      setSelectedRegionSlug(track.slug);
      setRegional(toRegionalForm(track));
    }
    setMessage(`Loaded ${entry.title}.`);
  }

  function loadSeedRegion(slug: string) {
    const track = regionalTracks.find((item) => item.slug === slug) ?? regionalTracks[0];
    setSelectedRegionSlug(track.slug);
    setRegional(toRegionalForm(track));
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

  function updateRegionalLesson(index: number, patch: Partial<RegionalLesson>) {
    setRegional((current) => ({
      ...current,
      lessons: current.lessons.map((lesson, itemIndex) => itemIndex === index ? { ...lesson, ...patch } : lesson),
    }));
  }

  function updateRegionalLessonObjective(lessonIndex: number, objectiveIndex: number, value: string) {
    setRegional((current) => ({
      ...current,
      lessons: current.lessons.map((lesson, itemIndex) => itemIndex === lessonIndex
        ? { ...lesson, objectives: lesson.objectives.map((objective, index) => index === objectiveIndex ? value : objective) }
        : lesson),
    }));
  }

  function updateRegionalLessonContent(lessonIndex: number, value: string) {
    updateRegionalLesson(lessonIndex, { content: textToContent(value) });
  }

  function updateRegionalQuestion(index: number, patch: Partial<QuizQuestion>) {
    setRegional((current) => ({
      ...current,
      quiz: {
        ...current.quiz,
        questions: current.quiz.questions.map((question, itemIndex) => itemIndex === index ? { ...question, ...patch } : question),
      },
    }));
  }

  function updateRegionalQuestionOption(questionIndex: number, optionIndex: number, value: string) {
    setRegional((current) => ({
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
          <p>{counts.weekly} weekly entries, {counts.spotlight} spotlights, and {counts.regional} regional tracks.</p>
        </article>
        <article className="card">
          <p className="meta">Published</p>
          <h2>{counts.published}</h2>
          <p>Published entries appear on public weekly, spotlight, and regional pages.</p>
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

      {!locked && (
        <section className="section card">
          <p className="meta">Bootstrap</p>
          <h2>Seed admin content</h2>
          <p>Copy built-in seed content into the editable admin store. Existing entries with the same kind and slug are overwritten, so use the regional-only controls when refreshing improved regional lessons.</p>
          <div className="cta-row">
            <button className="button compact" disabled={bootstrappingRun !== null} type="button" onClick={() => bootstrapSeedContent("regional", "draft")}>
              {bootstrappingRun?.scope === "regional" && bootstrappingRun.status === "draft" ? "Refreshing" : "Refresh regions as drafts"}
            </button>
            <button className="button secondary compact" disabled={bootstrappingRun !== null} type="button" onClick={() => bootstrapSeedContent("regional", "published")}>
              {bootstrappingRun?.scope === "regional" && bootstrappingRun.status === "published" ? "Publishing" : "Refresh regions as published"}
            </button>
          </div>
          <div className="cta-row">
            <button className="button secondary compact" disabled={bootstrappingRun !== null} type="button" onClick={() => bootstrapSeedContent("weekly", "draft")}>
              {bootstrappingRun?.scope === "weekly" ? "Seeding" : "Seed weekly drafts"}
            </button>
            <button className="button secondary compact" disabled={bootstrappingRun !== null} type="button" onClick={() => bootstrapSeedContent("spotlight", "draft")}>
              {bootstrappingRun?.scope === "spotlight" ? "Seeding" : "Seed spotlight drafts"}
            </button>
            <button className="button secondary compact" disabled={bootstrappingRun !== null} type="button" onClick={() => bootstrapSeedContent("all", "draft")}>
              {bootstrappingRun?.scope === "all" ? "Seeding" : "Seed all drafts"}
            </button>
          </div>
          <p className="meta">Regional refresh copies the latest code seed for all 10 regions into admin. Use published when you want those seeds to immediately override public regional pages.</p>
        </section>
      )}

      {!locked && (
        <section className="section card">
          <div className="status-row">
            <div>
              <p className="meta">Certificate templates</p>
              <h2>Regional PNG status</h2>
            </div>
            <span className={`pill status-${certificateTemplateSummary?.missing ? "warning" : "ready"}`}>
              {certificateTemplateSummary ? `${certificateTemplateSummary.available}/${certificateTemplateSummary.total} ready` : "not checked"}
            </span>
          </div>
          <p>Place final 1600x1000 PNG designs in <code>apps/web/public/certificates</code>. Each certificate page loads the matching file and writes the signed-in username on top.</p>
          <div className="cta-row">
            <button className="button compact" disabled={loadingCertificateTemplates} type="button" onClick={() => loadCertificateTemplates()}>
              {loadingCertificateTemplates ? "Checking" : "Refresh status"}
            </button>
            {certificateTemplateError && <span className="pill status-missing">{certificateTemplateError}</span>}
          </div>
          <div className="list">
            {certificateTemplates.map((template) => (
              <article className="list-item" key={template.regionSlug}>
                <div>
                  <h3>{template.regionName} - {template.languageName}</h3>
                  <p className="meta">{template.repositoryPath}</p>
                  <p>{template.certificateTitle}</p>
                </div>
                <div className="cta-row inline-actions">
                  <span className={`pill status-${template.available ? "ready" : "missing"}`}>{template.available ? "Ready" : "Missing"}</span>
                  <span className="pill">{formatBytes(template.sizeBytes)}</span>
                  {template.available && <a className="button secondary compact" href={template.publicUrl} target="_blank" rel="noreferrer">Open PNG</a>}
                  <a className="button secondary compact" href={`/regions/${template.regionSlug}/certificate`} target="_blank" rel="noreferrer">Certificate</a>
                </div>
              </article>
            ))}
            {!loadingCertificateTemplates && certificateTemplates.length === 0 && (
              <article className="list-item">
                <span>Certificate template status has not loaded yet.</span>
                <button className="button secondary compact" type="button" onClick={() => loadCertificateTemplates()}>Check now</button>
              </article>
            )}
          </div>
        </section>
      )}

      {!locked && (
        <section className="section card">
          <div className="status-row">
            <div>
              <p className="meta">Content QA</p>
              <h2>Regional launch checks</h2>
            </div>
            <span className={`pill status-${contentQa?.ready ? "ready" : contentQa?.summary?.errors ? "missing" : "warning"}`}>
              {contentQa?.ready ? "Ready" : contentQa?.summary ? `${contentQa.summary.errors} errors` : "not checked"}
            </span>
          </div>
          <p>Validate the public regional tracks currently being served, including published admin overrides, route assumptions, quiz answer indexes, and certificate template filenames.</p>
          <div className="cta-row">
            <button className="button compact" disabled={loadingContentQa} type="button" onClick={() => loadContentQa()}>
              {loadingContentQa ? "Running" : "Run content QA"}
            </button>
            {contentQaError && <span className="pill status-missing">{contentQaError}</span>}
            {contentQa?.summary && (
              <>
                <span className="pill">{contentQa.summary.regions}/{contentQa.summary.expectedRegions} regions</span>
                <span className="pill">{contentQa.summary.publishedRegionalOverrides} published overrides</span>
                <span className={`pill status-${contentQa.summary.warnings ? "warning" : "ready"}`}>{contentQa.summary.warnings} warnings</span>
              </>
            )}
          </div>
          <div className="list">
            {(contentQa?.checks ?? []).slice(0, 12).map((check, index) => (
              <article className="list-item" key={`${check.label}-${index}`}>
                <div>
                  <h3>{check.label}</h3>
                  <p>{check.detail}</p>
                </div>
                <span className={`pill status-${check.severity === "error" ? "missing" : "warning"}`}>{check.severity}</span>
              </article>
            ))}
            {contentQa?.checks && contentQa.checks.length > 12 && (
              <article className="list-item">
                <span>{contentQa.checks.length - 12} more QA findings hidden from this panel.</span>
                <span className="pill">Review API JSON</span>
              </article>
            )}
            {contentQa && contentQa.checks?.length === 0 && (
              <article className="list-item">
                <span>All regional content QA checks passed.</span>
                <span className="pill status-ready">Ready</span>
              </article>
            )}
            {!loadingContentQa && !contentQa && !contentQaError && (
              <article className="list-item">
                <span>Content QA has not run yet.</span>
                <button className="button secondary compact" type="button" onClick={() => loadContentQa()}>Run now</button>
              </article>
            )}
          </div>
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

        <article className="card admin-form">
          <p className="meta">Regional track</p>
          <h2>Native-language classroom</h2>
          <p>Published regional entries override the built-in region content on public region pages, quizzes, certificates, and catalog responses.</p>
          <div className="form-grid">
            <label>
              <span>Load seed region</span>
              <select value={selectedRegionSlug} onChange={(event) => loadSeedRegion(event.target.value)}>
                {regionalTracks.map((track) => (
                  <option key={track.slug} value={track.slug}>{track.regionName} - {track.languageName}</option>
                ))}
              </select>
            </label>
            <label><span>Slug</span><input value={regional.slug} onChange={(event) => setRegional({ ...regional, slug: event.target.value as RegionalTrack["slug"] })} /></label>
            <label><span>Region name</span><input value={regional.regionName} onChange={(event) => setRegional({ ...regional, regionName: event.target.value })} /></label>
            <label><span>Native region name</span><input value={regional.nativeRegionName} onChange={(event) => setRegional({ ...regional, nativeRegionName: event.target.value })} /></label>
            <label><span>Language</span><input value={regional.languageName} onChange={(event) => setRegional({ ...regional, languageName: event.target.value })} /></label>
            <label><span>Native language</span><input value={regional.nativeLanguageName} onChange={(event) => setRegional({ ...regional, nativeLanguageName: event.target.value })} /></label>
            <label><span>Locale</span><input value={regional.locale} onChange={(event) => setRegional({ ...regional, locale: event.target.value })} /></label>
            <label><span>Certificate title</span><input value={regional.certificateTitle} onChange={(event) => setRegional({ ...regional, certificateTitle: event.target.value })} /></label>
          </div>
          <label className="field-block"><span>Classroom title</span><input value={regional.title} onChange={(event) => setRegional({ ...regional, title: event.target.value })} /></label>
          <label className="field-block"><span>Description</span><textarea value={regional.description} onChange={(event) => setRegional({ ...regional, description: event.target.value })} /></label>
          <label className="field-block"><span>Unity message</span><textarea value={regional.unityMessage} onChange={(event) => setRegional({ ...regional, unityMessage: event.target.value })} /></label>

          <div className="sub-editor">
            <div className="status-row">
              <h3>Lessons</h3>
              <button className="button secondary compact" type="button" onClick={() => setRegional({ ...regional, lessons: [...regional.lessons, createRegionalLesson(regional.lessons.length + 1)] })}>Add lesson</button>
            </div>
            {regional.lessons.map((lesson, lessonIndex) => (
              <div className="stack-editor" key={`regional-lesson-${lessonIndex}`}>
                <div className="form-grid">
                  <label><span>Lesson title</span><input value={lesson.title} onChange={(event) => updateRegionalLesson(lessonIndex, { title: event.target.value })} /></label>
                  <label><span>Lesson slug</span><input value={lesson.slug} onChange={(event) => updateRegionalLesson(lessonIndex, { slug: event.target.value })} /></label>
                  <label><span>Duration minutes</span><input type="number" min={1} value={lesson.durationMinutes} onChange={(event) => updateRegionalLesson(lessonIndex, { durationMinutes: Number(event.target.value) })} /></label>
                </div>
                <label><span>Summary</span><input value={lesson.summary} onChange={(event) => updateRegionalLesson(lessonIndex, { summary: event.target.value })} /></label>
                <label className="field-block"><span>Body</span><textarea value={contentToText(lesson)} onChange={(event) => updateRegionalLessonContent(lessonIndex, event.target.value)} /></label>
                <div className="sub-editor">
                  <div className="status-row">
                    <h3>Objectives</h3>
                    <button className="button secondary compact" type="button" onClick={() => updateRegionalLesson(lessonIndex, { objectives: [...lesson.objectives, ""] })}>Add</button>
                  </div>
                  {lesson.objectives.map((objective, objectiveIndex) => (
                    <div className="inline-editor" key={`regional-lesson-${lessonIndex}-objective-${objectiveIndex}`}>
                      <input value={objective} onChange={(event) => updateRegionalLessonObjective(lessonIndex, objectiveIndex, event.target.value)} />
                      <button className="button secondary compact" type="button" onClick={() => updateRegionalLesson(lessonIndex, { objectives: lesson.objectives.filter((_, itemIndex) => itemIndex !== objectiveIndex) })}>Remove</button>
                    </div>
                  ))}
                </div>
                <button className="button secondary compact" type="button" onClick={() => setRegional({ ...regional, lessons: regional.lessons.filter((_, itemIndex) => itemIndex !== lessonIndex) })}>Remove lesson</button>
              </div>
            ))}
          </div>

          <div className="sub-editor">
            <div className="status-row">
              <h3>Quiz</h3>
              <button className="button secondary compact" type="button" onClick={() => setRegional({ ...regional, quiz: { ...regional.quiz, questions: [...regional.quiz.questions, createQuestion(regional.quiz.questions.length + 1)] } })}>Add question</button>
            </div>
            <div className="form-grid">
              <label><span>Quiz title</span><input value={regional.quiz.title} onChange={(event) => setRegional({ ...regional, quiz: { ...regional.quiz, title: event.target.value } })} /></label>
              <label><span>Quiz slug</span><input value={regional.quiz.slug} onChange={(event) => setRegional({ ...regional, quiz: { ...regional.quiz, slug: event.target.value } })} /></label>
              <label><span>Pass percent</span><input type="number" min={0} max={100} value={regional.quiz.passPercent} onChange={(event) => setRegional({ ...regional, quiz: { ...regional.quiz, passPercent: Number(event.target.value) } })} /></label>
            </div>
            {regional.quiz.questions.map((question, questionIndex) => (
              <div className="stack-editor" key={`regional-question-${questionIndex}`}>
                <input placeholder="Question prompt" value={question.prompt} onChange={(event) => updateRegionalQuestion(questionIndex, { prompt: event.target.value })} />
                {question.options.map((option, optionIndex) => (
                  <input key={`regional-question-${questionIndex}-option-${optionIndex}`} placeholder={`Option ${optionIndex + 1}`} value={option} onChange={(event) => updateRegionalQuestionOption(questionIndex, optionIndex, event.target.value)} />
                ))}
                <label><span>Correct option</span><select value={question.correctOption} onChange={(event) => updateRegionalQuestion(questionIndex, { correctOption: Number(event.target.value) })}>{question.options.map((_, index) => <option key={index} value={index}>Option {index + 1}</option>)}</select></label>
                <input placeholder="Explanation" value={question.explanation} onChange={(event) => updateRegionalQuestion(questionIndex, { explanation: event.target.value })} />
                <button className="button secondary compact" type="button" onClick={() => setRegional({ ...regional, quiz: { ...regional.quiz, questions: regional.quiz.questions.filter((_, itemIndex) => itemIndex !== questionIndex) } })}>Remove question</button>
              </div>
            ))}
          </div>

          <section className="preview-panel">
            <p className="meta">Preview links</p>
            <h3>{regional.title || "Regional classroom"}</h3>
            <p>{regional.regionName || "Region"} - {regional.languageName || "Language"} - {regional.certificateTitle || "Certificate"}</p>
            <div className="cta-row">
              <a className="button secondary compact" href={`/regions/${regional.slug}`} target="_blank" rel="noreferrer">Classroom</a>
              <a className="button secondary compact" href={`/regions/${regional.slug}/quiz`} target="_blank" rel="noreferrer">Quiz</a>
              <a className="button secondary compact" href={`/regions/${regional.slug}/certificate`} target="_blank" rel="noreferrer">Certificate</a>
            </div>
          </section>
          <div className="cta-row">
            <button className="button compact" disabled={savingKind === "regional"} type="button" onClick={() => save("regional", "draft")}>Save draft</button>
            <button className="button secondary compact" disabled={savingKind === "regional"} type="button" onClick={() => save("regional", "published")}>Publish</button>
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
                {entry.kind === "regional" && (
                  <>
                    <a className="button secondary compact" href={`/regions/${entry.slug}`} target="_blank" rel="noreferrer">Classroom</a>
                    <a className="button secondary compact" href={`/regions/${entry.slug}/quiz`} target="_blank" rel="noreferrer">Quiz</a>
                    <a className="button secondary compact" href={`/regions/${entry.slug}/certificate`} target="_blank" rel="noreferrer">Certificate</a>
                  </>
                )}
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
