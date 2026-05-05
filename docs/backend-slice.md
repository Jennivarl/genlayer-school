# Backend Slice

The first backend slice uses Next.js route handlers and a local JSON store for development. The storage boundary is isolated so Supabase can replace it later.

## Endpoints

- `GET /api/catalog` returns courses, spotlights, and weekly summaries.
- `GET /api/profile` returns the current learner profile and username.
- `PATCH /api/profile` updates `username` and `displayName`.
- `GET /api/progress?learnerId=demo-learner` returns progress, summary stats, and certificate eligibility.
- `POST /api/progress/lesson` marks a lesson complete or incomplete.
- `POST /api/quizzes/submit` grades course or Gen-Fren weekly quizzes and records attempts.
- `GET /api/certificates/eligibility` returns certificate requirements and eligibility.
- `GET /api/certificates` returns eligibility merged with stored certificate lifecycle records.
- `POST /api/certificates/request` moves an eligible certificate record into `mint_pending`.
- `GET /api/admin/content` lists editable weekly summaries and spotlights.
- `POST /api/admin/content` creates or updates admin content as `draft` or `published`.

## Usernames

Usernames are public handles for leaderboards, certificates, and community activity. They are normalized to lowercase and must match:

```text
^[a-z0-9_]{3,24}$
```

## Local Data

Development progress and profiles are stored in `.local-data/progress.json`, which is git-ignored. This keeps the API real while avoiding premature database setup.

## Supabase Path

When ready, replace local mode with Supabase by setting `GENLAYER_SCHOOL_STORAGE_DRIVER=supabase` and applying the migrations in `supabase/migrations`.

## Certificate Lifecycle

Certificate records are stored separately from computed eligibility so the minting flow can survive refreshes, deployments, and future GenLayer contract calls.

```text
eligible -> mint_pending -> minted
```

Records can also be marked `revoked` for moderation or contract correction flows.

## Admin Content

Admin content is intentionally off-chain. It stores weekly Gen-Fren summaries, prep quiz payloads, and monthly community spotlights in local JSON or Supabase. Production deployments should set `ADMIN_ACCESS_TOKEN`; requests must provide that token as `x-admin-token` or a bearer token.
