"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlRoutes = void 0;
const express_1 = require("express");
const UrlController_1 = require("../controllers/UrlController");
const basePathRoutes_1 = require("../constants/basePathRoutes");
const BASE_PATH = basePathRoutes_1.API_VERSION.V1 + basePathRoutes_1.ROOT_PATH.URL; // /api/v1/url
const urlRoutes = (0, express_1.Router)();
exports.urlRoutes = urlRoutes;
const urlController = new UrlController_1.UrlController();
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
