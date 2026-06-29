// ───────────────────────────────────────────────────────────────────────────
// Brandon's Cards API — standalone Express server (port 5000)
//
// Implements the Card endpoints from planning.md Section 2 / brandon-cards
// README. This is the cards-only workspace: there is no Board model here, so
// `boardId` is stored as a plain integer (defaults to 1) with no FK constraint.
//
// Routes:
//   GET    /cards                 → list all cards
//   POST   /cards                 → create a card (message + gifUrl required)
//   PATCH  /cards/:id/upvote      → increment upvotes by 1 (repeatable)
//   DELETE /cards/:id             → delete a card
// ───────────────────────────────────────────────────────────────────────────

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "brandon-cards-api" });
});

// ── Middleware: validate the body for creating a card ─────────────────────────
// Contract (POST /cards): message* and gifUrl* required; author optional;
// boardId optional (defaults to 1 in this standalone app).
function validateCardBody(req, res, next) {
  const { message, gifUrl } = req.body || {};

  const errors = [];
  if (typeof message !== "string" || message.trim() === "") {
    errors.push("message is required and must be a non-empty string");
  }
  if (typeof gifUrl !== "string" || gifUrl.trim() === "") {
    errors.push("gifUrl is required and must be a non-empty string");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: "Invalid request body", details: errors });
  }
  next();
}

// ── Middleware: parse and validate an :id route param ─────────────────────────
function parseIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }
  req.cardId = id;
  next();
}

// ── GET /cards — return all cards ─────────────────────────────────────────────
app.get("/cards", async (req, res, next) => {
  try {
    const cards = await prisma.card.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ cards });
  } catch (err) {
    next(err);
  }
});

// ── POST /cards — create a card ───────────────────────────────────────────────
app.post("/cards", validateCardBody, async (req, res, next) => {
  try {
    const { message, gifUrl, author, boardId } = req.body;

    const card = await prisma.card.create({
      data: {
        // Standalone app has no real boards, so default boardId to 1.
        boardId: Number.isInteger(boardId) ? boardId : 1,
        message: message.trim(),
        gifUrl: gifUrl.trim(),
        author: author && author.trim() !== "" ? author.trim() : null,
        // upvotes defaults to 0 via the schema.
      },
    });

    res.status(201).json({ card });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /cards/:id/upvote — increment upvotes by 1 ──────────────────────────
app.patch("/cards/:id/upvote", parseIdParam, async (req, res, next) => {
  try {
    const card = await prisma.card.update({
      where: { id: req.cardId },
      data: { upvotes: { increment: 1 } },
    });
    res.status(200).json({ card });
  } catch (err) {
    // Prisma throws P2025 when the record to update is not found.
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Card not found" });
    }
    next(err);
  }
});

// ── DELETE /cards/:id — delete a card ─────────────────────────────────────────
app.delete("/cards/:id", parseIdParam, async (req, res, next) => {
  try {
    await prisma.card.delete({ where: { id: req.cardId } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Card not found" });
    }
    next(err);
  }
});

// ── 404 fallback for unknown routes ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Centralized error handler ─────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Brandon's Cards API listening on http://localhost:${PORT}`);
});
