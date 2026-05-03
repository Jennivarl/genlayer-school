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

## Usernames

Usernames are public handles for leaderboards, certificates, and community activity. They are normalized to lowercase and must match:

```text
^[a-z0-9_]{3,24}$
```

## Local Data

Development progress and profiles are stored in `.local-data/progress.json`, which is git-ignored. This keeps the API real while avoiding premature database setup.

## Supabase Path

When ready, replace local mode with Supabase by setting `GENLAYER_SCHOOL_STORAGE_DRIVER=supabase` and applying the migrations in `supabase/migrations`.
