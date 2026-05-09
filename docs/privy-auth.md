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

## Learner IDs

Authenticated learner records use this shape:

```text
privy:<privy-user-id>
```

That means the same storage layer works with local JSON today and Supabase later.

## Profile and username

After login, learners can choose a username from the dashboard. Profile APIs use the verified Privy user ID when an access token is present, so usernames attach to privy:<privy-user-id> records.

The dashboard also syncs Privy email and wallet address into the learner profile after sign-in. Usernames remain learner-controlled and are not inferred from Privy identity.

