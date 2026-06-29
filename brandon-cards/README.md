# Brandon's Workspace — Cards Feature

## Your Deliverable
A **standalone cards-only CRUD app** with GIPHY integration that can run independently.

## What You Own
- Card model and all card CRUD operations
- Card display grid on board page
- Create card form **with GIPHY search/select** (the hardest feature!)
- Upvote functionality (repeatable)
- Delete card functionality

## Your Stack
- **Backend**: Express (port 5001), Prisma, PostgreSQL
- **Frontend**: React (port 3001)
- **Database**: `kudos_cards_brandon` (your own isolated database)
- **External API**: GIPHY API

## Timeline

### Day 1 (Wednesday) — Backend Setup
- [ ] `cd backend && npm init -y`
- [ ] Install: `npm install express cors @prisma/client pg`
- [ ] `npx prisma init`
- [ ] Create `schema.prisma` with **Card model only** (see planning.md Section 3)
  - Include `boardId` field but **NO foreign key constraint** (boards don't exist in your DB)
- [ ] Create `.env` with `DATABASE_URL=postgresql://user:password@localhost:5432/kudos_cards_brandon`
- [ ] Set up Express server in `index.js` (port 5001)
- [ ] Add CORS middleware
- [ ] Run `npx prisma migrate dev --name init`

### Day 2 (Thursday) — Backend Routes
- [ ] **GET /cards** — return all cards (ignore boardId filtering for now)
- [ ] **POST /cards** — validate message & gifUrl required, author optional, accept boardId (default to 1)
- [ ] **PATCH /cards/:id/upvote** — increment upvotes by 1
- [ ] **DELETE /cards/:id** — delete card
- [ ] Test all 4 routes in Postman
- [ ] Seed a few test cards

### Day 3 (Friday) — Frontend Components + GIPHY
- [ ] `cd frontend && npx create-react-app .` (port 3001)
- [ ] Get GIPHY API key from https://developers.giphy.com/
- [ ] Build `CardGrid.jsx` — displays cards in grid
- [ ] Build `CardTile.jsx` — shows message, gif, upvote count, upvote button, delete button
- [ ] Build `CreateCardForm.jsx` — **THIS IS THE BIG ONE:**
  - Message textarea (required)
  - Author input (optional)
  - GIPHY search section:
    - Search input field
    - Search button
    - Display search results (grid of gifs)
    - Click gif to select it
    - Show selected gif preview in form
    - Store gifUrl in state
  - Submit button
- [ ] Use **mock card data** to test CardGrid/CardTile first
- [ ] Get GIPHY search working before connecting to backend

### Day 4 (Saturday) — Connect & Test
- [ ] Replace mock data with `fetch('http://localhost:5001/cards')`
- [ ] Wire up create form → `POST http://localhost:5001/cards` (hardcode `boardId: 1`)
- [ ] Wire up upvote button → `PATCH http://localhost:5001/cards/:id/upvote`
- [ ] Wire up delete button → `DELETE http://localhost:5001/cards/:id`
- [ ] Test end-to-end:
  - Search GIPHY → select gif → create card → appears in grid
  - Upvote card → count increases
  - Upvote again → count increases again (repeatable)
  - Delete card → disappears from grid
- [ ] ✅ **DONE** — Push final code to GitHub

## API Contract (from planning.md)

### GET /cards
Returns all cards
```json
{
  "cards": [
    {
      "id": 1,
      "boardId": 1,
      "message": "Great job!",
      "gifUrl": "https://media.giphy.com/...",
      "author": "Bob",
      "upvotes": 5,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

Note: During integration, this will become `GET /boards/:boardId/cards` and filter by boardId.

### POST /cards
Create a new card
```json
// Request
{
  "boardId": 1,
  "message": "Great job!",
  "gifUrl": "https://media.giphy.com/...",
  "author": "Bob"
}

// Response (201)
{
  "card": {
    "id": 1,
    "boardId": 1,
    "message": "Great job!",
    "gifUrl": "https://media.giphy.com/...",
    "author": "Bob",
    "upvotes": 0,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### PATCH /cards/:id/upvote
Increment upvotes by 1
```json
// Response (200)
{
  "card": {
    "id": 1,
    "boardId": 1,
    "message": "Great job!",
    "gifUrl": "https://media.giphy.com/...",
    "author": "Bob",
    "upvotes": 6,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### DELETE /cards/:id
Delete a card
- Success: 204 No Content
- Error: 404 Not Found or 500

## Database Schema

```prisma
model Card {
  id        Int      @id @default(autoincrement())
  boardId   Int
  message   String
  gifUrl    String
  author    String?
  upvotes   Int      @default(0)
  createdAt DateTime @default(now())
}
```

Note: Don't add the foreign key relation to Board yet — Charles will add that during integration.

## Components You Own

### CardGrid
- Props: `cards` (array), `onCardDeleted` (function), `onCardUpvoted` (function)
- Renders: Grid of CardTile components

### CardTile
- Props: `card` (object), `onDelete` (function), `onUpvote` (function)
- State: isUpvoting, isDeleting
- Renders: Card with message, gif image, upvote button + count, delete button

### CreateCardForm
- Props: `boardId` (number), `onCardCreated` (function)
- State: message, author, gifUrl, giphySearchQuery, giphyResults, selectedGif, isSearching, isSubmitting, error
- Renders: Form with message input, author input, GIPHY search interface, submit button
- Interactions: 
  - GIPHY search → fetch from API → display results
  - Click gif → set selectedGif and gifUrl
  - Submit form → POST /cards

## GIPHY API Integration

### Getting API Key
1. Go to https://developers.giphy.com/
2. Create an account
3. Create an app
4. Copy your API key

### Search Endpoint
```javascript
const API_KEY = 'your_api_key_here';
const searchGifs = async (query) => {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=20`
  );
  const data = await response.json();
  return data.data; // Array of gif objects
};

// Each gif object has:
// - id: string
// - images.original.url: string (use this for gifUrl)
// - title: string
```

## How to Run Your App

```bash
# Terminal 1 - Backend
cd brandon-cards/backend
npm install
npx prisma migrate dev
node index.js
# Backend runs on http://localhost:5001

# Terminal 2 - Frontend
cd brandon-cards/frontend
npm install
npm start
# Frontend runs on http://localhost:3001
```

## When You're Done
- Push your code to GitHub
- Let Charles know it's ready for integration
- Your app should be fully functional standalone (create cards with GIPHY, upvote, delete)
