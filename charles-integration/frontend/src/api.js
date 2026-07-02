// Central API config + tiny fetch helpers for the integrated backend.
// Set VITE_API_BASE to the deployed backend URL in production; falls back to
// localhost for local dev. Vite inlines this at build time, so rebuild after
// changing it on the host.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// GIPHY: read the key from Vite env (set VITE_GIPHY_API_KEY in .env.local).
// Falls back to the public beta key for local dev.
export const GIPHY_API_KEY =
  import.meta.env.VITE_GIPHY_API_KEY || 'dc6zaTOxFJmzC'

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    let detail
    try {
      detail = (await res.json()).error
    } catch {
      detail = res.statusText
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }
  // 204 No Content has no body.
  return res.status === 204 ? null : res.json()
}

// --- Boards ---
export const getBoards = () => request('/boards')
export const createBoard = (data) =>
  request('/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
export const deleteBoard = (id) => request(`/boards/${id}`, { method: 'DELETE' })

// --- Cards ---
export const getCards = (boardId) => request(`/boards/${boardId}/cards`)
export const createCard = (data) =>
  request('/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
export const upvoteCard = (id) =>
  request(`/cards/${id}/upvote`, { method: 'PATCH' })
export const pinCard = (id, isPinned) =>
  request(`/cards/${id}/pin`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isPinned }),
  })
export const deleteCard = (id) => request(`/cards/${id}`, { method: 'DELETE' })

// --- Stats ---
export const getStats = () => request('/stats')

// --- Comments ---
export const getComments = (cardId) => request(`/cards/${cardId}/comments`)
export const createComment = (cardId, data) =>
  request(`/cards/${cardId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

// --- GIPHY ---
// Search GIPHY and return a normalized list: { id, url, previewUrl, title }.
//   url        → full-size gif (stored as the card's gifUrl)
//   previewUrl → smaller gif for the results grid
export async function searchGifs(query) {
  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
    q: query,
    limit: '12',
    rating: 'g',
  })
  const res = await fetch(`https://api.giphy.com/v1/gifs/search?${params}`)
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        'GIPHY key invalid or banned. Set VITE_GIPHY_API_KEY in frontend/.env.local, or paste a GIF URL below.',
      )
    }
    throw new Error(`GIPHY request failed (${res.status})`)
  }
  const body = await res.json()
  return (body.data || []).map((g) => ({
    id: g.id,
    url: g.images?.original?.url || g.images?.fixed_height?.url || '',
    previewUrl:
      g.images?.fixed_height_small?.url || g.images?.fixed_height?.url || '',
    title: g.title || 'GIF',
  }))
}
