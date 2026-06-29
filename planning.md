# Kudos Board — Project Planning Document

## Project Overview
A full-stack web application where users can create themed boards and fill them with kudos cards (messages of praise, encouragement, and appreciation). Users can search and filter boards, create cards with GIFs from GIPHY, and upvote cards.

---

## Section 1: Component Architecture

### Root Component
**App**
- **Responsibility**: Manages routing and renders top-level page components
- **Renders**: `<Router>` with routes for HomePage and BoardPage
- **Props**: None
- **State**: None (routing handled by React Router)
- **Interactions**: Navigation between pages

---

### Home Page Components (Discovery + Boards)

**HomePage**
- **Responsibility**: Displays the home page with all boards, search, and filter functionality
- **Renders**: Header, Banner, SearchBar, FilterButtons, CreateBoardForm, BoardGrid, Footer
- **Props**: None
- **State**: 
  - `boards` (array of board objects)
  - `searchQuery` (string)
  - `selectedCategory` (string: 'all' | 'recent' | 'celebration' | 'thank-you' | 'inspiration')
  - `filteredBoards` (computed from boards + searchQuery + selectedCategory)
- **Interactions**: Fetches boards on mount, handles search/filter updates, refreshes on create/delete

**Header**
- **Responsibility**: Displays site header with title/logo
- **Renders**: `<header>` with site branding
- **Props**: None
- **State**: None
- **Interactions**: None

**Banner**
- **Responsibility**: Displays welcome message or hero section
- **Renders**: `<section>` with banner content
- **Props**: None
- **State**: None
- **Interactions**: None

**Footer**
- **Responsibility**: Displays footer content
- **Renders**: `<footer>` with copyright/links
- **Props**: None
- **State**: None
- **Interactions**: None

**SearchBar**
- **Responsibility**: Allows users to search boards by title
- **Renders**: Text input, submit button, clear button
- **Props**: 
  - `searchQuery` (string) — current search query
  - `onSearch` (function) — callback when search is submitted
  - `onClear` (function) — callback when search is cleared
- **State**: None (controlled by parent)
- **Interactions**: 
  - Submit button click → calls `onSearch(query)`
  - Enter key press → calls `onSearch(query)`
  - Clear button click → calls `onClear()`

**FilterButtons**
- **Responsibility**: Allows users to filter boards by category
- **Renders**: Button group or dropdown with category options (All, Recent, Celebration, Thank You, Inspiration)
- **Props**: 
  - `selectedCategory` (string) — currently selected category
  - `onFilterChange` (function) — callback when filter changes
- **State**: None (controlled by parent)
- **Interactions**: Button click → calls `onFilterChange(category)`

**CreateBoardForm**
- **Responsibility**: Form to create a new board
- **Renders**: Form with inputs for title, category dropdown, author (optional), imageUrl, and submit button
- **Props**: 
  - `onBoardCreated` (function) — callback after successful creation
- **State**: 
  - `title` (string)
  - `category` (string)
  - `author` (string)
  - `imageUrl` (string)
  - `isSubmitting` (boolean)
  - `error` (string | null)
- **Interactions**: 
  - Form submit → POST to /boards → calls `onBoardCreated()` → resets form

**BoardGrid**
- **Responsibility**: Displays boards in a grid layout
- **Renders**: Grid container with BoardTile components
- **Props**: 
  - `boards` (array of board objects)
  - `onBoardDeleted` (function) — callback after board is deleted
- **State**: None
- **Interactions**: Passes `onBoardDeleted` to each BoardTile

**BoardTile**
- **Responsibility**: Displays a single board (image, title) and handles navigation/deletion
- **Renders**: Card with image, title, delete button
- **Props**: 
  - `board` (object: {id, title, category, author, imageUrl, createdAt})
  - `onDelete` (function) — callback when delete is clicked
- **State**: 
  - `isDeleting` (boolean)
- **Interactions**: 
  - Card click → navigates to `/boards/:id`
  - Delete button click → DELETE to `/boards/:id` → calls `onDelete()`

---

### Board Detail Page Components (Cards)

**BoardPage**
- **Responsibility**: Displays a specific board's cards and allows card creation
- **Renders**: Header, board title, CreateCardForm, CardGrid, Footer
- **Props**: None (gets boardId from URL params)
- **State**: 
  - `boardId` (number, from URL)
  - `cards` (array of card objects)
  - `isLoading` (boolean)
- **Interactions**: Fetches cards for the board on mount, refreshes on create/delete/upvote

**CreateCardForm**
- **Responsibility**: Form to create a new card with GIPHY integration
- **Renders**: Form with message input, author input (optional), GIPHY search interface, submit button
- **Props**: 
  - `boardId` (number) — the board this card belongs to
  - `onCardCreated` (function) — callback after successful creation
- **State**: 
  - `message` (string)
  - `author` (string)
  - `gifUrl` (string)
  - `giphySearchQuery` (string)
  - `giphyResults` (array of GIF objects)
  - `selectedGif` (object | null)
  - `isSearching` (boolean)
  - `isSubmitting` (boolean)
  - `error` (string | null)
- **Interactions**: 
  - GIPHY search input + button → fetches from GIPHY API → displays results
  - GIF click in results → sets `selectedGif` and `gifUrl`
  - Form submit → POST to /cards → calls `onCardCreated()` → resets form

**CardGrid**
- **Responsibility**: Displays cards in a grid layout
- **Renders**: Grid container with CardTile components
- **Props**: 
  - `cards` (array of card objects)
  - `onCardDeleted` (function) — callback after card is deleted
  - `onCardUpvoted` (function) — callback after card is upvoted
- **State**: None
- **Interactions**: Passes callbacks to each CardTile

**CardTile**
- **Responsibility**: Displays a single card with message, gif, upvote count, and actions
- **Renders**: Card with message, gif image, upvote button + count, delete button
- **Props**: 
  - `card` (object: {id, boardId, message, gifUrl, author, upvotes, createdAt})
  - `onDelete` (function) — callback when delete is clicked
  - `onUpvote` (function) — callback when upvote is clicked
- **State**: 
  - `isUpvoting` (boolean)
  - `isDeleting` (boolean)
- **Interactions**: 
  - Upvote button click → PATCH to `/cards/:id/upvote` → calls `onUpvote()`
  - Delete button click → DELETE to `/cards/:id` → calls `onDelete()`

---

### Component Hierarchy

```
App
├── HomePage
│   ├── Header
│   ├── Banner
│   ├── SearchBar
│   ├── FilterButtons
│   ├── CreateBoardForm
│   ├── BoardGrid
│   │   └── BoardTile (multiple)
│   └── Footer
└── BoardPage
    ├── Header
    ├── CreateCardForm
    ├── CardGrid
    │   └── CardTile (multiple)
    └── Footer
```

---

## Section 2: API Contracts

### Base URL
Development: `http://localhost:5000`

---

### Boards Endpoints

#### GET /boards
**Description**: Retrieve all boards

**Request**:
- Method: GET
- Body: None

**Success Response**:
- Status: 200 OK
- Body:
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

**Error Response**:
- Status: 500 Internal Server Error
- Body: `{ "error": "Failed to fetch boards" }`

---

#### POST /boards
**Description**: Create a new board

**Request**:
- Method: POST
- Body:
```json
{
  "title": "Team Wins",          // required, string
  "category": "celebration",     // required, string (celebration | thank-you | inspiration)
  "author": "Alice",             // optional, string
  "imageUrl": "https://..."      // required, string (URL)
}
```

**Success Response**:
- Status: 201 Created
- Body:
```json
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

**Error Responses**:
- Status: 400 Bad Request (missing required fields)
  - Body: `{ "error": "Title and category are required" }`
- Status: 500 Internal Server Error
  - Body: `{ "error": "Failed to create board" }`

---

#### DELETE /boards/:id
**Description**: Delete a board by ID

**Request**:
- Method: DELETE
- Params: `id` (number) — board ID
- Body: None

**Success Response**:
- Status: 204 No Content
- Body: None

**Error Responses**:
- Status: 404 Not Found (board doesn't exist)
  - Body: `{ "error": "Board not found" }`
- Status: 500 Internal Server Error
  - Body: `{ "error": "Failed to delete board" }`

---

### Cards Endpoints

#### GET /boards/:boardId/cards
**Description**: Retrieve all cards for a specific board

**Request**:
- Method: GET
- Params: `boardId` (number) — board ID
- Body: None

**Success Response**:
- Status: 200 OK
- Body:
```json
{
  "cards": [
    {
      "id": 1,
      "boardId": 1,
      "message": "Great job on the presentation!",
      "gifUrl": "https://media.giphy.com/...",
      "author": "Bob",
      "upvotes": 5,
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- Status: 404 Not Found (board doesn't exist)
  - Body: `{ "error": "Board not found" }`
- Status: 500 Internal Server Error
  - Body: `{ "error": "Failed to fetch cards" }`

---

#### POST /cards
**Description**: Create a new card

**Request**:
- Method: POST
- Body:
```json
{
  "boardId": 1,                                  // required, number
  "message": "Great job on the presentation!",   // required, string
  "gifUrl": "https://media.giphy.com/...",       // required, string (URL)
  "author": "Bob"                                // optional, string
}
```

**Success Response**:
- Status: 201 Created
- Body:
```json
{
  "card": {
    "id": 1,
    "boardId": 1,
    "message": "Great job on the presentation!",
    "gifUrl": "https://media.giphy.com/...",
    "author": "Bob",
    "upvotes": 0,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses**:
- Status: 400 Bad Request (missing required fields)
  - Body: `{ "error": "boardId, message, and gifUrl are required" }`
- Status: 404 Not Found (board doesn't exist)
  - Body: `{ "error": "Board not found" }`
- Status: 500 Internal Server Error
  - Body: `{ "error": "Failed to create card" }`

---

#### PATCH /cards/:id/upvote
**Description**: Increment the upvote count for a card by 1

**Request**:
- Method: PATCH
- Params: `id` (number) — card ID
- Body: None

**Success Response**:
- Status: 200 OK
- Body:
```json
{
  "card": {
    "id": 1,
    "boardId": 1,
    "message": "Great job on the presentation!",
    "gifUrl": "https://media.giphy.com/...",
    "author": "Bob",
    "upvotes": 6,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses**:
- Status: 404 Not Found (card doesn't exist)
  - Body: `{ "error": "Card not found" }`
- Status: 500 Internal Server Error
  - Body: `{ "error": "Failed to upvote card" }`

---

#### DELETE /cards/:id
**Description**: Delete a card by ID

**Request**:
- Method: DELETE
- Params: `id` (number) — card ID
- Body: None

**Success Response**:
- Status: 204 No Content
- Body: None

**Error Responses**:
- Status: 404 Not Found (card doesn't exist)
  - Body: `{ "error": "Card not found" }`
- Status: 500 Internal Server Error
  - Body: `{ "error": "Failed to delete card" }`

---

## Section 3: Database Schema Spec

### Board Model

```prisma
model Board {
  id        Int      @id @default(autoincrement())
  title     String
  category  String
  author    String?
  imageUrl  String
  createdAt DateTime @default(now())
  cards     Card[]
}
```

**Fields**:
- `id`: Integer, primary key, auto-increments
- `title`: String, required — the board's title
- `category`: String, required — one of: "celebration", "thank-you", "inspiration"
- `author`: String, optional — name of board creator
- `imageUrl`: String, required — URL to board's cover image/gif
- `createdAt`: DateTime, default now() — timestamp of creation
- `cards`: Relation to Card model (one-to-many)

**Constraints**:
- `title` cannot be empty
- `category` must be one of the valid categories (enforced in backend validation)
- `imageUrl` must be a valid URL (enforced in backend validation)

---

### Card Model

```prisma
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

**Fields**:
- `id`: Integer, primary key, auto-increments
- `boardId`: Integer, required — foreign key to Board.id
- `board`: Relation to Board model (many-to-one)
- `message`: String, required — the kudos message content
- `gifUrl`: String, required — URL to selected GIPHY gif
- `author`: String, optional — name of card creator
- `upvotes`: Integer, default 0 — count of upvotes received
- `createdAt`: DateTime, default now() — timestamp of creation

**Constraints**:
- `boardId` must reference an existing Board
- When a Board is deleted, all its Cards are deleted (Cascade)
- `message` cannot be empty
- `gifUrl` must be a valid URL (enforced in backend validation)
- `upvotes` cannot be negative

---

## Section 4: State Architecture

### HomePage State

**boards** (array of board objects)
- **Data Type**: `Array<{id: number, title: string, category: string, author: string | null, imageUrl: string, createdAt: string}>`
- **Initial Value**: `[]`
- **Owner Component**: HomePage
- **Update Triggers**: 
  - Component mount → fetch GET /boards
  - New board created → add to array
  - Board deleted → remove from array

**searchQuery** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: HomePage
- **Update Triggers**: 
  - User types in SearchBar input
  - User clicks clear button → reset to ""

**selectedCategory** (string)
- **Data Type**: `string` (one of: "all" | "recent" | "celebration" | "thank-you" | "inspiration")
- **Initial Value**: `"all"`
- **Owner Component**: HomePage
- **Update Triggers**: User clicks a category filter button

**filteredBoards** (computed array)
- **Data Type**: `Array<Board>` (computed from boards + searchQuery + selectedCategory)
- **Initial Value**: Computed on render
- **Owner Component**: HomePage
- **Update Triggers**: 
  - Computed whenever `boards`, `searchQuery`, or `selectedCategory` changes
  - Filter logic:
    1. If `searchQuery` is not empty → filter boards where `title` includes `searchQuery` (case-insensitive)
    2. If `selectedCategory` is "all" → show all (filtered by search)
    3. If `selectedCategory` is "recent" → sort by `createdAt` descending, take first 6
    4. If `selectedCategory` is a category name → filter by `category === selectedCategory`

---

### CreateBoardForm State

**title** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: CreateBoardForm
- **Update Triggers**: User types in title input

**category** (string)
- **Data Type**: `string`
- **Initial Value**: `"celebration"` (default selection)
- **Owner Component**: CreateBoardForm
- **Update Triggers**: User selects from category dropdown

**author** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: CreateBoardForm
- **Update Triggers**: User types in author input (optional)

**imageUrl** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: CreateBoardForm
- **Update Triggers**: User types/pastes image URL

**isSubmitting** (boolean)
- **Data Type**: `boolean`
- **Initial Value**: `false`
- **Owner Component**: CreateBoardForm
- **Update Triggers**: 
  - Set to `true` when form is submitted
  - Set to `false` after POST request completes (success or error)

**error** (string | null)
- **Data Type**: `string | null`
- **Initial Value**: `null`
- **Owner Component**: CreateBoardForm
- **Update Triggers**: Set when validation fails or API returns error

---

### BoardPage State

**boardId** (number)
- **Data Type**: `number`
- **Initial Value**: Extracted from URL params (`useParams()`)
- **Owner Component**: BoardPage
- **Update Triggers**: Route change

**cards** (array of card objects)
- **Data Type**: `Array<{id: number, boardId: number, message: string, gifUrl: string, author: string | null, upvotes: number, createdAt: string}>`
- **Initial Value**: `[]`
- **Owner Component**: BoardPage
- **Update Triggers**: 
  - Component mount → fetch GET /boards/:boardId/cards
  - New card created → add to array
  - Card deleted → remove from array
  - Card upvoted → update upvotes count

**isLoading** (boolean)
- **Data Type**: `boolean`
- **Initial Value**: `true`
- **Owner Component**: BoardPage
- **Update Triggers**: 
  - Set to `true` when fetching cards
  - Set to `false` after fetch completes

---

### CreateCardForm State

**message** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: CreateCardForm
- **Update Triggers**: User types in message textarea

**author** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: CreateCardForm
- **Update Triggers**: User types in author input (optional)

**giphySearchQuery** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: CreateCardForm
- **Update Triggers**: User types in GIPHY search input

**giphyResults** (array of GIF objects)
- **Data Type**: `Array<{id: string, url: string, title: string}>`
- **Initial Value**: `[]`
- **Owner Component**: CreateCardForm
- **Update Triggers**: 
  - User submits GIPHY search → fetch from GIPHY API
  - Results populate array

**selectedGif** (object | null)
- **Data Type**: `{id: string, url: string, title: string} | null`
- **Initial Value**: `null`
- **Owner Component**: CreateCardForm
- **Update Triggers**: User clicks a GIF from search results

**gifUrl** (string)
- **Data Type**: `string`
- **Initial Value**: `""`
- **Owner Component**: CreateCardForm
- **Update Triggers**: When user selects a GIF, set to `selectedGif.url`

**isSearching** (boolean)
- **Data Type**: `boolean`
- **Initial Value**: `false`
- **Owner Component**: CreateCardForm
- **Update Triggers**: 
  - Set to `true` when GIPHY search is submitted
  - Set to `false` after fetch completes

**isSubmitting** (boolean)
- **Data Type**: `boolean`
- **Initial Value**: `false`
- **Owner Component**: CreateCardForm
- **Update Triggers**: 
  - Set to `true` when form is submitted
  - Set to `false` after POST request completes

**error** (string | null)
- **Data Type**: `string | null`
- **Initial Value**: `null`
- **Owner Component**: CreateCardForm
- **Update Triggers**: Set when validation fails or API returns error

---

### CardTile State

**isUpvoting** (boolean)
- **Data Type**: `boolean`
- **Initial Value**: `false`
- **Owner Component**: CardTile
- **Update Triggers**: 
  - Set to `true` when upvote button clicked
  - Set to `false` after PATCH request completes

**isDeleting** (boolean)
- **Data Type**: `boolean`
- **Initial Value**: `false`
- **Owner Component**: CardTile
- **Update Triggers**: 
  - Set to `true` when delete button clicked
  - Set to `false` after DELETE request completes

---

### BoardTile State

**isDeleting** (boolean)
- **Data Type**: `boolean`
- **Initial Value**: `false`
- **Owner Component**: BoardTile
- **Update Triggers**: 
  - Set to `true` when delete button clicked
  - Set to `false` after DELETE request completes

---

## Additional Notes

### Work Split
- **Prateek**: Boards domain (BoardGrid, BoardTile, CreateBoardForm, backend routes for boards)
- **Brandon**: Cards domain (CardGrid, CardTile, CreateCardForm with GIPHY, backend routes for cards)
- **Charles**: Discovery features (SearchBar, FilterButtons, Header, Banner, Footer) + final integration

### External APIs
- **GIPHY API**: Used in CreateCardForm for GIF search
  - Endpoint: `https://api.giphy.com/v1/gifs/search`
  - API Key required (get from https://developers.giphy.com/)

### Technology Stack
- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: CSS (TBD during implementation)

### Edge Cases to Consider
1. **Empty states**: What displays when no boards exist? No cards on a board?
2. **Search with no results**: Show "No boards found" message
3. **Filter "Recent" with < 6 boards**: Show all available boards
4. **Duplicate upvotes**: Allow unlimited upvotes per user (no restriction)
5. **Long messages**: Consider max-length validation or text truncation in UI
6. **Invalid image URLs**: Consider validation or fallback image
7. **Network errors**: Display user-friendly error messages

---

**Document Status**: Draft  
**Last Updated**: Day 0 — Initial planning phase  
**Code-Spec Parity**: To be verified during Milestones 1-3
