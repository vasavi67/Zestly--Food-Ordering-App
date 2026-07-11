import express from "express";
import cors from "cors";
import "dotenv/config";

import restaurantsRouter from "./routes/restaurants.js";
import ordersRouter from "./routes/orders.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandlers.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// simple request logger — helps when demoing the API live
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/restaurants", restaurantsRouter);
app.use("/api/orders", ordersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Zestly API listening on http://localhost:${PORT}`);
});
