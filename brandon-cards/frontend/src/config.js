// Central configuration, read from Vite environment variables.
// Vite only exposes vars prefixed with VITE_ to the client (import.meta.env).
// See .env.example for the values you need to set.

// Base URL of Brandon's Cards backend (Express on port 5000).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// GIPHY API key — required for the card GIF search.
// Get a key at https://developers.giphy.com/ and set VITE_GIPHY_API_KEY in .env.
export const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || "";

// GIPHY search endpoint + how many results to request per search.
export const GIPHY_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";
export const GIPHY_RESULTS_LIMIT = 12;
