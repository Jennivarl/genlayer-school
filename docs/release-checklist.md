# Release Checklist

Use this before promoting a deployment to the community.

## Code

- `main` is pushed to GitHub.
- GitHub Actions CI is passing on `main`.
- `npm.cmd run typecheck` passes.
- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- `npm.cmd run smoke -- --base-url=<deployment-url>` passes.
- `/backend` has no missing production keys.

## Supabase

- All migrations in `supabase/migrations` are applied in order.
- The database includes regional quiz support from `0005_add_regional_quiz_kind.sql`.
- The database includes regional admin content support from `0006_add_regional_admin_content.sql`.
- `GENLAYER_SCHOOL_STORAGE_DRIVER=supabase` is set.
- Admin content can be saved and published.
- Analytics loads without database errors.

## Privy

- `NEXT_PUBLIC_PRIVY_APP_ID` is set.
- `NEXT_PUBLIC_PRIVY_LOGIN_METHODS=email,wallet` is set unless more providers are configured in Privy.
- `PRIVY_APP_ID` is set.
- `PRIVY_APP_SECRET` or `PRIVY_VERIFICATION_KEY` is set.
- `PRIVY_AUTH_REQUIRED=true` is set for production.
- A test learner can sign in and update their username.
- Google sign-in is tested before adding `google` to `NEXT_PUBLIC_PRIVY_LOGIN_METHODS`.

## Admin

- `ADMIN_ACCESS_TOKEN` is set.
- `/admin` unlocks with the token.
- `/analytics` loads with the token.
- Seed content is bootstrapped into admin content if this is a fresh environment.
- A weekly summary can be saved as draft.
- A test spotlight can be published and appears publicly.
- A regional track can be edited, saved, and previewed from admin.

## Regional School

- `/regions` lists all 10 regional tracks.
- China uses Chinese.
- India uses Hindi.
- Indonesia uses Indonesian.
- LATAM uses Spanish + Portuguese.
- Nigeria uses Pidgin.
- Russia uses Russian.
- Korea uses Korean.
- Turkey uses Turkish.
- Ukraine uses Ukrainian.
- Vietnam uses Vietnamese.
- A signed-in learner can complete a regional lesson.
- A signed-in learner can submit a regional quiz.
- Regional progress updates on `/regions` and `/dashboard`.
- Regional certificate page pulls the learner username into the download.

## Certificate Templates

- Final PNGs are committed in `apps/web/public/certificates`.
- Expected files exist: `china.png`, `india.png`, `indonesia.png`, `latam.png`, `nigeria.png`, `russia.png`, `korea.png`, `turkey.png`, `ukraine.png`, `vietnam.png`.
- `/admin` -> Certificate templates shows all files as ready.
- A missing-template fallback is acceptable only before public launch.
- At least one downloaded certificate PNG is inspected manually.

## Public Smoke Test

- `/learn` loads.
- `/regions` loads.
- `/regions/india` loads.
- `/regions/latam/quiz` loads.
- `/regions/nigeria/certificate` loads.
- `/dashboard` loads after sign-in.
- `/certificates` loads and shows certificate lifecycle state.
- `/gen-fren-weekly` shows seed and published admin content.
- `/community-spotlight` shows seed and published admin content.
- `/backend` reflects the expected production readiness state.
- `/api/backend/status` returns ready/missing diagnostics without exposing secrets.
- `/api/catalog` returns course, weekly, spotlight, and regional content.
