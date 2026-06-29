// API client for the Cards backend (see brandon-cards/backend, port 5000).
// Each function maps to one documented endpoint in planning.md Section 2.

import { API_BASE_URL } from "../config";

// Parse an error response body into a useful Error.
async function toError(response) {
  let detail;
  try {
    const body = await response.json();
    detail = body.error || JSON.stringify(body);
  } catch {
    detail = response.statusText;
  }
  return new Error(`HTTP ${response.status}: ${detail}`);
}

// GET /cards → { cards: [...] }
export async function getCards() {
  const response = await fetch(`${API_BASE_URL}/cards`);
  if (!response.ok) throw await toError(response);
  const data = await response.json();
  return data.cards;
}

// POST /cards → { card: {...} }
// payload: { message, gifUrl, author?, boardId? }
export async function createCard(payload) {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw await toError(response);
  const data = await response.json();
  return data.card;
}

// PATCH /cards/:id/upvote → { card: {...} }
export async function upvoteCard(id) {
  const response = await fetch(`${API_BASE_URL}/cards/${id}/upvote`, {
    method: "PATCH",
  });
  if (!response.ok) throw await toError(response);
  const data = await response.json();
  return data.card;
}

// DELETE /cards/:id → 204 No Content
export async function deleteCard(id) {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw await toError(response);
  // 204 has no body.
}
