const app = require("./app");
const env = require("./config/env");
const prisma = require("./lib/prisma");
const { logInfo, logError } = require("./utils/logger");

async function startServer() {
  try {
    await prisma.$connect();
    logInfo("Database connected successfully");

    app.listen(env.PORT, () => {
      logInfo(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logError("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});