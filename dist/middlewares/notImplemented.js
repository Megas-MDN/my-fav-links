"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notImplemented = void 0;
const basePathRoutes_1 = require("../constants/basePathRoutes");
const statusCode_1 = require("../constants/statusCode");
const path_1 = __importDefault(require("path"));
const notImplemented = (req, res, next) => {
    const { authorization } = req.headers;
    const publicPath = path_1.default.join(__dirname, "../../public");
    if (!req.url.startsWith("/api")) {
        res.sendFile(path_1.default.join(publicPath, "index.html"));
        return;
    }
    res.status(statusCode_1.STATUS_CODE.NOT_IMPLEMENTED).send({
        message: "Route not Implemented",
        url: req.url,
        method: req.method,
        host: `${req.protocol}://${req.hostname}:${process.env.PORT || 3001}`,
        api_version: basePathRoutes_1.API_VERSION.MAIN,
        root_options: basePathRoutes_1.ROOT_PATH,
        authorization,
        query: req.query,
        body: req.body,
        headers: req.headers,
    });
    return;
};
exports.notImplemented = notImplemented;
