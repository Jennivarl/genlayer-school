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
supabase/migrations/0005_add_regional_quiz_kind.sql
supabase/migrations/0006_add_regional_admin_content.sql
```

Required values:

```text
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GENLAYER_SCHOOL_STORAGE_DRIVER=supabase
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.

Recommended setup check:

```text
/api/backend/status
/backend
```

Both should report Supabase as ready once the variables are set and migrations are applied.

## 2. Privy

Create a Privy app and configure wallet/email login.

Required values:

```text
NEXT_PUBLIC_APP_URL=...
NEXT_PUBLIC_PRIVY_APP_ID=...
NEXT_PUBLIC_PRIVY_CLIENT_ID=...
NEXT_PUBLIC_PRIVY_LOGIN_METHODS=email,wallet
PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
PRIVY_AUTH_REQUIRED=true
```

`NEXT_PUBLIC_PRIVY_CLIENT_ID` can be left empty if Privy does not require a separate client ID for the app setup.
`PRIVY_VERIFICATION_KEY` is optional and can be set as a fallback or JWT verification override.

Keep Google disabled unless the Privy dashboard is fully configured for Google OAuth. The default login methods are email and wallet.

Before turning on Google, confirm these Privy dashboard settings:

```text
Google provider: enabled
Allowed local origin: http://localhost:3100
Allowed production origin: https://your-production-domain
Allowed production redirect: https://your-production-domain
```

Then set:

```text
NEXT_PUBLIC_PRIVY_LOGIN_METHODS=email,wallet,google
```

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

Production environment variables:

```text
NEXT_PUBLIC_APP_URL=https://your-production-domain
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GENLAYER_SCHOOL_STORAGE_DRIVER=supabase
NEXT_PUBLIC_PRIVY_APP_ID=...
NEXT_PUBLIC_PRIVY_CLIENT_ID=...
NEXT_PUBLIC_PRIVY_LOGIN_METHODS=email,wallet
PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
PRIVY_VERIFICATION_KEY=...
PRIVY_AUTH_REQUIRED=true
ADMIN_ACCESS_TOKEN=...
```

Do not set secrets in `NEXT_PUBLIC_*` variables. Only `NEXT_PUBLIC_*` values are safe for the browser.

Set these GitHub repository secrets so CI can run the optional production checks:

```text
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_PRIVY_APP_ID
NEXT_PUBLIC_PRIVY_CLIENT_ID
NEXT_PUBLIC_PRIVY_LOGIN_METHODS
PRIVY_APP_ID
PRIVY_APP_SECRET
PRIVY_VERIFICATION_KEY
PRIVY_AUTH_REQUIRED
```

`PRIVY_VERIFICATION_KEY` is optional if `PRIVY_APP_SECRET` is set. CI skips Supabase or Privy verification when the matching secrets are not configured.

## 5. Regional Certificate Templates

The certificate renderer looks for one PNG per region in `apps/web/public/certificates`:

```text
china.png
india.png
indonesia.png
latam.png
nigeria.png
russia.png
korea.png
turkey.png
ukraine.png
vietnam.png
```

Use 1600x1000 PNGs when possible. The app draws the signed-in username on top and exports a learner-specific PNG download.

Admin status check:

```text
/admin -> Certificate templates -> Refresh status
```

Missing files are allowed during development because the certificate page falls back to a generated placeholder. For public launch, commit all final regional certificate PNGs before deploying.

## 6. Production Checklist

- Supabase migrations are applied.
- `GENLAYER_SCHOOL_STORAGE_DRIVER=supabase`.
- Privy client and server verification are configured with `PRIVY_APP_SECRET`.
- `PRIVY_AUTH_REQUIRED=true`.
- `ADMIN_ACCESS_TOKEN` is set.
- `/backend` shows no missing production keys.
- `/admin` can publish a test draft.
- `/gen-fren-weekly` and `/community-spotlight` show published admin content.
- `/regions` shows all regional tracks.
- `/regions/<region>/quiz` can submit a quiz after sign-in.
- `/regions/<region>/certificate` can download a username-rendered certificate.
- Admin certificate template status shows expected missing/ready files.
- `/analytics` loads with the admin token.

## 7. Local Verification

For local development, copy the root env template into the web app workspace:

```powershell
Copy-Item .env.example apps/web/.env.local
```

Run before deploying:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run smoke -- --base-url=http://localhost:3100
npm.cmd run verify:auth -- --production
npm.cmd run verify:supabase
```

For the launch flow, use docs/release-checklist.md.
