import { Router } from "express";
import { CardController } from "../controllers/CardController";

import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { auth } from "../auth";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.CARD; // /api/v1/card

const cardRoutes = Router();

const cardController = new CardController();

cardRoutes.get(`${BASE_PATH}`, async (req, res) => {
  await cardController.listAll(req, res);
});

cardRoutes.get(`${BASE_PATH}/:idCard`, async (req, res) => {
  await cardController.getById(req, res);
});

cardRoutes.post(`${BASE_PATH}`, auth, async (req, res) => {
  await cardController.create(req, res);
});

cardRoutes.put(`${BASE_PATH}/reorder`, auth, async (req, res) => {
  await cardController.reorder(req, res);
});

cardRoutes.put(`${BASE_PATH}/:idCard`, auth, async (req, res) => {
  await cardController.update(req, res);
});

cardRoutes.delete(`${BASE_PATH}/:idCard`, auth, async (req, res) => {
  await cardController.delete(req, res);
});

export { cardRoutes };
