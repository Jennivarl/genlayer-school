#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const envFiles = [".env", ".env.local", "apps/web/.env.local"];
const requiredTables = [
  "learner_profiles",
  "lesson_progress",
  "quiz_attempts",
  "certificates",
  "admin_content_entries",
];

function loadEnvFile(filePath) {
  const resolved = resolve(process.cwd(), filePath);
  if (!existsSync(resolved)) return;

  const lines = readFileSync(resolved, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (!key || process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function pass(label, detail = "") {
  console.log(`ok ${label}${detail ? ` - ${detail}` : ""}`);
}

function fail(label, detail) {
  console.error(`fail ${label}${detail ? ` - ${detail}` : ""}`);
}

async function expectNoError(label, operation) {
  const result = await operation();
  if (result.error) throw new Error(result.error.message);
  pass(label);
  return result;
}

async function cleanup(supabase, learnerId, adminSlug) {
  await Promise.allSettled([
    supabase.from("admin_content_entries").delete().eq("kind", "regional").eq("slug", adminSlug),
    supabase.from("learner_profiles").delete().eq("learner_id", learnerId),
  ]);
}

async function run() {
  for (const file of envFiles) loadEnvFile(file);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    fail("environment", "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
    process.exitCode = 1;
    return;
  }

  pass("environment", "Supabase env vars are present");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const runId = `verify-${Date.now()}`;
  const learnerId = `verify-supabase-${runId}`;
  const adminSlug = `verify-supabase-${runId}`;

  try {
    for (const table of requiredTables) {
      await expectNoError(`table ${table}`, () => supabase.from(table).select("*", { head: true, count: "exact" }).limit(1));
    }

    await expectNoError("learner_profiles username column", () => supabase
      .from("learner_profiles")
      .insert({
        learner_id: learnerId,
        username: `verify_${runId}`,
        display_name: "Supabase Verify",
        email: `${runId}@example.invalid`,
      }));

    await expectNoError("lesson_progress unique key", () => supabase
      .from("lesson_progress")
      .upsert({
        learner_id: learnerId,
        course_slug: "nigeria",
        lesson_slug: "genlayer-basics",
      }, { onConflict: "learner_id,course_slug,lesson_slug" }));

    await expectNoError("quiz_attempts regional kind", () => supabase
      .from("quiz_attempts")
      .insert({
        learner_id: learnerId,
        quiz_kind: "regional",
        quiz_slug: "nigeria-genlayer-basics-quiz",
        score: 5,
        total: 5,
        percent: 100,
        passed: true,
        answers: { "verify-q1": 0 },
      }));

    await expectNoError("certificates lifecycle columns", () => supabase
      .from("certificates")
      .insert({
        learner_id: learnerId,
        certificate_slug: "nigeria-regional-certificate",
        status: "eligible",
      }));

    await expectNoError("admin_content_entries regional kind", () => supabase
      .from("admin_content_entries")
      .upsert({
        kind: "regional",
        slug: adminSlug,
        title: "Verify Regional Track",
        status: "draft",
        payload: { slug: adminSlug, title: "Verify Regional Track" },
      }, { onConflict: "kind,slug" }));

    await expectNoError("admin_content_entries unique kind+slug", () => supabase
      .from("admin_content_entries")
      .upsert({
        kind: "regional",
        slug: adminSlug,
        title: "Verify Regional Track Updated",
        status: "published",
        payload: { slug: adminSlug, title: "Verify Regional Track Updated" },
      }, { onConflict: "kind,slug" }));

    const { data, error } = await supabase
      .from("admin_content_entries")
      .select("title,status")
      .eq("kind", "regional")
      .eq("slug", adminSlug);
    if (error) throw new Error(error.message);
    if (!data || data.length !== 1 || data[0].title !== "Verify Regional Track Updated" || data[0].status !== "published") {
      throw new Error("admin_content_entries did not preserve one upserted kind+slug row");
    }
    pass("admin_content_entries upsert verification");

    await cleanup(supabase, learnerId, adminSlug);
    pass("cleanup", "temporary verification rows removed");
    pass("supabase verification complete");
  } catch (error) {
    await cleanup(supabase, learnerId, adminSlug);
    fail("supabase verification", error instanceof Error ? error.message : "unknown error");
    process.exitCode = 1;
  }
}

run();
