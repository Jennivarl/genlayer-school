# Deployment Guide

This guide takes GenLayer School from local development to a production web deployment without adding GenLayer network tooling.

## Recommended Stack

- Vercel for `apps/web`
- Supabase for Postgres storage
- Privy for learner authentication
- GitHub for source control and deployments

## 1. Supabase

Create a Supabase project, then apply migrations in order:

```text
supabase/migrations/0001_initial_learning_schema.sql
supabase/migrations/0002_add_usernames.sql
supabase/migrations/0003_certificate_record_updates.sql
supabase/migrations/0004_admin_content_entries.sql
```

Required values:

```text
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GENLAYER_SCHOOL_STORAGE_DRIVER=supabase
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.

## 2. Privy

Create a Privy app and configure wallet/email login.

Required values:

```text
NEXT_PUBLIC_PRIVY_APP_ID=...
NEXT_PUBLIC_PRIVY_CLIENT_ID=...
PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
PRIVY_AUTH_REQUIRED=true
```

`NEXT_PUBLIC_PRIVY_CLIENT_ID` can be left empty if Privy does not require a separate client ID for the app setup.
`PRIVY_VERIFICATION_KEY` is optional and can be set as a fallback or JWT verification override.

## 3. Admin Access

Set a strong admin token:

```text
ADMIN_ACCESS_TOKEN=...
```

The `/admin` and `/analytics` pages use this token through `x-admin-token` for protected API calls.

## 4. Vercel

Import the GitHub repo into Vercel.

Recommended settings:

```text
Framework preset: Next.js
Root directory: repository root
Build command: npm run build
Install command: npm ci
Output directory: apps/web/.next
```

The repository includes `vercel.json` with these defaults.

Set all production environment variables in Vercel before the first production deployment.

## 5. Production Checklist

- Supabase migrations are applied.
- `GENLAYER_SCHOOL_STORAGE_DRIVER=supabase`.
- Privy client and server verification are configured with `PRIVY_APP_SECRET`.
- `PRIVY_AUTH_REQUIRED=true`.
- `ADMIN_ACCESS_TOKEN` is set.
- `/backend` shows no missing production keys.
- `/admin` can publish a test draft.
- `/gen-fren-weekly` and `/community-spotlight` show published admin content.
- `/analytics` loads with the admin token.

## 6. Local Verification

For local development, copy the root env template into the web app workspace:

```powershell
Copy-Item .env.example apps/web/.env.local
```

Run before deploying:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

For the launch flow, use docs/release-checklist.md.
