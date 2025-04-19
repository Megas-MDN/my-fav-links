import express, { Router } from "express";
import path from "path";

export const fileRoutes = Router();

fileRoutes.use(express.static(path.resolve(__dirname, "../../public")));

fileRoutes.get("/", (_req, res) =>
  res.sendFile(path.resolve(__dirname, "../../public/index.html")),
);
