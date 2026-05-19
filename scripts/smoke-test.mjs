#!/usr/bin/env node

const DEFAULT_BASE_URL = "http://localhost:3100";

function readArg(name) {
  const prefix = `--${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value?.slice(prefix.length);
}

const baseUrl = (readArg("base-url") ?? process.env.SMOKE_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "");
const adminToken = readArg("admin-token") ?? process.env.ADMIN_ACCESS_TOKEN ?? "";

const publicChecks = [
  { path: "/", expectJson: false },
  { path: "/learn", expectJson: false },
  { path: "/regions", expectJson: false },
  { path: "/regions/india", expectJson: false },
  { path: "/regions/latam/quiz", expectJson: false },
  { path: "/regions/nigeria/certificate", expectJson: false },
  { path: "/backend", expectJson: false },
  { path: "/gen-fren-weekly", expectJson: false },
  { path: "/community-spotlight", expectJson: false },
  { path: "/api/backend/status", expectJson: true },
  { path: "/api/catalog", expectJson: true },
];

const adminChecks = [
  { path: "/api/admin/content", expectJson: true },
  { path: "/api/admin/analytics", expectJson: true },
  { path: "/api/admin/content/qa", expectJson: true },
  { path: "/api/admin/certificate-templates", expectJson: true },
];

async function checkEndpoint({ path, expectJson, expectedStatus = 200 }, headers = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, { headers });
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status !== expectedStatus) {
    throw new Error(`${path} returned ${response.status}, expected ${expectedStatus}`);
  }

  if (expectJson && !contentType.includes("application/json")) {
    throw new Error(`${path} did not return JSON`);
  }

  return response.status;
}

async function checkInvalidAdminPayload(headers = {}) {
  const response = await fetch(`${baseUrl}/api/admin/content`, {
    method: "POST",
    headers: { ...headers, "content-type": "application/json" },
    body: JSON.stringify({
      kind: "regional",
      status: "draft",
      payload: {
        slug: "nigeria",
        title: "Invalid regional payload",
        lessons: [],
        quiz: { slug: "broken", title: "Broken", passPercent: 70, questions: [] },
      },
    }),
  });

  if (response.status !== 400) {
    throw new Error(`/api/admin/content invalid payload returned ${response.status}, expected 400`);
  }

  const payload = await response.json();
  if (!payload.error) {
    throw new Error("/api/admin/content invalid payload did not return an error message");
  }

  return response.status;
}

async function run() {
  console.log(`Smoke testing ${baseUrl}`);

  for (const check of publicChecks) {
    const status = await checkEndpoint(check);
    console.log(`ok ${status} ${check.path}`);
  }

  if (!adminToken) {
    console.log("skip admin checks: provide ADMIN_ACCESS_TOKEN or --admin-token=...");
    return;
  }

  const headers = { "x-admin-token": adminToken };
  for (const check of adminChecks) {
    const status = await checkEndpoint(check, headers);
    console.log(`ok ${status} ${check.path}`);
  }
  const invalidPayloadStatus = await checkInvalidAdminPayload(headers);
  console.log(`ok ${invalidPayloadStatus} /api/admin/content invalid payload`);
}

run().catch((error) => {
  console.error(`smoke test failed: ${error.message}`);
  process.exitCode = 1;
});
