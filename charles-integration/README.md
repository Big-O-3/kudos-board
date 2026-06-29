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
- [ ] `cd frontend && npx create-react-app .` (port 3002)
- [ ] Build `Header.jsx` — site title/logo
- [ ] Build `Banner.jsx` — welcome message or hero section
- [ ] Build `Footer.jsx` — footer content
- [ ] Build `HomePage.jsx` — combines Header + Banner + (placeholder) + Footer

#### Day 2 (Thursday) — Search Bar
- [ ] Build `SearchBar.jsx`:
  - Text input field
  - Submit/Search button
  - Clear button (X icon or "Clear" text)
- [ ] Search logic:
  - When Enter key or Submit clicked → filter boards where `title.toLowerCase().includes(query.toLowerCase())`
  - When input is cleared (empty string) → show all boards
- [ ] Use **mock board data** (hardcoded array)
- [ ] Test: search "thank" → only boards with "thank" in title

#### Day 3 (Friday) — Category Filter
- [ ] Build `FilterButtons.jsx` (button group or dropdown):
  - Buttons: All, Recent, Celebration, Thank you, Inspiration
- [ ] Filter logic:
  - **All**: show all boards
  - **Recent**: sort by `createdAt` descending, take first 6
  - **Celebration/Thank you/Inspiration**: filter by `category === selected`
- [ ] Still using mock data
- [ ] Test all filters work

#### Day 4 (Saturday) — Polish Discovery UI
- [ ] Combine search + filter (both work together)
- [ ] Test all interactions with mock data
- [ ] ✅ **Phase 1 DONE**

---

### Phase 2: Integration (Days 5-7)

#### Day 5 (Sunday) — Backend Integration
- [ ] Wait for Prateek and Brandon to push their code
- [ ] Create `charles-integration/backend/`
- [ ] `npm init -y && npm install express cors @prisma/client pg`
- [ ] `npx prisma init`
- [ ] Copy Prateek's 3 board routes into `index.js`
- [ ] Copy Brandon's 4 card routes into same `index.js`
- [ ] Merge `schema.prisma`:
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
- [ ] **Update GET /cards → GET /boards/:boardId/cards** (filter by boardId)
- [ ] Create `.env` with `DATABASE_URL=postgresql://user:password@localhost:5432/kudos_full`
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Test all 7 endpoints in Postman

#### Day 6 (Monday) — Frontend Integration
- [ ] Create `charles-integration/frontend/` (can copy your existing React app)
- [ ] Install React Router: `npm install react-router-dom`
- [ ] Copy components:
  - From Prateek: `BoardGrid.jsx`, `BoardTile.jsx`, `CreateBoardForm.jsx`
  - From Brandon: `CardGrid.jsx`, `CardTile.jsx`, `CreateCardForm.jsx`
  - Your own: `Header.jsx`, `Banner.jsx`, `Footer.jsx`, `SearchBar.jsx`, `FilterButtons.jsx`
- [ ] Create `HomePage.jsx`:
  - Renders: Header + Banner + SearchBar + FilterButtons + CreateBoardForm + BoardGrid + Footer
  - State: boards, searchQuery, selectedCategory, filteredBoards (computed)
  - Fetch: `GET http://localhost:5000/boards` on mount
  - BoardTile onClick → `navigate(`/boards/${board.id}`)`
- [ ] Create `BoardPage.jsx`:
  - Renders: Header + board title + CreateCardForm + CardGrid + Footer
  - State: boardId (from URL), cards, isLoading
  - Fetch: `GET http://localhost:5000/boards/${boardId}/cards` on mount
- [ ] Set up routing in `App.jsx`:
  ```jsx
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/boards/:id" element={<BoardPage />} />
  </Routes>
  ```
- [ ] Replace ALL mock data with real fetch calls:
  - Home page: `fetch('http://localhost:5000/boards')`
  - Create board: `POST /boards`
  - Delete board: `DELETE /boards/:id`
  - Board page: `fetch('http://localhost:5000/boards/${boardId}/cards')`
  - Create card: `POST /cards` (include boardId from URL)
  - Upvote card: `PATCH /cards/:id/upvote`
  - Delete card: `DELETE /cards/:id`
- [ ] Test end-to-end flow:
  1. Home page loads all boards
  2. Search by title works
  3. Filter by category works (All, Recent, Celebration, etc.)
  4. Create new board → appears in grid
  5. Click board → navigates to `/boards/:id`
  6. Board page shows cards for that board
  7. Create card with GIPHY → appears in grid
  8. Upvote card → count increases
  9. Delete card → disappears
  10. Go back to home → delete board → disappears

#### Day 7 (Tuesday) — Reconciliation & Polish
- [ ] Open `planning.md`
- [ ] Add **Spec Reconciliation — Backend** section:
  - List all 7 endpoints
  - For each: ✅ matches spec OR ⚠️ gap: [explain]
  - Verify Board model matches schema spec
  - Verify Card model matches schema spec
  - List any gaps found and how you resolved them
- [ ] Add **Final Spec Reconciliation — Full Pipeline** section:
  - Verify all frontend fetch calls match API contracts
  - List integration gaps found and resolved
  - Verify state architecture matches implementation
  - Final assessment: Is planning.md accurate? ✅ or ⚠️ differences
- [ ] Commit reconciliation sections
- [ ] Final testing with Prateek and Brandon

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
Sort boards by `createdAt` descending, take first 6:
```javascript
const recentBoards = boards
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
    result = result
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
npx prisma migrate dev
node index.js
# Backend runs on http://localhost:5000

# Terminal 2 - Frontend
cd charles-integration/frontend
npm install
npm start
# Frontend runs on http://localhost:3000
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
