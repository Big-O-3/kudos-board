# Charles's Workspace — Discovery Features + Integration

## Your Deliverable
1. **Phase 1 (Days 1-4)**: Standalone discovery UI with mock data
2. **Phase 2 (Days 5-7)**: Integrated full-stack app combining all three workspaces

## What You Own
- Search functionality (search by title)
- Filter functionality (All, Recent, Celebration, Thank You, Inspiration)
- Home page chrome (Header, Banner, Footer)
- **Integration**: Merging Prateek's boards + Brandon's cards into one app
- **Reconciliation**: Writing the spec verification sections in planning.md

## Your Stack
- **Backend**: Express (port 5000), Prisma, PostgreSQL
- **Frontend**: React (port 3000), React Router
- **Database**: `kudos_full` (combined database with Board + Card models)

## Timeline

### Phase 1: Standalone Discovery UI (Days 1-4)

#### Day 1 (Wednesday) — Frontend Layout
- [x] `cd frontend` — scaffolded with Vite + React (port 3002; CRA is deprecated and broken on Node 24)
- [x] Build `Header.jsx` — site title/logo
- [x] Build `Banner.jsx` — welcome message or hero section
- [x] Build `Footer.jsx` — footer content
- [x] Build `HomePage.jsx` — combines Header + Banner + (placeholder) + Footer

#### Day 2 (Thursday) — Search Bar
- [x] Build `SearchBar.jsx`:
  - Text input field
  - Submit/Search button
  - Clear button (X icon or "Clear" text)
- [x] Search logic:
  - When Enter key or Submit clicked → filter boards where `title.toLowerCase().includes(query.toLowerCase())`
  - When input is cleared (empty string) → show all boards
- [x] Use **mock board data** (hardcoded array)
- [x] Test: search "thank" → only boards with "thank" in title

#### Day 3 (Friday) — Category Filter
- [x] Build `FilterButtons.jsx` (button group or dropdown):
  - Buttons: All, Recent, Celebration, Thank you, Inspiration
- [x] Filter logic:
  - **All**: show all boards
  - **Recent**: sort by `createdAt` descending, take first 6
  - **Celebration/Thank you/Inspiration**: filter by `category === selected`
- [x] Still using mock data
- [x] Test all filters work

#### Day 4 (Saturday) — Polish Discovery UI
- [x] Combine search + filter (both work together)
- [x] Test all interactions with mock data (Vitest suite: `npm test`, 9 tests)
- [x] ✅ **Phase 1 DONE**

---

### Phase 2: Integration (Days 5-7)

#### Day 5 (Sunday) — Backend Integration
- [x] Backend originally built from the planning.md contract (partners hadn't pushed yet); now reconciled against their pushed code — see planning.md.
- [x] Create `charles-integration/backend/`
- [x] `npm init -y && npm install express cors @prisma/client pg` (Prisma pinned to v6 — see backend/README.md)
- [x] `npx prisma init` (schema + .env created)
- [x] Board routes in `index.js` (GET/POST/DELETE /boards) — ✅ contracts match Prateek's pushed code
- [x] Card routes in same `index.js` — ✅ contracts match Brandon's pushed code
- [x] Merge `schema.prisma`:
  ```prisma
  model Board {
    id        Int      @id @default(autoincrement())
    title     String
    category  String
    author    String?
    imageUrl  String
    createdAt DateTime @default(now())
    cards     Card[]   // Add relation
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
- [x] **Update GET /cards → GET /boards/:boardId/cards** (filter by boardId; also 404s if board missing)
- [x] Create `.env` with a working `DATABASE_URL` for the `kudos_full` database (gitignored; local `postgres` role)
- [x] Run `npx prisma migrate dev --name init` — ✅ applied, DB in sync with schema
- [x] Test all 7 endpoints — ✅ all pass live via curl: create/list boards, create/list cards, upvote (repeatable), delete card, **cascade delete board removes its cards**, plus 400/404 error cases


#### Day 6 (Monday) — Frontend Integration
- [x] Use existing Phase 1 React app at `charles-integration/frontend/`
- [x] Install React Router: `npm install react-router-dom`
- [x] Copy components (built from spec, reconciled against partners' pushed code — see planning.md):
  - From Prateek: `BoardGrid.jsx`, `BoardTile.jsx`, `CreateBoardForm.jsx` — ✅ contracts match (categories, fields, fetch shapes)
  - From Brandon: `CardGrid.jsx`, `CardTile.jsx`, `CreateCardForm.jsx` (with GIPHY) — ✅ contracts match (GIPHY env var, gifUrl shape)
  - Your own: `Header.jsx`, `Banner.jsx`, `Footer.jsx`, `SearchBar.jsx`, `FilterButtons.jsx` ✅
- [x] Create `HomePage.jsx`:
  - Renders: Header + Banner + SearchBar + FilterButtons + CreateBoardForm + BoardGrid + Footer
  - State: boards, searchQuery, selectedCategory, filteredBoards (computed)
  - Fetch: `GET httplocalhost:5000/boards` on mount
  - BoardTile onClick → `navigate(`/boards/${board.id}`)`
- [x] Create `BoardPage.jsx`:
  - Renders: Header + board title + CreateCardForm + CardGrid + Footer
  - State: boardId (from URL), cards, isLoading
  - Fetch: `GET http://localhost:5000/boards/${boardId}/cards` on mount
- [x] Set up routing in `App.jsx` (HomePage at `/`, BoardPage at `/boards/:id`)
- [x] Replace ALL mock data with real fetch calls (centralized in `src/api.js`):
  - Home page: `GET /boards` ✅
  - Create board: `POST /boards` ✅
  - Delete board: `DELETE /boards/:id` ✅
  - Board page: `GET /boards/:boardId/cards` ✅
  - Create card: `POST /cards` (boardId from URL) ✅
  - Upvote card: `PATCH /cards/:id/upvote` ✅
  - Delete card: `DELETE /cards/:id` ✅
- [x] Test end-to-end flow — ✅ full stack runs live against `kudos_full`: backend serves real boards/cards, frontend loads them (build ✅, lint ✅, 9 unit tests ✅, both routes serve 200, UI handles errors gracefully). GIPHY uses `VITE_GIPHY_API_KEY`.

#### Day 7 (Tuesday) — Reconciliation & Polish
- [x] Open `planning.md`
- [x] Add **Spec Reconciliation — Backend** section (7 endpoints, both schemas, 3 gaps resolved)
- [x] Add **Final Spec Reconciliation — Full Pipeline** section (fetch calls, gaps, state arch, final assessment)
- [x] Commit reconciliation sections
- [x] Final testing — ✅ all 7 endpoints pass live against a real `kudos_full` DB (incl. cascade delete + 400/404 cases); frontend loads live data end-to-end

## Components You Own

### HomePage (You build this)
- Renders: Header + Banner + SearchBar + FilterButtons + CreateBoardForm + BoardGrid + Footer
- State: boards, searchQuery, selectedCategory, filteredBoards
- Integrates: Prateek's board components + your discovery components

### BoardPage (You build this)
- Renders: Header + board title + CreateCardForm + CardGrid + Footer
- State: boardId, cards, isLoading
- Integrates: Brandon's card components

### SearchBar
- Props: searchQuery, onSearch, onClear
- Renders: Input, submit button, clear button

### FilterButtons
- Props: selectedCategory, onFilterChange
- Renders: Button group with All, Recent, Celebration, Thank You, Inspiration

### Header, Banner, Footer
- Simple presentational components

## Filter Logic (Important!)

### Recent Filter
Sort boards by `createdAt` descending, take first 6. Copy first (`[...boards]`)
so we don't mutate the source array — `.sort()` sorts in place:
```javascript
const recentBoards = [...boards]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 6);
```

### Combined Search + Filter
```javascript
const filteredBoards = useMemo(() => {
  let result = boards;
  
  // Apply search
  if (searchQuery) {
    result = result.filter(board =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply category filter
  if (selectedCategory === 'recent') {
    // Copy first so we don't mutate state — .sort() sorts in place.
    result = [...result]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  } else if (selectedCategory !== 'all') {
    result = result.filter(board => board.category === selectedCategory);
  }
  
  return result;
}, [boards, searchQuery, selectedCategory]);
```

## How to Run Final App

```bash
# Terminal 1 - Backend
cd charles-integration/backend
npm install
# Set a real DATABASE_URL in .env (see .env.example), then:
npx prisma migrate dev
npm start          # or: node index.js
# Backend runs on http://localhost:5000

# Terminal 2 - Frontend
cd charles-integration/frontend
npm install
npm run dev        # Vite (not `npm start`)
# Frontend runs on http://localhost:3002
```

## Reconciliation Template

Copy this into `planning.md` after integration:

```markdown
## Spec Reconciliation — Backend (Milestone 2)

### Endpoints verified:
- GET /boards — ✅ matches spec
- POST /boards — ✅ matches spec
- DELETE /boards/:id — ✅ matches spec
- GET /boards/:boardId/cards — ✅ matches spec
- POST /cards — ✅ matches spec
- PATCH /cards/:id/upvote — ✅ matches spec
- DELETE /cards/:id — ✅ matches spec

### Schema verified:
- Board model — ✅ matches planning.md schema spec
- Card model — ✅ matches planning.md schema spec
- Relationship (Board → Cards) — ✅ correct with cascade delete

### Gaps found and resolved:
- [List any mismatches between implementation and spec]

### Intentional spec updates:
- [Any changes made because the spec was incomplete]

---

## Final Spec Reconciliation — Full Pipeline (Milestone 3)

### Frontend fetch calls verified:
- GET /boards (home page load) — ✅ matches spec
- POST /boards (create board) — ✅ matches spec
- DELETE /boards/:id — ✅ matches spec
- GET /boards/:boardId/cards — ✅ matches spec
- POST /cards — ✅ matches spec
- PATCH /cards/:id/upvote — ✅ matches spec
- DELETE /cards/:id — ✅ matches spec

### Integration gaps found and resolved:
- [List mismatches: field names, routes, etc.]

### State architecture verified:
- State variables in planning.md match implementation — ✅

### Final code-spec parity assessment:
- Is planning.md accurate? ✅ Yes
```

## When You're Done
- The final integrated app is the project deliverable
- All reconciliation sections are in planning.md
- Everyone has tested their features end-to-end
