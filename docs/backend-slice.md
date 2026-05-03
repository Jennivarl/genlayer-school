# Backend Slice

The first backend slice uses Next.js route handlers and a local JSON store for development. The storage boundary is isolated so Supabase can replace it later.

## Endpoints

- `GET /api/catalog` returns courses, spotlights, and weekly summaries.
- `GET /api/progress?learnerId=demo-learner` returns progress, summary stats, and certificate eligibility.
- `POST /api/progress/lesson` marks a lesson complete or incomplete.
- `POST /api/quizzes/submit` grades course or Gen-Fren weekly quizzes and records attempts.
- `GET /api/certificates/eligibility` returns certificate requirements and eligibility.

## Local Data

Development progress is stored in `.local-data/progress.json`, which is git-ignored. This keeps the API real while avoiding premature database setup.

## Supabase Path

When ready, replace `apps/web/src/lib/backend/progress-store.ts` with a Supabase-backed adapter that preserves the same function signatures.
