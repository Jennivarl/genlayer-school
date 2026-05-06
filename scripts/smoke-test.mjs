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
  { path: "/backend", expectJson: false },
  { path: "/gen-fren-weekly", expectJson: false },
  { path: "/community-spotlight", expectJson: false },
  { path: "/api/backend/status", expectJson: true },
  { path: "/api/catalog", expectJson: true },
];

const adminChecks = [
  { path: "/api/admin/content", expectJson: true },
  { path: "/api/admin/analytics", expectJson: true },
];

async function checkEndpoint({ path, expectJson }, headers = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, { headers });
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  if (expectJson && !contentType.includes("application/json")) {
    throw new Error(`${path} did not return JSON`);
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
}

run().catch((error) => {
  console.error(`smoke test failed: ${error.message}`);
  process.exitCode = 1;
});
