"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCardSchema = void 0;
const zod_1 = require("zod");
exports.createCardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    imageUrl: zod_1.z.string().min(1, "Image URL is required").optional(),
    lastViewed: zod_1.z.string().optional(),
    order: zod_1.z.number().min(1, "Order must be greater than 0"),
});
