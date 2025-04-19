"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrlSchema = void 0;
const zod_1 = require("zod");
exports.createUrlSchema = zod_1.z.object({
    value: zod_1.z.string().min(1, "URL value is required"),
    cardId: zod_1.z.string().min(1, "Card ID is required"),
});
