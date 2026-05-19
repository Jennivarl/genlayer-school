import { stat } from "node:fs/promises";
import { join, sep } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { regionalTracks as seedRegionalTracks, type RegionalTrack } from "@genlayer-school/content";
import { requireAdminAuth } from "@/lib/backend/admin-auth";
import { listAdminContentEntries } from "@/lib/backend/content-store";
import { getPublishedRegionalTracks } from "@/lib/backend/public-content";

type QaSeverity = "error" | "warning";

type QaCheck = {
  severity: QaSeverity;
  label: string;
  detail: string;
  regionSlug?: string;
};

const expectedRegionSlugs = seedRegionalTracks.map((track) => track.slug);

function getCertificatesDirectory() {
  const cwd = process.cwd();
  const publicRoot = cwd.endsWith(`${sep}apps${sep}web`) ? join(cwd, "public") : join(cwd, "apps", "web", "public");
  return join(publicRoot, "certificates");
}

function addCheck(checks: QaCheck[], condition: boolean, check: QaCheck) {
  if (!condition) checks.push(check);
}

async function hasCertificateTemplate(slug: string) {
  try {
    const file = await stat(join(getCertificatesDirectory(), `${slug}.png`));
    return file.isFile();
  } catch {
    return false;
  }
}

function validateTrack(track: RegionalTrack, checks: QaCheck[]) {
  const prefix = `${track.regionName} (${track.slug})`;

  addCheck(checks, Boolean(track.title && track.regionName && track.nativeRegionName), {
    severity: "error",
    regionSlug: track.slug,
    label: `${prefix}: identity`,
    detail: "Region title, English name, and native name are required.",
  });
  addCheck(checks, Boolean(track.languageName && track.nativeLanguageName && track.locale), {
    severity: "error",
    regionSlug: track.slug,
    label: `${prefix}: language`,
    detail: "Language name, native language name, and locale are required.",
  });
  addCheck(checks, Boolean(track.description && track.unityMessage), {
    severity: "error",
    regionSlug: track.slug,
    label: `${prefix}: landing copy`,
    detail: "Regional description and unity message are required.",
  });
  addCheck(checks, Boolean(track.certificateTitle), {
    severity: "error",
    regionSlug: track.slug,
    label: `${prefix}: certificate title`,
    detail: "Certificate title is required.",
  });
  addCheck(checks, track.lessons.length > 0, {
    severity: "error",
    regionSlug: track.slug,
    label: `${prefix}: lessons`,
    detail: "At least one regional lesson is required.",
  });

  for (const lesson of track.lessons) {
    addCheck(checks, Boolean(lesson.slug && lesson.title && lesson.summary), {
      severity: "error",
      regionSlug: track.slug,
      label: `${prefix}: lesson ${lesson.slug || "missing-slug"}`,
      detail: "Each lesson needs a slug, title, and summary.",
    });
    addCheck(checks, lesson.objectives.length > 0 && lesson.content.length > 0, {
      severity: "error",
      regionSlug: track.slug,
      label: `${prefix}: lesson body`,
      detail: "Each lesson needs at least one objective and one content block.",
    });
  }

  addCheck(checks, Boolean(track.quiz.slug && track.quiz.title), {
    severity: "error",
    regionSlug: track.slug,
    label: `${prefix}: quiz identity`,
    detail: "Regional quiz slug and title are required.",
  });
  addCheck(checks, track.quiz.questions.length >= 5, {
    severity: "error",
    regionSlug: track.slug,
    label: `${prefix}: quiz depth`,
    detail: "Each regional quiz should have at least 5 questions.",
  });

  for (const question of track.quiz.questions) {
    addCheck(checks, Boolean(question.id && question.prompt && question.explanation), {
      severity: "error",
      regionSlug: track.slug,
      label: `${prefix}: quiz question`,
      detail: "Every quiz question needs an id, prompt, and explanation.",
    });
    addCheck(checks, question.options.length >= 2 && question.options.every(Boolean), {
      severity: "error",
      regionSlug: track.slug,
      label: `${prefix}: quiz options`,
      detail: "Every quiz question needs at least two non-empty options.",
    });
    addCheck(checks, question.correctOption >= 0 && question.correctOption < question.options.length, {
      severity: "error",
      regionSlug: track.slug,
      label: `${prefix}: correct answer`,
      detail: `Correct option index ${question.correctOption} is outside the available options.`,
    });
  }
}

export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request);
  if (authError) return authError;

  const checks: QaCheck[] = [];
  const entries = await listAdminContentEntries();
  const publishedRegionalSlugs = new Set(entries
    .filter((entry) => entry.kind === "regional" && entry.status === "published")
    .map((entry) => entry.slug));
  const tracks = await getPublishedRegionalTracks();
  const trackSlugs = new Set(tracks.map((track) => track.slug));

  addCheck(checks, tracks.length === expectedRegionSlugs.length, {
    severity: "error",
    label: "Regional track count",
    detail: `Expected ${expectedRegionSlugs.length} regional tracks, found ${tracks.length}.`,
  });

  for (const slug of expectedRegionSlugs) {
    addCheck(checks, trackSlugs.has(slug), {
      severity: "error",
      regionSlug: slug,
      label: `${slug}: route coverage`,
      detail: `Missing regional track for /regions/${slug}.`,
    });
  }

  for (const track of tracks) {
    validateTrack(track, checks);

    const lesson = track.lessons.find((item) => item.slug === "genlayer-basics");
    addCheck(checks, Boolean(lesson), {
      severity: "error",
      regionSlug: track.slug,
      label: `${track.slug}: default lesson route`,
      detail: `Expected /regions/${track.slug}/genlayer-basics to exist.`,
    });
    addCheck(checks, Boolean(track.quiz.slug), {
      severity: "error",
      regionSlug: track.slug,
      label: `${track.slug}: quiz route`,
      detail: `Expected /regions/${track.slug}/quiz to have a quiz payload.`,
    });
    addCheck(checks, Boolean(track.certificateTitle), {
      severity: "error",
      regionSlug: track.slug,
      label: `${track.slug}: certificate route`,
      detail: `Expected /regions/${track.slug}/certificate to have certificate content.`,
    });
    addCheck(checks, await hasCertificateTemplate(track.slug), {
      severity: "warning",
      regionSlug: track.slug,
      label: `${track.slug}: certificate template`,
      detail: `Expected apps/web/public/certificates/${track.slug}.png for launch-ready certificate artwork.`,
    });
  }

  const errors = checks.filter((check) => check.severity === "error").length;
  const warnings = checks.filter((check) => check.severity === "warning").length;

  return NextResponse.json({
    ready: errors === 0,
    summary: {
      regions: tracks.length,
      expectedRegions: expectedRegionSlugs.length,
      publishedRegionalOverrides: publishedRegionalSlugs.size,
      errors,
      warnings,
    },
    routes: expectedRegionSlugs.flatMap((slug) => [
      `/regions/${slug}`,
      `/regions/${slug}/genlayer-basics`,
      `/regions/${slug}/quiz`,
      `/regions/${slug}/certificate`,
    ]),
    checks,
  });
}
