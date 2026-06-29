# Prateek's Workspace — Boards Feature

## Your Deliverable
A **standalone boards-only CRUD app** that can run independently.

## What You Own
- Board model and all board CRUD operations
- Board display grid on home page
- Create board form
- Delete board functionality
- Click-to-navigate behavior (navigation itself will be handled by Charles during integration)

## Your Stack
- **Backend**: Express (port 5000), Prisma, PostgreSQL
- **Frontend**: React (port 3000)
- **Database**: `kudos_boards_prateek` (your own isolated database)

## Timeline

### Day 1 (Wednesday) — Backend Setup
- [ ] `cd backend && npm init -y`
- [ ] Install: `npm install express cors @prisma/client pg`
- [ ] `npx prisma init`
- [ ] Create `schema.prisma` with **Board model only** (see planning.md Section 3)
- [ ] Create `.env` with `DATABASE_URL=postgresql://user:password@localhost:5432/kudos_boards_prateek`
- [ ] Set up Express server in `index.js` (port 5000)
- [ ] Add CORS middleware
- [ ] Run `npx prisma migrate dev --name init`

### Day 2 (Thursday) — Backend Routes
- [ ] **GET /boards** — return all boards
- [ ] **POST /boards** — validate title & category required, author optional
- [ ] **DELETE /boards/:id** — delete board by id
- [ ] Test all 3 routes in Postman
- [ ] Seed 3-4 test boards manually for testing

### Day 3 (Friday) — Frontend Components
- [ ] `cd frontend && npx create-react-app .` (port 3000)
- [ ] Build `BoardGrid.jsx` — displays boards in grid
- [ ] Build `BoardTile.jsx` — shows imageUrl, title, delete button, clickable
- [ ] Build `CreateBoardForm.jsx` — form with:
  - Title input (text, required)
  - Category dropdown (celebration | thank-you | inspiration, required)
  - Author input (text, optional)
  - ImageUrl input (text, required)
  - Submit button
- [ ] Use **mock data** (hardcoded array of boards)
- [ ] Make sure UI looks right

### Day 4 (Saturday) — Connect & Test
- [ ] Replace mock data with `fetch('http://localhost:5000/boards')`
- [ ] Wire up create form → `POST http://localhost:5000/boards`
- [ ] Wire up delete button → `DELETE http://localhost:5000/boards/:id`
- [ ] Test end-to-end:
  - Create board → appears in grid
  - Delete board → disappears from grid
- [ ] Handle "View Board" click → for now just `console.log(board.id)` or use `onClick` prop
- [ ] ✅ **DONE** — Push final code to GitHub

## API Contract (from planning.md)

### GET /boards
Returns all boards
```json
{
  "boards": [
    {
      "id": 1,
      "title": "Team Wins",
      "category": "celebration",
      "author": "Alice",
      "imageUrl": "https://...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### POST /boards
Create a new board
```json
// Request
{
  "title": "Team Wins",
  "category": "celebration",
  "author": "Alice",
  "imageUrl": "https://..."
}

// Response (201)
{
  "board": {
    "id": 1,
    "title": "Team Wins",
    "category": "celebration",
    "author": "Alice",
    "imageUrl": "https://...",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### DELETE /boards/:id
Delete a board
- Success: 204 No Content
- Error: 404 Not Found or 500

## Database Schema

```prisma
model Board {
  id        Int      @id @default(autoincrement())
  title     String
  category  String
  author    String?
  imageUrl  String
  createdAt DateTime @default(now())
}
```

Note: Don't add the `cards Card[]` relation yet — Charles will add that during integration.

## Components You Own

### BoardGrid
- Props: `boards` (array), `onBoardDeleted` (function)
- Renders: Grid of BoardTile components

### BoardTile
- Props: `board` (object), `onDelete` (function)
- Renders: Card with image, title, delete button
- Interactions: Click card → navigate (you can add `onClick` prop for Charles to wire up later)

### CreateBoardForm
- Props: `onBoardCreated` (function)
- State: title, category, author, imageUrl, isSubmitting, error
- Interactions: Form submit → POST /boards → reset form

## How to Run Your App

```bash
# Terminal 1 - Backend
cd prateek-boards/backend
npm install
npx prisma migrate dev
node index.js
# Backend runs on http://localhost:5000

# Terminal 2 - Frontend
cd prateek-boards/frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## When You're Done
- Push your code to GitHub
- Let Charles know it's ready for integration
- Your app should be fully functional standalone (create/view/delete boards)
