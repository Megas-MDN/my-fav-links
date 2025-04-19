"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notImplemented = void 0;
const basePathRoutes_1 = require("../constants/basePathRoutes");
const statusCode_1 = require("../constants/statusCode");
const notImplemented = (req, res, next) => {
    const { authorization } = req.headers;
    return next({
        status: statusCode_1.STATUS_CODE.NOT_IMPLEMENTED,
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
};
exports.notImplemented = notImplemented;
