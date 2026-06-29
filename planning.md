# Kudos Board — Project Planning Document

## Project Overview
Full-stack app where users create themed boards with kudos cards. Features: search/filter boards, create cards with GIPHY, upvote cards.

---

## Section 1: Component Architecture

### Component Hierarchy
```
App (routing)
├── HomePage (boards, searchQuery, selectedCategory, filteredBoards)
│   ├── Header
│   ├── Banner
│   ├── SearchBar (searchQuery, onSearch, onClear)
│   ├── FilterButtons (selectedCategory, onFilterChange)
│   ├── CreateBoardForm (title, category, author, imageUrl, isSubmitting, error)
│   ├── BoardGrid (boards[], onBoardDeleted)
│   │   └── BoardTile (board, onDelete, isDeleting) → click navigates to /boards/:id
│   └── Footer
└── BoardPage (boardId, cards[], isLoading)
    ├── Header
    ├── CreateCardForm (boardId, message, author, gifUrl, giphySearchQuery, giphyResults, selectedGif, isSearching, isSubmitting)
    ├── CardGrid (cards[], onCardDeleted, onCardUpvoted)
    │   └── CardTile (card, onDelete, onUpvote, isUpvoting, isDeleting)
    └── Footer
```

**Key Interactions:**
- HomePage: fetches boards on mount, search filters by title, category filter (All/Recent/Celebration/Thank You/Inspiration)
- CreateBoardForm: POST /boards with validation (title & category required)
- BoardTile: click navigates, delete button calls DELETE /boards/:id
- CreateCardForm: GIPHY search → select gif → POST /cards
- CardTile: upvote button PATCH /cards/:id/upvote, delete button DELETE /cards/:id

---

## Section 2: API Contracts

Base URL: `http://localhost:5000`

### Boards
**GET /boards**  
→ 200: `{boards: [{id, title, category, author?, imageUrl, createdAt}]}`

**POST /boards**  
← `{title*, category*, author?, imageUrl*}`  
→ 201: `{board: {id, title, category, author, imageUrl, createdAt}}`  
→ 400: Missing title or category

**DELETE /boards/:id**  
→ 204: No content  
→ 404: Board not found

### Cards
**GET /boards/:boardId/cards**  
→ 200: `{cards: [{id, boardId, message, gifUrl, author?, upvotes, createdAt}]}`  
→ 404: Board not found

**POST /cards**  
← `{boardId*, message*, gifUrl*, author?}`  
→ 201: `{card: {id, boardId, message, gifUrl, author, upvotes: 0, createdAt}}`  
→ 400: Missing required fields  
→ 404: Board not found

**PATCH /cards/:id/upvote**  
→ 200: `{card: {..., upvotes: incremented}}`  
→ 404: Card not found

**DELETE /cards/:id**  
→ 204: No content  
→ 404: Card not found

*Fields marked with * are required

---

## Section 3: Database Schema Spec

```prisma
model Board {
  id        Int      @id @default(autoincrement())
  title     String
  category  String   // "celebration" | "thank-you" | "inspiration"
  author    String?
  imageUrl  String
  createdAt DateTime @default(now())
  cards     Card[]
}

model Card {
  id        Int      @id @default(autoincrement())
  boardId   Int
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  message   String
  gifUrl    String
  author    String?
  upvotes   Int      @default(0)
  createdAt DateTime @default(now())
}
```

**Relationships:** Board → Cards (one-to-many, cascade delete)

---

## Section 4: State Architecture

### HomePage
- `boards: Board[]` — fetched on mount, updated on create/delete
- `searchQuery: string` — controlled by SearchBar
- `selectedCategory: 'all' | 'recent' | 'celebration' | 'thank-you' | 'inspiration'` — controlled by FilterButtons
- `filteredBoards` (computed) — applies search (case-insensitive title match) + category filter (recent = sort by createdAt desc, take 6)

### CreateBoardForm
- `title, category, author, imageUrl: string` — form inputs
- `isSubmitting: boolean, error: string | null` — submission state

### BoardPage
- `boardId: number` — from URL params
- `cards: Card[]` — fetched on mount, updated on create/delete/upvote
- `isLoading: boolean`

### CreateCardForm
- `message, author, gifUrl: string` — form inputs
- `giphySearchQuery: string, giphyResults: GIF[], selectedGif: GIF | null` — GIPHY search state
- `isSearching, isSubmitting: boolean, error: string | null` — loading/error states

### BoardTile & CardTile
- `isDeleting: boolean` — loading state during delete
- CardTile also has `isUpvoting: boolean`

---

## Additional Notes

**Work Split:**
- Prateek: Boards (backend + frontend)
- Brandon: Cards (backend + frontend + GIPHY)
- Charles: Discovery (search/filter) + integration

**External API:** GIPHY (https://api.giphy.com/v1/gifs/search) — get key from https://developers.giphy.com/

**Tech Stack:** React, React Router, Express, Prisma, PostgreSQL

**Filter Logic:**
- Search: case-insensitive `title.includes(query)`
- Recent: sort by `createdAt` desc, take first 6
- Category: filter by `category === selected`

---

**Code-Spec Parity:** Verified during integration — see reconciliation below.

---

## Spec Reconciliation — Backend (Milestone 2)

Verified `charles-integration/backend` against Prateek's `prateek-boards/backend`
and Brandon's `brandon-cards/backend` after both pushed.

### Endpoints verified:
- GET /boards — ✅ matches spec (returns `{ boards }`, ordered by createdAt desc)
- POST /boards — ✅ matches spec (title/category/imageUrl required → 201 `{ board }`; 400 otherwise)
- DELETE /boards/:id — ✅ matches spec (204; 404 via Prisma P2025)
- GET /boards/:boardId/cards — ✅ matches spec (integration route; 404 if board missing)
- POST /cards — ✅ matches spec (boardId/message/gifUrl required → 201 `{ card }`)
- PATCH /cards/:id/upvote — ✅ matches spec (increments by 1, returns `{ card }`; 404)
- DELETE /cards/:id — ✅ matches spec (204; 404)

### Schema verified:
- Board model — ✅ matches Prateek's schema (id, title, category, author?, imageUrl, createdAt)
- Card model — ✅ matches Brandon's schema (id, boardId, message, gifUrl, author?, upvotes, createdAt)
- Relationship (Board → Cards) — ✅ added during integration: one-to-many, `onDelete: Cascade`

### Gaps found and resolved:
- **`GET /cards` → `GET /boards/:boardId/cards`:** Brandon's standalone app served all
  cards at `/cards` with no board filter (boardId defaulted to 1). Integration migrated
  this to the board-scoped route and added a 404 when the board doesn't exist. ✅ resolved.
- **`POST /cards` board existence:** standalone app didn't verify the board (none existed).
  Integration adds a `findUnique` check → 404 if the board is missing. ✅ resolved.
- **No FK in standalone Card model:** Brandon intentionally omitted the Board relation
  (isolated DB). Integration adds the FK + cascade in the merged schema. ✅ resolved.

### Intentional spec updates:
- Prisma pinned to v6 in the integrated backend. Prisma v7 removed `url = env(...)` from
  schema files in favor of a `prisma.config.ts` driver adapter; v6 keeps the team's
  documented `migrate dev` workflow and stays byte-compatible with both partners' schemas.

---

## Final Spec Reconciliation — Full Pipeline (Milestone 3)

Verified `charles-integration/frontend` against the partners' pushed frontends.

### Frontend fetch calls verified (centralized in `src/api.js`):
- GET /boards (home page load) — ✅ matches Prateek's `data.boards` usage
- POST /boards (create board) — ✅ matches (optimistic `[board, ...prev]` insert)
- DELETE /boards/:id — ✅ matches
- GET /boards/:boardId/cards — ✅ matches integration contract
- POST /cards (boardId from URL) — ✅ matches Brandon's payload shape
- PATCH /cards/:id/upvote — ✅ matches
- DELETE /cards/:id — ✅ matches

### Integration gaps found and resolved:
- **Category value `thank-you` vs `thank you`:** My Phase-1 FilterButtons used `'thank you'`
  (space). Prateek's CreateBoardForm dropdown emits `'thank-you'` (hyphen), matching the
  planning.md schema comment. Fixed FilterButtons + mock data + tests to `'thank-you'`,
  so the category filter actually matches real board data. ✅ resolved.
- **GIPHY API key:** Both my integration and Brandon's app read `VITE_GIPHY_API_KEY` from
  Vite env. ✅ consistent (no gap).
- **GIF result shape:** Brandon normalizes GIPHY results to `{ id, url, previewUrl, title }`
  via an `api/giphy.js` helper; my integrated CreateCardForm reads the raw GIPHY shape
  inline. Both store `images.original.url` as `gifUrl`, so the persisted data is identical.
  Structural difference only — no behavioral gap.

### State architecture verified:
- HomePage state (boards, searchQuery, selectedCategory, computed filteredBoards) — ✅ matches
- BoardPage state (boardId from URL, cards, isLoading) — ✅ matches
- Create/Tile loading flags (isSubmitting, isDeleting, isUpvoting) — ✅ matches

### Final code-spec parity assessment:
- Is planning.md accurate? ✅ Yes. Backend routes, response shapes, schema, and frontend
  fetch contracts all match across the three workspaces.
- ⚠️ Outstanding (environmental, not code): full end-to-end run requires a live `kudos_full`
  Postgres database. The placeholder `user:password` credentials in `.env` are denied, so
  `prisma migrate dev` and a live CRUD walkthrough have not been executed. All static checks
  pass: schema validates, frontend builds + lints, 9 unit tests pass, both routes serve, and
  the UI degrades gracefully on backend errors.
