# Kudos Board — Full Stack Project

A collaborative full-stack web application where users can create themed boards and fill them with kudos cards (messages of praise, encouragement, and appreciation).

## Team
- **Prateek** — Boards feature
- **Brandon** — Cards feature  
- **Charles** — Discovery features + Integration

## Project Structure

```
kudos-board/
├── planning.md                    # Project specification (API contracts, schema, components, state)
├── README.md                      # This file
│
├── prateek-boards/                # Prateek's isolated workspace
│   ├── README.md                  # Prateek's guide
│   ├── backend/                   # Express API for boards (port 5000)
│   └── frontend/                  # React app for boards (port 3000)
│
├── brandon-cards/                 # Brandon's isolated workspace
│   ├── README.md                  # Brandon's guide
│   ├── backend/                   # Express API for cards (port 5001)
│   └── frontend/                  # React app for cards (port 3001)
│
└── charles-integration/           # Charles's workspace (final deliverable)
    ├── README.md                  # Charles's guide
    ├── backend/                   # Combined Express API (port 5000)
    └── frontend/                  # Combined React app (port 3000)
```

## Work Split Strategy

Each person works **independently** in their own folder with their own database until Day 5.

### Phase 1: Independent Development (Days 1-4)

**Prateek (Boards):**
- Board CRUD operations (backend + frontend)
- Board grid display
- Create board form
- Delete board functionality

**Brandon (Cards):**
- Card CRUD operations (backend + frontend)
- Card grid display
- Create card form **with GIPHY integration**
- Upvote functionality (repeatable)
- Delete card functionality

**Charles (Discovery):**
- Search by title functionality
- Filter by category (All, Recent, Celebration, Thank You, Inspiration)
- Home page layout (Header, Banner, Footer)

### Phase 2: Integration (Days 5-7)

**Charles (Integrator):**
- Merge Prateek's board routes + Brandon's card routes into one backend
- Merge all frontend components into one React app
- Add React Router for navigation
- Connect frontend to backend
- Write reconciliation sections in planning.md
- Final testing

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express, CORS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **External API**: GIPHY API (for card GIF search)

## Required Features

### Home Page
- ✅ Display all boards in a grid (image + title)
- ✅ Search boards by title
- ✅ Filter boards by category (All, Recent, Celebration, Thank You, Inspiration)
- ✅ Create new board (title, category, author optional, image URL)
- ✅ Delete board
- ✅ Click board to navigate to board detail page

### Board Page
- ✅ Display all cards for a board (message, gif, upvote count)
- ✅ Create new card with GIPHY search/select
- ✅ Upvote card (repeatable)
- ✅ Delete card

## API Endpoints

All endpoints documented in [planning.md](planning.md) Section 2.

### Boards
- `GET /boards` — Get all boards
- `POST /boards` — Create a board
- `DELETE /boards/:id` — Delete a board

### Cards
- `GET /boards/:boardId/cards` — Get all cards for a board
- `POST /cards` — Create a card
- `PATCH /cards/:id/upvote` — Upvote a card
- `DELETE /cards/:id` — Delete a card

## Database Schema

See [planning.md](planning.md) Section 3 for full schema.

### Board
- id, title, category, author (optional), imageUrl, createdAt
- Has many Cards (one-to-many)

### Card
- id, boardId (foreign key), message, gifUrl, author (optional), upvotes, createdAt
- Belongs to Board (many-to-one)
- Cascade delete when board is deleted

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- GIPHY API key (get from https://developers.giphy.com/)

### Phase 1: Individual Workspaces (Days 1-4)

Each person works in their own folder. See individual README files:
- [prateek-boards/README.md](prateek-boards/README.md)
- [brandon-cards/README.md](brandon-cards/README.md)
- [charles-integration/README.md](charles-integration/README.md)

### Phase 2: Final Integrated App (Days 5-7)

```bash
# Backend
cd charles-integration/backend
npm install
npx prisma migrate dev
node index.js
# Runs on http://localhost:5000

# Frontend (in another terminal)
cd charles-integration/frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Timeline

| Day | Prateek | Brandon | Charles |
|-----|---------|---------|---------|
| **0 (Tue)** | Planning.md (together) | Planning.md (together) | Planning.md (together) |
| **1 (Wed)** | Backend setup | Backend setup | Frontend layout |
| **2 (Thu)** | 3 board routes | 4 card routes | Search bar |
| **3 (Fri)** | Frontend components | Frontend + GIPHY | Category filter |
| **4 (Sat)** | Connect FE↔BE ✅ | Connect FE↔BE ✅ | Polish UI ✅ |
| **5 (Sun)** | Hand off code 🎉 | Hand off code 🎉 | Merge backends |
| **6 (Mon)** | Review/feedback | Review/feedback | Merge frontends |
| **7 (Tue)** | Final testing | Final testing | Reconciliation |

## Git Workflow

```bash
# Day 0 - Everyone together
git add planning.md README.md prateek-boards/ brandon-cards/ charles-integration/
git commit -m "Initial project setup and planning"
git push

# Days 1-4 - Work in your own folder
git add prateek-boards/  # or brandon-cards/ or charles-integration/
git commit -m "Your commit message"
git push

# Days 5-7 - Charles integrates
git add charles-integration/
git commit -m "Integrate all features"
git push
```

## Final Deliverable

The **charles-integration/** folder contains the final integrated app that will be submitted.

## Notes

- **planning.md** is the contract — everyone refers to it for API shapes, schema, and component architecture
- Each person's workspace is **fully functional standalone** until integration
- No blocking dependencies until Day 5 (integration phase)
- Reconciliation sections in planning.md verify code-spec parity

## Questions?

Check your individual README:
- [Prateek's Guide](prateek-boards/README.md)
- [Brandon's Guide](brandon-cards/README.md)
- [Charles's Guide](charles-integration/README.md)