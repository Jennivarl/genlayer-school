# Release Checklist

Use this before promoting a deployment to the community.

## Code

- `main` is pushed to GitHub.
- `npm.cmd run typecheck` passes.
- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- `npm.cmd run smoke -- --base-url=<deployment-url>` passes.
- `/backend` has no missing production keys.

## Supabase

- All migrations in `supabase/migrations` are applied in order.
- `GENLAYER_SCHOOL_STORAGE_DRIVER=supabase` is set.
- Admin content can be saved and published.
- Analytics loads without database errors.

## Privy

- `NEXT_PUBLIC_PRIVY_APP_ID` is set.
- `PRIVY_APP_ID` is set.
- `PRIVY_VERIFICATION_KEY` is set.
- `PRIVY_AUTH_REQUIRED=true` is set for production.
- A test learner can sign in and update their username.

## Admin

- `ADMIN_ACCESS_TOKEN` is set.
- `/admin` unlocks with the token.
- `/analytics` loads with the token.
- Seed content is bootstrapped into admin content if this is a fresh environment.
- A weekly summary can be saved as draft.
- A test spotlight can be published and appears publicly.

## Public Smoke Test

- `/learn` loads.
- `/dashboard` loads after sign-in.
- `/certificates` loads and shows certificate lifecycle state.
- `/gen-fren-weekly` shows seed and published admin content.
- `/community-spotlight` shows seed and published admin content.
- `/backend` reflects the expected production readiness state.
