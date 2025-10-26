import "express-async-errors";
import express from "express";
import cors from "cors";
import { logs } from "./middlewares/logs";
import { routes } from "./routes/_index";
import { notImplemented } from "./middlewares/notImplemented";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";

const app = express();
const publicPath = path.join(__dirname, "../public");

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.static(publicPath));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("*", (req, res, next) => {
  if (!req.path.startsWith("/api")) {
    return res.sendFile(path.join(publicPath, "index.html"));
  }
  return next();
});

app.use(logs);
app.use(routes);
app.use(notImplemented);
app.use(errorHandler);

export { app };
