import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CertificateRecord, LearnerProfile, LearnerProgress, QuizAttempt } from "@genlayer-school/content";
import type { CommunityMember, LearningAnalytics, ProfileUpdateInput } from "./progress-store-types";

const DEFAULT_LEARNER_ID = "demo-learner";
const DATA_DIR = path.resolve(process.cwd(), "..", "..", ".local-data");
const DATA_FILE = path.join(DATA_DIR, "progress.json");

let mutationQueue: Promise<unknown> = Promise.resolve();

type ProgressDatabase = {
  learners: Record<string, LearnerProgress>;
  profiles?: Record<string, LearnerProfile>;
  certificates?: Record<string, CertificateRecord[]>;
};

function nowIso(): string {
  return new Date().toISOString();
}

function createProfile(learnerId = DEFAULT_LEARNER_ID): LearnerProfile {
  return {
    learnerId,
    username: null,
    displayName: null,
    walletAddress: null,
    email: null,
    updatedAt: nowIso(),
  };
}

function createProgress(learnerId = DEFAULT_LEARNER_ID): LearnerProgress {
  return {
    learnerId,
    completedLessons: [],
    quizAttempts: [],
    issuedCertificates: [],
    updatedAt: nowIso(),
  };
}

async function enqueueMutation<T>(mutation: () => Promise<T>): Promise<T> {
  const run = mutationQueue.then(mutation, mutation);
  mutationQueue = run.catch(() => undefined);
  return run;
}

async function readDatabase(): Promise<ProgressDatabase> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as ProgressDatabase;
  } catch {
    return { learners: {}, profiles: {}, certificates: {} };
  }
}

async function writeDatabase(database: ProgressDatabase): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8");
}

export function normalizeLearnerId(learnerId?: string | null): string {
  return learnerId?.trim() || DEFAULT_LEARNER_ID;
}

export function normalizeUsername(username?: string | null): string | null {
  const value = username?.trim().toLowerCase();
  if (!value) return null;
  return value;
}

export function validateUsername(username?: string | null): string | null {
  const value = normalizeUsername(username);
  if (!value) return null;
  if (!/^[a-z0-9_]{3,24}$/.test(value)) {
    throw new Error("Username must be 3-24 characters and use only letters, numbers, or underscores.");
  }
  return value;
}

export async function getProfile(learnerId?: string | null): Promise<LearnerProfile> {
  const id = normalizeLearnerId(learnerId);
  const database = await readDatabase();
  return database.profiles?.[id] ?? createProfile(id);
}

export async function updateProfile(input: ProfileUpdateInput): Promise<LearnerProfile> {
  return enqueueMutation(async () => {
    const id = normalizeLearnerId(input.learnerId);
    const database = await readDatabase();
    const profiles = database.profiles ?? {};
    const current = profiles[id] ?? createProfile(id);
    const username = input.username === undefined ? current.username : validateUsername(input.username);

    if (username) {
      const usernameOwner = Object.values(profiles).find((profile) => profile.username === username && profile.learnerId !== id);
      if (usernameOwner) throw new Error("Username is already taken.");
    }

    const updated: LearnerProfile = {
      ...current,
      username,
      displayName: input.displayName === undefined ? current.displayName : input.displayName?.trim() || null,
      walletAddress: input.walletAddress === undefined ? current.walletAddress : input.walletAddress?.trim() || null,
      email: input.email === undefined ? current.email : input.email?.trim() || null,
      updatedAt: nowIso(),
    };

    database.profiles = { ...profiles, [id]: updated };
    await writeDatabase(database);
    return updated;
  });
}

export async function getProgress(learnerId?: string | null): Promise<LearnerProgress> {
  const id = normalizeLearnerId(learnerId);
  const database = await readDatabase();
  return database.learners[id] ?? createProgress(id);
}

export async function setLessonCompletion(input: {
  learnerId?: string | null;
  courseSlug: string;
  lessonSlug: string;
  completed: boolean;
}): Promise<LearnerProgress> {
  return enqueueMutation(async () => {
    const id = normalizeLearnerId(input.learnerId);
    const database = await readDatabase();
    const progress = database.learners[id] ?? createProgress(id);
    const key = `${input.courseSlug}/${input.lessonSlug}`;
    const completedLessons = new Set(progress.completedLessons);

    if (input.completed) completedLessons.add(key);
    else completedLessons.delete(key);

    const updated: LearnerProgress = {
      ...progress,
      completedLessons: [...completedLessons].sort(),
      updatedAt: nowIso(),
    };

    database.learners[id] = updated;
    await writeDatabase(database);
    return updated;
  });
}

export async function recordQuizAttempt(input: {
  learnerId?: string | null;
  attempt: Omit<QuizAttempt, "id" | "submittedAt">;
}): Promise<LearnerProgress> {
  return enqueueMutation(async () => {
    const id = normalizeLearnerId(input.learnerId);
    const database = await readDatabase();
    const progress = database.learners[id] ?? createProgress(id);
    const submittedAt = nowIso();
    const attempt: QuizAttempt = {
      ...input.attempt,
      id: `${input.attempt.quizSlug}-${submittedAt}`,
      submittedAt,
    };

    const updated: LearnerProgress = {
      ...progress,
      quizAttempts: [attempt, ...progress.quizAttempts],
      updatedAt: submittedAt,
    };

    database.learners[id] = updated;
    await writeDatabase(database);
    return updated;
  });
}

function createCertificateRecord(learnerId: string, certificateSlug: string): CertificateRecord {
  const now = nowIso();
  return {
    id: `${learnerId}:${certificateSlug}`,
    learnerId,
    certificateSlug,
    status: "eligible",
    contractAddress: null,
    txHash: null,
    issuedAt: now,
    updatedAt: now,
  };
}

export async function getCertificateRecords(learnerId?: string | null): Promise<CertificateRecord[]> {
  const id = normalizeLearnerId(learnerId);
  const database = await readDatabase();
  return [...(database.certificates?.[id] ?? [])].sort((a, b) => a.certificateSlug.localeCompare(b.certificateSlug));
}

export async function syncEligibleCertificates(input: {
  learnerId?: string | null;
  certificateSlugs: string[];
}): Promise<CertificateRecord[]> {
  return enqueueMutation(async () => {
    const id = normalizeLearnerId(input.learnerId);
    const database = await readDatabase();
    const certificates = database.certificates ?? {};
    const currentRecords = certificates[id] ?? [];
    const recordsBySlug = new Map(currentRecords.map((record) => [record.certificateSlug, record]));

    for (const certificateSlug of input.certificateSlugs) {
      const existing = recordsBySlug.get(certificateSlug);
      if (!existing) {
        recordsBySlug.set(certificateSlug, createCertificateRecord(id, certificateSlug));
      } else if (existing.status === "revoked") {
        recordsBySlug.set(certificateSlug, { ...existing, status: "eligible", updatedAt: nowIso() });
      }
    }

    const updated = [...recordsBySlug.values()].sort((a, b) => a.certificateSlug.localeCompare(b.certificateSlug));
    database.certificates = { ...certificates, [id]: updated };
    await writeDatabase(database);
    return updated;
  });
}

export async function requestCertificateMint(input: {
  learnerId?: string | null;
  certificateSlug: string;
}): Promise<CertificateRecord> {
  return enqueueMutation(async () => {
    const id = normalizeLearnerId(input.learnerId);
    const database = await readDatabase();
    const certificates = database.certificates ?? {};
    const currentRecords = certificates[id] ?? [];
    const existing = currentRecords.find((record) => record.certificateSlug === input.certificateSlug);

    if (!existing || existing.status === "revoked") {
      throw new Error("Certificate is not eligible for minting yet.");
    }

    const updatedRecord: CertificateRecord = existing.status === "minted"
      ? existing
      : { ...existing, status: "mint_pending", updatedAt: nowIso() };

    const updatedRecords = currentRecords
      .map((record) => record.certificateSlug === input.certificateSlug ? updatedRecord : record)
      .sort((a, b) => a.certificateSlug.localeCompare(b.certificateSlug));

    database.certificates = { ...certificates, [id]: updatedRecords };
    await writeDatabase(database);
    return updatedRecord;
  });
}

const REGIONAL_SLUGS = new Set([
  "china", "india", "indonesia", "latam", "latam-es", "latam-pt",
  "nigeria", "russia", "korea", "turkey", "ukraine", "vietnam",
]);

export async function getCommunityMembers(): Promise<CommunityMember[]> {
  const database = await readDatabase();
  const progressRows = Object.values(database.learners);
  const profiles = database.profiles ?? {};

  return progressRows
    .map((progress) => {
      const regionalLessons = progress.completedLessons.filter(
        (l) => REGIONAL_SLUGS.has(l.split("/")[0])
      );
      const regions = [...new Set(regionalLessons.map((l) => l.split("/")[0]))];
      const quizzesPassed = progress.quizAttempts.filter((a) => a.passed).length;
      const profile = profiles[progress.learnerId];
      return {
        displayName: profile?.displayName ?? null,
        regions,
        lessonCount: regionalLessons.length,
        quizzesPassed,
      };
    })
    .filter((m) => m.lessonCount > 0 && m.displayName)
    .sort((a, b) => b.regions.length - a.regions.length || b.lessonCount - a.lessonCount);
}

export async function getLearningAnalytics(): Promise<LearningAnalytics> {
  const database = await readDatabase();
  const progressRows = Object.values(database.learners);
  const profiles = Object.values(database.profiles ?? {});
  const certificateRows = Object.values(database.certificates ?? {}).flat();
  const quizAttempts = progressRows.flatMap((progress) => (
    progress.quizAttempts.map((attempt) => ({ learnerId: progress.learnerId, attempt }))
  ));
  const averageQuizPercent = quizAttempts.length === 0
    ? 0
    : Math.round(quizAttempts.reduce((total, item) => total + item.attempt.percent, 0) / quizAttempts.length);

  return {
    learnerCount: progressRows.length,
    profileCount: profiles.length,
    completedLessonCount: progressRows.reduce((total, progress) => total + progress.completedLessons.length, 0),
    quizAttemptCount: quizAttempts.length,
    passedQuizAttemptCount: quizAttempts.filter((item) => item.attempt.passed).length,
    averageQuizPercent,
    certificateStatusCounts: {
      eligible: certificateRows.filter((record) => record.status === "eligible").length,
      mint_pending: certificateRows.filter((record) => record.status === "mint_pending").length,
      minted: certificateRows.filter((record) => record.status === "minted").length,
      revoked: certificateRows.filter((record) => record.status === "revoked").length,
    },
    recentQuizAttempts: quizAttempts
      .sort((a, b) => b.attempt.submittedAt.localeCompare(a.attempt.submittedAt))
      .slice(0, 10)
      .map(({ learnerId, attempt }) => ({
        learnerId,
        quizSlug: attempt.quizSlug,
        quizKind: attempt.quizKind,
        percent: attempt.percent,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt,
      })),
  };
}
