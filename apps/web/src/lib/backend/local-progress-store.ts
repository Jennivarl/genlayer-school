import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LearnerProfile, LearnerProgress, QuizAttempt } from "@genlayer-school/content";
import type { ProfileUpdateInput } from "./progress-store-types";

const DEFAULT_LEARNER_ID = "demo-learner";
const DATA_DIR = path.resolve(process.cwd(), "..", "..", ".local-data");
const DATA_FILE = path.join(DATA_DIR, "progress.json");

let mutationQueue: Promise<unknown> = Promise.resolve();

type ProgressDatabase = {
  learners: Record<string, LearnerProgress>;
  profiles?: Record<string, LearnerProfile>;
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
    return { learners: {}, profiles: {} };
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
