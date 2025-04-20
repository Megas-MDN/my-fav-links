"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const erroMessages_1 = require("../constants/erroMessages");
const statusCode_1 = require("../constants/statusCode");
const auth = async (req, _res, next) => {
    const xSign = req.headers["x-sign"];
    if (!xSign) {
        next({
            status: statusCode_1.STATUS_CODE.UNAUTHORIZED,
            message: erroMessages_1.ERROR_MESSAGE.UNAUTHORIZED,
        });
    }
    else if (xSign !== process.env.X_SIGN) {
        next({
            status: statusCode_1.STATUS_CODE.UNAUTHORIZED,
            message: erroMessages_1.ERROR_MESSAGE.UNAUTHORIZED,
        });
    }
    else {
        return next();
    }
};
exports.auth = auth;
