import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LearnerProgress, QuizAttempt } from "@genlayer-school/content";

const DEFAULT_LEARNER_ID = "demo-learner";
const DATA_DIR = path.resolve(process.cwd(), "..", "..", ".local-data");
const DATA_FILE = path.join(DATA_DIR, "progress.json");

let mutationQueue: Promise<unknown> = Promise.resolve();

type ProgressDatabase = {
  learners: Record<string, LearnerProgress>;
};

function nowIso(): string {
  return new Date().toISOString();
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
    return { learners: {} };
  }
}

async function writeDatabase(database: ProgressDatabase): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8");
}

export function normalizeLearnerId(learnerId?: string | null): string {
  return learnerId?.trim() || DEFAULT_LEARNER_ID;
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
