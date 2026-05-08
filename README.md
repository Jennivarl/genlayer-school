# GenLayer School

GenLayer School is a community education platform for learning GenLayer, Intelligent Contracts, and the GenLayer ecosystem.

The product is designed as a durable community resource, not a hackathon prototype:

- Learn GenLayer through courses, lessons, labs, and quizzes.
- Follow monthly GenLayer community spotlights.
- Read weekly Gen-Fren summaries and prep for community quizzes.
- Track progress and prepare for on-chain certifications.
- Integrate with GenLayer contracts and GenLayerJS as the product matures.

## Workspace

```text
apps/web              Next.js community learning app
packages/content      Typed seed content and content contracts
packages/contracts    GenLayer Intelligent Contract templates
packages/sdk          GenLayer client wrappers
packages/ui           Shared UI primitives
docs                  Product, architecture, and operating notes
```

## Quickstart

```powershell
npm install
Copy-Item .env.example apps/web/.env.local
npm.cmd run dev
```

The web app runs at `http://localhost:3100` when started with the existing local workflow.

## Checks

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run smoke -- --base-url=http://localhost:3100
```

GitHub Actions runs typecheck, lint, Vercel config validation, and production build on pushes to `main` and pull requests.

## Auth

Privy is the planned auth provider for wallet-first learner identity. See docs/privy-auth.md.

## Backend Diagnostics

Use `/backend` while setting up deployments. It reports the active storage driver, Supabase readiness, Privy readiness, and production-required environment keys without exposing secret values.

## Deployment

See docs/deployment.md for the Vercel, Supabase, Privy, admin token, and production checklist flow.

The repo includes `vercel.json` for root-based Vercel deployments. Use docs/release-checklist.md before sharing a deployment publicly.

