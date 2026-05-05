import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AdminContentEntry } from "@genlayer-school/content";
import type { AdminContentInput } from "./content-store-types";

const DATA_DIR = path.resolve(process.cwd(), "..", "..", ".local-data");
const DATA_FILE = path.join(DATA_DIR, "admin-content.json");

let mutationQueue: Promise<unknown> = Promise.resolve();

type AdminContentDatabase = {
  entries: AdminContentEntry[];
};

function nowIso(): string {
  return new Date().toISOString();
}

async function enqueueMutation<T>(mutation: () => Promise<T>): Promise<T> {
  const run = mutationQueue.then(mutation, mutation);
  mutationQueue = run.catch(() => undefined);
  return run;
}

async function readDatabase(): Promise<AdminContentDatabase> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as AdminContentDatabase;
  } catch {
    return { entries: [] };
  }
}

async function writeDatabase(database: AdminContentDatabase): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8");
}

function toEntry(input: AdminContentInput, existing?: AdminContentEntry): AdminContentEntry {
  const now = nowIso();
  return {
    id: existing?.id ?? `${input.kind}:${input.payload.slug}`,
    kind: input.kind,
    slug: input.payload.slug,
    title: input.payload.title,
    status: input.status,
    payload: input.payload,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    publishedAt: input.status === "published" ? existing?.publishedAt ?? now : existing?.publishedAt ?? null,
  };
}

export async function listEntries(): Promise<AdminContentEntry[]> {
  const database = await readDatabase();
  return [...database.entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveEntry(input: AdminContentInput): Promise<AdminContentEntry> {
  return enqueueMutation(async () => {
    const database = await readDatabase();
    const existing = database.entries.find((entry) => entry.kind === input.kind && entry.slug === input.payload.slug);
    const entry = toEntry(input, existing);
    const entries = [
      entry,
      ...database.entries.filter((item) => !(item.kind === input.kind && item.slug === input.payload.slug)),
    ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    await writeDatabase({ entries });
    return entry;
  });
}
