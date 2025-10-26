"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logs = void 0;
const logs = (req, _res, next) => {
    const { method, url, body, query } = req;
    console.log(`____________________________________\n ${method} - ${url}${query && Object.keys(query).length
        ? `\nquery: ${JSON.stringify(query, null, 2)}`
        : ""}${body && Object.keys(body).length
        ? `\nbody:${JSON.stringify(body, null, 2)}`
        : ""}\n____________________________________`);
    return next();
};
exports.logs = logs;
