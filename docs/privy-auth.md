# Privy Auth Setup

GenLayer School uses Privy for wallet-first learner identity.

## Client setup

Create a Privy app in the dashboard, then set:

```text
NEXT_PUBLIC_PRIVY_APP_ID=...
NEXT_PUBLIC_PRIVY_CLIENT_ID=...
```

`NEXT_PUBLIC_PRIVY_CLIENT_ID` is optional for web app clients, but useful when you configure separate app clients for staging/production.

## Server verification

Progress APIs accept Privy access tokens in the `Authorization: Bearer <token>` header. Server routes verify tokens with `@privy-io/node` before using the learner ID.

Set:

```text
PRIVY_APP_ID=...
PRIVY_VERIFICATION_KEY=...
```

If `PRIVY_AUTH_REQUIRED=false`, unauthenticated local development falls back to `demo-learner`. If `PRIVY_AUTH_REQUIRED=true`, progress, quiz, and certificate APIs return `401` unless a valid Privy access token is provided.

## Learner IDs

Authenticated learner records use this shape:

```text
privy:<privy-user-id>
```

That means the same storage layer works with local JSON today and Supabase later.
