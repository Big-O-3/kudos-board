import { useState } from "react";
import "./CardTile.css";

// CardTile — renders a single card: message, GIF, author, upvote count + button,
// and a delete button. Owns local loading state so its buttons can disable
// themselves while their async action is in flight. Upvoting is repeatable.
//
// Props:
//   card     — { id, message, gifUrl, author, upvotes, createdAt }
//   onUpvote — async (id) => void   (parent updates the count)
//   onDelete — async (id) => void   (parent removes the card)
function CardTile({ card, onUpvote, onDelete }) {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleUpvote() {
    setIsUpvoting(true);
    try {
      await onUpvote(card.id);
    } finally {
      setIsUpvoting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete(card.id);
      // On success the parent unmounts this tile, so no further state update.
    } catch {
      // If delete failed, re-enable the button so the user can retry.
      setIsDeleting(false);
    }
  }

  return (
    <li className="card-tile">
      <div className="card-tile__gif-wrap">
        {card.gifUrl ? (
          <img className="card-tile__gif" src={card.gifUrl} alt={card.message} />
        ) : (
          <div className="card-tile__gif card-tile__gif--placeholder">No GIF</div>
        )}
      </div>

      <p className="card-tile__message">{card.message}</p>

      {card.author && (
        <p className="card-tile__author">— {card.author}</p>
      )}

      <div className="card-tile__actions">
        <button
          type="button"
          className="card-tile__btn card-tile__btn--upvote"
          onClick={handleUpvote}
          disabled={isUpvoting}
          aria-label="Upvote card"
        >
          ▲ {card.upvotes}
          {isUpvoting ? "…" : ""}
        </button>

        <button
          type="button"
          className="card-tile__btn card-tile__btn--delete"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete card"
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}

export default CardTile;
