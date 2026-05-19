# Privy Auth Setup

GenLayer School uses Privy for wallet-first learner identity.

## Client setup

Create a Privy app in the dashboard, then set:

```text
NEXT_PUBLIC_PRIVY_APP_ID=...
NEXT_PUBLIC_PRIVY_CLIENT_ID=...
NEXT_PUBLIC_PRIVY_LOGIN_METHODS=email,wallet
```

For local development, put these values in `apps/web/.env.local`. Deployment providers such as Vercel should receive them through their environment variable settings.

`NEXT_PUBLIC_PRIVY_CLIENT_ID` is optional for web app clients, but useful when you configure separate app clients for staging/production.

`NEXT_PUBLIC_PRIVY_LOGIN_METHODS` should only list methods enabled in the Privy dashboard. The app defaults to `email,wallet`; add `google` or `github` after enabling those providers in Privy.

For Google sign-in, enable Google in the Privy dashboard before adding it here:

```text
NEXT_PUBLIC_PRIVY_LOGIN_METHODS=email,wallet,google
```

Also add the app domain to Privy's allowed origins/redirect settings. For local testing, include `http://localhost:3100`. For production, include the final Vercel or custom domain. If Google is listed in `NEXT_PUBLIC_PRIVY_LOGIN_METHODS` but disabled in the Privy dashboard, email login can still work while Google fails.

## Server verification

Progress APIs accept Privy access tokens in the `Authorization: Bearer <token>` header. Server routes verify tokens with `@privy-io/node` before using the learner ID.

Set:

```text
PRIVY_APP_ID=...
PRIVY_APP_SECRET=...
```

`PRIVY_APP_SECRET` is the preferred server-side credential for the Privy Node SDK. Keep it out of Git and set it only in `.env.local` or your deployment provider's secret environment variables.

You can also provide a JWT verification key as a fallback or override:

```text
PRIVY_VERIFICATION_KEY=...
```

If `PRIVY_AUTH_REQUIRED=false`, unauthenticated local development falls back to `demo-learner`. If `PRIVY_AUTH_REQUIRED=true`, progress, quiz, and certificate APIs return `401` unless a valid Privy access token is provided.

## Verification

Run this before deploying:

```powershell
npm.cmd run verify:auth -- --production
```

The command checks required Privy environment variables without printing secret values. It cannot verify dashboard-only provider settings, so Google must still be checked manually in the Privy dashboard.

## Learner IDs

Authenticated learner records use this shape:

```text
privy:<privy-user-id>
```

That means the same storage layer works with local JSON today and Supabase later.

## Profile and username

After login, learners can choose a username from the dashboard. Profile APIs use the verified Privy user ID when an access token is present, so usernames attach to privy:<privy-user-id> records.

The dashboard also syncs Privy email and wallet address into the learner profile after sign-in. Usernames remain learner-controlled and are not inferred from Privy identity.

