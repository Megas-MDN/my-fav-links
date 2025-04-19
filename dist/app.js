"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logs_1 = require("./middlewares/logs");
const _index_1 = require("./routes/_index");
const notImplemented_1 = require("./middlewares/notImplemented");
const errorHandler_1 = require("./middlewares/errorHandler");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: "100mb" }));
exports.app.use(express_1.default.urlencoded({ limit: "100mb", extended: true }));
exports.app.use(express_1.default.static("public"));
exports.app.use(logs_1.logs);
exports.app.use(_index_1.routes);
exports.app.use(notImplemented_1.notImplemented);
exports.app.use(errorHandler_1.errorHandler);
