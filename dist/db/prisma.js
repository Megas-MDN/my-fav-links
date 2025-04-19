"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
// Verifique a conexão ao inicializar
exports.prisma
    .$connect()
    .then(() => {
    console.log("Connected to database");
})
    .catch((error) => {
    console.error("Database connection error:", error);
});
exports.default = exports.prisma;
