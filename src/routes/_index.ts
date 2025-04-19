import { Router } from "express";
import { cardRoutes } from "./card.routes";

export const routes = Router();
routes.use(cardRoutes);
