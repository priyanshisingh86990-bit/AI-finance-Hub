# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Google Gemini via Replit AI Integrations (`@workspace/integrations-gemini-ai`)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── ai-money-mentor/    # React + Vite frontend (AI Money Mentor)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── integrations-gemini-ai/  # Gemini AI integration client
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Application: AI Money Mentor

An AI-powered personal finance advisor for Indian users. Features:

1. **Dashboard** - Overview with quick start guide and tool navigation
2. **FIRE Path Planner** - Retirement planning with SIP amounts, asset allocation, and projections
3. **Money Health Score** - 6-dimension financial wellness scoring (0-100)
4. **Tax Wizard** - Old vs new tax regime comparison with deduction analysis
5. **Life Event Advisor** - AI guidance for major life events (marriage, baby, bonus, etc.)
6. **AI Mentor Chat** - Real-time financial Q&A powered by Gemini AI with SSE streaming

## Database Tables

- `conversations` - Gemini AI chat conversations
- `messages` - Messages in conversations
- `financial_profiles` - Saved user financial profiles

## API Routes

- `GET /api/healthz` - Health check
- `GET/POST /api/gemini/conversations` - Conversation CRUD
- `GET/DELETE /api/gemini/conversations/:id` - Single conversation
- `GET/POST /api/gemini/conversations/:id/messages` - Messages (POST streams SSE)
- `POST /api/gemini/generate-image` - Image generation
- `POST /api/finance/fire-plan` - FIRE retirement plan generation
- `POST /api/finance/health-score` - Money health score calculation
- `POST /api/finance/tax-wizard` - Tax regime analysis
- `POST /api/finance/life-event` - Life event financial advice
- `GET/POST /api/finance/profiles` - Saved financial profiles

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all lib packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini AI proxy URL (auto-set by Replit AI Integrations)
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini AI key (auto-set by Replit AI Integrations)
