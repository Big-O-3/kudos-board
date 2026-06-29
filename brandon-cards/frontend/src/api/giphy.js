// GIPHY search client. Used by CreateCardForm so users can search for and
// select a GIF for their card. Get a key at https://developers.giphy.com/ and
// set VITE_GIPHY_API_KEY in frontend/.env.

import {
  GIPHY_API_KEY,
  GIPHY_SEARCH_URL,
  GIPHY_RESULTS_LIMIT,
} from "../config";

// Search GIPHY for `query` and return a normalized list of GIFs:
//   { id, url, previewUrl, title }
// - url        → full-size gif (stored as the card's gifUrl)
// - previewUrl → smaller still/downsized gif used in the results grid
export async function searchGifs(query) {
  if (!GIPHY_API_KEY) {
    throw new Error(
      "Missing GIPHY API key. Set VITE_GIPHY_API_KEY in frontend/.env (see .env.example)."
    );
  }

  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
    q: query,
    limit: String(GIPHY_RESULTS_LIMIT),
    rating: "pg-13",
  });

  const response = await fetch(`${GIPHY_SEARCH_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`GIPHY request failed (HTTP ${response.status}).`);
  }

  const body = await response.json();
  const results = Array.isArray(body.data) ? body.data : [];

  return results.map((gif) => ({
    id: gif.id,
    url: gif.images?.original?.url || "",
    previewUrl:
      gif.images?.fixed_width?.url ||
      gif.images?.downsized?.url ||
      gif.images?.original?.url ||
      "",
    title: gif.title || "GIF",
  }));
}
