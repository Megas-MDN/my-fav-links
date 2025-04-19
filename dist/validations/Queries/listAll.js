"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = void 0;
const zod_1 = require("zod");
const alphanumericString = zod_1.z
    .string()
    .regex(/^[a-zA-Z0-9]*$/, "Search can only contain alphanumeric characters");
exports.querySchema = zod_1.z.object({
    search: alphanumericString.optional(),
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => val === undefined || !isNaN(val), {
        message: "Page must be a valid number",
    }),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => val === undefined || !isNaN(val), {
        message: "Limit must be a valid number",
    }),
    offset: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : undefined))
        .refine((val) => val === undefined || !isNaN(val), {
        message: "Offset must be a valid number",
    }),
    orderBy: zod_1.z
        .string()
        .optional()
        .transform((val) => {
        if (!val)
            return [];
        return val.split(",").map((pair) => {
            const [field, direction] = pair.split(":");
            return { field, direction };
        });
    })
        .refine((val) => val.every(({ field, direction }) => field && ["asc", "desc"].includes(direction)), {
        message: "Each orderBy must have a valid format: 'field:asc' or 'field:desc'",
    }),
});
