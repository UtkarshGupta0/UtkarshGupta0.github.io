# BITS Professor Ratings (Monorepo)

Monorepo for a BITS-only professor rating platform.

## Apps
- `apps/server`: Node/Express API (TypeScript, Prisma, PostgreSQL)
- `apps/web`: Next.js 14 web app (Tailwind, PWA)

## Quick Start
1. Create env files from examples in `apps/server/.env.example` and `apps/web/.env.example`.
2. Start dependencies (Postgres, Redis, Elasticsearch) or adjust envs.
3. Install deps and run dev:

```bash
npm i
npm run prisma:generate -w apps/server
npm run dev
```

API: http://localhost:4000/health
Web: http://localhost:3000/