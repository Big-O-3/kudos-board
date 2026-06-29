import { useEffect, useState } from "react";
import CreateCardForm from "./components/CreateCardForm";
import CardGrid from "./components/CardGrid";
import {
  getCards,
  createCard,
  upvoteCard,
  deleteCard,
} from "./api/cards";
import "./App.css";

// Standalone boardId for this cards-only app. Charles wires real boards in
// during integration; until then every card belongs to board 1.
const DEFAULT_BOARD_ID = 1;

// App — owns the cards list and orchestrates all card operations. State updates
// after each operation keep the UI in sync with no manual refresh.
function App() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all cards once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCards();
        if (!cancelled) setCards(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Create a card, then prepend it to the list (newest first).
  async function handleCardCreated(payload) {
    const created = await createCard(payload);
    setCards((prev) => [created, ...prev]);
  }

  // Upvote a card and replace it in the list with the server's updated copy.
  async function handleUpvote(id) {
    const updated = await upvoteCard(id);
    setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  // Delete a card and remove it from the list.
  async function handleDelete(id) {
    await deleteCard(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Kudos Cards</h1>
        <p className="app__subtitle">
          Create, upvote, and share cards of appreciation.
        </p>
      </header>

      <main className="app__main">
        <section className="app__create">
          <CreateCardForm
            boardId={DEFAULT_BOARD_ID}
            onCardCreated={handleCardCreated}
          />
        </section>

        <section className="app__list">
          <h2 className="app__list-title">Cards</h2>

          {isLoading && <p className="app__status">Loading cards…</p>}

          {error && !isLoading && (
            <p className="app__status app__status--error">
              Couldn&apos;t load cards: {error}
            </p>
          )}

          {!isLoading && !error && (
            <CardGrid
              cards={cards}
              onUpvote={handleUpvote}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      <footer className="app__footer">
        <p>Kudos Cards · Brandon&apos;s workspace</p>
      </footer>
    </div>
  );
}

export default App;
