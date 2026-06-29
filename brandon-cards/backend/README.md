# Brandon's Cards API (Backend)

Standalone Express + Prisma + PostgreSQL API for the **Cards** feature of the
Kudos Board project. Runs independently on **port 5000** with its own database
(`kudos_cards_brandon`). There is no Board model here — `boardId` is stored as a
plain integer (no foreign key) and defaults to `1`. Charles adds the Board
relation during integration.

## Stack
- Express 4 + CORS
- Prisma **6.7.0** (`@prisma/client` + `prisma` CLI)
- PostgreSQL

## Setup

```bash
cd brandon-cards/backend
npm install

# 1. Configure the database connection
cp .env.example .env
# Edit .env and set DATABASE_URL for your Postgres instance.
# (Postgres.app on macOS: postgresql://<your-mac-username>@localhost:5432/kudos_cards_brandon?schema=public)

# 2. Create the database (if it doesn't exist) and apply migrations
createdb kudos_cards_brandon       # or create it however you manage Postgres
npx prisma migrate dev             # applies migrations + generates the client

# 3. (Optional) seed some sample cards
npm run seed

# 4. Run the server
npm start                          # http://localhost:5000
# or: npm run dev   (auto-restart on file changes)
```

## Environment variables (`.env`)
| Variable       | Description                                  |
|----------------|----------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `PORT`         | Express server port (defaults to `5000`).    |

## API

Base URL: `http://localhost:5000`

| Method | Path                   | Description                       | Success | Errors |
|--------|------------------------|-----------------------------------|---------|--------|
| GET    | `/cards`               | List all cards (newest first)     | 200     | 500    |
| POST   | `/cards`               | Create a card                     | 201     | 400, 500 |
| PATCH  | `/cards/:id/upvote`    | Increment upvotes by 1 (repeatable)| 200    | 400, 404, 500 |
| DELETE | `/cards/:id`           | Delete a card                     | 204     | 400, 404, 500 |

### POST /cards — request body
```jsonc
{
  "message": "Great job!",     // required, non-empty string
  "gifUrl":  "https://...",    // required, non-empty string
  "author":  "Bob",            // optional
  "boardId": 1                  // optional, defaults to 1
}
```

### Response shape
All success responses (except DELETE 204) return the card under a key:
```jsonc
// GET /cards
{ "cards": [ { "id": 1, "boardId": 1, "message": "...", "gifUrl": "...", "author": "Bob", "upvotes": 3, "createdAt": "..." } ] }

// POST /cards, PATCH /cards/:id/upvote
{ "card": { "id": 1, "boardId": 1, "message": "...", "gifUrl": "...", "author": "Bob", "upvotes": 0, "createdAt": "..." } }
```

## Scripts
| Script         | Action                          |
|----------------|---------------------------------|
| `npm start`    | Run the server (`node index.js`)|
| `npm run dev`  | Run with `--watch` auto-restart |
| `npm run seed` | Insert sample cards             |
