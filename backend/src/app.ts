import express from "express";
import path from "path";
import calculateRouter from "./routes/calculate";
import logger from "./utils/logger";

const app = express();

app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, "Incoming request");
  next();
});

// API routes
app.use("/api/v1/calculate", calculateRouter);

// Serve React static assets in production
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));

// SPA fallback — serve index.html for any non-API route
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

export default app;
