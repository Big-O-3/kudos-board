import { useState } from "react";
import { searchGifs } from "../api/giphy";
import "./CreateCardForm.css";

// CreateCardForm — the form for creating a new card, including the GIPHY
// search/select flow (the centerpiece feature).
//
// Props:
//   boardId       — number (defaults to 1 in this standalone app)
//   onCardCreated — async (payload) => void  (parent POSTs and updates state)
//
// State (per planning.md Section 4):
//   message, author, gifUrl       — form fields
//   giphySearchQuery              — text in the GIF search box
//   giphyResults, selectedGif     — GIPHY search results + the chosen GIF
//   isSearching, isSubmitting     — async loading flags
//   error                         — user-facing error message
function CreateCardForm({ boardId = 1, onCardCreated }) {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [gifUrl, setGifUrl] = useState("");

  const [giphySearchQuery, setGiphySearchQuery] = useState("");
  const [giphyResults, setGiphyResults] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);

  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Run a GIPHY search. This is its own button (not the form submit) so that
  // pressing Enter / clicking Search never submits the card.
  async function handleSearch() {
    const query = giphySearchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setError(null);
    try {
      const results = await searchGifs(query);
      setGiphyResults(results);
      if (results.length === 0) {
        setError(`No GIFs found for "${query}". Try another search.`);
      }
    } catch (err) {
      setError(err.message);
      setGiphyResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  // Select a GIF from the results grid.
  function handleSelectGif(gif) {
    setSelectedGif(gif);
    setGifUrl(gif.url);
  }

  // Submit the new card.
  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    // Client-side validation mirrors the backend contract: message + gifUrl required.
    if (message.trim() === "") {
      setError("Message is required.");
      return;
    }
    if (gifUrl.trim() === "") {
      setError("Please search for and select a GIF.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCardCreated({
        boardId,
        message: message.trim(),
        gifUrl,
        author: author.trim() || undefined,
      });
      // Reset the form on success.
      setMessage("");
      setAuthor("");
      setGifUrl("");
      setGiphySearchQuery("");
      setGiphyResults([]);
      setSelectedGif(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="create-card-form" onSubmit={handleSubmit}>
      <h2 className="create-card-form__title">Create a Card</h2>

      <label className="create-card-form__label">
        Message <span className="create-card-form__req">*</span>
        <textarea
          className="create-card-form__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message of kudos…"
          rows={3}
          required
        />
      </label>

      <label className="create-card-form__label">
        Author <span className="create-card-form__optional">(optional)</span>
        <input
          className="create-card-form__input"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
        />
      </label>

      {/* ── GIPHY search section ─────────────────────────────────────────── */}
      <fieldset className="create-card-form__giphy">
        <legend>
          Choose a GIF <span className="create-card-form__req">*</span>
        </legend>

        <div className="create-card-form__search-row">
          <input
            className="create-card-form__input"
            type="text"
            value={giphySearchQuery}
            onChange={(e) => setGiphySearchQuery(e.target.value)}
            onKeyDown={(e) => {
              // Search on Enter without submitting the whole form.
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search GIPHY (e.g. celebrate)"
          />
          <button
            type="button"
            className="create-card-form__btn"
            onClick={handleSearch}
            disabled={isSearching || giphySearchQuery.trim() === ""}
          >
            {isSearching ? "Searching…" : "Search"}
          </button>
        </div>

        {giphyResults.length > 0 && (
          <ul className="create-card-form__results">
            {giphyResults.map((gif) => (
              <li key={gif.id}>
                <button
                  type="button"
                  className={
                    "create-card-form__result" +
                    (selectedGif?.id === gif.id
                      ? " create-card-form__result--selected"
                      : "")
                  }
                  onClick={() => handleSelectGif(gif)}
                  aria-label={`Select GIF: ${gif.title}`}
                >
                  <img src={gif.previewUrl} alt={gif.title} loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedGif && (
          <div className="create-card-form__selected">
            <p className="create-card-form__selected-label">Selected GIF:</p>
            <img
              className="create-card-form__selected-img"
              src={selectedGif.url}
              alt={selectedGif.title}
            />
          </div>
        )}
      </fieldset>

      {error && <p className="create-card-form__error">{error}</p>}

      <button
        type="submit"
        className="create-card-form__btn create-card-form__btn--submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating…" : "Create Card"}
      </button>
    </form>
  );
}

export default CreateCardForm;
