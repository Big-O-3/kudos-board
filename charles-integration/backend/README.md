# Integrated Kudos Board — Backend

Express + Prisma + PostgreSQL backend for the integrated app. Combines the
board routes (Prateek) and card routes (Brandon) against one `kudos_full`
database, per the API contract in [planning.md](../../planning.md) Section 2.

## Setup

```bash
npm install
# Set real Postgres credentials in .env (see .env.example), then:
npx prisma migrate dev --name init
npm start          # http://localhost:5000
```

`.env` currently uses the spec's placeholder `user:password`. Replace with real
credentials for a working `kudos_full` database before running the migration.

## Endpoints (7)

| Method | Route | Notes |
|--------|-------|-------|
| GET    | `/boards` | All boards |
| POST   | `/boards` | Requires `title`, `category`, `imageUrl`; `author` optional → 201 |
| DELETE | `/boards/:id` | 204; 404 if missing. Cascade-deletes the board's cards |
| GET    | `/boards/:boardId/cards` | Cards for a board; 404 if board missing |
| POST   | `/cards` | Requires `boardId`, `message`, `gifUrl`; `author` optional → 201; 404 if board missing |
| PATCH  | `/cards/:id/upvote` | Increments upvotes; 200; 404 if missing |
| DELETE | `/cards/:id` | 204; 404 if missing |

## Integration changes vs. standalone apps

- Brandon's `GET /cards` → `GET /boards/:boardId/cards` (filtered by board).
- `POST /cards` now verifies the referenced board exists (404 otherwise).
- `schema.prisma` merges both models and adds the `Board → Cards` relation
  (one-to-many, cascade delete).

## Status

Built from the planning.md spec because Prateek's and Brandon's code had not
been pushed at integration time (their workspace folders are still README-only).
Once they push, Day 7 reconciliation verifies their routes/schema match this
implementation. Prisma is pinned to v6 to match the team's documented
`url = env("DATABASE_URL")` + `migrate dev` workflow (v7 dropped that in favor
of a `prisma.config.ts` driver-adapter setup).
