"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoutes = void 0;
const express_1 = require("express");
const CardController_1 = require("../controllers/CardController");
const basePathRoutes_1 = require("../constants/basePathRoutes");
const auth_1 = require("../auth");
const BASE_PATH = basePathRoutes_1.API_VERSION.V1 + basePathRoutes_1.ROOT_PATH.CARD; // /api/v1/card
const cardRoutes = (0, express_1.Router)();
exports.cardRoutes = cardRoutes;
const cardController = new CardController_1.CardController();
cardRoutes.get(`${BASE_PATH}`, async (req, res) => {
    await cardController.listAll(req, res);
});
cardRoutes.get(`${BASE_PATH}/:idCard`, async (req, res) => {
    await cardController.getById(req, res);
});
cardRoutes.post(`${BASE_PATH}`, auth_1.auth, async (req, res) => {
    await cardController.create(req, res);
});
cardRoutes.put(`${BASE_PATH}/reorder`, auth_1.auth, async (req, res) => {
    await cardController.reorder(req, res);
});
cardRoutes.put(`${BASE_PATH}/:idCard`, auth_1.auth, async (req, res) => {
    await cardController.update(req, res);
});
cardRoutes.delete(`${BASE_PATH}/:idCard`, auth_1.auth, async (req, res) => {
    await cardController.delete(req, res);
});
