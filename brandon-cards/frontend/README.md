# Brandon's Cards Frontend

Standalone React (Vite) app for the **Cards** feature of the Kudos Board
project. Runs on **port 3000** and talks to the Cards backend on **port 5000**.
Lets you create cards (with GIPHY GIF search/select), upvote them (repeatable),
and delete them — with the UI updating live, no refresh needed.

## Stack
- React 19 + Vite
- Plain `fetch` for the API client (no extra HTTP library)
- GIPHY API for GIF search

## Setup

```bash
cd brandon-cards/frontend
npm install

# 1. Configure environment variables
cp .env.example .env
# Edit .env and paste your GIPHY API key (see below).

# 2. Run the dev server
npm run dev        # http://localhost:3000
```

> The backend must also be running on port 5000 — see
> [../backend/README.md](../backend/README.md).

## Environment variables (`.env`)

Vite only exposes variables prefixed with `VITE_` to the browser.

| Variable              | Description                                              |
|-----------------------|----------------------------------------------------------|
| `VITE_GIPHY_API_KEY`  | **Required.** Your GIPHY API key (for GIF search).       |
| `VITE_API_BASE_URL`   | Base URL of the Cards backend. Defaults to `http://localhost:5000`. |

### Getting a GIPHY API key
1. Go to https://developers.giphy.com/
2. Create an account and create an app.
3. Copy the API key into `.env`:
   ```
   VITE_GIPHY_API_KEY=your_real_key_here
   ```
4. Restart the dev server (Vite reads env vars at startup).

`.env` is gitignored so your key is never committed. Commit `.env.example` only.

## Scripts
| Script            | Action                              |
|-------------------|-------------------------------------|
| `npm run dev`     | Start the dev server on port 3000   |
| `npm run build`   | Production build to `dist/`         |
| `npm run preview` | Preview the production build (3000) |
| `npm run lint`    | Run ESLint                          |

## Project structure

```
src/
├── App.jsx              # Owns the cards list; fetches on mount; create/upvote/delete handlers
├── config.js           # Reads VITE_ env vars (API base URL, GIPHY key/config)
├── api/
│   ├── cards.js        # fetch wrappers: getCards, createCard, upvoteCard, deleteCard
│   └── giphy.js        # GIPHY search → normalized { id, url, previewUrl, title }
└── components/
    ├── CardGrid.jsx     # Grid of CardTiles (+ empty state)
    ├── CardTile.jsx     # One card: gif, message, author, upvote count/button, delete
    └── CreateCardForm.jsx  # Message + author + GIPHY search/select + submit
```

## Component overview

- **CardGrid** — `props: cards, onUpvote, onDelete`. Lays cards out in a
  responsive grid; shows an empty-state message when there are none.
- **CardTile** — `props: card, onUpvote, onDelete`. Renders one card and owns
  `isUpvoting` / `isDeleting` loading flags to disable its buttons mid-request.
- **CreateCardForm** — `props: boardId, onCardCreated`. Message (required),
  author (optional), and the GIPHY search section: search box + Search button,
  results grid, click-to-select, selected-GIF preview, then submit.
