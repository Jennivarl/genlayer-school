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

## First Step

This repo starts with a production-minded monorepo foundation so the project can grow into a real community platform.

## Auth

Privy is the planned auth provider for wallet-first learner identity. See docs/privy-auth.md.

## Backend Diagnostics

Use `/backend` while setting up deployments. It reports the active storage driver, Supabase readiness, Privy readiness, and production-required environment keys without exposing secret values.

