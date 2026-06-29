import CardTile from "./CardTile";
import "./CardGrid.css";

// CardGrid — lays out the cards in a responsive grid. Stateless: it just maps
// the `cards` array to CardTile components and forwards the action handlers.
//
// Props:
//   cards    — Card[]
//   onUpvote — async (id) => void
//   onDelete — async (id) => void
function CardGrid({ cards, onUpvote, onDelete }) {
  if (!cards || cards.length === 0) {
    return (
      <p className="card-grid__empty">
        No cards yet — create the first one above! 🎉
      </p>
    );
  }

  return (
    <ul className="card-grid">
      {cards.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          onUpvote={onUpvote}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default CardGrid;
