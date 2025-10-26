import { Router } from "express";
import { cardRoutes } from "./card.routes";
import { urlRoutes } from "./url.routes";

export const routes = Router();
routes.use(cardRoutes);
routes.use(urlRoutes);
