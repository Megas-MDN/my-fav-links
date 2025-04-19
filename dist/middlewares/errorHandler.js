"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    try {
        res
            .status(err.status || 500)
            .send({ message: err.message || "Internal Server Error" });
    }
    catch (er) {
        let message = "Internal Server Error";
        if (er instanceof Error)
            message = er.message;
        res.status(500).send({
            message: "Unknow Error",
            error: message,
            err,
            er,
        });
    }
};
exports.errorHandler = errorHandler;
