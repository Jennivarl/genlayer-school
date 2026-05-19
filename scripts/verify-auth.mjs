#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envFiles = [".env", ".env.local", "apps/web/.env.local"];
const supportedLoginMethods = new Set(["email", "wallet", "google", "github"]);
const args = new Set(process.argv.slice(2));
const production = args.has("--production");

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

function warn(label, detail) {
  console.warn(`warn ${label}${detail ? ` - ${detail}` : ""}`);
}

function fail(label, detail) {
  console.error(`fail ${label}${detail ? ` - ${detail}` : ""}`);
}

function hasEnv(key) {
  return Boolean(process.env[key]?.trim());
}

function parseLoginMethods() {
  const raw = process.env.NEXT_PUBLIC_PRIVY_LOGIN_METHODS || "email,wallet";
  return raw
    .split(",")
    .map((method) => method.trim().toLowerCase())
    .filter(Boolean);
}

function requireEnv(key, message) {
  if (hasEnv(key)) {
    pass(`env ${key}`);
    return true;
  }

  fail(`env ${key}`, message);
  return false;
}

function run() {
  for (const file of envFiles) loadEnvFile(file);

  let ok = true;
  const loginMethods = parseLoginMethods();
  const unknownMethods = loginMethods.filter((method) => !supportedLoginMethods.has(method));

  if (unknownMethods.length) {
    fail("login methods", `unsupported values: ${unknownMethods.join(", ")}`);
    ok = false;
  } else if (loginMethods.length) {
    pass("login methods", loginMethods.join(","));
  } else {
    fail("login methods", "set at least one supported method");
    ok = false;
  }

  ok = requireEnv("NEXT_PUBLIC_PRIVY_APP_ID", "client auth needs a public Privy app id") && ok;

  if (hasEnv("NEXT_PUBLIC_PRIVY_CLIENT_ID")) {
    pass("env NEXT_PUBLIC_PRIVY_CLIENT_ID");
  } else {
    warn("env NEXT_PUBLIC_PRIVY_CLIENT_ID", "optional for many web app clients");
  }

  const serverAppIdReady = hasEnv("PRIVY_APP_ID") || hasEnv("NEXT_PUBLIC_PRIVY_APP_ID");
  if (serverAppIdReady) {
    pass("server app id");
  } else {
    fail("server app id", "set PRIVY_APP_ID or NEXT_PUBLIC_PRIVY_APP_ID");
    ok = false;
  }

  const serverCredentialReady = hasEnv("PRIVY_APP_SECRET") || hasEnv("PRIVY_VERIFICATION_KEY");
  if (serverCredentialReady) {
    pass("server credential", hasEnv("PRIVY_APP_SECRET") ? "app secret present" : "verification key present");
  } else {
    fail("server credential", "set PRIVY_APP_SECRET or PRIVY_VERIFICATION_KEY");
    ok = false;
  }

  if (production) {
    ok = requireEnv("NEXT_PUBLIC_APP_URL", "production auth redirects need the public app URL") && ok;

    if (process.env.PRIVY_AUTH_REQUIRED === "true") {
      pass("PRIVY_AUTH_REQUIRED", "true");
    } else {
      fail("PRIVY_AUTH_REQUIRED", "set PRIVY_AUTH_REQUIRED=true for production");
      ok = false;
    }

    if (process.env.NEXT_PUBLIC_APP_URL?.startsWith("http://localhost")) {
      fail("NEXT_PUBLIC_APP_URL", "production cannot use localhost");
      ok = false;
    }
  } else if (process.env.PRIVY_AUTH_REQUIRED === "true") {
    pass("PRIVY_AUTH_REQUIRED", "true");
  } else {
    warn("PRIVY_AUTH_REQUIRED", "false or unset; local demo fallback remains enabled");
  }

  if (loginMethods.includes("google")) {
    warn("google login", "must also be enabled in the Privy dashboard with this app domain as an allowed origin");
  }

  if (!ok) {
    process.exitCode = 1;
    return;
  }

  pass("auth verification complete");
}

run();
