// Seed script — inserts a few test cards so the grid isn't empty on first run.
// Run with:  npm run seed   (or:  node prisma/seed.js)

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sampleCards = [
  {
    boardId: 1,
    message: "Amazing work shipping the new feature on time! 🚀",
    gifUrl: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
    author: "Alex",
    upvotes: 4,
  },
  {
    boardId: 1,
    message: "Thank you for always being so helpful in code review.",
    gifUrl: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    author: "Jordan",
    upvotes: 2,
  },
  {
    boardId: 1,
    message: "You crushed that presentation today!",
    gifUrl: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
    author: null,
    upvotes: 7,
  },
];

async function main() {
  // Clear existing cards so seeding is idempotent.
  await prisma.card.deleteMany();
  for (const card of sampleCards) {
    await prisma.card.create({ data: card });
  }
  const count = await prisma.card.count();
  console.log(`Seeded ${count} cards.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
