import { Router } from "express";
import { cardRoutes } from "./card.routes";
import { urlRoutes } from "./url.routes";
import { fileRoutes } from "./file.routes";

export const routes = Router();
routes.use(fileRoutes);
routes.use(cardRoutes);
routes.use(urlRoutes);
