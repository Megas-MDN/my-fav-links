"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const card_routes_1 = require("./card.routes");
const url_routes_1 = require("./url.routes");
exports.routes = (0, express_1.Router)();
exports.routes.use(card_routes_1.cardRoutes);
exports.routes.use(url_routes_1.urlRoutes);
