import { Router } from "express";
import { UrlController } from "../controllers/UrlController";

import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.URL; // /api/v1/url

const urlRoutes = Router();

const urlController = new UrlController();

urlRoutes.get(`${BASE_PATH}`, async (req, res) => {
  await urlController.listAll(req, res);
});

urlRoutes.get(`${BASE_PATH}/:idUrl`, async (req, res) => {
  await urlController.getById(req, res);
});

urlRoutes.post(`${BASE_PATH}`, async (req, res) => {
  await urlController.create(req, res);
});

urlRoutes.put(`${BASE_PATH}/:idUrl`, async (req, res) => {
  await urlController.update(req, res);
});

urlRoutes.delete(`${BASE_PATH}/:idUrl`, async (req, res) => {
  await urlController.delete(req, res);
});

export { urlRoutes };
